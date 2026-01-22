import React from "react";

interface CardProps {
  children: React.ReactNode;
  variant?: "default" | "flat" | "hover";
  className?: string;
  padding?: "none" | "sm" | "md" | "lg";
}

/**
 * Componente Card - Minimalista Moderno
 * Usa las clases del sistema de diseño global
 */
export function Card({
  children,
  variant = "default",
  className = "",
  padding = "md"
}: CardProps) {
  const variantStyles = {
    default: "card",
    flat: "card-flat",
    hover: "card-hover",
  };

  const paddingStyles = {
    none: "",
    sm: "p-4",
    md: "p-6",
    lg: "p-8",
  };

  return (
    <div
      className={`${variantStyles[variant]} ${paddingStyles[padding]} ${className}`}
    >
      {children}
    </div>
  );
}

interface CardHeaderProps {
  children: React.ReactNode;
  className?: string;
}

export function CardHeader({ children, className = "" }: CardHeaderProps) {
  return (
    <div className={`mb-5 ${className}`}>
      {children}
    </div>
  );
}

interface CardTitleProps {
  children: React.ReactNode;
  className?: string;
  as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
}

export function CardTitle({ children, className = "", as = "h3" }: CardTitleProps) {
  const Component = as;
  return (
    <Component className={`font-semibold text-[rgb(var(--color-text-primary))] ${className}`}>
      {children}
    </Component>
  );
}

interface CardDescriptionProps {
  children: React.ReactNode;
  className?: string;
}

export function CardDescription({ children, className = "" }: CardDescriptionProps) {
  return (
    <p className={`text-sm text-[rgb(var(--color-text-secondary))] mt-1 ${className}`}>
      {children}
    </p>
  );
}

interface CardContentProps {
  children: React.ReactNode;
  className?: string;
}

export function CardContent({ children, className = "" }: CardContentProps) {
  return (
    <div className={`content-spacing ${className}`}>
      {children}
    </div>
  );
}

interface CardFooterProps {
  children: React.ReactNode;
  className?: string;
}

export function CardFooter({ children, className = "" }: CardFooterProps) {
  return (
    <div className={`mt-5 pt-5 divider flex items-center gap-3 ${className}`}>
      {children}
    </div>
  );
}
