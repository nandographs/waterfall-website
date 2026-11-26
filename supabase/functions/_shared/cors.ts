// Quem pode chamar as funções pelo navegador. ALLOWED_ORIGINS (secret) aceita vários domínios
// separados por vírgula, ex.: https://waterfall.ind.br,https://www.waterfall.ind.br,https://bionlife.waterfall.ind.br
// Sem ele vale só o SITE_URL. Nunca "*": origem fora da lista não recebe o cabeçalho e o navegador bloqueia.
const ALLOWED = (Deno.env.get("ALLOWED_ORIGINS") ?? Deno.env.get("SITE_URL") ?? "")
  .split(",")
  .map((s) => s.trim().replace(/\/$/, ""))
  .filter(Boolean);

export const isAllowedOrigin = (origin: string | null) => !!origin && ALLOWED.includes(origin);

export const corsHeaders = (req: Request): Record<string, string> => {
  const origin = req.headers.get("origin");
  return {
    ...(isAllowedOrigin(origin) ? { "Access-Control-Allow-Origin": origin! } : {}),
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Max-Age": "86400",
    Vary: "Origin",
  };
};

export const preflight = (req: Request) => new Response(null, { status: 204, headers: corsHeaders(req) });

export const json = (req: Request, body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: {
      ...corsHeaders(req),
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store",
      "X-Content-Type-Options": "nosniff",
    },
  });
