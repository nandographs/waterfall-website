// Utilitários de segurança das Edge Functions.
import type { SupabaseClient } from "npm:@supabase/supabase-js@2";

/** Erro que pode ser mostrado ao cliente. Qualquer outro erro vira uma mensagem genérica (sem detalhes internos). */
export class UserError extends Error {
  constructor(message: string, readonly status = 400) {
    super(message);
  }
}

const SALT = Deno.env.get("RATE_LIMIT_SALT") ?? Deno.env.get("SUPABASE_URL") ?? "";

/** Identifica o visitante por um hash do IP: dá para limitar tentativas sem guardar o IP em si. */
export async function clientKey(req: Request) {
  const ip =
    req.headers.get("cf-connecting-ip") ||
    (req.headers.get("x-forwarded-for") ?? "").split(",")[0].trim() ||
    req.headers.get("x-real-ip") ||
    "";
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(`${SALT}:${ip || "unknown"}`));
  return Array.from(new Uint8Array(digest).slice(0, 12), (b) => b.toString(16).padStart(2, "0")).join("");
}

/**
 * Conta uma tentativa na janela de `windowSeconds` e diz se ainda está dentro do limite.
 * Se o banco falhar, deixa passar (e registra no log) para não derrubar a loja por causa do contador.
 */
export async function rateLimit(db: SupabaseClient, key: string, windowSeconds: number, max: number) {
  const { data, error } = await db.rpc("rate_limit_hit", { p_key: key, p_window_seconds: windowSeconds, p_max: max });
  if (error) {
    console.error("[rate-limit] indisponível:", error.message);
    return true;
  }
  return data === true;
}

/** Compara segredos em tempo constante (não revela quantos caracteres batem). */
export function safeEqual(a: string, b: string) {
  const x = new TextEncoder().encode(a);
  const y = new TextEncoder().encode(b);
  let diff = x.length ^ y.length;
  for (let i = 0; i < Math.max(x.length, y.length); i++) diff |= (x[i] ?? 0) ^ (y[i] ?? 0);
  return diff === 0;
}

/** Lê o corpo JSON recusando corpos grandes demais ou que não sejam um objeto. */
// deno-lint-ignore no-explicit-any
export async function readJson(req: Request, maxBytes = 16_384): Promise<Record<string, any>> {
  if (Number(req.headers.get("content-length") ?? 0) > maxBytes) throw new UserError("Dados grandes demais.", 413);
  const text = await req.text();
  if (text.length > maxBytes) throw new UserError("Dados grandes demais.", 413);
  try {
    const value = JSON.parse(text);
    if (value && typeof value === "object" && !Array.isArray(value)) return value;
  } catch {
    /* cai no erro abaixo */
  }
  throw new UserError("Dados inválidos.");
}

/** Texto curto, sem caracteres de controle. Qualquer coisa que não seja string vira "". */
export const str = (v: unknown, max = 200) =>
  typeof v === "string" ? v.normalize("NFC").replace(/[\u0000-\u001f\u007f]/g, "").trim().slice(0, max) : "";
