// SITE_URL (secret) restringe quem pode chamar do navegador. Ex.: https://waterdiamond.com.br
const origin = Deno.env.get("SITE_URL") ?? "*";

export const corsHeaders = {
  "Access-Control-Allow-Origin": origin,
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

export const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { ...corsHeaders, "Content-Type": "application/json" } });
