import { request, tokenStore } from "./auth.service";

const BASE_URL = (import.meta.env.VITE_API_URL as string | undefined) ?? "http://localhost:3000/api";

// ── Types ────────────────────────────────────────────────────────────────────

export interface DepartmentLeader {
  id: string;
  name: string;
  role: string;
  image: string;
}

export interface Department {
  id: string;
  name: string;
  description: string;
  backgroundImage: string | null;
  bgImagePublicId: string | null;
  leaderId: string;
  leader: DepartmentLeader;
  order: number;
  createdAt: string;
  updatedAt: string;
}

// ── Multipart helper ──────────────────────────────────────────────────────────

async function fetchWithAuth(url: string, init: RequestInit): Promise<Response> {
  const access = tokenStore.getAccess();
  const headers: Record<string, string> = { ...(init.headers as Record<string, string>) };
  if (access) headers["Authorization"] = `Bearer ${access}`;
  return fetch(url, { ...init, headers });
}

// ── Service ───────────────────────────────────────────────────────────────────

export const departmentService = {
  async getAll(): Promise<Department[]> {
    const data = await request<{ departments: Department[] }>("GET", "/departments");
    return data.departments;
  },

  async getById(id: string): Promise<Department> {
    const data = await request<{ department: Department }>("GET", `/departments/${id}`);
    return data.department;
  },

  async create(form: FormData): Promise<Department> {
    const res = await fetchWithAuth(`${BASE_URL}/departments`, { method: "POST", body: form });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error((data as { error?: string }).error ?? "Create failed.");
    return (data as { department: Department }).department;
  },

  async update(id: string, form: FormData): Promise<Department> {
    const res = await fetchWithAuth(`${BASE_URL}/departments/${id}`, { method: "PUT", body: form });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error((data as { error?: string }).error ?? "Update failed.");
    return (data as { department: Department }).department;
  },

  async remove(id: string): Promise<Department> {
    const data = await request<{ department: Department }>("DELETE", `/departments/${id}`);
    return data.department;
  },
};
