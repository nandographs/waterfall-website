// Registra um clique de afiliado. O navegador só dispara 1x por sessão e por código.
import { createClient } from "npm:@supabase/supabase-js@2";
import { corsHeaders, json } from "../_shared/cors.ts";

const db = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  const b = await req.json().catch(() => ({}));
  const code = typeof b.code === "string" ? b.code.toLowerCase().slice(0, 30) : "";
  const path = typeof b.path === "string" ? b.path.slice(0, 200) : null;
  const { data: aff } = await db.from("affiliates").select("id").eq("code", code).eq("status", "active").maybeSingle();
  if (aff) await db.from("affiliate_clicks").insert({ affiliate_id: aff.id, landing_path: path });
  return json({ ok: true });
});
