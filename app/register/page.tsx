"use client";

import Link from "next/link";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FormInput } from "../components/ui/FormInput";
import ErrorAlert from "../components/ui/ErrorAlert";
import LoadingButton from "../components/ui/LoadingButton";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Error al crear la cuenta");
        return;
      }

      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError("Cuenta creada, pero hubo un error al iniciar sesión");
        return;
      }

      router.push("/");
      router.refresh();
    } catch (err) {
      console.error("Error al crear la cuenta:", err);
      setError("Error al crear la cuenta");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[rgb(var(--color-bg-primary))] px-4 py-10 flex items-center justify-center">
      <div className="container-wide">
        <div className="grid items-center gap-8 lg:grid-cols-[1fr_1fr]">
          {/* Left Side - Branding */}
          <div className="hidden lg:flex lg:flex-col lg:gap-6 animate-fade-in">
            <div className="inline-flex items-center gap-2 w-fit">
              <div className="w-10 h-10 rounded-[var(--radius-md)] bg-gradient-to-br from-[rgb(var(--color-success))] to-[rgb(var(--color-accent))] flex items-center justify-center shadow-[var(--shadow-sm)]">
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <span className="text-lg font-semibold text-[rgb(var(--color-text-primary))]">
                Travel Planner
              </span>
            </div>

            <h1 className="text-4xl font-semibold leading-tight text-[rgb(var(--color-text-primary))]">
              Empezá tu bitácora de viaje
            </h1>
            <p className="text-lg text-[rgb(var(--color-text-secondary))]">
              Creá tu cuenta en segundos y comenzá a planificar viajes inolvidables. Todo organizado, simple y accesible.
            </p>

            <div className="grid gap-4 sm:grid-cols-2 mt-4">
              <div className="card-flat p-4">
                <div className="w-8 h-8 rounded-[var(--radius-sm)] bg-[rgb(var(--color-success))]/10 flex items-center justify-center mb-3">
                  <svg className="w-4 h-4 text-[rgb(var(--color-success))]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-sm font-semibold text-[rgb(var(--color-text-primary))] mb-1">
                  Fácil de usar
                </h3>
                <p className="text-xs text-[rgb(var(--color-text-secondary))]">
                  Interfaz intuitiva y clara
                </p>
              </div>

              <div className="card-flat p-4">
                <div className="w-8 h-8 rounded-[var(--radius-sm)] bg-[rgb(var(--color-accent))]/10 flex items-center justify-center mb-3">
                  <svg className="w-4 h-4 text-[rgb(var(--color-accent))]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                  </svg>
                </div>
                <h3 className="text-sm font-semibold text-[rgb(var(--color-text-primary))] mb-1">
                  Compartí con otros
                </h3>
                <p className="text-xs text-[rgb(var(--color-text-secondary))]">
                  Invitá amigos a tus viajes
                </p>
              </div>
            </div>
          </div>

          {/* Right Side - Register Form */}
          <div className="card p-8 max-w-md mx-auto w-full animate-fade-in">
            <div className="mb-6">
              <div className="flex items-center gap-3 mb-1">
                <div className="w-12 h-12 rounded-[var(--radius-md)] bg-gradient-to-br from-[rgb(var(--color-success))] to-[rgb(var(--color-accent))] flex items-center justify-center shadow-[var(--shadow-sm)] lg:hidden">
                  <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                  </svg>
                </div>
                <h2 className="text-2xl font-semibold text-[rgb(var(--color-text-primary))]">
                  Crear cuenta
                </h2>
              </div>
              <p className="text-sm text-[rgb(var(--color-text-secondary))]">
                Unite y empezá a organizar tus viajes
              </p>
            </div>

            <ErrorAlert error={error} />

            <form onSubmit={handleSubmit} className="space-y-4 mt-6">
              <FormInput
                label="Nombre"
                type="text"
                id="name"
                value={name}
                onChange={(event) => setName(event.target.value)}
                required
                placeholder="Tu nombre"
              />

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
                minLength={6}
                placeholder="••••••••"
                helper="Mínimo 6 caracteres"
              />

              <LoadingButton
                type="submit"
                isLoading={loading}
                loadingText="Creando cuenta..."
                variant="primary"
                className="w-full mt-6"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                </svg>
                Crear cuenta
              </LoadingButton>
            </form>

            <div className="divider my-6"></div>

            <div className="text-center">
              <span className="text-sm text-[rgb(var(--color-text-secondary))]">
                ¿Ya tenés cuenta?{" "}
              </span>
              <Link
                href="/login"
                className="text-sm font-medium text-[rgb(var(--color-accent))] hover:text-[rgb(var(--color-accent-hover))]"
              >
                Iniciá sesión
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
