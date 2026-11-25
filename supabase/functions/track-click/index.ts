// Registra um clique de afiliado. O navegador só dispara 1x por sessão e por código, mas isso é
// fácil de burlar, então o servidor também limita: 1 clique por visitante, por código e por dia,
// e no máximo 30 cliques por visitante por hora. Assim ninguém infla os números de um afiliado.
import { createClient } from "npm:@supabase/supabase-js@2";
import { isAllowedOrigin, json, preflight } from "../_shared/cors.ts";
import { clientKey, rateLimit, readJson } from "../_shared/security.ts";

const db = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return preflight(req);
  if (req.method !== "POST" || !isAllowedOrigin(req.headers.get("origin"))) return json(req, { ok: false }, 403);

  try {
    const b = await readJson(req, 2048);
    const code = typeof b.code === "string" ? b.code.toLowerCase() : "";
    if (!/^[a-z0-9_-]{3,30}$/.test(code)) return json(req, { ok: true });
    const path = typeof b.path === "string" && b.path.startsWith("/") ? b.path.slice(0, 200) : null;

    const visitor = await clientKey(req);
    if (!(await rateLimit(db, `clicks:${visitor}`, 3600, 30))) return json(req, { ok: true });
    if (!(await rateLimit(db, `click:${code}:${visitor}`, 86400, 1))) return json(req, { ok: true });

    const { data: aff } = await db.from("affiliates").select("id").eq("code", code).eq("status", "active").maybeSingle();
    if (aff) await db.from("affiliate_clicks").insert({ affiliate_id: aff.id, landing_path: path });
  } catch (e) {
    console.error("[track-click]", e instanceof Error ? e.message : e);
  }
  // Resposta sempre igual: não revela se o código existe.
  return json(req, { ok: true });
});
