import { useSyncExternalStore } from "react";

/** `variant` guarda o acabamento escolhido (ex.: "Preto"). O mesmo produto em cores diferentes vira duas linhas. */
export type CartLine = { slug: string; qty: number; variant?: string };

const KEY = "wd_cart";
const listeners = new Set<() => void>();
let cache: CartLine[] | null = null;

const sameLine = (a: CartLine, slug: string, variant?: string) => a.slug === slug && (a.variant ?? "") === (variant ?? "");

export const lineKey = (l: CartLine) => `${l.slug}::${l.variant ?? ""}`;

function read(): CartLine[] {
  if (cache) return cache;
  try {
    const parsed = JSON.parse(localStorage.getItem(KEY) ?? "[]");
    cache = Array.isArray(parsed)
      ? parsed
          .filter((l) => typeof l?.slug === "string" && Number.isInteger(l?.qty) && l.qty > 0)
          .map((l) => ({ slug: l.slug, qty: l.qty, ...(typeof l.variant === "string" && l.variant ? { variant: l.variant } : {}) }))
      : [];
  } catch {
    cache = [];
  }
  return cache!;
}

function write(lines: CartLine[]) {
  cache = lines;
  try {
    localStorage.setItem(KEY, JSON.stringify(lines));
  } catch {
    /* sem localStorage: o carrinho vive só nesta aba */
  }
  listeners.forEach((l) => l());
}

export const addToCart = (slug: string, qty = 1, variant?: string) => {
  const lines = read();
  const found = lines.find((l) => sameLine(l, slug, variant));
  write(
    found
      ? lines.map((l) => (sameLine(l, slug, variant) ? { ...l, qty: Math.min(l.qty + qty, 10) } : l))
      : [...lines, { slug, qty, ...(variant ? { variant } : {}) }],
  );
};

export const setQty = (slug: string, qty: number, variant?: string) =>
  write(
    qty <= 0
      ? read().filter((l) => !sameLine(l, slug, variant))
      : read().map((l) => (sameLine(l, slug, variant) ? { ...l, qty: Math.min(qty, 10) } : l)),
  );

export const clearCart = () => write([]);

export function useCart() {
  return useSyncExternalStore(
    (cb) => {
      listeners.add(cb);
      return () => listeners.delete(cb);
    },
    read,
    () => [],
  );
}

export const useCartCount = () => useCart().reduce((n, l) => n + l.qty, 0);
