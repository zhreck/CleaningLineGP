"use client";

export const dynamic = 'force-dynamic';

import { Suspense } from "react";
import LoginForm from "./LoginForm";

function LoginFormContent() {
  return <LoginForm />;
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="mx-auto max-w-md py-8 text-center">Cargando...</div>}>
      <LoginFormContent />
    </Suspense>
  );
}
