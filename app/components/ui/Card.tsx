import React from "react";

interface CardProps {
  children: React.ReactNode;
  variant?: "default" | "glass" | "elevated" | "white";
  className?: string;
  padding?: "none" | "sm" | "md" | "lg";
}

export function Card({
  children,
  variant = "default",
  className = "",
  padding = "md"
}: CardProps) {
  const baseStyles = "rounded-2xl transition-all";

  const variantStyles = {
    default: "bg-slate-900/70 border border-slate-800 shadow-lg shadow-black/30",
    glass: "bg-white/95 backdrop-blur-sm border border-gray-200/50 shadow-lg",
    elevated: "bg-slate-900/80 border border-white/10 shadow-xl",
    white: "bg-white/95 backdrop-blur-sm border-l border-gray-200/50 shadow-xl",
  };

  const paddingStyles = {
    none: "",
    sm: "p-4",
    md: "p-6",
    lg: "p-8",
  };

  return (
    <div
      className={`${baseStyles} ${variantStyles[variant]} ${paddingStyles[padding]} ${className}`}
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
    <div className={`mb-4 ${className}`}>
      {children}
    </div>
  );
}

interface CardTitleProps {
  children: React.ReactNode;
  className?: string;
}

export function CardTitle({ children, className = "" }: CardTitleProps) {
  return (
    <h3 className={`text-lg font-semibold ${className}`}>
      {children}
    </h3>
  );
}

interface CardContentProps {
  children: React.ReactNode;
  className?: string;
}

export function CardContent({ children, className = "" }: CardContentProps) {
  return (
    <div className={className}>
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
    <div className={`mt-4 pt-4 border-t border-gray-200 ${className}`}>
      {children}
    </div>
  );
}
