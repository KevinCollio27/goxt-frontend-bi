"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AuthService } from "@/services/auth.service";
import { useAuthStore } from "@/store/auth.store";
import Image from "next/image";

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
        setError("Error al verificar tu sesión. Intenta de nuevo.");
      });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  if (error) {
    return (
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-sm border border-gray-200 p-8 text-center space-y-5">
        <div className="flex justify-center">
          <Image src="/images/Logo BI.png" alt="GOxT BI" width={160} height={54} className="object-contain" />
        </div>

        <div className="space-y-1">
          <h2 className="text-lg font-semibold text-gray-900">No pudimos autenticarte</h2>
          <p className="text-sm text-gray-500">{error}</p>
        </div>

        <a
          href="/login"
          className="inline-flex w-full items-center justify-center h-11 bg-ink hover:bg-[#0a2d40] text-white text-sm font-semibold rounded-lg transition-colors duration-200"
        >
          Volver al login
        </a>
      </div>
    );
  }

  return (
    <div className="w-full max-w-sm bg-white rounded-2xl shadow-sm border border-gray-200 p-8 text-center space-y-5">
      <div className="flex justify-center">
        <Image src="/images/Logo BI.png" alt="GOxT BI" width={160} height={54} className="object-contain" />
      </div>

      <div className="space-y-4">
        <div className="w-9 h-9 border-2 border-teal border-t-transparent rounded-full animate-spin mx-auto" />
        <div className="space-y-1">
          <p className="text-sm font-medium text-gray-700">Iniciando sesión...</p>
          <p className="text-xs text-gray-400">
            {tokenReceived ? "Verificando credenciales..." : "Autenticando con Google..."}
          </p>
        </div>
      </div>
    </div>
  );
}

const LoadingCard = () => (
  <div className="w-full max-w-sm bg-white rounded-2xl shadow-sm border border-gray-200 p-8 text-center space-y-5">
    <div className="flex justify-center">
      <Image src="/images/Logo BI.png" alt="GOxT BI" width={160} height={54} className="object-contain" />
    </div>
    <div className="w-9 h-9 border-2 border-teal border-t-transparent rounded-full animate-spin mx-auto" />
  </div>
);

export default function AuthCallbackPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100">
      <Suspense fallback={<LoadingCard />}>
        <CallbackHandler />
      </Suspense>
    </div>
  );
}
