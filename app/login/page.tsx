"use client";

import Link from "next/link";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FormInput } from "../components/ui/FormInput";
import ErrorAlert from "../components/ui/ErrorAlert";
import LoadingButton from "../components/ui/LoadingButton";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError("Email o contraseña incorrectos");
        return;
      }

      router.push("/");
      router.refresh();
    } catch (err) {
      console.error("Error al iniciar sesión:", err);
      setError("Error al iniciar sesión");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[rgb(var(--color-bg-primary))] px-4 py-10 flex items-center justify-center">
      <div className="container-wide">
        <div className="grid items-center gap-8 lg:grid-cols-[1fr_1fr]">
          {/* Left Side - Branding */}
          <div className="hidden lg:flex lg:flex-col lg:gap-5 animate-fade-in">
            <div className="inline-flex items-center gap-2 w-fit">
              <div className="w-9 h-9 rounded-[var(--radius-md)] bg-gradient-to-br from-[rgb(var(--color-accent))] to-[rgb(var(--color-accent-hover))] flex items-center justify-center shadow-[var(--shadow-sm)]">
                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <span className="text-base font-semibold text-[rgb(var(--color-text-primary))]">
                Travel Planner
              </span>
            </div>

            <h1 className="text-3xl font-semibold leading-tight text-[rgb(var(--color-text-primary))]">
              Organizá, compartí y viví tus viajes
            </h1>
            <p className="text-base text-[rgb(var(--color-text-secondary))]">
              Tu copiloto de viajes personal. Planificá itinerarios, guardá detalles importantes y compartí con quienes viajan con vos.
            </p>

            <div className="grid gap-4 sm:grid-cols-2 mt-4">
              <div className="card-flat p-4">
                <div className="w-8 h-8 rounded-[var(--radius-sm)] bg-[rgb(var(--color-accent))]/10 flex items-center justify-center mb-3">
                  <svg className="w-4 h-4 text-[rgb(var(--color-accent))]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <h3 className="text-sm font-semibold text-[rgb(var(--color-text-primary))] mb-1">
                  Seguro y confiable
                </h3>
                <p className="text-xs text-[rgb(var(--color-text-secondary))]">
                  Tus datos protegidos con autenticación segura
                </p>
              </div>

              <div className="card-flat p-4">
                <div className="w-8 h-8 rounded-[var(--radius-sm)] bg-[rgb(var(--color-accent))]/10 flex items-center justify-center mb-3">
                  <svg className="w-4 h-4 text-[rgb(var(--color-accent))]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-sm font-semibold text-[rgb(var(--color-text-primary))] mb-1">
                  En todos lados
                </h3>
                <p className="text-xs text-[rgb(var(--color-text-secondary))]">
                  Accedé desde cualquier dispositivo
                </p>
              </div>
            </div>
          </div>

          {/* Right Side - Login Form */}
          <div className="card p-8 max-w-md mx-auto w-full animate-fade-in">
            <div className="mb-5">
              <div className="flex items-center gap-2.5 mb-1">
                <div className="w-10 h-10 rounded-[var(--radius-md)] bg-gradient-to-br from-[rgb(var(--color-accent))] to-[rgb(var(--color-accent-hover))] flex items-center justify-center shadow-[var(--shadow-sm)] lg:hidden">
                  <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h2 className="text-xl font-semibold text-[rgb(var(--color-text-primary))]">
                  Bienvenido
                </h2>
              </div>
              <p className="text-sm text-[rgb(var(--color-text-secondary))]">
                Iniciá sesión para continuar con tus planes
              </p>
            </div>

            <ErrorAlert error={error} />

            <form onSubmit={handleSubmit} className="space-y-4 mt-6">
              <FormInput
                label="Email"
                type="email"
                id="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
                placeholder="tu@email.com"
              />

              <FormInput
                label="Contraseña"
                type="password"
                id="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
                placeholder="••••••••"
              />

              <LoadingButton
                type="submit"
                isLoading={loading}
                loadingText="Iniciando sesión..."
                variant="primary"
                className="w-full mt-6"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                </svg>
                Iniciar sesión
              </LoadingButton>
            </form>

            <div className="divider my-6"></div>

            <div className="text-center">
              <span className="text-sm text-[rgb(var(--color-text-secondary))]">
                ¿No tenés cuenta?{" "}
              </span>
              <Link
                href="/register"
                className="text-sm font-medium text-[rgb(var(--color-accent))] hover:text-[rgb(var(--color-accent-hover))]"
              >
                Registrate
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
