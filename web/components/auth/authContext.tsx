"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

export type LocalUser = {
  id: string;
  name: string;
  email: string;
  password: string;
  role: "admin" | "user";
};

type AuthContextType = {
  user: LocalUser | null;
  loading: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<LocalUser | null>(null);
  const [loading, setLoading] = useState(true);

  // Cargar usuario guardado en localStorage al iniciar
  useEffect(() => {
    if (typeof window === "undefined") return;
    const saved = localStorage.getItem("authUser");
    if (saved) {
      try {
        setUser(JSON.parse(saved));
      } catch {
        localStorage.removeItem("authUser");
      }
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    if (typeof window === "undefined") return false;

    const raw = localStorage.getItem("users");
    const users: LocalUser[] = raw ? JSON.parse(raw) : [];

    const found = users.find(
      (u) => u.email === email && u.password === password
    );

    if (!found) return false;

    localStorage.setItem("authUser", JSON.stringify(found));
    setUser(found);
    return true;
  };

  const register = async (name: string, email: string, password: string) => {
    if (typeof window === "undefined") return false;

    const stored = localStorage.getItem("users");
    const users: LocalUser[] = stored ? JSON.parse(stored) : [];

    // correo ya registrado
    if (users.some((u) => u.email === email)) {
      return false;
    }

    // primer usuario o correo especial → admin
    const role: "admin" | "user" =
      users.length === 0 || email === "cleaningsale04@gmail.com"
        ? "admin"
        : "user";

    const newUser: LocalUser = {
      id: crypto.randomUUID(),
      name,
      email,
      password,
      role,
    };

    users.push(newUser);
    localStorage.setItem("users", JSON.stringify(users));
    // lo dejamos registrado pero no logueado automáticamente
    return true;
  };

  const logout = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("authUser");
    }
    setUser(null);
  };

  const value: AuthContextType = {
    user,
    loading,
    isAuthenticated: !!user,
    isAdmin: !!user && user.role === "admin",
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth debe usarse dentro de <AuthProvider>");
  }
  return ctx;
}
