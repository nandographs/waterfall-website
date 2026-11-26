import { Check, ChevronRight, LogOut, Search, ShieldAlert, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";
import { formatBRL } from "@/lib/catalog";
import { SidebarMenu, SiteFooter, SiteHeader } from "@/components/site-shell";

const shell = "mx-auto w-full max-w-[1200px] px-5 md:px-12";

type Tier = "affiliate" | "consultant";
type Partner = {
  id: string;
  name: string;
  email: string;
  code: string;
  pix_key: string | null;
  status: "pending" | "active" | "blocked";
  tier: Tier;
  commission_pct: number;
  created_at: string;
  clicks: number;
  orders_paid: number;
  sales_cents: number;
  commission_waiting_cents: number;
  commission_available_cents: number;
  commission_paid_cents: number;
};
type Sale = {
  order_id: string;
  number: number;
  status: "pending" | "paid" | "refunded";
  customer_name: string;
  total_cents: number;
  created_at: string;
  paid_at: string | null;
  commission_cents: number | null;
  commission_status: string | null;
  release_at: string | null;
};

const TIER_LABEL: Record<Tier, string> = { affiliate: "Afiliado", consultant: "Consultor" };
const STATUS_LABEL: Record<Partner["status"], string> = { active: "Ativo", pending: "E-mail não confirmado", blocked: "Bloqueado" };
const ORDER_LABEL: Record<Sale["status"], string> = { paid: "Pago", pending: "Aguardando pagamento", refunded: "Estornado" };
const COMMISSION_LABEL: Record<string, string> = { pending: "Em espera", approved: "Em espera", paid: "Paga", cancelled: "Cancelada" };

const date = (iso: string | null) => (iso ? new Date(iso).toLocaleDateString("pt-BR") : "—");
const n = (v: number | string | null | undefined) => Number(v ?? 0);
const plural = (count: number, one: string, many: string) => `${count} ${count === 1 ? one : many}`;

/** Mensagem legível para os erros das funções do banco. */
const rpcError = (e: { message: string } | null) =>
  !e ? null : /forbidden/.test(e.message) ? "Sua conta não tem acesso de administrador." : "Não foi possível salvar. Tente novamente.";

function Stat({ label, value, hint }: { label: string; value: string; hint?: string }) {
  return (
    <div className="rounded-[22px] bg-frost p-6">
      <p className="t-small text-pewter">{label}</p>
      <p className="mt-2 text-[1.75rem] font-semibold leading-none tracking-[-0.025em] [font-variant-numeric:tabular-nums]">{value}</p>
      {hint && <p className="t-caption mt-2 text-pewter">{hint}</p>}
    </div>
  );
}

function TierBadge({ tier }: { tier: Tier }) {
  return (
    <span
      className={`t-caption inline-flex items-center rounded-full px-2.5 py-1 font-medium ${
        tier === "consultant" ? "bg-obsidian text-frost" : "border border-hairline bg-white text-obsidian"
      }`}
    >
      {TIER_LABEL[tier]}
    </span>
  );
}

function StatusDot({ status }: { status: Partner["status"] }) {
  const color = status === "active" ? "bg-emerald-500" : status === "blocked" ? "bg-red-500" : "bg-amber-400";
  return (
    <span className="t-caption inline-flex items-center gap-1.5 text-pewter">
      <span className={`h-2 w-2 rounded-full ${color}`} aria-hidden="true" />
      {STATUS_LABEL[status]}
    </span>
  );
}

/** Seletor afiliado/consultor. Salva na hora. */
function TierSwitch({ partner, onChanged }: { partner: Partner; onChanged: () => void }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const set = async (tier: Tier) => {
    if (tier === partner.tier || busy) return;
    setBusy(true);
    setError(null);
    const { error } = await supabase!.rpc("admin_set_affiliate_tier", { p_affiliate: partner.id, p_tier: tier });
    setBusy(false);
    if (error) return setError(rpcError(error));
    onChanged();
  };
  return (
    <div>
      <div role="radiogroup" aria-label="Tipo do parceiro" className="inline-flex rounded-full bg-frost p-1">
        {(["affiliate", "consultant"] as Tier[]).map((t) => (
          <button
            key={t}
            type="button"
            role="radio"
            aria-checked={partner.tier === t}
            disabled={busy}
            onClick={() => set(t)}
            className={`t-small cursor-pointer rounded-full px-4 py-2 font-medium transition-colors disabled:cursor-wait ${
              partner.tier === t ? "bg-obsidian text-frost" : "text-pewter hover:text-obsidian"
            }`}
          >
            {TIER_LABEL[t]} · {t === "consultant" ? 20 : 10}%
          </button>
        ))}
      </div>
      {error && <p role="alert" className="t-small mt-2 font-medium text-red-600">{error}</p>}
    </div>
  );
}

/** Painel lateral com os dados, as ações e as vendas de um parceiro. */
function PartnerDetail({ partner, onClose, onChanged }: { partner: Partner; onClose: () => void; onChanged: () => void }) {
  const [sales, setSales] = useState<Sale[] | null>(null);
  const [salesError, setSalesError] = useState(false);
  const [confirmPay, setConfirmPay] = useState(false);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);

  useEffect(() => {
    setSales(null);
    setConfirmPay(false);
    setMsg(null);
    supabase!.rpc("admin_affiliate_orders", { p_affiliate: partner.id }).then(({ data, error }) => {
      setSalesError(!!error);
      setSales((data as Sale[] | null) ?? []);
    });
  }, [partner.id]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  const available = n(partner.commission_available_cents);

  const markPaid = async () => {
    setBusy(true);
    setMsg(null);
    const { data, error } = await supabase!.rpc("admin_mark_commissions_paid", { p_affiliate: partner.id });
    setBusy(false);
    setConfirmPay(false);
    if (error) return setMsg({ ok: false, text: rpcError(error)! });
    setMsg({ ok: true, text: `${formatBRL(n(data))} marcado como pago.` });
    onChanged();
  };

  const toggleBlock = async () => {
    setBusy(true);
    setMsg(null);
    const next = partner.status === "blocked" ? "active" : "blocked";
    const { error } = await supabase!.rpc("admin_set_affiliate_status", { p_affiliate: partner.id, p_status: next });
    setBusy(false);
    if (error) return setMsg({ ok: false, text: rpcError(error)! });
    onChanged();
  };

  return (
    <div className="fixed inset-0 z-[60] flex justify-end" role="dialog" aria-modal="true" aria-labelledby="partner-title">
      <button type="button" aria-label="Fechar" onClick={onClose} className="absolute inset-0 cursor-default bg-black/30" />
      <div className="relative flex h-full w-full max-w-[640px] flex-col overflow-y-auto bg-white shadow-2xl">
        <div className="sticky top-0 z-10 flex items-start justify-between gap-4 border-b border-hairline bg-white px-6 py-5 md:px-8">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <TierBadge tier={partner.tier} />
              <StatusDot status={partner.status} />
            </div>
            <h2 id="partner-title" className="t-headline mt-2 truncate font-semibold">{partner.name}</h2>
            <p className="t-small truncate text-pewter">{partner.email}</p>
          </div>
          <button type="button" onClick={onClose} aria-label="Fechar" className="-mr-2 cursor-pointer rounded-full p-2 text-pewter hover:bg-frost hover:text-obsidian">
            <X size={20} aria-hidden="true" />
          </button>
        </div>

        <div className="space-y-8 px-6 py-7 md:px-8">
          <dl className="grid grid-cols-2 gap-x-6 gap-y-4">
            <div>
              <dt className="t-caption text-pewter">Código do link</dt>
              <dd className="t-small mt-0.5 font-mono">{partner.code}</dd>
            </div>
            <div>
              <dt className="t-caption text-pewter">Chave Pix</dt>
              <dd className="t-small mt-0.5 break-all">{partner.pix_key || "Não informada"}</dd>
            </div>
            <div>
              <dt className="t-caption text-pewter">Cadastro</dt>
              <dd className="t-small mt-0.5">{date(partner.created_at)}</dd>
            </div>
            <div>
              <dt className="t-caption text-pewter">Comissão</dt>
              <dd className="t-small mt-0.5">{n(partner.commission_pct)}% por venda</dd>
            </div>
          </dl>

          <section>
            <h3 className="t-title">Tipo</h3>
            <p className="t-small mt-1 text-pewter">Vale para as vendas pagas a partir de agora. Comissões já registradas não mudam.</p>
            <div className="mt-3">
              <TierSwitch partner={partner} onChanged={onChanged} />
            </div>
          </section>

          <section className="grid grid-cols-3 gap-3">
            <div className="rounded-[18px] bg-frost p-4">
              <p className="t-caption text-pewter">Liberada</p>
              <p className="t-title mt-1 [font-variant-numeric:tabular-nums]">{formatBRL(available)}</p>
            </div>
            <div className="rounded-[18px] bg-frost p-4">
              <p className="t-caption text-pewter">Em espera</p>
              <p className="t-title mt-1 [font-variant-numeric:tabular-nums]">{formatBRL(n(partner.commission_waiting_cents))}</p>
            </div>
            <div className="rounded-[18px] bg-frost p-4">
              <p className="t-caption text-pewter">Já paga</p>
              <p className="t-title mt-1 [font-variant-numeric:tabular-nums]">{formatBRL(n(partner.commission_paid_cents))}</p>
            </div>
          </section>

          <section className="flex flex-wrap items-center gap-3">
            {confirmPay ? (
              <>
                <button type="button" onClick={markPaid} disabled={busy} className="btn-action">
                  {busy ? "Salvando…" : `Confirmar: ${formatBRL(available)} pago`}
                </button>
                <button type="button" onClick={() => setConfirmPay(false)} className="t-small cursor-pointer px-3 text-link hover:underline">
                  Cancelar
                </button>
              </>
            ) : (
              <button type="button" onClick={() => setConfirmPay(true)} disabled={busy || available <= 0} className="btn-action">
                Marcar liberada como paga
              </button>
            )}
            {partner.status !== "pending" && (
              <button
                type="button"
                onClick={toggleBlock}
                disabled={busy}
                className={`t-small min-h-11 cursor-pointer rounded-full border px-5 font-medium transition-colors disabled:opacity-60 ${
                  partner.status === "blocked" ? "border-hairline text-obsidian hover:bg-frost" : "border-red-200 text-red-600 hover:bg-red-50"
                }`}
              >
                {partner.status === "blocked" ? "Reativar acesso" : "Bloquear acesso"}
              </button>
            )}
          </section>
          {confirmPay && partner.pix_key && <p className="t-small -mt-5 text-pewter">Pix: {partner.pix_key}</p>}
          {msg && (
            <p role="alert" className={`t-small -mt-4 flex items-center gap-2 font-medium ${msg.ok ? "text-obsidian" : "text-red-600"}`}>
              {msg.ok && <Check size={16} className="text-action" aria-hidden="true" />}
              {msg.text}
            </p>
          )}

          <section>
            <h3 className="t-title">Vendas</h3>
            {sales === null ? (
              <div className="mt-4 space-y-2">
                {[0, 1, 2].map((i) => <div key={i} className="h-16 animate-pulse rounded-[14px] bg-frost" />)}
              </div>
            ) : salesError ? (
              <p className="t-small mt-3 text-red-600">Não foi possível carregar as vendas.</p>
            ) : sales.length === 0 ? (
              <p className="t-small mt-3 text-pewter">Nenhuma venda por este link ainda.</p>
            ) : (
              <ul className="mt-4 divide-y divide-hairline border-y border-hairline">
                {sales.map((s) => (
                  <li key={s.order_id} className="flex items-start justify-between gap-4 py-4">
                    <div className="min-w-0">
                      <p className="t-small font-medium">
                        Pedido #{s.number} <span className="font-normal text-pewter">· {date(s.paid_at ?? s.created_at)}</span>
                      </p>
                      <p className="t-caption mt-0.5 truncate text-pewter">{s.customer_name}</p>
                      <p className={`t-caption mt-1 ${s.status === "paid" ? "text-obsidian" : "text-pewter"}`}>{ORDER_LABEL[s.status] ?? s.status}</p>
                    </div>
                    <div className="shrink-0 text-right">
                      <p className="t-small font-medium [font-variant-numeric:tabular-nums]">{formatBRL(s.total_cents)}</p>
                      {s.commission_cents != null && (
                        <p className="t-caption mt-0.5 text-pewter [font-variant-numeric:tabular-nums]">
                          Comissão {formatBRL(s.commission_cents)} · {COMMISSION_LABEL[s.commission_status ?? ""] ?? s.commission_status}
                        </p>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}

type Filter = "all" | Tier;

function Dashboard() {
  const [partners, setPartners] = useState<Partner[] | null>(null);
  const [loadError, setLoadError] = useState(false);
  const [filter, setFilter] = useState<Filter>("all");
  const [query, setQuery] = useState("");
  const [openId, setOpenId] = useState<string | null>(null);
  const [version, setVersion] = useState(0);

  useEffect(() => {
    supabase!.rpc("admin_list_affiliates").then(({ data, error }) => {
      setLoadError(!!error);
      setPartners((data as Partner[] | null) ?? []);
    });
  }, [version]);

  const reload = () => setVersion((v) => v + 1);

  const shown = useMemo(() => {
    const q = query.trim().toLowerCase();
    return (partners ?? []).filter(
      (p) =>
        (filter === "all" || p.tier === filter) &&
        (!q || p.name.toLowerCase().includes(q) || p.email.toLowerCase().includes(q) || p.code.includes(q)),
    );
  }, [partners, filter, query]);

  if (partners === null) {
    return (
      <div className="space-y-4">
        <div className="h-14 w-72 animate-pulse rounded-xl bg-frost" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[0, 1, 2, 3].map((i) => <div key={i} className="h-28 animate-pulse rounded-[22px] bg-frost" />)}
        </div>
      </div>
    );
  }

  const active = partners.filter((p) => p.status === "active");
  const total = (f: (p: Partner) => number) => partners.reduce((s, p) => s + f(p), 0);
  const count = (t: Tier) => partners.filter((p) => p.tier === t).length;
  const open = partners.find((p) => p.id === openId) ?? null;

  return (
    <div>
      <h1 className="t-display">Parceiros</h1>
      {loadError && <p role="alert" className="t-small mt-4 font-medium text-red-600">Não foi possível carregar os parceiros. Recarregue a página.</p>}

      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat
          label="Parceiros ativos"
          value={String(active.length)}
          hint={`${plural(active.filter((p) => p.tier === "affiliate").length, "afiliado", "afiliados")} · ${plural(active.filter((p) => p.tier === "consultant").length, "consultor", "consultores")}`}
        />
        <Stat label="Vendas pagas" value={String(total((p) => n(p.orders_paid)))} hint={formatBRL(total((p) => n(p.sales_cents)))} />
        <Stat label="Comissão a pagar" value={formatBRL(total((p) => n(p.commission_available_cents)))} hint={`Em espera: ${formatBRL(total((p) => n(p.commission_waiting_cents)))}`} />
        <Stat label="Comissão já paga" value={formatBRL(total((p) => n(p.commission_paid_cents)))} />
      </div>

      <div className="mt-12 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div role="tablist" aria-label="Filtrar por tipo" className="inline-flex max-w-full self-start overflow-x-auto rounded-full bg-frost p-1">
          {([
            ["all", `Todos (${partners.length})`],
            ["affiliate", `Afiliados (${count("affiliate")})`],
            ["consultant", `Consultores (${count("consultant")})`],
          ] as [Filter, string][]).map(([f, label]) => (
            <button
              key={f}
              type="button"
              role="tab"
              aria-selected={filter === f}
              onClick={() => setFilter(f)}
              className={`t-small cursor-pointer whitespace-nowrap rounded-full px-4 py-2 font-medium transition-colors ${
                filter === f ? "bg-white text-obsidian shadow-sm" : "text-pewter hover:text-obsidian"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
        <label className="relative block md:w-80">
          <span className="sr-only">Buscar parceiro</span>
          <Search size={17} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-pewter" aria-hidden="true" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Nome, e-mail ou código"
            className="wd-input pl-11"
          />
        </label>
      </div>

      {/* Cabeçalho da lista (só no desktop; no celular cada linha vira um cartão) */}
      <div className="t-caption mt-6 hidden grid-cols-[minmax(0,2.2fr)_minmax(0,1fr)_repeat(3,minmax(0,0.8fr))_minmax(0,1fr)_20px] gap-4 border-b border-hairline px-4 pb-3 text-pewter md:grid">
        <span>Parceiro</span>
        <span>Tipo</span>
        <span className="text-right">Cliques</span>
        <span className="text-right">Vendas</span>
        <span className="text-right">Vendido</span>
        <span className="text-right">A pagar</span>
        <span />
      </div>

      {shown.length === 0 ? (
        <p className="t-small mt-8 text-pewter">{partners.length ? "Nenhum parceiro encontrado." : "Nenhum parceiro cadastrado ainda."}</p>
      ) : (
        <ul className="mt-3 space-y-2 md:mt-0 md:space-y-0 md:divide-y md:divide-hairline">
          {shown.map((p) => (
            <li key={p.id}>
              <button
                type="button"
                onClick={() => setOpenId(p.id)}
                className="grid w-full cursor-pointer grid-cols-2 gap-x-4 gap-y-3 rounded-[18px] bg-frost p-5 text-left transition-colors hover:bg-black/[0.06] md:grid-cols-[minmax(0,2.2fr)_minmax(0,1fr)_repeat(3,minmax(0,0.8fr))_minmax(0,1fr)_20px] md:items-center md:rounded-none md:bg-transparent md:px-4 md:py-4 md:hover:bg-frost"
              >
                <span className="col-span-2 min-w-0 md:col-span-1">
                  <span className="t-small block truncate font-medium text-obsidian">{p.name}</span>
                  <span className="t-caption block truncate text-pewter">
                    {p.email} · <span className="font-mono">{p.code}</span>
                  </span>
                  {p.status !== "active" && <span className="mt-1 block"><StatusDot status={p.status} /></span>}
                </span>
                <span className="col-span-2 md:col-span-1"><TierBadge tier={p.tier} /></span>
                <span className="t-small text-pewter md:text-right md:text-obsidian [font-variant-numeric:tabular-nums]">
                  <span className="md:hidden">Cliques: </span>{n(p.clicks)}
                </span>
                <span className="t-small text-pewter md:text-right md:text-obsidian [font-variant-numeric:tabular-nums]">
                  <span className="md:hidden">Vendas: </span>{n(p.orders_paid)}
                </span>
                <span className="t-small text-pewter md:text-right md:text-obsidian [font-variant-numeric:tabular-nums]">
                  <span className="md:hidden">Vendido: </span>{formatBRL(n(p.sales_cents))}
                </span>
                <span className="t-small font-medium md:text-right [font-variant-numeric:tabular-nums]">
                  <span className="font-normal text-pewter md:hidden">A pagar: </span>{formatBRL(n(p.commission_available_cents))}
                </span>
                <ChevronRight size={18} className="hidden text-pewter md:block" aria-hidden="true" />
              </button>
            </li>
          ))}
        </ul>
      )}

      {open && <PartnerDetail partner={open} onClose={() => setOpenId(null)} onChanged={reload} />}
    </div>
  );
}

export default function AdminPage() {
  const [session, setSession] = useState<Session | null | undefined>(undefined);
  const [isAdmin, setIsAdmin] = useState<boolean | undefined>(undefined);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    document.title = "Painel administrativo | Water Diamond";
    const robots = document.createElement("meta");
    robots.name = "robots";
    robots.content = "noindex, nofollow";
    document.head.appendChild(robots);

    if (!supabase) {
      setSession(null);
      return () => robots.remove();
    }
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    const { data } = supabase.auth.onAuthStateChange((_e, s) => setSession(s));
    return () => {
      data.subscription.unsubscribe();
      robots.remove();
    };
  }, []);

  // undefined = carregando, null = sem login. As duas dão user.id undefined, então a chave separa os três casos.
  const sessionKey = session === undefined ? "loading" : (session?.user.id ?? "none");
  useEffect(() => {
    if (session === undefined) return;
    // Sem login: vai para a tela de entrar. O mesmo login reconhece o admin e manda de volta para cá.
    if (!session) return void window.location.replace("/afiliados#entrar");
    supabase!.rpc("is_admin").then(({ data, error }) => {
      if (!error && data === true) return setIsAdmin(true);
      setIsAdmin(false);
    });
  }, [sessionKey]);

  return (
    <div className="wd min-h-screen bg-white text-obsidian selection:bg-action/15">
      <SiteHeader onMenuOpen={() => setIsMenuOpen(true)} cta={null} />
      <SidebarMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />

      <main className={`${shell} pb-24 pt-32 md:pb-32 md:pt-36`}>
        {session && (
          <div className="mb-8 flex items-center justify-between gap-4">
            <p className="t-eyebrow text-signal-ink">Painel administrativo</p>
            <button
              type="button"
              onClick={() => supabase!.auth.signOut().then(() => window.location.replace("/afiliados"))}
              className="t-small flex cursor-pointer items-center gap-1.5 text-link hover:underline"
            >
              <LogOut size={15} aria-hidden="true" /> Sair
            </button>
          </div>
        )}

        {!session || isAdmin === undefined ? (
          <div className="h-14 w-72 animate-pulse rounded-xl bg-frost" />
        ) : isAdmin ? (
          <Dashboard />
        ) : (
          <div className="flex max-w-2xl items-start gap-5 rounded-[28px] bg-frost p-8 md:p-10">
            <ShieldAlert size={28} strokeWidth={1.5} className="shrink-0 text-obsidian" aria-hidden="true" />
            <div>
              <p className="t-headline font-semibold">Acesso restrito.</p>
              <p className="t-body mt-2 text-pewter">Esta área é só para administradores. Sua conta não tem esse acesso.</p>
              <a href="/afiliados" className="link-arrow mt-4 text-link">
                Ir para a área do afiliado
                <ChevronRight size={18} aria-hidden="true" />
              </a>
            </div>
          </div>
        )}
      </main>

      <SiteFooter />
    </div>
  );
}
