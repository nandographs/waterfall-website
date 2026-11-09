import { motion } from "motion/react";
import {
  ArrowDown,
  ArrowRight,
  Check,
  Facebook,
  Instagram,
  MessageCircle,
  Sparkles,
  Youtube,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { Button, ButtonArrow } from "@/components/ui/button";
import { submitWeb3Form } from "@/lib/forms";
import { SiteHeader, SidebarMenu } from "@/components/site-shell";

const ease = [0.21, 0.47, 0.32, 0.98] as const;

const reveal = {
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.75, ease },
};

const scrollTo = (id: string) => {
  document.querySelector(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
};

const PrimaryButton = ({ children, onClick, light = false }: { children: React.ReactNode; onClick: () => void; light?: boolean }) => (
  <Button onClick={onClick} variant={light ? "pill-light" : "pill"} className="consultor-button">
    {children}
    <ButtonArrow tone={light ? "light" : "dark"}>
      <ArrowRight size={15} />
    </ButtonArrow>
  </Button>
);

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

  if (status === "success") {
    return (
      <div className="flex min-h-[480px] flex-col items-center justify-center rounded-3xl bg-white p-8 text-center text-foreground md:p-12">
        <div className="mb-7 flex h-16 w-16 items-center justify-center rounded-full bg-primary text-white"><Check size={27} /></div>
        <h3 className="mb-4 text-3xl font-medium tracking-tight">Seu próximo passo começou.</h3>
        <p className="max-w-sm text-sm font-light leading-7 text-muted-foreground">Nossa equipe vai analisar seu contato e falar com você em breve.</p>
        <button onClick={() => setStatus("idle")} className="mt-8 text-[10px] font-semibold uppercase tracking-[0.18em] text-primary underline underline-offset-8">Enviar outro contato</button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-3xl bg-white p-6 text-foreground shadow-2xl md:p-10">
                {/* Honeypot: bots preenchem, humanos não veem. O Web3Forms descarta o envio. */}
                <input type="checkbox" name="botcheck" tabIndex={-1} autoComplete="off" aria-hidden="true" className="hidden" style={{ display: "none" }} />

      <div className="mb-8 flex items-start justify-between gap-6">
        <div>
          <h3 className="text-2xl font-medium tracking-tight md:text-3xl">Conte um pouco sobre você.</h3>
        </div>
        <MessageCircle className="mt-1 shrink-0 text-primary" size={24} strokeWidth={1.5} />
      </div>

      <div className="space-y-5">
        <label className="block">
          <span className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">Nome completo</span>
          <input required name="nome" autoComplete="name" placeholder="Como podemos chamar você?" className="consultor-input" />
        </label>
        <div className="grid gap-5 sm:grid-cols-2">
          <label className="block">
            <span className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">WhatsApp</span>
            <input required name="whatsapp" type="tel" autoComplete="tel" placeholder="(00) 00000-0000" className="consultor-input" />
          </label>
          <label className="block">
            <span className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">Cidade / Estado</span>
            <input required name="cidade" autoComplete="address-level2" placeholder="Onde você está?" className="consultor-input" />
          </label>
        </div>
        <label className="block">
          <span className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">E-mail</span>
          <input required name="email" type="email" autoComplete="email" placeholder="voce@email.com" className="consultor-input" />
        </label>
      </div>

      {status === "error" && <p role="alert" className="mt-5 text-sm text-red-600">{message}</p>}

      <button disabled={status === "sending"} className="mt-7 flex min-h-14 w-full items-center justify-center gap-3 rounded-full bg-primary px-6 text-[11px] font-semibold uppercase tracking-[0.18em] text-white transition-colors hover:bg-primary-hover disabled:cursor-wait disabled:opacity-65">
        {status === "sending" ? "Enviando..." : "Quero ser Consultor Waterfall"}
        {status !== "sending" && <ArrowRight size={16} />}
      </button>
      <p className="mt-5 text-center text-[10px] font-light leading-5 text-muted-foreground">Ao enviar, você concorda em ser contatado pela equipe Waterfall. Seus dados serão tratados conforme nossa <a href="/politica-de-privacidade" className="underline">Política de Privacidade</a>.</p>
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
    <div className="consultor-page min-h-screen overflow-x-hidden bg-surface-light text-foreground selection:bg-primary selection:text-white">
      <SiteHeader scrolled={scrolled} onMenuOpen={() => setIsMenuOpen(true)} cta={{ label: "Quero ser consultor", onClick: () => scrollTo("#contato") }} />
      <SidebarMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />

      <main>
        <section className="relative min-h-[820px] overflow-hidden bg-navy-900 text-white lg:min-h-screen">
          <div className="absolute inset-0">
            <img
              src="/images/consultor-hero.webp"
              srcSet="/images/consultor-hero-sm.webp 800w, /images/consultor-hero.webp 1400w"
              sizes="100vw"
              alt="Consultor conversando com um casal sobre saúde e qualidade de vida"
              className="h-full w-full object-cover object-[70%_center] opacity-80"
              fetchPriority="high"
              decoding="async"
            />
            <div className="absolute inset-0 bg-[linear-gradient(90deg,#041923_0%,rgba(4,25,35,.96)_38%,rgba(4,25,35,.3)_73%,rgba(4,25,35,.64)_100%)]" />
            <div className="absolute inset-0 bg-[linear-gradient(0deg,#041923_0%,transparent_35%)]" />
          </div>

          <div className="relative mx-auto flex min-h-[820px] w-full max-w-[1500px] items-center px-5 pb-24 pt-32 md:px-10 lg:min-h-screen">
            <div className="max-w-[790px]">
              <motion.h1 initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.85, delay: 0.08, ease }} className="max-w-[760px] text-[clamp(3rem,7.1vw,7.2rem)] font-medium leading-[0.9] tracking-tight">
                Existe uma nova forma de <span className="text-primary-light">crescer.</span>
              </motion.h1>
              <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.75, delay: 0.22, ease }} className="mt-8 max-w-xl border-l border-white/25 pl-5 md:mt-10 md:pl-7">
                <p className="text-lg font-light leading-8 text-white/74 md:text-xl">Transforme relacionamento em oportunidade. E oportunidade em crescimento.</p>
              </motion.div>
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.34, ease }} className="mt-9">
                <PrimaryButton onClick={() => scrollTo("#contato")}>Quero fazer parte</PrimaryButton>
              </motion.div>
            </div>

            <div className="absolute bottom-8 right-5 hidden items-center gap-4 text-[9px] uppercase tracking-[0.22em] text-white/45 md:flex md:right-10">
              Conheça a oportunidade <ArrowDown size={15} />
            </div>
          </div>
        </section>

        <section className="border-b border-navy-800/10 bg-accent">
          <div className="mx-auto grid w-full max-w-[1500px] grid-cols-2 md:grid-cols-4">
            {["Mais liberdade", "Mais renda", "Mais propósito", "Mais possibilidades"].map((item, index) => (
              <div key={item} className="flex min-h-28 items-center gap-4 border-r border-b border-navy-800/10 px-5 last:border-r-0 md:min-h-32 md:border-b-0 md:px-8">
                <span className="text-[10px] font-semibold text-primary">0{index + 1}</span>
                <p className="text-sm font-medium tracking-tight md:text-base">{item}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-surface-light px-5 py-20 md:px-10 md:py-32">
          <div className="mx-auto grid w-full max-w-[1300px] gap-16 lg:grid-cols-[.8fr_1.2fr] lg:gap-28">
            <motion.div {...reveal}>
              <h2 className="text-[clamp(2.6rem,5vw,5.4rem)] font-medium leading-[0.98] tracking-tight">É fazer parte de um movimento.</h2>
            </motion.div>
            <motion.div {...reveal} transition={{ ...reveal.transition, delay: 0.1 }} className="lg:pt-20">
              <p className="max-w-2xl text-xl font-light leading-9 text-muted-foreground md:text-2xl md:leading-10">A Waterfall está abrindo espaço para pessoas que querem construir uma nova fase profissional ligada à saúde, qualidade de vida e transformação.</p>
              <div className="mt-10 flex items-center gap-4 border-t border-navy-800/12 pt-6 text-sm font-medium">
                <Sparkles size={18} className="text-primary" /> Crescimento com propósito e direção.
              </div>
            </motion.div>
          </div>
        </section>

        <section id="oportunidade" className="scroll-mt-20 bg-white px-5 py-20 md:px-10 md:py-32">
          <div className="mx-auto w-full max-w-[1300px]">
            <motion.div {...reveal} className="grid gap-8 border-b border-navy-800/12 pb-16 lg:grid-cols-2 lg:items-end">
              <div>
                <h2 className="max-w-2xl text-[clamp(2.7rem,5.2vw,5.6rem)] font-medium leading-[0.98] tracking-tight">O futuro pertence a quem se posiciona.</h2>
              </div>
              <p className="max-w-xl text-lg font-light leading-8 text-muted-foreground lg:justify-self-end">Todos os dias, pessoas buscam mais qualidade de vida para suas famílias. A Waterfall existe para elevar esse padrão — e queremos pessoas preparadas para levar essa visão mais longe.</p>
            </motion.div>

            <div className="grid md:grid-cols-2">
              {[
                ["01", "Relacionamento", "Transforme confiança e boa comunicação em portas reais."],
                ["02", "Autonomia", "Construa uma rotina com mais liberdade para decidir seus próximos passos."],
                ["03", "Crescimento", "Desenvolva uma nova fonte de renda com marca, método e direção."],
                ["04", "Propósito", "Leve saúde, bem-estar e qualidade de vida para mais pessoas."],
              ].map(([number, title, description], index) => (
                <motion.article key={title} {...reveal} transition={{ ...reveal.transition, delay: (index % 2) * 0.08 }} className={`group min-h-72 border-b border-navy-800/12 py-10 md:p-10 ${index % 2 === 0 ? "md:border-r" : ""}`}>
                  <div className="flex h-full flex-col justify-between gap-16">
                    <div className="flex items-start justify-between">
                      <span className="text-[10px] font-semibold tracking-[0.18em] text-primary">{number}</span>
                      <ArrowRight className="text-foreground/20 transition-all duration-300 group-hover:translate-x-1 group-hover:text-primary" size={20} />
                    </div>
                    <div>
                      <h3 className="mb-3 text-2xl font-medium tracking-tight">{title}</h3>
                      <p className="max-w-md text-sm font-light leading-7 text-muted-foreground">{description}</p>
                    </div>
                  </div>
                </motion.article>
              ))}
            </div>

            <motion.div {...reveal} className="mt-14 flex flex-col items-start justify-between gap-7 rounded-3xl bg-accent p-7 md:flex-row md:items-center md:p-10">
              <p className="max-w-2xl text-xl font-medium leading-8 tracking-tight">Você não precisa saber tudo agora. Precisa estar disposto a começar.</p>
              <PrimaryButton onClick={() => scrollTo("#contato")}>Quero começar</PrimaryButton>
            </motion.div>
          </div>
        </section>

        <section id="historia" className="scroll-mt-20 relative overflow-hidden bg-navy-900 px-5 py-24 text-white md:px-10 md:py-40">
          <div className="absolute inset-y-0 right-0 w-full opacity-30 lg:w-[62%]">
            <img
              src="/images/ioncenterkitchen.webp"
              srcSet="/images/ioncenterkitchen-sm.webp 800w, /images/ioncenterkitchen.webp 1400w"
              sizes="(max-width: 768px) 100vw, 50vw"
              alt="Tecnologia Waterfall em uma cozinha contemporânea"
              loading="lazy"
              decoding="async"
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-[linear-gradient(90deg,#041923_0%,transparent_72%)]" />
          </div>
          <div className="relative mx-auto w-full max-w-[1300px]">
            <motion.div {...reveal} className="max-w-3xl">
              <div className="mb-10 flex items-end gap-4 border-b border-white/15 pb-10">
                <span className="text-[clamp(6rem,15vw,13rem)] font-medium leading-[0.72] tracking-[-0.08em] text-primary-light">20</span>
                <span className="pb-1 text-4xl font-light text-white/80 md:pb-3 md:text-6xl">+ anos</span>
              </div>
              <h2 className="max-w-2xl text-3xl font-medium leading-tight tracking-tight md:text-5xl">Cresça com uma marca que escolheu transformar a qualidade da água.</h2>
              <p className="mt-7 max-w-xl text-base font-light leading-8 text-white/60">A Waterfall atua há mais de duas décadas desenvolvendo soluções ligadas à qualidade da água e ao bem-estar. Agora, estamos expandindo nossa rede para chegar a mais pessoas, famílias e empresas.</p>
              <p className="mt-8 border-l border-primary-light pl-5 text-lg font-medium">Quem entra nesse movimento não entra apenas para vender. Entra para crescer junto.</p>
            </motion.div>
          </div>
        </section>

        <section id="perfil" className="scroll-mt-20 bg-accent px-5 py-20 md:px-10 md:py-32">
          <div className="mx-auto grid w-full max-w-[1300px] gap-14 lg:grid-cols-[1fr_.9fr] lg:gap-24">
            <motion.div {...reveal}>
              <h2 className="max-w-2xl text-[clamp(2.8rem,5.4vw,5.8rem)] font-medium leading-[0.96] tracking-tight">Ambição com os pés no chão.</h2>
              <p className="mt-8 max-w-lg text-lg font-light leading-8 text-muted-foreground">Pessoas com iniciativa, comunicação e vontade de evoluir. Gente que quer construir algo maior e entende que confiança se conquista.</p>
            </motion.div>

            <motion.div {...reveal} transition={{ ...reveal.transition, delay: 0.1 }} className="rounded-3xl bg-white p-6 shadow-xl md:p-9">
              {[
                "Gosta de lidar com pessoas",
                "Quer construir novas fontes de renda",
                "Enxerga valor em saúde e bem-estar",
                "Tem iniciativa e boa comunicação",
                "Busca uma oportunidade séria e com direção",
              ].map((item, index) => (
                <div key={item} className="flex items-center gap-4 border-b border-navy-800/10 py-5 last:border-b-0">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-white"><Check size={14} /></span>
                  <p className="text-sm font-medium tracking-tight md:text-base">{item}</p>
                  <span className="ml-auto text-[9px] font-semibold tracking-[0.18em] text-primary/55">0{index + 1}</span>
                </div>
              ))}
            </motion.div>
          </div>
        </section>

        <section id="contato" className="scroll-mt-10 relative overflow-hidden bg-navy-800 px-5 py-24 text-white md:px-10 md:py-40">
          <div className="pointer-events-none absolute -right-32 top-[-10rem] h-[34rem] w-[34rem] rounded-full bg-primary/20 blur-[100px]" />
          <div className="relative mx-auto grid w-full max-w-[1300px] gap-14 lg:grid-cols-[1fr_.86fr] lg:items-center lg:gap-24">
            <motion.div {...reveal}>
              <h2 className="max-w-2xl text-[clamp(3rem,6vw,6.5rem)] font-medium leading-[0.93] tracking-tight">Toda grande mudança começa com uma decisão.</h2>
              <p className="mt-8 max-w-xl text-lg font-light leading-8 text-white/62">Se você quer construir uma nova fase profissional e fazer parte da expansão da Waterfall, preencha o formulário e fale com nossa equipe.</p>
            </motion.div>
            <motion.div {...reveal} transition={{ ...reveal.transition, delay: 0.12 }}>
              <ConsultantForm />
            </motion.div>
          </div>
        </section>
      </main>

      <footer className="border-t border-white/8 bg-navy-900 px-5 py-10 text-white md:px-10">
        <div className="mx-auto flex w-full max-w-[1500px] flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <div>
            <a href="/" className="inline-flex items-center gap-3">
              <img src="/images/LOGO.webp" alt="Waterfall" className="h-8 w-auto brightness-0 invert" />
              <span className="text-[9px] uppercase tracking-[0.22em] text-white/40">Quality of life</span>
            </a>
            <div className="mt-7 flex items-center gap-3">
              <a href="https://www.instagram.com/waterfallcompanybr" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 text-white/55 transition hover:border-primary hover:text-primary"><Instagram size={17} /></a>
              <a href="https://www.youtube.com/@waterfallcompanybr" target="_blank" rel="noopener noreferrer" aria-label="YouTube" className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 text-white/55 transition hover:border-primary hover:text-primary"><Youtube size={17} /></a>
              <a href="https://www.facebook.com/waterfallcompanybr" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 text-white/55 transition hover:border-primary hover:text-primary"><Facebook size={17} /></a>
            </div>
          </div>
          <div className="flex flex-col gap-3 text-xs text-white/40 md:items-end">
            <div className="flex flex-wrap gap-5"><a href="/politica-de-privacidade" className="hover:text-white">Política de Privacidade</a><a href="/termos-de-uso" className="hover:text-white">Termos de Uso</a></div>
            <p>© {new Date().getFullYear()} Waterfall. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>

      <button
        onClick={() => scrollTo("#contato")}
        aria-hidden={contactVisible}
        tabIndex={contactVisible ? -1 : 0}
        className={`fixed bottom-4 left-4 right-4 z-40 flex min-h-14 items-center justify-center gap-3 rounded-full bg-primary px-5 text-[10px] font-semibold uppercase tracking-[0.17em] text-white shadow-2xl transition-all duration-300 md:hidden ${
          contactVisible ? "pointer-events-none translate-y-24 opacity-0" : "translate-y-0 opacity-100"
        }`}
      >
        Quero ser consultor <ArrowRight size={15} />
      </button>
    </div>
  );
}
