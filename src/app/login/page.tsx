"use client";

import { useState } from "react";
import Image from "next/image";
import { Eye, EyeOff, Lock, Mail } from "lucide-react";
import { useRouter } from "next/navigation";
import { AuthService } from "@/services/auth.service";
import { useAuthStore } from "@/store/auth.store";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const { setAuth } = useAuthStore();
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const result = await AuthService.login(email, password);
      setAuth(result.token, result.user);
      router.push(result.user.isSuperAdmin ? "/dashboard" : "/workspace");
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { message?: string } } };
      setError(axiosErr?.response?.data?.message || "Credenciales inválidas");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = () => {
    window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/api/auth/google`;
  };

  return (
    <div className="flex min-h-screen w-full">
      {/* Panel izquierdo - imagen */}
      <div className="hidden lg:flex lg:w-[55%] relative overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url('/images/BI.png')" }}
        >
          <div className="absolute inset-0 bg-linear-to-br from-ink/80 via-ink/65 to-ink/75" />
        </div>

        <div className="relative z-10 flex flex-col justify-between h-full p-8 lg:p-12">
          {/* Logo GOxT esquina superior izquierda */}
          <div>
            <Image
              src="/images/goxt-negro.png"
              alt="GOxT"
              width={90}
              height={32}
              className="object-contain brightness-0 invert"
            />
          </div>

          <div className="flex-1 flex flex-col justify-center">
            {/* Badge */}
            <div className="mb-6">
              <span className="inline-flex items-center gap-2 rounded-full bg-white/10 backdrop-blur-sm px-4 py-2 text-sm text-white/90 border border-white/10">
                <span>📊</span>
                Plataforma de Business Intelligence
              </span>
            </div>

            {/* Slogan */}
            <div className="mb-8">
              <h1 className="text-4xl lg:text-5xl font-bold text-white leading-tight mb-4">
                Todos tus datos,
                <br />
                en un <span className="text-teal">solo lugar</span>.
              </h1>
              <p className="text-lg text-white/70 max-w-md leading-relaxed">
                Visualiza la salud de tus productos CRM y Cargo con métricas en tiempo real.
              </p>
            </div>

            {/* Pills */}
            <div className="flex flex-wrap gap-2">
              {[
                { label: "Dashboard Ejecutivo", color: "bg-teal/20 text-teal border-teal/30" },
                { label: "Reportes Automáticos", color: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30" },
                { label: "Multi-workspace", color: "bg-amber-500/20 text-amber-300 border-amber-500/30" },
              ].map(({ label, color }) => (
                <span
                  key={label}
                  className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs border ${color}`}
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {label}
                </span>
              ))}
            </div>
          </div>

          {/* Footer */}
          <p className="text-sm text-white/50">
            <span className="font-semibold text-white/80">GOxT Platform</span> · Business Intelligence
          </p>
        </div>
      </div>

      {/* Panel derecho - formulario */}
      <div className="flex-1 flex flex-col bg-white px-4 py-8 sm:px-6 lg:px-8 relative">
        <div className="flex-1 flex items-center justify-center">
          <div className="w-full max-w-md space-y-6">
            {/* Header */}
            <div className="text-center">
              <div className="mb-2 flex justify-center">
                <Image
                  src="/images/Logo BI.png"
                  alt="GOxT BI"
                  width={300}
                  height={100}
                  className="object-contain"
                  priority
                />
              </div>
              <h2 className="text-3xl font-semibold text-gray-900 tracking-tight">
                ¡Bienvenido de nuevo!
              </h2>
              <p className="mt-2 text-gray-500">
                Accede a la plataforma y descubre insights poderosos.
              </p>
            </div>

            {/* Formulario */}
            <form onSubmit={handleLogin} className="space-y-5">
              {/* Email */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-gray-600 tracking-wide flex items-center gap-2">
                  <Mail className="h-3.5 w-3.5" />
                  Correo electrónico
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Ingresa tu correo electrónico"
                  required
                  className="w-full h-12 px-4 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-900 placeholder:text-gray-400 hover:border-gray-300 focus:bg-white focus:border-teal focus:ring-2 focus:ring-teal/20 focus:outline-none transition-all duration-200"
                />
              </div>

              {/* Contraseña */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-gray-600 tracking-wide flex items-center gap-2">
                  <Lock className="h-3.5 w-3.5" />
                  Contraseña
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Ingresa tu contraseña"
                    required
                    className="w-full h-12 px-4 pr-11 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-900 placeholder:text-gray-400 hover:border-gray-300 focus:bg-white focus:border-teal focus:ring-2 focus:ring-teal/20 focus:outline-none transition-all duration-200"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {error && (
                <p className="text-sm text-red-500 text-center">{error}</p>
              )}

              {/* Botón submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full h-12 bg-ink hover:bg-[#0a2d40] active:scale-[0.98] text-white font-semibold rounded-lg shadow-lg shadow-gray-900/25 hover:shadow-xl hover:shadow-gray-900/30 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                {loading ? "Cargando..." : "Iniciar sesión"}
              </button>

              {/* Divider */}
              <div className="relative py-2">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-gray-200" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white px-4 text-gray-400 font-medium tracking-wider">
                    O accede con
                  </span>
                </div>
              </div>

              {/* Google */}
              <button
                type="button"
                onClick={handleGoogle}
                disabled={loading}
                className="w-full h-12 flex items-center justify-center gap-3 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                <GoogleIcon />
                Continuar con Google
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <path d="M17.64 9.205c0-.639-.057-1.252-.164-1.841H9v3.481h4.844a4.14 4.14 0 01-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4" />
      <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z" fill="#34A853" />
      <path d="M3.964 10.71A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05" />
      <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335" />
    </svg>
  );
}
