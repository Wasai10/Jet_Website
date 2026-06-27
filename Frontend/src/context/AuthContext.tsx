import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { authService, type User, type SigninPayload, type SignupPayload } from "@/api/auth.service";

interface AuthContextValue {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (payload: SigninPayload) => Promise<User>;
  register: (payload: SignupPayload) => Promise<void>;
  logout: () => Promise<void>;
  logoutAll: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    authService.restoreSession()
      .then((restored) => setUser(restored))
      .finally(() => setIsLoading(false));
  }, []);

  const login = async (payload: SigninPayload): Promise<User> => {
    const data = await authService.signin(payload);
    setUser(data.user);
    return data.user;
  };

  const register = async (payload: SignupPayload) => {
    await authService.signup(payload);
  };

  const logout = async () => {
    await authService.logout();
    setUser(null);
  };

  const logoutAll = async () => {
    await authService.logoutAll();
    setUser(null);
  };

  const refreshUser = async () => {
    const updated = await authService.getCurrentUser();
    setUser(updated);
  };

  return (
    <AuthContext.Provider value={{
      user,
      isLoading,
      isAuthenticated: user !== null,
      login,
      register,
      logout,
      logoutAll,
      refreshUser,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}
