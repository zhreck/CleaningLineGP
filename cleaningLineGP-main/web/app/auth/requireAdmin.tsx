"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "./authContext";
import { RequireAuth } from "./requireAuth";

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
