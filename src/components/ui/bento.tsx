"use client";

import { clsx } from "clsx";
import { motion, useReducedMotion } from "motion/react";
import React from "react";

/**
 * Bento grid adaptado do componente FUIBentoGridDark.
 * Trocas em relação ao original: `framer-motion` -> `motion/react` (o pacote já usado no
 * projeto), a `<div>` de background virou `<img>` para funcionar com os assets locais e
 * as cores seguem os tokens do site em vez do preto/cinza padrão.
 */
export function BentoGrid({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={clsx(
        "grid grid-cols-1 gap-4 lg:grid-cols-6",
        className,
      )}
    >
      {children}
    </div>
  );
}

export function BentoCard({
  className = "",
  tone = "dark",
  eyebrow,
  title,
  description,
  graphic,
  fade = [],
  overlap = true,
  mediaClassName = "h-[19rem] md:h-[23rem]",
}: {
  className?: string;
  /** `dark` = card navy sobre seção clara. `light` = card azul-claro, texto escuro. */
  tone?: "dark" | "light";
  eyebrow?: React.ReactNode;
  title: React.ReactNode;
  description: React.ReactNode;
  graphic?: React.ReactNode;
  fade?: ("top" | "bottom")[];
  /** Painel de texto sobreposto à imagem, como no componente original. */
  overlap?: boolean;
  mediaClassName?: string;
}) {
  const reduce = useReducedMotion();
  const dark = tone === "dark";

  return (
    <motion.div
      initial="idle"
      whileHover="active"
      variants={{ idle: {}, active: {} }}
      className={clsx(
        className,
        "group relative flex flex-col overflow-hidden rounded-[24px] transform-gpu shadow-sm",
        dark
          ? "bg-navy-900 ring-1 ring-white/10 [box-shadow:0_-20px_80px_-20px_rgba(0,176,224,0.18)_inset]"
          : "bg-[#eef6fa] ring-1 ring-[#dbe7ed]",
      )}
    >
      <div className={clsx("relative shrink-0 overflow-hidden", mediaClassName)}>
        <motion.div
          className="absolute inset-0"
          variants={
            reduce ? undefined : { idle: { scale: 1 }, active: { scale: 1.04 } }
          }
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        >
          {graphic}
        </motion.div>

        {fade.includes("top") && (
          <div
            className={clsx(
              "absolute inset-0 bg-gradient-to-b to-50%",
              dark ? "from-navy-900 opacity-70" : "from-[#eef6fa] opacity-80",
            )}
          />
        )}
        {fade.includes("bottom") && (
          <div
            className={clsx(
              "absolute inset-0 bg-gradient-to-t to-55%",
              dark ? "from-navy-900 opacity-90" : "from-[#eef6fa] opacity-95",
            )}
          />
        )}
      </div>

      <div
        className={clsx(
          "relative isolate z-20 flex flex-1 flex-col p-7 md:p-9",
          overlap && "mt-[-7rem] min-h-[13rem] backdrop-blur-xl",
          dark ? "text-white" : "text-foreground",
        )}
      >
        {eyebrow && (
          <p
            className={clsx(
              "text-[11px] font-semibold uppercase tracking-[0.2em]",
              dark ? "text-primary-light" : "text-primary",
            )}
          >
            {eyebrow}
          </p>
        )}
        <h3 className="mt-3 text-xl font-medium tracking-[-0.03em] md:text-2xl">
          {title}
        </h3>
        <p
          className={clsx(
            "mt-3 max-w-[46ch] text-[15px] font-light leading-7",
            dark ? "text-white/65" : "text-muted-foreground",
          )}
        >
          {description}
        </p>
      </div>
    </motion.div>
  );
}

/** Imagem de fundo de um card, no lugar do `bg-[url(...)]` do componente original. */
export function BentoImage({
  src,
  alt = "",
  className = "",
}: {
  src: string;
  alt?: string;
  className?: string;
}) {
  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      decoding="async"
      className={clsx("h-full w-full object-cover", className)}
    />
  );
}

export default BentoGrid;
