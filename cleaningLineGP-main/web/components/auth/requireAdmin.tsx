"use client";

import { RequireAuth } from "./requireAuth";
import { useAuth } from "./authContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export function RequireAdmin({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user && user.role !== "admin") {
      router.push("/");
    }
  }, [user, router]);

  return (
    <RequireAuth>
      {user?.role === "admin" ? children : null}
    </RequireAuth>
  );
}
