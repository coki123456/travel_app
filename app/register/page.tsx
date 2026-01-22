"use client";

import Link from "next/link";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FormInput } from "../components/ui/FormInput";
import ErrorAlert from "../components/ui/ErrorAlert";
import LoadingButton from "../components/ui/LoadingButton";
import { Icon } from "../components/ui/Icon";

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
          <div className="hidden lg:flex lg:flex-col lg:gap-5 animate-fade-in">
            <div className="inline-flex items-center gap-2 w-fit">
              <div className="w-9 h-9 rounded-[var(--radius-md)] bg-gradient-to-br from-[rgb(var(--color-success))] to-[rgb(var(--color-accent))] flex items-center justify-center shadow-[var(--shadow-sm)]">
                <Icon name="plane" label="Travel Planner" className="w-5 h-5" strokeWidth={2} />
              </div>
              <span className="text-base font-semibold text-[rgb(var(--color-text-primary))]">
                Travel Planner
              </span>
            </div>

            <h1 className="text-3xl font-semibold leading-tight text-[rgb(var(--color-text-primary))]">
              Empezá tu bitácora de viaje
            </h1>
            <p className="text-base text-[rgb(var(--color-text-secondary))]">
              Creá tu cuenta en segundos y comenzá a planificar viajes inolvidables. Todo organizado, simple y accesible.
            </p>

            <div className="grid gap-4 sm:grid-cols-2 mt-4">
              <div className="card-flat p-4">
                <div className="w-8 h-8 rounded-[var(--radius-sm)] bg-[rgb(var(--color-success))]/10 flex items-center justify-center mb-3">
                  <Icon name="check" label="Fácil de usar" className="w-4 h-4 text-[rgb(var(--color-success))]" strokeWidth={2} />
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
                  <Icon name="share" label="Compartí con otros" className="w-4 h-4 text-[rgb(var(--color-accent))]" strokeWidth={2} />
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
            <div className="mb-5">
              <div className="flex items-center gap-2.5 mb-1">
                <div className="w-10 h-10 rounded-[var(--radius-md)] bg-gradient-to-br from-[rgb(var(--color-success))] to-[rgb(var(--color-accent))] flex items-center justify-center shadow-[var(--shadow-sm)] lg:hidden">
                  <Icon name="plus" label="Crear cuenta" className="w-5 h-5" strokeWidth={2} />
                </div>
                <h2 className="text-xl font-semibold text-[rgb(var(--color-text-primary))]">
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
                <Icon name="check" label="Crear cuenta" className="w-4 h-4" strokeWidth={2} />
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
