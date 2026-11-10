import { Check, ChevronRight, Clock, Copy, Link2, LogOut, ShieldAlert, Wallet } from "lucide-react";
import { useEffect, useState } from "react";
import type React from "react";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";
import { FUNCTIONS_URL } from "@/lib/affiliate";
import { formatBRL } from "@/lib/catalog";
import { SidebarMenu, SiteFooter, SiteHeader } from "@/components/site-shell";

const shell = "mx-auto w-full max-w-[1200px] px-5 md:px-12";
const labelClass = "mb-1.5 block text-[0.8125rem] font-medium text-pewter";

type Affiliate = { name: string; code: string; status: string; commission_pct: number };
type Commission = { amount_cents: number; status: string; release_at: string | null; created_at: string };

const steps = [
  { icon: Link2, title: "Cadastre-se", text: "Escolha o código do seu link. A equipe analisa e avisa por e-mail quando aprovar." },
  { icon: Copy, title: "Compartilhe", text: "Divulgue seu link ou cupom. Cada venda feita por ele fica registrada no seu painel." },
  { icon: Wallet, title: "Receba por Pix", text: "A comissão é liberada após o prazo de segurança e paga pela equipe via Pix." },
];

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
    <form id="cadastro" onSubmit={submit} className="flex h-full scroll-mt-24 flex-col rounded-[28px] bg-frost p-7 md:p-10">
      <h2 className="t-headline-lg">Quero ser afiliado.</h2>
      <p className="t-small mt-2 text-pewter">Leva um minuto. Você recebe a resposta por e-mail.</p>

      <div className="mt-7 space-y-4">
        <label className="block">
          <span className={labelClass}>Nome completo</span>
          <input name="name" required autoComplete="name" className="wd-input" />
        </label>
        <label className="block">
          <span className={labelClass}>E-mail</span>
          <input name="email" type="email" required autoComplete="email" className="wd-input" />
        </label>
        <label className="block">
          <span className={labelClass}>Código do seu link</span>
          <input
            name="code"
            required
            autoComplete="off"
            placeholder="ex.: maria"
            pattern={"[A-Za-z0-9_\\-]{3,30}"}
            title="De 3 a 30 letras, números, _ ou -"
            className="wd-input"
          />
          <span className="t-caption mt-1.5 block text-pewter">Seu link fica assim: {window.location.host}/?ref=<span className="text-obsidian">codigo</span></span>
        </label>
        <label className="block">
          <span className={labelClass}>
            Chave Pix para receber <span className="font-normal">(opcional)</span>
          </span>
          <input name="pix" autoComplete="off" className="wd-input" />
        </label>
      </div>

      {msg && (
        <p role="alert" className={`t-small mt-5 flex items-start gap-2 font-medium ${msg.ok ? "text-obsidian" : "text-red-600"}`}>
          {msg.ok && <Check size={16} className="mt-0.5 shrink-0 text-action" aria-hidden="true" />}
          {msg.text}
        </p>
      )}
      <button type="submit" disabled={busy} className="btn-action mt-7 min-h-12 w-full text-base">
        {busy ? "Enviando…" : "Enviar cadastro"}
      </button>
    </form>
  );
}

function Login() {
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const email = String(new FormData(e.currentTarget).get("email"));
    setBusy(true);
    const { error } = await supabase!.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${window.location.origin}/afiliados`, shouldCreateUser: true },
    });
    setBusy(false);
    if (error) setError("Não foi possível enviar o link. Tente novamente.");
    else setSent(true);
  }

  return (
    <form id="entrar" onSubmit={submit} className="flex h-full scroll-mt-24 flex-col rounded-[28px] bg-obsidian p-7 text-frost md:p-10">
      <h2 className="t-headline-lg">Já sou afiliado.</h2>
      {sent ? (
        <div className="mt-6 flex items-start gap-3">
          <Check size={20} className="mt-0.5 shrink-0 text-halo" aria-hidden="true" />
          <p className="t-body text-frost">Enviamos um link de acesso para o seu e-mail. Abra por ele para entrar.</p>
        </div>
      ) : (
        <>
          <p className="t-small mt-2 text-platinum">Sem senha: enviamos um link de acesso para o seu e-mail.</p>
          <label className="mt-7 block">
            <span className="mb-1.5 block text-[0.8125rem] font-medium text-platinum">E-mail cadastrado</span>
            <input name="email" type="email" required autoComplete="email" className="wd-input" />
          </label>
          {error && <p role="alert" className="t-small mt-4 font-medium text-red-400">{error}</p>}
          <button type="submit" disabled={busy} className="btn-action mt-7 min-h-12 w-full text-base">
            {busy ? "Enviando…" : "Receber link de acesso"}
          </button>
        </>
      )}
    </form>
  );
}

function Stat({ label, value, hint }: { label: string; value: string; hint?: string }) {
  return (
    <div className="rounded-[22px] bg-frost p-6">
      <p className="t-small text-pewter">{label}</p>
      <p className="mt-2 text-[1.75rem] font-semibold leading-none tracking-[-0.025em] [font-variant-numeric:tabular-nums]">{value}</p>
      {hint && <p className="t-caption mt-2 text-pewter">{hint}</p>}
    </div>
  );
}

function Notice({ icon: Icon, title, text }: { icon: typeof Clock; title: string; text: string }) {
  return (
    <div className="flex max-w-2xl items-start gap-5 rounded-[28px] bg-frost p-8 md:p-10">
      <Icon size={28} strokeWidth={1.5} className="shrink-0 text-obsidian" aria-hidden="true" />
      <div>
        <p className="t-headline font-semibold">{title}</p>
        <p className="t-body mt-2 text-pewter">{text}</p>
      </div>
    </div>
  );
}

function Dashboard({ session }: { session: Session }) {
  const [aff, setAff] = useState<Affiliate | null | undefined>(undefined);
  const [clicks, setClicks] = useState(0);
  const [commissions, setCommissions] = useState<Commission[]>([]);
  const [coupon, setCoupon] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

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

  useEffect(() => {
    if (!copied) return;
    const t = setTimeout(() => setCopied(false), 2000);
    return () => clearTimeout(t);
  }, [copied]);

  if (aff === undefined) {
    return (
      <div className="space-y-4">
        <div className="h-14 w-72 animate-pulse rounded-xl bg-frost" />
        <div className="h-40 animate-pulse rounded-[28px] bg-frost" />
      </div>
    );
  }
  if (!aff) {
    return (
      <Notice
        icon={ShieldAlert}
        title="Nenhum cadastro encontrado."
        text={`Não há cadastro de afiliado para ${session.user.email}. Se ainda não se cadastrou, saia e preencha o formulário de cadastro.`}
      />
    );
  }
  if (aff.status !== "active") {
    return aff.status === "pending" ? (
      <Notice icon={Clock} title="Seu cadastro está em análise." text="Avisaremos por e-mail assim que for aprovado. Depois disso, seu link e seus números aparecem aqui." />
    ) : (
      <Notice icon={ShieldAlert} title="Seu acesso está bloqueado." text="Fale com a equipe Waterfall para entender o motivo." />
    );
  }

  const now = Date.now();
  const live = commissions.filter((c) => c.status !== "cancelled");
  const sum = (f: (c: Commission) => boolean) => live.filter(f).reduce((s, c) => s + c.amount_cents, 0);
  const paid = sum((c) => c.status === "paid");
  const available = sum((c) => c.status !== "paid" && !!c.release_at && new Date(c.release_at).getTime() <= now);
  const waiting = sum((c) => c.status !== "paid" && (!c.release_at || new Date(c.release_at).getTime() > now));
  const link = `${window.location.origin}/?ref=${aff.code}`;

  const copy = () => {
    navigator.clipboard?.writeText(link).then(() => setCopied(true)).catch(() => {});
  };

  return (
    <div>
      <h1 className="t-display">
        Olá, {aff.name.split(" ")[0]}. <span className="text-pewter">Este é o seu painel.</span>
      </h1>

      {/* Link de indicação */}
      <div className="mt-12 rounded-[28px] bg-obsidian p-7 text-frost md:p-10">
        <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
          <p className="t-title">Seu link de indicação</p>
          <p className="t-small text-platinum">{aff.commission_pct}% de comissão por venda</p>
        </div>
        <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center">
          <code className="min-w-0 flex-1 truncate rounded-[14px] bg-black/40 px-5 py-3.5 font-mono text-[0.9375rem] text-frost">{link}</code>
          <button type="button" onClick={copy} className="btn-action min-h-12 shrink-0 px-6">
            {copied ? <><Check size={18} aria-hidden="true" /> Copiado</> : <><Copy size={17} aria-hidden="true" /> Copiar link</>}
          </button>
        </div>
        {coupon && (
          <p className="t-small mt-5 text-platinum">
            Cupom para divulgar:{" "}
            <code className="rounded-full bg-graphite px-3 py-1 font-mono text-frost">{coupon}</code>
          </p>
        )}
      </div>

      {/* Números */}
      <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="Cliques no link" value={String(clicks)} />
        <Stat label="Vendas" value={String(live.length)} />
        <Stat label="Disponível" value={formatBRL(available)} hint="Liberado para pagamento" />
        <Stat label="A liberar" value={formatBRL(waiting)} hint="Ainda no prazo de segurança" />
      </div>

      <p className="t-small mt-8 max-w-2xl text-pewter">
        Já pago a você: <span className="font-semibold text-obsidian [font-variant-numeric:tabular-nums]">{formatBRL(paid)}</span>. Os pagamentos são feitos por Pix pela equipe sobre o valor disponível.
      </p>
    </div>
  );
}

export default function AfiliadosPage() {
  const [session, setSession] = useState<Session | null | undefined>(undefined);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    document.title = "Área do afiliado | Water Diamond";
    if (!supabase) return setSession(null);
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    const { data } = supabase.auth.onAuthStateChange((_e, s) => setSession(s));
    return () => data.subscription.unsubscribe();
  }, []);

  return (
    <div className="wd min-h-screen bg-white text-obsidian selection:bg-action/15">
      <SiteHeader onMenuOpen={() => setIsMenuOpen(true)} cta={null} />
      <SidebarMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />

      {session === undefined ? (
        <main className={`${shell} pb-24 pt-32`}>
          <div className="h-14 w-72 animate-pulse rounded-xl bg-frost" />
        </main>
      ) : session ? (
        <main className={`${shell} pb-24 pt-32 md:pb-32 md:pt-36`}>
          <div className="mb-8 flex items-center justify-between gap-4">
            <p className="t-eyebrow text-signal-ink">Área do afiliado</p>
            <button
              type="button"
              onClick={() => supabase!.auth.signOut()}
              className="t-small flex cursor-pointer items-center gap-1.5 text-link hover:underline"
            >
              <LogOut size={15} aria-hidden="true" /> Sair
            </button>
          </div>
          <Dashboard session={session} />
        </main>
      ) : (
        <main>
          {/* Palco: o que é o programa */}
          <section className="bg-stage pb-20 pt-36 text-frost md:pb-28 md:pt-44">
            <div className={shell}>
              <p className="t-eyebrow text-signal">Área do afiliado</p>
              <h1 className="t-display mt-3 max-w-[18ch]">
                Indique a melhor água do mundo. <span className="text-platinum">Ganhe a cada venda pelo seu link.</span>
              </h1>
              <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-4">
                <a href="#cadastro" className="btn-action">Quero ser afiliado</a>
                <a href="#entrar" className="link-arrow text-halo">
                  Já é afiliado? Entrar
                  <ChevronRight size={18} aria-hidden="true" />
                </a>
              </div>

              <ol className="mt-14 grid border-t border-smoke md:mt-20 md:grid-cols-3">
                {steps.map(({ icon: Icon, title, text }, i) => (
                  <li
                    key={title}
                    className="flex gap-5 border-b border-smoke py-8 md:flex-col md:gap-4 md:border-b-0 md:border-l md:px-8 md:py-10 md:first:border-l-0 md:first:pl-0"
                  >
                    <Icon size={26} strokeWidth={1.5} className="shrink-0 text-frost" aria-hidden="true" />
                    <div>
                      <p className="t-small font-semibold text-signal">0{i + 1}</p>
                      <p className="t-headline mt-1 font-semibold">{title}</p>
                      <p className="t-small mt-2 max-w-xs text-platinum">{text}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </section>

          {/* Cadastro e acesso */}
          <section className="py-20 md:py-28">
            <div className={shell}>
              <div className="grid items-start gap-4 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:gap-5">
                <Signup />
                {supabase ? (
                  <Login />
                ) : (
                  <p className="t-small rounded-[28px] bg-frost p-8 text-pewter">Login indisponível: Supabase não configurado.</p>
                )}
              </div>

              <a href="/consultor" className="link-arrow mt-12 text-link">
                Quer atuar com atendimento e vendas consultivas? Conheça o programa de consultores
                <ChevronRight size={18} className="shrink-0" aria-hidden="true" />
              </a>
            </div>
          </section>
        </main>
      )}

      <SiteFooter />
    </div>
  );
}
