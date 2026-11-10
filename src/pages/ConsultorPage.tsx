import { motion } from "motion/react";
import { Check, ChevronRight, Sparkles } from "lucide-react";
import React, { useEffect, useState } from "react";
import { submitWeb3Form } from "@/lib/forms";
import { SidebarMenu, SiteFooter, SiteHeader, scrollToSection } from "@/components/site-shell";

const shell = "mx-auto w-full max-w-[1440px] px-5 md:px-12";
const sectionY = "py-24 md:py-32";
const ease = [0.22, 1, 0.36, 1] as const;

const Reveal = ({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string; key?: React.Key }) => (
  <motion.div
    initial={{ opacity: 0, y: 24 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-80px" }}
    transition={{ duration: 0.9, delay, ease }}
    className={className}
  >
    {children}
  </motion.div>
);

const goToForm = () => scrollToSection("#contato");

const pillars = ["Mais liberdade", "Mais renda", "Mais propósito", "Mais possibilidades"];

const opportunities = [
  ["01", "Relacionamento", "Transforme confiança e boa comunicação em portas reais."],
  ["02", "Autonomia", "Construa uma rotina com mais liberdade para decidir seus próximos passos."],
  ["03", "Crescimento", "Desenvolva uma nova fonte de renda com marca, método e direção."],
  ["04", "Propósito", "Leve saúde, bem-estar e qualidade de vida para mais pessoas."],
];

const profile = [
  "Gosta de lidar com pessoas",
  "Quer construir novas fontes de renda",
  "Enxerga valor em saúde e bem-estar",
  "Tem iniciativa e boa comunicação",
  "Busca uma oportunidade séria e com direção",
];

const ConsultantForm = () => {
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus("sending");
    setMessage("");

    const form = event.currentTarget;

    try {
      await submitWeb3Form(form, {
        kind: "consultor",
        subject: "Novo candidato a Consultor Waterfall",
        fromName: "Página Seja um Consultor Waterfall",
      });
      form.reset();
      setStatus("success");
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "Algo deu errado. Tente novamente.");
    }
  };

  const labelClass = "mb-1.5 block text-[0.8125rem] font-medium text-pewter";

  if (status === "success") {
    return (
      <div className="flex min-h-[480px] flex-col items-center justify-center rounded-[28px] bg-white p-8 text-center text-obsidian md:p-12">
        <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-frost">
          <Check size={26} className="text-action" />
        </div>
        <h3 className="t-headline-lg">Seu próximo passo começou.</h3>
        <p className="t-body mt-3 max-w-sm text-pewter">Nossa equipe vai analisar seu contato e falar com você em breve.</p>
        <button type="button" onClick={() => setStatus("idle")} className="link-arrow mt-8 text-link">
          Enviar outro contato
          <ChevronRight size={18} aria-hidden="true" />
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-[28px] bg-white p-7 text-obsidian md:p-10">
      {/* Honeypot: bots preenchem, humanos não veem. O Web3Forms descarta o envio. */}
      <input type="checkbox" name="botcheck" tabIndex={-1} autoComplete="off" aria-hidden="true" className="hidden" style={{ display: "none" }} />

      <h3 className="t-headline-lg">Conte um pouco sobre você.</h3>

      <div className="mt-7 space-y-4">
        <label className="block">
          <span className={labelClass}>Nome completo</span>
          <input required name="nome" autoComplete="name" placeholder="Como podemos chamar você?" className="wd-input" />
        </label>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
          <label className="block">
            <span className={labelClass}>WhatsApp</span>
            <input required name="whatsapp" type="tel" autoComplete="tel" placeholder="(00) 00000-0000" className="wd-input" />
          </label>
          <label className="block">
            <span className={labelClass}>Cidade / Estado</span>
            <input required name="cidade" autoComplete="address-level2" placeholder="Onde você está?" className="wd-input" />
          </label>
        </div>
        <label className="block">
          <span className={labelClass}>E-mail</span>
          <input required name="email" type="email" autoComplete="email" placeholder="voce@email.com" className="wd-input" />
        </label>
      </div>

      {status === "error" && <p role="alert" className="t-small mt-5 font-medium text-red-600">{message}</p>}

      <button type="submit" disabled={status === "sending"} className="btn-action mt-7 min-h-12 w-full text-base disabled:cursor-wait">
        {status === "sending" ? "Enviando..." : "Quero ser Consultor Waterfall"}
      </button>
      <p className="t-caption mt-5 text-center text-pewter">
        Ao enviar, você concorda em ser contatado pela equipe Waterfall. Seus dados serão tratados conforme nossa{" "}
        <a href="/politica-de-privacidade" className="text-link underline-offset-2 hover:underline">Política de Privacidade</a>.
      </p>
    </form>
  );
};

export default function ConsultorPage() {
  const [scrolled, setScrolled] = useState(false);
  const [contactVisible, setContactVisible] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const previousTitle = document.title;
    document.title = "Seja um Consultor Waterfall | Cresça com a gente";

    const onScroll = () => setScrolled(window.scrollY > 32);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    const contact = document.querySelector("#contato");
    const observer = contact
      ? new IntersectionObserver(([entry]) => setContactVisible(entry.isIntersecting), { threshold: 0.08 })
      : null;
    if (contact && observer) observer.observe(contact);

    return () => {
      document.title = previousTitle;
      window.removeEventListener("scroll", onScroll);
      observer?.disconnect();
    };
  }, []);

  return (
    <div className="wd min-h-screen bg-stage text-frost selection:bg-action/30">
      <SiteHeader scrolled={scrolled} onMenuOpen={() => setIsMenuOpen(true)} title="Seja um consultor" cta={{ label: "Quero ser consultor", shortLabel: "Fazer parte", onClick: goToForm }} />
      <SidebarMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />

      <main>
        {/* PALCO */}
        <section className="relative isolate flex min-h-[100svh] flex-col justify-end overflow-hidden bg-stage">
          {/* No celular a foto ocupa só o topo e o texto pousa no preto; no desktop ela cobre o palco. */}
          <div className="absolute inset-x-0 top-0 -z-10 h-[62%] md:inset-0 md:h-auto">
            <img
              src="/images/consultor-hero.webp"
              srcSet="/images/consultor-hero-sm.webp 800w, /images/consultor-hero.webp 1400w"
              sizes="100vw"
              alt="Consultor conversando com um casal sobre saúde e qualidade de vida"
              className="h-full w-full object-cover object-[32%_20%] opacity-90 md:object-[68%_center] md:opacity-85"
              fetchPriority="high"
              decoding="async"
            />
            {/* Véu só onde o texto pousa, para a foto continuar dominando o quadro. */}
            <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black to-transparent md:h-[70%] md:via-black/75" />
          </div>

          <div className={`${shell} pb-28 pt-32 md:pb-24`}>
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.1, delay: 0.15, ease }}
            >
              <p className="t-eyebrow text-frost">Seja um Consultor Waterfall</p>
              <h1 className="t-hero mt-4 max-w-[13ch]">
                <span className="text-platinum">Existe uma nova forma de</span> crescer.
              </h1>
              <p className="t-body mt-5 max-w-lg text-platinum">
                Transforme relacionamento em oportunidade. E oportunidade em crescimento.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-4">
                <button type="button" onClick={goToForm} className="btn-action">
                  Quero fazer parte
                </button>
                <button type="button" onClick={() => scrollToSection("#oportunidade")} className="link-arrow text-halo">
                  Conheça a oportunidade
                  <ChevronRight size={18} aria-hidden="true" />
                </button>
              </div>
            </motion.div>
          </div>
        </section>

        {/* PILARES */}
        <section className="bg-stage pb-24 md:pb-32">
          <div className={shell}>
            <ul className="grid grid-cols-2 border-t border-smoke lg:grid-cols-4">
              {pillars.map((item, index) => (
                <Reveal
                  key={item}
                  delay={index * 0.05}
                  className={`border-b border-smoke lg:border-b-0 ${index % 2 === 0 ? "border-r" : ""} lg:border-r lg:last:border-r-0`}
                >
                  <li className="flex flex-col gap-3 px-1 py-8 sm:px-6 lg:py-10">
                    <span className="t-small font-semibold text-signal">0{index + 1}</span>
                    <p className="t-headline">{item}</p>
                  </li>
                </Reveal>
              ))}
            </ul>
          </div>
        </section>

        {/* MOVIMENTO — faixa clara */}
        <section className={`bg-white text-obsidian ${sectionY}`}>
          <div className={`${shell} grid gap-10 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-24`}>
            <Reveal>
              <p className="t-eyebrow text-signal-ink">A oportunidade</p>
              <h2 className="t-display mt-3 max-w-[14ch]">É fazer parte de um movimento.</h2>
            </Reveal>
            <Reveal delay={0.1} className="lg:pt-14">
              <p className="t-headline max-w-2xl font-normal text-pewter">
                A Waterfall está abrindo espaço para pessoas que querem construir uma nova fase profissional ligada à saúde, qualidade de vida e transformação.
              </p>
              <p className="t-title mt-10 flex items-center gap-3 border-t border-hairline pt-6">
                <Sparkles size={20} strokeWidth={1.6} className="shrink-0 text-action" aria-hidden="true" />
                Crescimento com propósito e direção.
              </p>
            </Reveal>
          </div>
        </section>

        {/* POR QUE AGORA — faixa cinza-clara */}
        <section id="oportunidade" className={`scroll-mt-20 bg-frost text-obsidian ${sectionY}`}>
          <div className={shell}>
            <Reveal>
              <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.8fr)] lg:items-end lg:gap-16">
                <h2 className="t-display max-w-[16ch]">O futuro pertence a quem se posiciona.</h2>
                <p className="t-body max-w-xl text-pewter">
                  Todos os dias, pessoas buscam mais qualidade de vida para suas famílias. A Waterfall existe para elevar esse padrão — e queremos pessoas preparadas para levar essa visão mais longe.
                </p>
              </div>
            </Reveal>

            <div className="mt-14 grid gap-4 md:mt-20 md:grid-cols-2 md:gap-5">
              {opportunities.map(([number, title, description], index) => (
                <Reveal key={title} delay={(index % 2) * 0.06}>
                  <article className="flex h-full min-h-64 flex-col justify-between gap-12 rounded-[28px] bg-white p-8 md:p-10">
                    <span className="t-small font-semibold text-signal-ink">{number}</span>
                    <div>
                      <h3 className="t-headline-lg">{title}</h3>
                      <p className="t-body mt-3 max-w-md text-pewter">{description}</p>
                    </div>
                  </article>
                </Reveal>
              ))}
            </div>

            <Reveal>
              <div className="mt-4 flex flex-col items-start justify-between gap-7 rounded-[28px] bg-obsidian p-8 text-frost md:mt-5 md:flex-row md:items-center md:p-10">
                <p className="t-headline max-w-2xl">
                  Você não precisa saber tudo agora. <span className="text-platinum">Precisa estar disposto a começar.</span>
                </p>
                <button type="button" onClick={goToForm} className="btn-action shrink-0">
                  Quero começar
                </button>
              </div>
            </Reveal>
          </div>
        </section>

        {/* HISTÓRIA — cartão obsidiana sobre o palco */}
        <section id="historia" className={`scroll-mt-20 bg-stage ${sectionY}`}>
          <div className={shell}>
            <Reveal>
              <div className="grid overflow-hidden rounded-[28px] bg-obsidian md:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
                <div className="px-7 pb-12 pt-12 md:px-14 md:py-20 lg:px-20">
                  <p className="t-eyebrow text-signal">Nossa história</p>
                  <p className="mt-6 flex items-baseline gap-3 [font-variant-numeric:tabular-nums]">
                    <span className="text-[clamp(4.5rem,2rem+6.5vw,8rem)] font-semibold leading-[0.85] tracking-[-0.05em] text-frost">20</span>
                    <span className="t-headline-lg whitespace-nowrap text-platinum">+ anos</span>
                  </p>
                  <h2 className="t-headline-lg mt-10 max-w-[22ch]">Cresça com uma marca que escolheu transformar a qualidade da água.</h2>
                  <p className="t-body mt-5 max-w-md text-platinum">
                    A Waterfall atua há mais de duas décadas desenvolvendo soluções ligadas à qualidade da água e ao bem-estar. Agora, estamos expandindo nossa rede para chegar a mais pessoas, famílias e empresas.
                  </p>
                  <p className="t-title mt-8 max-w-md border-t border-smoke pt-6 text-frost">
                    Quem entra nesse movimento não entra apenas para vender. Entra para crescer junto.
                  </p>
                </div>
                <div className="relative aspect-[4/3] md:aspect-auto">
                  <img
                    src="/images/PRODUTOS.webp"
                    srcSet="/images/PRODUTOS-sm.webp 900w, /images/PRODUTOS.webp 1800w"
                    sizes="(max-width: 768px) 100vw, 55vw"
                    alt="Linha Water Diamond Ion Center: modelos Smart, Slim e Turbo lado a lado"
                    loading="lazy"
                    decoding="async"
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        {/* PERFIL — faixa clara */}
        <section id="perfil" className={`scroll-mt-20 bg-white text-obsidian ${sectionY}`}>
          <div className={`${shell} grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.9fr)] lg:gap-24`}>
            <Reveal>
              <p className="t-eyebrow text-signal-ink">Perfil</p>
              <h2 className="t-display mt-3 max-w-[14ch]">Ambição com os pés no chão.</h2>
              <p className="t-body mt-6 max-w-lg text-pewter">
                Pessoas com iniciativa, comunicação e vontade de evoluir. Gente que quer construir algo maior e entende que confiança se conquista.
              </p>
            </Reveal>

            <Reveal delay={0.1} className="lg:pt-16">
              <ul className="border-t border-hairline">
                {profile.map((item) => (
                  <li key={item} className="t-title flex items-center gap-4 border-b border-hairline py-5 font-medium">
                    <Check size={20} className="shrink-0 text-action" aria-hidden="true" />
                    {item}
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
        </section>

        {/* CONTATO — palco escuro */}
        <section id="contato" className={`scroll-mt-10 bg-stage ${sectionY}`}>
          <div className={`${shell} grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.9fr)] lg:items-center lg:gap-24`}>
            <Reveal>
              <p className="t-eyebrow text-signal">Próximo passo</p>
              <h2 className="t-display mt-3 max-w-[16ch]">
                Toda grande mudança <span className="text-platinum">começa com uma decisão.</span>
              </h2>
              <p className="t-body mt-6 max-w-xl text-platinum">
                Se você quer construir uma nova fase profissional e fazer parte da expansão da Waterfall, preencha o formulário e fale com nossa equipe.
              </p>
            </Reveal>
            <Reveal delay={0.1}>
              <ConsultantForm />
            </Reveal>
          </div>
        </section>
      </main>

      <SiteFooter />

      {/* Atalho para o formulário no celular; some quando o formulário aparece. */}
      <div
        aria-hidden={contactVisible}
        className={`fixed inset-x-4 bottom-4 z-40 transition-all duration-300 md:hidden ${
          contactVisible ? "pointer-events-none translate-y-24 opacity-0" : "translate-y-0 opacity-100"
        }`}
      >
        <button type="button" onClick={goToForm} tabIndex={contactVisible ? -1 : 0} className="btn-action min-h-12 w-full text-base">
          Quero ser consultor
        </button>
      </div>
    </div>
  );
}
