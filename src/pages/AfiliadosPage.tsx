import { ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";
import type React from "react";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";
import { FUNCTIONS_URL } from "@/lib/affiliate";
import { formatBRL } from "@/lib/catalog";

const inputCls = "w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:border-neutral-900 focus:outline-none";
const btnCls = "rounded-full bg-neutral-900 px-6 py-3 text-sm font-medium text-white hover:bg-neutral-700 disabled:opacity-50";

type Affiliate = { name: string; code: string; status: string; commission_pct: number };
type Commission = { amount_cents: number; status: string; release_at: string | null; created_at: string };

function Signup() {
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!FUNCTIONS_URL) return setMsg({ ok: false, text: "Cadastro indisponível no momento." });
    const f = new FormData(e.currentTarget);
    setBusy(true);
    const res = await fetch(`${FUNCTIONS_URL}/affiliate-signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json", apikey: import.meta.env.VITE_SUPABASE_ANON_KEY },
      body: JSON.stringify({ name: f.get("name"), email: f.get("email"), code: f.get("code"), pixKey: f.get("pix") }),
    }).catch(() => null);
    const data = await res?.json().catch(() => ({}));
    setBusy(false);
    setMsg(res?.ok
      ? { ok: true, text: "Cadastro recebido. Avisaremos por e-mail quando for aprovado; depois é só entrar aqui ao lado." }
      : { ok: false, text: data?.error ?? "Não foi possível enviar. Tente novamente." });
  }

  return (
    <form onSubmit={submit} className="flex flex-col gap-4">
      <h2 className="text-xl font-semibold">Quero ser afiliado</h2>
      {[
        ["name", "Nome completo", "text"], ["email", "E-mail", "email"],
        ["code", "Código do seu link (ex.: maria)", "text"], ["pix", "Chave Pix para receber (opcional)", "text"],
      ].map(([name, label, type]) => (
        <label key={name} className="flex flex-col gap-1 text-sm">
          <span className="text-neutral-600">{label}</span>
          <input name={name} type={type} required={name !== "pix"} className={inputCls} />
        </label>
      ))}
      {msg && <p role="alert" className={`text-sm ${msg.ok ? "text-green-700" : "text-red-600"}`}>{msg.text}</p>}
      <button disabled={busy} className={btnCls}>{busy ? "Enviando…" : "Enviar cadastro"}</button>
    </form>
  );
}

function Login() {
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const email = String(new FormData(e.currentTarget).get("email"));
    const { error } = await supabase!.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${window.location.origin}/afiliados`, shouldCreateUser: true },
    });
    if (error) setError("Não foi possível enviar o link. Tente novamente.");
    else setSent(true);
  }

  return (
    <form onSubmit={submit} className="flex flex-col gap-4">
      <h2 className="text-xl font-semibold">Já sou afiliado</h2>
      {sent ? (
        <p className="text-sm text-neutral-600">Enviamos um link de acesso para o seu e-mail. Abra por ele para entrar.</p>
      ) : (
        <>
          <label className="flex flex-col gap-1 text-sm">
            <span className="text-neutral-600">E-mail cadastrado</span>
            <input name="email" type="email" required className={inputCls} />
          </label>
          {error && <p role="alert" className="text-sm text-red-600">{error}</p>}
          <button className={btnCls}>Receber link de acesso</button>
        </>
      )}
    </form>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-neutral-200 p-5">
      <p className="text-xs uppercase tracking-widest text-neutral-500">{label}</p>
      <p className="mt-2 text-2xl font-semibold">{value}</p>
    </div>
  );
}

function Dashboard({ session }: { session: Session }) {
  const [aff, setAff] = useState<Affiliate | null | undefined>(undefined);
  const [clicks, setClicks] = useState(0);
  const [commissions, setCommissions] = useState<Commission[]>([]);
  const [coupon, setCoupon] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const db = supabase!;
      const { data } = await db.from("affiliates").select("name, code, status, commission_pct").maybeSingle();
      setAff(data);
      if (data?.status !== "active") return;
      const [c, k, cp] = await Promise.all([
        db.from("commissions").select("amount_cents, status, release_at, created_at").order("created_at", { ascending: false }),
        db.from("affiliate_clicks").select("id", { count: "exact", head: true }),
        db.from("coupons").select("code").limit(1).maybeSingle(),
      ]);
      setCommissions(c.data ?? []);
      setClicks(k.count ?? 0);
      setCoupon(cp.data?.code ?? null);
    })();
  }, []);

  if (aff === undefined) return <p className="text-neutral-500">Carregando…</p>;
  if (!aff) return <p>Nenhum cadastro de afiliado para {session.user.email}.</p>;
  if (aff.status !== "active")
    return <p>{aff.status === "pending" ? "Seu cadastro ainda está em análise." : "Seu acesso está bloqueado. Fale com a equipe."}</p>;

  const now = Date.now();
  const live = commissions.filter((c) => c.status !== "cancelled");
  const sum = (f: (c: Commission) => boolean) => live.filter(f).reduce((s, c) => s + c.amount_cents, 0);
  const paid = sum((c) => c.status === "paid");
  const available = sum((c) => c.status !== "paid" && !!c.release_at && new Date(c.release_at).getTime() <= now);
  const waiting = sum((c) => c.status !== "paid" && (!c.release_at || new Date(c.release_at).getTime() > now));
  const link = `${window.location.origin}/?ref=${aff.code}`;

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h2 className="text-xl font-semibold">Olá, {aff.name}</h2>
        <p className="mt-2 text-sm text-neutral-600">Seu link ({aff.commission_pct}% de comissão):</p>
        <div className="mt-1 flex flex-wrap items-center gap-2">
          <code className="rounded bg-neutral-100 px-3 py-2 text-sm">{link}</code>
          <button className="text-sm underline" onClick={() => navigator.clipboard?.writeText(link)}>Copiar</button>
        </div>
        {coupon && <p className="mt-2 text-sm text-neutral-600">Cupom: <code className="rounded bg-neutral-100 px-2 py-1">{coupon}</code></p>}
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="Cliques" value={String(clicks)} />
        <Stat label="Vendas" value={String(live.length)} />
        <Stat label="Disponível" value={formatBRL(available)} />
        <Stat label="A liberar" value={formatBRL(waiting)} />
      </div>
      <p className="text-sm text-neutral-500">Já pago a você: {formatBRL(paid)}. Os pagamentos são feitos por Pix pela equipe sobre o valor disponível.</p>
    </div>
  );
}

export default function AfiliadosPage() {
  const [session, setSession] = useState<Session | null | undefined>(undefined);

  useEffect(() => {
    document.title = "Programa de afiliados | Water Diamond";
    if (!supabase) return setSession(null);
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    const { data } = supabase.auth.onAuthStateChange((_e, s) => setSession(s));
    return () => data.subscription.unsubscribe();
  }, []);

  return (
    <main className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      <a href="/" className="mb-8 inline-flex items-center gap-2 text-sm text-neutral-500 hover:text-neutral-900">
        <ArrowLeft size={16} /> Voltar ao site
      </a>
      <h1 className="mb-8 text-3xl font-semibold">Programa de afiliados</h1>
      {session === undefined ? (
        <p className="text-neutral-500">Carregando…</p>
      ) : session ? (
        <>
          <Dashboard session={session} />
          <button className="mt-10 text-sm text-neutral-500 underline" onClick={() => supabase!.auth.signOut()}>Sair</button>
        </>
      ) : (
        <div className="grid gap-12 md:grid-cols-2">
          <Signup />
          {supabase ? <Login /> : <p className="text-sm text-neutral-500">Login indisponível: Supabase não configurado.</p>}
        </div>
      )}
    </main>
  );
}
