"use client";

import { createContext, useContext, useState, useEffect } from "react";

export type User = {
  id: string;
  name: string;
  email: string;
  role: "user" | "admin";
};

type AuthContextType = {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // cargar usuario desde localStorage
  useEffect(() => {
    const saved = localStorage.getItem("authUser");
    if (saved) {
      setUser(JSON.parse(saved));
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    // Simulación: En producción, aquí se llama al backend
    const savedUsers = JSON.parse(localStorage.getItem("users") || "[]");

    const found = savedUsers.find(
      (u: any) => u.email === email && u.password === password
    );

    if (found) {
      const loggedUser: User = {
        id: found.id,
        email: found.email,
        name: found.name,
        role: found.role,
      };
      localStorage.setItem("authUser", JSON.stringify(loggedUser));
      setUser(loggedUser);
      return true;
    }

    return false;
  };

  const register = async (name: string, email: string, password: string) => {
    const users = JSON.parse(localStorage.getItem("users") || "[]");

    if (users.find((u: any) => u.email === email)) {
      return false; // correo ya registrado
    }

    const newUser = {
      id: crypto.randomUUID(),
      name,
      email,
      role: "user", // siempre usuario normal
      password, // se elimina cuando pasemos a backend real
    };

    users.push(newUser);
    localStorage.setItem("users", JSON.stringify(users));
    return true;
  };

  const logout = () => {
    localStorage.removeItem("authUser");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth debe usarse dentro de AuthProvider");
  return ctx;
}
