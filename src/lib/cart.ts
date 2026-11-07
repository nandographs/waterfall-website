import { useSyncExternalStore } from "react";

export type CartLine = { slug: string; qty: number };

const KEY = "wd_cart";
const listeners = new Set<() => void>();
let cache: CartLine[] | null = null;

function read(): CartLine[] {
  if (cache) return cache;
  try {
    const parsed = JSON.parse(localStorage.getItem(KEY) ?? "[]");
    cache = Array.isArray(parsed)
      ? parsed.filter((l) => typeof l?.slug === "string" && Number.isInteger(l?.qty) && l.qty > 0)
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

export const addToCart = (slug: string, qty = 1) => {
  const lines = read();
  const found = lines.find((l) => l.slug === slug);
  write(found ? lines.map((l) => (l.slug === slug ? { ...l, qty: Math.min(l.qty + qty, 10) } : l)) : [...lines, { slug, qty }]);
};

export const setQty = (slug: string, qty: number) =>
  write(qty <= 0 ? read().filter((l) => l.slug !== slug) : read().map((l) => (l.slug === slug ? { ...l, qty: Math.min(qty, 10) } : l)));

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
