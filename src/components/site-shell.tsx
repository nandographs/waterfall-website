import { Facebook, Instagram, Menu, ShoppingBag, UserRound, X, Youtube } from "lucide-react";
import { WHATSAPP_DIRECT_URL } from "@/lib/forms";
import { useCartCount } from "@/lib/cart";

// --- Navegação entre seções (a home é uma página só; as outras rotas voltam para /#secao) ---

export const scrollToSection = (selector: string) => {
  const target = document.querySelector<HTMLElement>(selector);
  if (!target) return;

  const header = document.querySelector<HTMLElement>("[data-site-header]");
  const headerOffset = (header?.offsetHeight ?? 0) + 12;
  const targetTop = window.scrollY + target.getBoundingClientRect().top - headerOffset;

  window.scrollTo({ top: Math.max(0, targetTop), behavior: "smooth" });
};

export const isHomePath = () => {
  const path = window.location.pathname.replace(/\/$/, "") || "/";
  return path === "/";
};

export const goToSection = (hash: string) => {
  if (isHomePath()) scrollToSection(hash);
  else window.location.href = `/${hash}`;
};

/** Leva ao configurador de compra da home. */
export const goToBuy = () => goToSection("#comprar");

const followLink = (href: string) => {
  if (href.startsWith("#")) goToSection(href);
  else window.location.href = href;
};

/** Menu enxuto: conhecer o produto, comprar e ser consultor. "Comprar" é o botão azul ao lado. */
export const navLinks = [
  { label: "Ion Center", href: "#ion-center" },
  { label: "Loja", href: "/loja" },
  { label: "Seja um consultor", href: "/consultor" },
];

/** Painel do afiliado (link de indicação e comissões). Não confundir com o consultor. */
export const AFFILIATE_HREF = "/afiliados";

const AffiliateLink = () => (
  <a
    href={AFFILIATE_HREF}
    aria-label="Área do afiliado"
    title="Área do afiliado"
    className="flex h-9 items-center gap-1.5 rounded-full px-2 text-[0.8125rem] text-frost/75 transition-colors hover:bg-white/10 hover:text-frost lg:px-3"
  >
    <UserRound size={17} strokeWidth={1.8} aria-hidden="true" />
    <span className="hidden lg:inline">Afiliado</span>
  </a>
);

export const socialLinks = [
  { label: "Instagram", href: "https://www.instagram.com/waterfallcompanybr", icon: Instagram },
  { label: "Facebook", href: "https://www.facebook.com/waterfallcompanybr", icon: Facebook },
  { label: "YouTube", href: "https://www.youtube.com/@waterfallcompanybr", icon: Youtube },
];

export const WhatsAppIcon = ({ className = "h-6 w-6" }: { className?: string }) => (
  <svg viewBox="0 0 32 32" className={className} fill="currentColor" aria-hidden="true">
    <path d="M16.01 3.2C8.96 3.2 3.23 8.91 3.23 15.93c0 2.24.59 4.43 1.7 6.36L3.12 28.8l6.68-1.75a12.77 12.77 0 0 0 6.21 1.58c7.04 0 12.77-5.71 12.77-12.73S23.05 3.2 16.01 3.2Zm0 23.28c-1.95 0-3.86-.52-5.52-1.5l-.4-.24-3.96 1.04 1.06-3.86-.26-.4a10.42 10.42 0 0 1-1.59-5.59c0-5.83 4.78-10.58 10.66-10.58 5.87 0 10.65 4.75 10.65 10.58S21.88 26.48 16 26.48Zm5.84-7.92c-.32-.16-1.9-.94-2.2-1.04-.3-.11-.51-.16-.72.16-.21.32-.83 1.04-1.02 1.25-.19.21-.38.24-.7.08-.32-.16-1.36-.5-2.59-1.6-.96-.85-1.6-1.9-1.79-2.22-.19-.32-.02-.49.14-.65.14-.14.32-.38.48-.57.16-.19.21-.32.32-.54.11-.21.05-.4-.03-.57-.08-.16-.72-1.73-.99-2.38-.26-.62-.53-.54-.72-.55h-.62c-.21 0-.56.08-.85.4-.3.32-1.12 1.09-1.12 2.65s1.15 3.08 1.31 3.29c.16.21 2.27 3.45 5.5 4.84.77.33 1.37.53 1.83.68.77.24 1.47.21 2.03.13.62-.09 1.9-.78 2.17-1.53.27-.75.27-1.4.19-1.53-.08-.13-.29-.21-.61-.37Z" />
  </svg>
);

export const BagLink = ({ className = "" }: { className?: string }) => {
  const count = useCartCount();
  return (
    <a
      href="/carrinho"
      aria-label={count ? `Sacola, ${count} ${count === 1 ? "item" : "itens"}` : "Sacola vazia"}
      className={`relative flex h-9 w-9 items-center justify-center rounded-full text-frost transition-colors hover:bg-white/10 ${className}`}
    >
      <ShoppingBag size={17} strokeWidth={1.8} />
      {count > 0 && (
        <span className="absolute right-0.5 top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-frost px-1 text-[10px] font-semibold leading-none text-obsidian [font-variant-numeric:tabular-nums]">
          {count}
        </span>
      )}
    </a>
  );
};

export const SiteHeader = ({
  scrolled = true,
  onMenuOpen,
  cta = { label: "Comprar", onClick: goToBuy },
}: {
  scrolled?: boolean;
  onMenuOpen: () => void;
  /** `shortLabel` substitui o rótulo em telas estreitas, para o botão não quebrar linha. */
  cta?: { label: string; shortLabel?: string; onClick: () => void } | null;
}) => (
  <nav data-site-header className="wd fixed inset-x-0 top-0 z-50 px-3 pt-3 md:px-6">
    <div
      className={`mx-auto flex h-12 max-w-[1080px] md:h-14 items-center justify-between gap-3 rounded-full pl-5 pr-1.5 md:pl-6 md:pr-2.5 text-frost backdrop-blur-xl backdrop-saturate-150 transition-colors duration-500 ${
        scrolled ? "bg-obsidian/85" : "bg-black/35"
      }`}
    >
      <a href="/" aria-label="Water Diamond, página inicial" className="flex shrink-0 items-center">
        <img src="/images/LOGO.webp" alt="" className="h-[22px] w-auto md:h-7 object-contain brightness-0 invert" />
      </a>

      <ul className="hidden items-center md:flex">
        {navLinks.map((link) => (
          <li key={link.label}>
            <button
              type="button"
              onClick={() => followLink(link.href)}
              className="cursor-pointer rounded-full px-3 py-1.5 text-[0.8125rem] text-frost/75 transition-colors duration-200 hover:text-frost"
            >
              {link.label}
            </button>
          </li>
        ))}
      </ul>

      <div className="flex items-center gap-1">
        <span className="hidden md:block">
          <AffiliateLink />
        </span>
        <BagLink />
        {cta && (
          <button type="button" onClick={cta.onClick} className="btn-action min-h-9 whitespace-nowrap px-4 text-[0.8125rem]">
            {cta.shortLabel ? (
              <>
                <span className="sm:hidden">{cta.shortLabel}</span>
                <span className="hidden sm:inline">{cta.label}</span>
              </>
            ) : (
              cta.label
            )}
          </button>
        )}
        <button
          type="button"
          onClick={onMenuOpen}
          aria-label="Abrir menu de navegação"
          className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full text-frost transition-colors hover:bg-white/10 md:hidden"
        >
          <Menu size={18} />
        </button>
      </div>
    </div>
  </nav>
);

export const SidebarMenu = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const handleClick = (href: string) => {
    onClose();
    if (href.startsWith("#") && isHomePath()) requestAnimationFrame(() => scrollToSection(href));
    else followLink(href);
  };

  return (
    <div
      inert={!isOpen}
      aria-hidden={!isOpen}
      className={`wd fixed inset-0 z-[60] bg-stage/95 text-frost backdrop-blur-xl transition-opacity duration-300 ${
        isOpen ? "opacity-100" : "pointer-events-none opacity-0"
      }`}
    >
      <div className="flex h-full flex-col px-7 pb-10 pt-6">
        <div className="flex items-center justify-between">
          <img src="/images/LOGO.webp" alt="Water Diamond" className="h-6 w-auto object-contain brightness-0 invert" />
          <button
            type="button"
            onClick={onClose}
            aria-label="Fechar menu de navegação"
            className="-mr-2 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full transition-colors hover:bg-white/10"
          >
            <X size={22} />
          </button>
        </div>

        <nav className="mt-14 flex flex-col">
          {navLinks.map((link, i) => (
            <button
              type="button"
              key={link.label}
              onClick={() => handleClick(link.href)}
              style={{ transitionDelay: isOpen ? `${60 + i * 40}ms` : "0ms" }}
              className={`cursor-pointer py-2 text-left text-[2rem] font-semibold tracking-[-0.03em] text-frost transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:text-halo ${
                isOpen ? "translate-y-0 opacity-100" : "-translate-y-2 opacity-0"
              }`}
            >
              {link.label}
            </button>
          ))}
        </nav>

        <ul
          style={{ transitionDelay: isOpen ? "220ms" : "0ms" }}
          className={`mt-10 flex flex-col gap-1 border-t border-smoke pt-6 transition-opacity duration-500 ${isOpen ? "opacity-100" : "opacity-0"}`}
        >
          {[
            { label: "Área do afiliado", href: AFFILIATE_HREF, icon: UserRound },
            { label: "Sacola", href: "/carrinho", icon: ShoppingBag },
          ].map(({ label, href, icon: Icon }) => (
            <li key={label}>
              <a href={href} onClick={onClose} className="flex items-center gap-3 py-2 text-[1.0625rem] text-platinum transition-colors hover:text-frost">
                <Icon size={18} strokeWidth={1.7} aria-hidden="true" />
                {label}
              </a>
            </li>
          ))}
        </ul>

        <p className="t-small mt-auto text-platinum">A melhor água do mundo.</p>
      </div>
    </div>
  );
};

/** `hidden` tira o botão de cena (ex.: enquanto o hero já tem o próprio CTA no canto). */
export const FloatingWhatsAppButton = ({ hidden = false }: { hidden?: boolean }) => (
  <a
    aria-hidden={hidden || undefined}
    tabIndex={hidden ? -1 : undefined}
    href={WHATSAPP_DIRECT_URL}
    target="_blank"
    rel="noopener noreferrer"
    aria-label="Falar com um consultor no WhatsApp"
    className={`fixed bottom-5 right-5 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white transition-all duration-300 hover:-translate-y-0.5 ${hidden ? "pointer-events-none translate-y-4 scale-90 opacity-0" : "opacity-100"} hover:bg-[#1ebe5d] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#25D366] focus-visible:ring-offset-4 md:bottom-8 md:right-8`}
  >
    <WhatsAppIcon className="h-7 w-7" />
  </a>
);

export const SiteFooter = () => (
  <footer className="wd bg-stage px-5 pb-10 pt-14 text-frost md:px-12">
    <div className="mx-auto w-full max-w-[1440px]">
      <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr_auto]">
        <div>
          <img src="/images/LOGO.webp" alt="Water Diamond" className="h-8 w-auto object-contain brightness-0 invert" />
          <p className="t-small mt-4 max-w-xs text-platinum">A melhor água do mundo.</p>
        </div>
        <div>
          <p className="t-caption font-semibold text-frost">Comprar</p>
          <ul className="t-caption mt-3 space-y-2 text-platinum">
            <li><a href="/loja" className="transition-colors hover:text-frost">Loja</a></li>
            <li><a href="/loja/ion-center-slim" className="transition-colors hover:text-frost">Ion Center Slim</a></li>
            <li><a href="/loja/ion-center-smart" className="transition-colors hover:text-frost">Ion Center Smart</a></li>
            <li><a href="/loja/ion-center-turbo" className="transition-colors hover:text-frost">Ion Center Turbo</a></li>
            <li><a href="/carrinho" className="transition-colors hover:text-frost">Sacola</a></li>
          </ul>
        </div>
        <div>
          <p className="t-caption font-semibold text-frost">Waterfall</p>
          <ul className="t-caption mt-3 space-y-2 text-platinum">
            <li><a href={WHATSAPP_DIRECT_URL} target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-frost">Falar com um consultor</a></li>
            <li><a href="/consultor" className="transition-colors hover:text-frost">Seja um consultor</a></li>
            <li><a href={AFFILIATE_HREF} className="transition-colors hover:text-frost">Área do afiliado</a></li>
          </ul>
        </div>
        <div className="flex items-start gap-2">
          {socialLinks.map(({ label, href, icon: Icon }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Waterfall Company no ${label}`}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-obsidian text-platinum transition-colors duration-200 hover:bg-graphite hover:text-frost"
            >
              <Icon size={17} strokeWidth={1.7} />
            </a>
          ))}
        </div>
      </div>

      <div className="mt-12 flex flex-col gap-4 border-t border-smoke pt-6 md:flex-row md:items-center md:justify-between">
        <div className="t-caption flex flex-wrap gap-x-5 gap-y-2 text-platinum">
          <a href="/politica-de-privacidade" className="transition-colors hover:text-frost">Política de Privacidade</a>
          <a href="/termos-de-uso" className="transition-colors hover:text-frost">Termos de Uso</a>
        </div>
        <p className="t-caption text-platinum">
          © {new Date().getFullYear()} Water Diamond. Todos os direitos reservados.
        </p>
      </div>
    </div>
  </footer>
);
