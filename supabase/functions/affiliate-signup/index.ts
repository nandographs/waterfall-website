// Cadastro de afiliado: entra como 'pending' e só vira 'active' quando você aprova no painel do Supabase.
import { createClient } from "npm:@supabase/supabase-js@2";
import { corsHeaders, json } from "../_shared/cors.ts";

const db = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
const str = (v: unknown, max = 120) => (typeof v === "string" ? v.trim().slice(0, max) : "");

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") return json({ error: "Método não permitido" }, 405);

  const b = await req.json().catch(() => ({}));
  const name = str(b.name), email = str(b.email).toLowerCase(), pix = str(b.pixKey, 140);
  const code = str(b.code, 30).toLowerCase();
  if (!name || !/^\S+@\S+\.\S+$/.test(email)) return json({ error: "Confira nome e e-mail." }, 400);
  if (!/^[a-z0-9_-]{3,30}$/.test(code)) return json({ error: "Código: 3 a 30 letras minúsculas, números, - ou _." }, 400);

  const { error } = await db.from("affiliates").insert({ name, email, code, pix_key: pix || null });
  if (error) {
    const dupCode = error.message.includes("code");
    return json({ error: dupCode ? "Esse código já está em uso." : "Não foi possível concluir o cadastro." }, 400);
  }
  return json({ ok: true });
});
