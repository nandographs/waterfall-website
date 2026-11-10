import { Check, ChevronRight, Clock, Copy, Link2, LogOut, ShieldAlert, Wallet } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type React from "react";
import type { EmailOtpType, Session } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";
import { formatBRL } from "@/lib/catalog";
import { SidebarMenu, SiteFooter, SiteHeader } from "@/components/site-shell";

const shell = "mx-auto w-full max-w-[1200px] px-5 md:px-12";
const labelClass = "mb-1.5 block text-[0.8125rem] font-medium text-pewter";

type Affiliate = { name: string; code: string; status: string; commission_pct: number };
type Commission = { amount_cents: number; status: string; release_at: string | null; created_at: string };

const steps = [
  { icon: Link2, title: "Cadastre-se", text: "Crie sua conta e escolha o código do seu link. Confirmou o e-mail, seu link já está ativo." },
  { icon: Copy, title: "Compartilhe", text: "Divulgue seu link ou cupom. Cada venda feita por ele fica registrada no seu painel." },
  { icon: Wallet, title: "Receba por Pix", text: "A comissão é liberada após o prazo de segurança e paga pela equipe via Pix." },
];

const authRedirect = () => `${window.location.origin}/afiliados`;
const ALREADY = "Esse e-mail já tem conta. Entre ao lado ou use “Esqueci minha senha”.";
const WEAK = "Senha fraca: use pelo menos 8 caracteres.";

/**
 * Login com Google pausado: o provedor está desligado no Supabase (as credenciais continuam salvas).
 * Para reativar, ligue o Google em Authentication > Sign In / Providers e mude para true.
 */
const GOOGLE_LOGIN_ENABLED = false;

function GoogleIcon() {
  return (
    <svg viewBox="0 0 48 48" width="18" height="18" aria-hidden="true">
      <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34.1 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.4-.4-3.5z" />
      <path fill="#FF3D00" d="m6.3 14.7 6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34.1 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z" />
      <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-8l-6.5 5C9.5 39.6 16.2 44 24 44z" />
      <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C37 39.2 44 34 44 24c0-1.3-.1-2.4-.4-3.5z" />
    </svg>
  );
}

/** Login social: volta para /afiliados já autenticado. Quem ainda não tem perfil completa o cadastro no painel. */
function GoogleButton({ label, dark = false }: { label: string; dark?: boolean }) {
  const [busy, setBusy] = useState(false);
  const go = async () => {
    setBusy(true);
    const { error } = await supabase!.auth.signInWithOAuth({ provider: "google", options: { redirectTo: authRedirect() } });
    if (error) setBusy(false);
  };
  return (
    <>
      <button
        type="button"
        onClick={go}
        disabled={busy}
        className="mt-7 flex min-h-12 w-full cursor-pointer items-center justify-center gap-3 rounded-full border border-black/10 bg-white px-6 text-base font-medium text-obsidian transition-colors hover:bg-white/90 disabled:opacity-60"
      >
        <GoogleIcon />
        {busy ? "Abrindo o Google…" : label}
      </button>
      <div className={`t-caption mt-6 flex items-center gap-3 ${dark ? "text-platinum" : "text-pewter"}`}>
        <span className={`h-px flex-1 ${dark ? "bg-white/15" : "bg-black/10"}`} />
        ou com e-mail
        <span className={`h-px flex-1 ${dark ? "bg-white/15" : "bg-black/10"}`} />
      </div>
    </>
  );
}

/** Reenvia o e-mail de confirmação do cadastro (o link anterior deixa de valer). */
async function resendConfirmation(email: string): Promise<string | null> {
  const { error } = await supabase!.auth.resend({ type: "signup", email, options: { emailRedirectTo: authRedirect() } });
  if (!error) return null;
  console.error("[afiliados] reenvio falhou:", error);
  return /security purposes|after \d+ seconds|rate limit/i.test(error.message)
    ? "Aguarde um minuto antes de pedir outro e-mail."
    : "Não foi possível reenviar agora. Tente de novo em alguns minutos.";
}

function ResendButton({ email, dark = false }: { email: string; dark?: boolean }) {
  const [state, setState] = useState<{ busy?: boolean; text?: string; ok?: boolean }>({});
  const go = async () => {
    setState({ busy: true });
    const err = await resendConfirmation(email);
    setState(err ? { text: err } : { ok: true, text: "Enviamos um novo e-mail. Use o link mais recente." });
  };
  return (
    <span className="mt-3 block">
      {state.text ? (
        <span className={`t-small font-medium ${state.ok ? (dark ? "text-frost" : "text-obsidian") : dark ? "text-red-400" : "text-red-600"}`}>{state.text}</span>
      ) : (
        <button type="button" onClick={go} disabled={state.busy} className={`t-small cursor-pointer font-medium hover:underline ${dark ? "text-halo" : "text-link"}`}>
          {state.busy ? "Reenviando…" : "Reenviar e-mail de confirmação"}
        </button>
      )}
    </span>
  );
}

/** Link do e-mail que falhou (expirado, já usado ou substituído por um mais novo): explica e oferece reenvio. */
function LinkProblem({ text }: { text: string }) {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<{ busy?: boolean; text?: string; ok?: boolean }>({});
  const ref = useRef<HTMLFormElement>(null);
  // Quem chega pelo link do e-mail cai no topo da página: leva o aviso para a vista.
  useEffect(() => {
    ref.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  }, []);
  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setState({ busy: true });
    const err = await resendConfirmation(email.trim().toLowerCase());
    setState(err ? { text: err } : { ok: true, text: "Enviamos um novo e-mail de confirmação. Use o link desse e-mail." });
  }
  return (
    <form ref={ref} onSubmit={submit} role="alert" className="mb-5 flex scroll-mt-24 items-start gap-5 rounded-[28px] border border-black/10 bg-white p-7 md:p-8">
      <ShieldAlert size={26} strokeWidth={1.5} className="mt-0.5 shrink-0 text-obsidian" aria-hidden="true" />
      <div className="min-w-0 flex-1">
        <p className="t-headline font-semibold">Esse link não funcionou.</p>
        <p className="t-small mt-1.5 max-w-2xl text-pewter">{text}</p>
        {state.ok ? (
          <p className="t-small mt-4 flex items-start gap-2 font-medium text-obsidian">
            <Check size={16} className="mt-0.5 shrink-0 text-action" aria-hidden="true" />
            {state.text}
          </p>
        ) : (
          <div className="mt-4 flex max-w-xl flex-col gap-3 sm:flex-row">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Seu e-mail de cadastro"
              autoComplete="email"
              aria-label="Seu e-mail de cadastro"
              className="wd-input min-w-0 flex-1"
            />
            <button type="submit" disabled={state.busy} className="btn-action min-h-12 shrink-0 px-6">
              {state.busy ? "Enviando…" : "Reenviar e-mail"}
            </button>
          </div>
        )}
        {state.text && !state.ok && <p className="t-small mt-3 font-medium text-red-600">{state.text}</p>}
      </div>
    </form>
  );
}

function Signup() {
  const [msg, setMsg] = useState<{ ok: boolean; text: string; resendTo?: string } | null>(null);
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!supabase) return setMsg({ ok: false, text: "Cadastro indisponível no momento." });
    const form = e.currentTarget;
    const f = new FormData(form);
    const name = String(f.get("name")).trim();
    const email = String(f.get("email")).trim().toLowerCase();
    const code = String(f.get("code")).trim().toLowerCase();
    const pix = String(f.get("pix") ?? "").trim();
    const password = String(f.get("password"));
    if (password !== String(f.get("password2"))) return setMsg({ ok: false, text: "As senhas não conferem." });

    setBusy(true);
    setMsg(null);
    const { data: free, error: codeErr } = await supabase.rpc("affiliate_code_available", { p_code: code, p_email: email });
    if (codeErr || free === false) {
      setBusy(false);
      if (codeErr) console.error("[afiliados] checagem do código falhou:", codeErr);
      return setMsg({ ok: false, text: codeErr ? "Não foi possível enviar. Tente novamente." : "Esse código já está em uso. Escolha outro." });
    }

    // A conta nasce no Supabase Auth; o trigger no banco cria o perfil do afiliado como "pending"
    // e outro trigger o ativa quando o e-mail é confirmado (aprovação automática).
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { emailRedirectTo: authRedirect(), data: { name, affiliate_code: code, pix_key: pix || null } },
    });
    setBusy(false);

    if (error) {
      console.error("[afiliados] cadastro falhou:", error);
      // O envio do e-mail pode demorar mais que o limite do Supabase (504): a conta é criada e o
      // e-mail costuma chegar mesmo assim. Cadastrar de novo geraria outro link e invalidaria o primeiro.
      if (error.status === 504 || /deadline|timeout|timed out/i.test(error.message)) {
        form.reset();
        return setMsg({
          ok: true,
          resendTo: email,
          text: "Recebemos seu cadastro. O e-mail de confirmação pode levar alguns minutos para chegar: não cadastre de novo. Se não chegar em 10 minutos, peça outro.",
        });
      }
      const text = /already registered|already exists/i.test(error.message)
        ? ALREADY
        : /password/i.test(error.message)
          ? WEAK
          : "Não foi possível enviar. Tente novamente.";
      return setMsg({ ok: false, text });
    }
    // Com confirmação de e-mail ligada, um e-mail já cadastrado volta sem identidades.
    if (data.user && data.user.identities?.length === 0) return setMsg({ ok: false, text: ALREADY });

    form.reset();
    setMsg({
      ok: true,
      resendTo: data.session ? undefined : email,
      text: data.session
        ? "Conta criada. Seu link de afiliado já está ativo."
        : "Conta criada. Confirme pelo link que enviamos ao seu e-mail: ao confirmar, seu link de afiliado já fica ativo.",
    });
  }

  return (
    <form id="cadastro" onSubmit={submit} className="flex h-full scroll-mt-24 flex-col rounded-[28px] bg-frost p-7 md:p-10">
      <h2 className="t-headline-lg">Quero ser afiliado.</h2>
      <p className="t-small mt-2 text-pewter">Leva um minuto. Você cria seu acesso agora e ativa pelo link que chega no seu e-mail.</p>

      {GOOGLE_LOGIN_ENABLED && <GoogleButton label="Cadastrar com Google" />}

      <div className={`${GOOGLE_LOGIN_ENABLED ? "mt-6" : "mt-7"} space-y-4`}>
        <label className="block">
          <span className={labelClass}>Nome completo</span>
          <input name="name" required autoComplete="name" className="wd-input" />
        </label>
        <label className="block">
          <span className={labelClass}>E-mail</span>
          <input name="email" type="email" required autoComplete="email" className="wd-input" />
        </label>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className={labelClass}>Senha</span>
            <input name="password" type="password" required minLength={8} autoComplete="new-password" className="wd-input" />
          </label>
          <label className="block">
            <span className={labelClass}>Repita a senha</span>
            <input name="password2" type="password" required minLength={8} autoComplete="new-password" className="wd-input" />
          </label>
        </div>
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
        <div role="alert" className="mt-5">
          <p className={`t-small flex items-start gap-2 font-medium ${msg.ok ? "text-obsidian" : "text-red-600"}`}>
            {msg.ok && <Check size={16} className="mt-0.5 shrink-0 text-action" aria-hidden="true" />}
            {msg.text}
          </p>
          {msg.resendTo && <ResendButton email={msg.resendTo} />}
        </div>
      )}
      <button type="submit" disabled={busy || !!msg?.resendTo} className="btn-action mt-7 min-h-12 w-full text-base">
        {busy ? "Enviando…" : "Criar conta de afiliado"}
      </button>
    </form>
  );
}

function Login() {
  const [mode, setMode] = useState<"login" | "forgot">("login");
  const [notice, setNotice] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [unconfirmed, setUnconfirmed] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const email = String(f.get("email")).trim().toLowerCase();
    setBusy(true);
    setError(null);
    setUnconfirmed(null);
    if (mode === "forgot") {
      const { error } = await supabase!.auth.resetPasswordForEmail(email, { redirectTo: authRedirect() });
      setBusy(false);
      if (error) return setError("Não foi possível enviar o link. Tente novamente.");
      return setNotice("Se houver uma conta com esse e-mail, enviamos um link para criar uma nova senha.");
    }
    const { error } = await supabase!.auth.signInWithPassword({ email, password: String(f.get("password")) });
    setBusy(false);
    if (error) {
      if (/not confirmed/i.test(error.message)) setUnconfirmed(email);
      setError(
        /not confirmed/i.test(error.message)
          ? "Confirme seu e-mail pelo link que enviamos antes de entrar."
          : /invalid/i.test(error.message)
            ? "E-mail ou senha incorretos."
            : "Não foi possível entrar. Tente novamente.",
      );
    }
  }

  const switchMode = (m: "login" | "forgot") => {
    setMode(m);
    setError(null);
    setNotice(null);
    setUnconfirmed(null);
  };

  return (
    <form id="entrar" onSubmit={submit} className="flex h-full scroll-mt-24 flex-col rounded-[28px] bg-obsidian p-7 text-frost md:p-10">
      <h2 className="t-headline-lg">{mode === "login" ? "Já sou afiliado." : "Esqueci a senha."}</h2>
      {notice ? (
        <>
          <div className="mt-6 flex items-start gap-3">
            <Check size={20} className="mt-0.5 shrink-0 text-halo" aria-hidden="true" />
            <p className="t-body text-frost">{notice}</p>
          </div>
          <button type="button" onClick={() => switchMode("login")} className="t-small mt-6 cursor-pointer self-start text-halo hover:underline">
            Voltar para o login
          </button>
        </>
      ) : (
        <>
          <p className="t-small mt-2 text-platinum">
            {mode !== "login"
              ? "Enviamos um link para você criar uma nova senha."
              : GOOGLE_LOGIN_ENABLED
                ? "Entre com o Google ou com o e-mail e a senha da sua conta."
                : "Entre com o e-mail e a senha da sua conta."}
          </p>
          {GOOGLE_LOGIN_ENABLED && mode === "login" && <GoogleButton label="Entrar com Google" dark />}
          <label className={`${GOOGLE_LOGIN_ENABLED && mode === "login" ? "mt-6" : "mt-7"} block`}>
            <span className="mb-1.5 block text-[0.8125rem] font-medium text-platinum">E-mail cadastrado</span>
            <input name="email" type="email" required autoComplete="email" className="wd-input" />
          </label>
          {mode === "login" && (
            <label className="mt-4 block">
              <span className="mb-1.5 block text-[0.8125rem] font-medium text-platinum">Senha</span>
              <input name="password" type="password" required autoComplete="current-password" className="wd-input" />
            </label>
          )}
          {error && <p role="alert" className="t-small mt-4 font-medium text-red-400">{error}</p>}
          {unconfirmed && <ResendButton email={unconfirmed} dark />}
          <button type="submit" disabled={busy} className="btn-action mt-7 min-h-12 w-full text-base">
            {busy ? "Enviando…" : mode === "login" ? "Entrar" : "Enviar link"}
          </button>
          <button
            type="button"
            onClick={() => switchMode(mode === "login" ? "forgot" : "login")}
            className="t-small mt-4 cursor-pointer self-start text-halo hover:underline"
          >
            {mode === "login" ? "Esqueci minha senha" : "Voltar para o login"}
          </button>
        </>
      )}
    </form>
  );
}

/** Aberto pelo link de recuperação: o Supabase já criou a sessão, falta gravar a senha nova. */
function NewPassword({ onDone }: { onDone: () => void }) {
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const password = String(f.get("password"));
    if (password !== String(f.get("password2"))) return setError("As senhas não conferem.");
    setBusy(true);
    setError(null);
    const { error } = await supabase!.auth.updateUser({ password });
    setBusy(false);
    if (error) setError(/password/i.test(error.message) ? WEAK : "Não foi possível salvar. Tente novamente.");
    else onDone();
  }

  return (
    <form onSubmit={submit} className="max-w-md rounded-[28px] bg-frost p-7 md:p-10">
      <h1 className="t-headline-lg">Crie sua nova senha.</h1>
      <div className="mt-7 space-y-4">
        <label className="block">
          <span className={labelClass}>Nova senha</span>
          <input name="password" type="password" required minLength={8} autoComplete="new-password" className="wd-input" />
        </label>
        <label className="block">
          <span className={labelClass}>Repita a senha</span>
          <input name="password2" type="password" required minLength={8} autoComplete="new-password" className="wd-input" />
        </label>
      </div>
      {error && <p role="alert" className="t-small mt-4 font-medium text-red-600">{error}</p>}
      <button type="submit" disabled={busy} className="btn-action mt-7 min-h-12 w-full text-base">
        {busy ? "Salvando…" : "Salvar senha"}
      </button>
    </form>
  );
}

/** Conta criada pelo Google ainda sem perfil de afiliado: pede o código do link e o Pix. */
function CompleteSignup({ session, onDone }: { session: Session; onDone: () => void }) {
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const meta = session.user.user_metadata ?? {};
  const defaultName = String(meta.full_name ?? meta.name ?? "");

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    setBusy(true);
    setError(null);
    const { error } = await supabase!.rpc("affiliate_register", {
      p_name: String(f.get("name")).trim(),
      p_code: String(f.get("code")).trim().toLowerCase(),
      p_pix: String(f.get("pix") ?? "").trim() || null,
    });
    setBusy(false);
    if (!error) return onDone();
    setError(
      /code_taken/.test(error.message)
        ? "Esse código já está em uso. Escolha outro."
        : /affiliate_code_invalid/.test(error.message)
          ? "Código: 3 a 30 letras minúsculas, números, - ou _."
          : /already_registered/.test(error.message)
            ? "Esta conta já tem cadastro de afiliado. Recarregue a página."
            : "Não foi possível concluir. Tente novamente.",
    );
  }

  return (
    <form onSubmit={submit} className="max-w-xl rounded-[28px] bg-frost p-7 md:p-10">
      <h1 className="t-headline-lg">Complete seu cadastro.</h1>
      <p className="t-small mt-2 text-pewter">
        Você entrou como <span className="text-obsidian">{session.user.email}</span>. Falta escolher o código do seu link; ele fica ativo na hora.
      </p>
      <div className="mt-7 space-y-4">
        <label className="block">
          <span className={labelClass}>Nome completo</span>
          <input name="name" required defaultValue={defaultName} autoComplete="name" className="wd-input" />
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
      {error && <p role="alert" className="t-small mt-4 font-medium text-red-600">{error}</p>}
      <button type="submit" disabled={busy} className="btn-action mt-7 min-h-12 w-full text-base">
        {busy ? "Enviando…" : "Enviar cadastro"}
      </button>
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
  const [version, setVersion] = useState(0);

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
  }, [version]);

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
  if (!aff) return <CompleteSignup session={session} onDone={() => setVersion((v) => v + 1)} />;
  if (aff.status !== "active") {
    return aff.status === "pending" ? (
      <Notice icon={Clock} title="Falta confirmar seu e-mail." text="Abra o link que enviamos para o seu e-mail. Assim que confirmar, seu link e seus números aparecem aqui." />
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

// O token do link só pode ser usado uma vez; o StrictMode roda o efeito duas vezes em dev.
let emailLinkHandled = false;

export default function AfiliadosPage() {
  const [session, setSession] = useState<Session | null | undefined>(undefined);
  const [recovering, setRecovering] = useState(false);
  const [linkError, setLinkError] = useState<string | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    document.title = "Área do afiliado | Water Diamond";
    if (!supabase) return setSession(null);
    const db = supabase;

    // Links dos e-mails: ?token_hash=...&type=email|recovery. A confirmação é feita aqui pelo site
    // (e não no clique do link), então o "pré-clique" de segurança do Outlook/Hotmail não gasta o link.
    const url = new URL(window.location.href);
    const tokenHash = url.searchParams.get("token_hash");
    const type = url.searchParams.get("type") as EmailOtpType | null;
    const hashParams = new URLSearchParams(url.hash.slice(1));
    const cleanUrl = () => window.history.replaceState(null, "", url.pathname);
    const expiredText =
      "Ele expirou, já foi usado ou foi substituído por um e-mail mais novo. Se você já confirmou, é só entrar com e-mail e senha. Se não, peça um novo e-mail abaixo.";

    if (hashParams.get("error")) {
      setLinkError(expiredText);
      cleanUrl();
    }

    if (tokenHash && type && !emailLinkHandled) {
      emailLinkHandled = true;
      db.auth.verifyOtp({ token_hash: tokenHash, type }).then(({ data, error }) => {
        cleanUrl();
        if (error) {
          console.error("[afiliados] confirmação do link falhou:", error);
          setLinkError(expiredText);
          setSession(null);
        } else {
          setSession(data.session);
        }
      });
    } else {
      db.auth.getSession().then(({ data }) => setSession(data.session));
    }
    const { data } = db.auth.onAuthStateChange((event, s) => {
      setSession(s);
      if (event === "PASSWORD_RECOVERY") setRecovering(true);
      if (event === "SIGNED_OUT") setRecovering(false);
    });
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
          {recovering ? <NewPassword onDone={() => setRecovering(false)} /> : <Dashboard session={session} />}
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
              {linkError && <LinkProblem text={linkError} />}
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
