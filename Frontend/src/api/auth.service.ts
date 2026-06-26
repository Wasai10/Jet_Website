const BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3000/api";

// ── Types ────────────────────────────────────────────────────────────────────

export interface User {
  id: string;
  fullName: string;
  email: string;
  role: "USER" | "ADMIN";
  createdAt: string;
  updatedAt: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface AuthResponse extends AuthTokens {
  message: string;
  user: User;
}

export interface SignupPayload {
  fullName: string;
  email: string;
  password: string;
}

export interface SigninPayload {
  email: string;
  password: string;
}

export interface UpdateUserPayload {
  fullName?: string;
  email?: string;
  password?: string;
  role?: "USER" | "ADMIN";
}

export interface CreateUserAdminPayload {
  fullName: string;
  email: string;
  password: string;
  role: "USER" | "ADMIN";
}

// ── Token store (access token in memory; refresh token in localStorage) ───────

const REFRESH_KEY = "jet_refresh_token";

let _accessToken: string | null = null;

export const tokenStore = {
  getAccess: () => _accessToken,
  setAccess: (token: string) => { _accessToken = token; },
  clearAccess: () => { _accessToken = null; },

  getRefresh: () => localStorage.getItem(REFRESH_KEY),
  setRefresh: (token: string) => localStorage.setItem(REFRESH_KEY, token),
  clearRefresh: () => localStorage.removeItem(REFRESH_KEY),

  setTokens: ({ accessToken, refreshToken }: AuthTokens) => {
    _accessToken = accessToken;
    localStorage.setItem(REFRESH_KEY, refreshToken);
  },
  clearAll: () => {
    _accessToken = null;
    localStorage.removeItem(REFRESH_KEY);
  },
};

// ── Core fetch client with auto-refresh ──────────────────────────────────────

export type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

let isRefreshing = false;
let pendingQueue: Array<(token: string | null) => void> = [];

const drainQueue = (token: string | null) => {
  pendingQueue.forEach((resolve) => resolve(token));
  pendingQueue = [];
};

async function tryRefresh(): Promise<string | null> {
  const refreshToken = tokenStore.getRefresh();
  if (!refreshToken) return null;

  try {
    const res = await fetch(`${BASE_URL}/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken }),
    });

    if (!res.ok) {
      tokenStore.clearAll();
      return null;
    }

    const data: AuthTokens = await res.json();
    tokenStore.setTokens(data);
    return data.accessToken;
  } catch {
    tokenStore.clearAll();
    return null;
  }
}

export async function request<T>(
  method: HttpMethod,
  path: string,
  body?: unknown,
  retry = true
): Promise<T> {
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  const access = tokenStore.getAccess();
  if (access) headers["Authorization"] = `Bearer ${access}`;

  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  if (res.status === 401 && retry) {
    // Queue concurrent 401s so only one refresh call fires
    if (isRefreshing) {
      return new Promise<T>((resolve, reject) => {
        pendingQueue.push((token) => {
          if (!token) return reject(new Error("Session expired. Please log in again."));
          resolve(request<T>(method, path, body, false));
        });
      });
    }

    isRefreshing = true;
    const newToken = await tryRefresh();
    isRefreshing = false;
    drainQueue(newToken);

    if (!newToken) throw new Error("Session expired. Please log in again.");
    return request<T>(method, path, body, false);
  }

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error((data as { error?: string }).error ?? `Request failed: ${res.status}`);
  }

  return data as T;
}

// ── Auth API ─────────────────────────────────────────────────────────────────

export const authService = {
  async signup(payload: SignupPayload): Promise<{ message: string; user: User }> {
    return request("POST", "/auth/signup", payload);
  },

  async signin(payload: SigninPayload): Promise<AuthResponse> {
    const data = await request<AuthResponse>("POST", "/auth/signin", payload);
    tokenStore.setTokens(data);
    return data;
  },

  async refresh(): Promise<AuthTokens> {
    const refreshToken = tokenStore.getRefresh();
    if (!refreshToken) throw new Error("No refresh token available.");

    const data = await request<AuthTokens & { message: string }>(
      "POST",
      "/auth/refresh",
      { refreshToken },
      false
    );
    tokenStore.setTokens(data);
    return data;
  },

  async logout(): Promise<void> {
    const refreshToken = tokenStore.getRefresh();
    if (refreshToken) {
      await request("POST", "/auth/logout", { refreshToken }).catch(() => {});
    }
    tokenStore.clearAll();
  },

  async logoutAll(): Promise<void> {
    await request("POST", "/auth/logout-all");
    tokenStore.clearAll();
  },

  async getCurrentUser(): Promise<User> {
    const data = await request<{ user: User }>("GET", "/auth/me");
    return data.user;
  },

  async getAllUsers(): Promise<User[]> {
    const data = await request<{ users: User[] }>("GET", "/auth/users");
    return data.users;
  },

  async updateUser(id: string, payload: UpdateUserPayload): Promise<User> {
    const data = await request<{ user: User }>("PATCH", `/auth/users/${id}`, payload);
    return data.user;
  },

  async deleteUser(id: string): Promise<User> {
    const data = await request<{ user: User }>("DELETE", `/auth/users/${id}`);
    return data.user;
  },

  async createUserAdmin(payload: CreateUserAdminPayload): Promise<User> {
    const data = await request<{ user: User }>("POST", "/auth/admin/users", payload);
    return data.user;
  },

  // Call on app mount — silently restores the access token from the stored refresh token
  async restoreSession(): Promise<User | null> {
    if (!tokenStore.getRefresh()) return null;
    try {
      await authService.refresh();
      return authService.getCurrentUser();
    } catch {
      tokenStore.clearAll();
      return null;
    }
  },

  isAuthenticated(): boolean {
    return tokenStore.getAccess() !== null;
  },
};
