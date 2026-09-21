import * as React from "react";
import { cn } from "@/lib/utils";

export type ButtonVariant = "primary" | "secondary" | "outline" | "glass" | "pill" | "pill-light";

const variantStyles: Record<ButtonVariant, string> = {
  primary: "bg-primary text-primary-foreground hover:bg-primary-hover",
  secondary: "bg-secondary text-secondary-foreground hover:bg-accent",
  outline: "border border-border bg-transparent text-foreground hover:border-primary hover:text-primary",
  glass: "border border-white/30 bg-white/10 text-white backdrop-blur-md hover:bg-white/20",
  pill: "bg-primary text-white hover:bg-primary-hover",
  "pill-light": "bg-white text-navy-900 hover:bg-accent",
};

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
}

/**
 * Botão pill compartilhado do site. Reconstruído após o `shadcn init` ter
 * sobrescrito este arquivo com o Button padrão do shadcn (API de variantes
 * incompatível: default/outline/secondary/ghost/destructive/link).
 * As variantes e o par com ButtonArrow foram restaurados a partir dos
 * pontos de uso reais em App.tsx e ConsultorPage.tsx.
 */
export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", children, ...props }, ref) => (
    <button
      ref={ref}
      className={cn(
        "group inline-flex min-h-14 items-center justify-center gap-3 rounded-full px-7 text-[11px] font-semibold tracking-[0.2em] transition-colors duration-300 disabled:cursor-not-allowed disabled:opacity-60",
        variantStyles[variant],
        className,
      )}
      {...props}
    >
      {children}
    </button>
  ),
);
Button.displayName = "Button";

/** Círculo de seta usado como sufixo dos botões pill (ex: ConsultorPage). */
export const ButtonArrow = ({
  children,
  tone = "dark",
}: {
  children: React.ReactNode;
  tone?: "dark" | "light";
}) => (
  <span
    className={cn(
      "flex h-9 w-9 items-center justify-center rounded-full transition-transform duration-300 group-hover:translate-x-0.5",
      tone === "light" ? "bg-navy-900 text-white" : "bg-white/18 text-white",
    )}
  >
    {children}
  </span>
);
