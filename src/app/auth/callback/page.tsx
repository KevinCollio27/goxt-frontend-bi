"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AuthService } from "@/services/auth.service";
import { useAuthStore } from "@/store/auth.store";

function CallbackHandler() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { setAuth } = useAuthStore();
  const [error, setError] = useState<string | null>(null);
  const [tokenReceived, setTokenReceived] = useState(false);

  useEffect(() => {
    const token = searchParams.get("token");
    const urlError = searchParams.get("error");

    if (urlError) {
      setError(
        urlError === "user_not_found"
          ? "Tu cuenta no está registrada en la plataforma."
          : "Error al iniciar sesión con Google."
      );
      return;
    }

    if (!token) {
      setError("Token no encontrado.");
      return;
    }

    setTokenReceived(true);

    AuthService.getMe(token)
      .then((res) => {
        setAuth(token, res.user);
        router.replace(res.user.isSuperAdmin ? "/dashboard" : "/workspace");
      })
      .catch((err) => {
        console.error("[Auth Callback] error:", {
          status: err?.response?.status,
          data: err?.response?.data,
          message: err?.message,
        });
        setError(`Error al verificar tu sesión. (${err?.message ?? "desconocido"}) Intenta de nuevo.`);
      });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="w-full max-w-sm bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center">
      <h2 className="text-xl font-semibold text-ink mb-6">
        {error ? "Error al iniciar sesión" : "Iniciando sesión..."}
      </h2>

      {error ? (
        <div className="space-y-4">
          <p className="text-red-500 text-sm">{error}</p>
          <a
            href="/login"
            className="inline-block px-4 py-2 bg-teal text-white rounded-lg text-sm font-medium hover:opacity-90 transition-opacity"
          >
            Volver al inicio
          </a>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="w-10 h-10 border-2 border-teal border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-gray-600 text-sm">Autenticando con Google...</p>
          <p className="text-xs text-gray-400">
            Token: {tokenReceived ? "recibido ✓" : "pendiente..."}
          </p>
        </div>
      )}
    </div>
  );
}

export default function AuthCallbackPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-vanilla">
      <Suspense
        fallback={
          <div className="w-full max-w-sm bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center">
            <h2 className="text-xl font-semibold text-ink mb-6">Iniciando sesión...</h2>
            <div className="w-10 h-10 border-2 border-teal border-t-transparent rounded-full animate-spin mx-auto" />
          </div>
        }
      >
        <CallbackHandler />
      </Suspense>
    </div>
  );
}
