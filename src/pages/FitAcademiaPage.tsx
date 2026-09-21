import { motion, useReducedMotion, AnimatePresence } from "motion/react";
import { ArrowRight, Check, Facebook, Instagram, X, Youtube } from "lucide-react";
import React, { useEffect, useState } from "react";
import { WHATSAPP_FIT_URL, submitWeb3Form } from "@/lib/forms";
import Hero19 from "@/components/ui/hero-19";
import AmbientVideo from "@/components/ui/ambient-video";
import { BentoCard, BentoGrid, BentoImage } from "@/components/ui/bento";

const WhatsAppIcon = ({ className = "h-5 w-5" }: { className?: string }) => (
  <svg viewBox="0 0 32 32" className={className} fill="currentColor" aria-hidden="true">
    <path d="M16.01 3.2C8.96 3.2 3.23 8.91 3.23 15.93c0 2.24.59 4.43 1.7 6.36L3.12 28.8l6.68-1.75a12.77 12.77 0 0 0 6.21 1.58c7.04 0 12.77-5.71 12.77-12.73S23.05 3.2 16.01 3.2Zm0 23.28c-1.95 0-3.86-.52-5.52-1.5l-.4-.24-3.96 1.04 1.06-3.86-.26-.4a10.42 10.42 0 0 1-1.59-5.59c0-5.83 4.78-10.58 10.66-10.58 5.87 0 10.65 4.75 10.65 10.58S21.88 26.48 16 26.48Zm5.84-7.92c-.32-.16-1.9-.94-2.2-1.04-.3-.11-.51-.16-.72.16-.21.32-.83 1.04-1.02 1.25-.19.21-.38.24-.7.08-.32-.16-1.36-.5-2.59-1.6-.96-.85-1.6-1.9-1.79-2.22-.19-.32-.02-.49.14-.65.14-.14.32-.38.48-.57.16-.19.21-.32.32-.54.11-.21.05-.4-.03-.57-.08-.16-.72-1.73-.99-2.38-.26-.62-.53-.54-.72-.55h-.62c-.21 0-.56.08-.85.4-.3.32-1.12 1.09-1.12 2.65s1.15 3.08 1.31 3.29c.16.21 2.27 3.45 5.5 4.84.77.33 1.37.53 1.83.68.77.24 1.47.21 2.03.13.62-.09 1.9-.78 2.17-1.53.27-.75.27-1.4.19-1.53-.08-.13-.29-.21-.61-.37Z" />
  </svg>
);

/** Modal de contato exibido antes do WhatsApp. Coleta só nome e telefone — a página é de QR code, o atrito precisa ser mínimo. */
const FitContactModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [message, setMessage] = useState("");
  const [name, setName] = useState("");

  useEffect(() => {
    if (!isOpen) {
      const timer = setTimeout(() => {
        setStatus("idle");
        setMessage("");
        setName("");
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus("sending");
    setMessage("");

    try {
      await submitWeb3Form(event.currentTarget, {
        kind: "fitacademia",
        subject: "Novo contato pelo QR code Fit Academia",
        fromName: "Water Diamond Ion Center | Fit Academia",
      });
      setStatus("success");
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "Algo deu errado. Tente novamente.");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/60 backdrop-blur-md"
        onClick={onClose}
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ duration: 0.4, ease: [0.21, 0.47, 0.32, 0.98] }}
        className="relative z-10 w-full max-w-md overflow-hidden rounded-3xl border border-neutral-100 bg-white text-foreground shadow-2xl"
      >
        <button
          onClick={onClose}
          aria-label="Fechar"
          className="absolute right-5 top-5 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-neutral-100 text-neutral-500 transition-colors hover:bg-neutral-200"
        >
          <X size={16} />
        </button>

        <div className="p-8 md:p-10">
          {status !== "success" ? (
            <>
              <div className="mb-8">
                <h3 className="text-2xl font-medium tracking-tight">Fale com um especialista</h3>
                <p className="mt-2 text-sm font-light text-neutral-500">
                  Deixe seu nome e telefone. Você será direcionado ao WhatsApp em seguida.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Honeypot: bots preenchem, humanos não veem. O Web3Forms descarta o envio. */}
                <input type="checkbox" name="botcheck" tabIndex={-1} autoComplete="off" aria-hidden="true" className="hidden" style={{ display: "none" }} />

                <div>
                  <label htmlFor="fit-name" className="mb-2 block text-xs font-semibold uppercase tracking-wider text-neutral-500">
                    Nome completo
                  </label>
                  <input
                    id="fit-name"
                    name="name"
                    type="text"
                    required
                    autoComplete="name"
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    placeholder="Seu nome"
                    className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm transition-colors focus:border-primary focus:outline-none"
                  />
                </div>

                <div>
                  <label htmlFor="fit-phone" className="mb-2 block text-xs font-semibold uppercase tracking-wider text-neutral-500">
                    WhatsApp / Telefone
                  </label>
                  <input
                    id="fit-phone"
                    name="phone"
                    type="tel"
                    required
                    autoComplete="tel"
                    placeholder="(00) 00000-0000"
                    className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm transition-colors focus:border-primary focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={status === "sending"}
                  className="mt-2 flex min-h-14 w-full items-center justify-center gap-3 rounded-full bg-primary px-6 text-[11px] font-semibold uppercase tracking-[0.18em] text-white transition-colors hover:bg-primary-hover disabled:cursor-wait disabled:opacity-65"
                >
                  {status === "sending" ? "Enviando..." : "Continuar"}
                  {status !== "sending" && <ArrowRight size={16} />}
                </button>

                {status === "error" && (
                  <p role="alert" className="text-center text-xs font-medium text-red-600">
                    {message}
                  </p>
                )}
              </form>
            </>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="py-6 text-center"
            >
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-primary text-white">
                <Check size={27} />
              </div>
              <h3 className="mb-2 text-2xl font-medium tracking-tight">
                Obrigado{name ? `, ${name.split(" ")[0]}` : ""}!
              </h3>
              <p className="mx-auto mb-8 max-w-xs text-sm font-light leading-7 text-neutral-500">
                Agora é só continuar no WhatsApp para falar com um especialista Waterfall.
              </p>
              <a
                href={WHATSAPP_FIT_URL}
                target="_blank"
                rel="noopener noreferrer"
                onClick={onClose}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-[#25D366] px-8 py-3 text-sm font-medium text-white transition-all duration-300 hover:bg-[#1ebe5d]"
              >
                <WhatsAppIcon className="h-5 w-5" />
                Falar agora no WhatsApp
              </a>
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

const ease = [0.16, 1, 0.3, 1] as const;

/** Reveal padrão da página. Uma entrada só, repetida com atraso escalonado. */
const Reveal = ({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  key?: React.Key;
}) => {
  const reduce = useReducedMotion();
  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: 26 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.75, delay, ease }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

/** Logo da Fit Academia. PNG preto sobre fundo transparente. */
const FitAcademiaLogo = ({ invert = false }: { invert?: boolean }) => (
  <img
    src="/images/fitpng.webp"
    alt="Fit Academia"
    className={`h-9 w-auto object-contain md:h-10 ${invert ? "brightness-0 invert" : ""}`}
  />
);

/** Lockup das duas marcas. O endosso da academia é o principal ativo de confiança da página. */
const CoBrand = ({ invert = false }: { invert?: boolean }) => (
  <div className="flex items-center gap-4">
    <img
      src="/images/LOGO.webp"
      alt="Waterfall"
      className="h-6 w-auto object-contain md:h-7"
      style={{
        filter: invert
          ? "brightness(0) invert(1)"
          : "brightness(0) saturate(100%) invert(47%) sepia(95%) saturate(1897%) hue-rotate(162deg) brightness(97%) contrast(101%)",
      }}
    />
    <span className={`h-5 w-px ${invert ? "bg-white/25" : "bg-border"}`} />
    <FitAcademiaLogo invert={invert} />
  </div>
);

const CtaButton = ({
  children,
  tone = "primary",
  className = "",
  onClick,
}: {
  children: React.ReactNode;
  tone?: "primary" | "light";
  className?: string;
  onClick: () => void;
}) => (
  <button
    type="button"
    onClick={onClick}
    className={`group inline-flex min-h-14 items-center justify-center gap-4 rounded-full pl-7 pr-3 text-[11px] font-semibold uppercase tracking-[0.2em] transition-colors duration-300 active:scale-[0.98] ${
      tone === "light"
        ? "bg-white text-navy-900 hover:bg-accent"
        : "bg-primary text-white hover:bg-primary-hover"
    } ${className}`}
  >
    {children}
    <span
      className={`flex h-9 w-9 items-center justify-center rounded-full transition-transform duration-300 group-hover:translate-x-0.5 ${
        tone === "light" ? "bg-navy-900 text-white" : "bg-white/18"
      }`}
    >
      <ArrowRight size={15} />
    </span>
  </button>
);

const waterCarries = [
  {
    eyebrow: "Rede e tubulações",
    title: "Partículas e sedimentos",
    desc: "Areia, ferrugem e outros resíduos acumulados ao longo da rede e dos sistemas de armazenamento.",
    image: "/images/DISTRIBUICAO.webp",
    alt: "Tubulações da rede de distribuição de água",
    span: "lg:col-span-2",
  },
  {
    eyebrow: "Tratamento público",
    title: "Cloro residual",
    desc: "Essencial para o tratamento público, mas perceptível no sabor e no odor da água consumida em casa.",
    image: "/images/TRATAMENTO.webp",
    alt: "Estação de tratamento de água",
    span: "lg:col-span-2",
  },
  {
    eyebrow: "Invisível a olho nu",
    title: "Microrganismos",
    desc: "Bactérias e outros microrganismos podem estar presentes sem alterar a cor, o cheiro ou a transparência da água.",
    image: "/images/RESERVATORIOS.webp",
    alt: "Caixa-d'água e reservatório residencial",
    span: "lg:col-span-2",
  },
];

const stages = [
  {
    n: "01",
    title: "Ultrafiltração",
    refill: "Refil Max Ultra",
    image: "/images/MAX.webp",
    desc: "Uma membrana de 0,5 mícron retém areia, ferrugem, sedimentos, microplásticos e microrganismos.",
    span: "lg:col-span-3",
  },
  {
    n: "02",
    title: "Purificação",
    refill: "Refil Max Carbon",
    image: "/images/CARBON.webp",
    desc: "Reduz o cloro, odores, compostos orgânicos e resíduos químicos que podem interferir no sabor da água.",
    span: "lg:col-span-3",
  },
  {
    n: "03",
    title: "Purificação profunda",
    refill: "Refil Max Block",
    image: "/images/BLOCK.webp",
    desc: "O carvão ativado compactado amplia a retenção de impurezas persistentes e contribui para a redução de metais pesados e bactérias.",
    span: "lg:col-span-3",
  },
  {
    n: "04",
    title: "Alcalinização",
    refill: "Refil Max Alka",
    image: "/images/ALKA.webp",
    desc: "Eleva o pH da água para a faixa de 8,5 a 9,5 e adiciona minerais como cálcio, magnésio e potássio.",
    span: "lg:col-span-3",
  },
];

/** Mesmas redes do footer padrão do site. Duplicado aqui de propósito: importar de App.tsx criaria ciclo. */
const socialLinks = [
  { label: "Instagram", href: "https://www.instagram.com/waterfallcompanybr", icon: Instagram },
  { label: "Facebook", href: "https://www.facebook.com/waterfallcompanybr", icon: Facebook },
  { label: "YouTube", href: "https://www.youtube.com/@waterfallcompanybr", icon: Youtube },
];

const specs = [
  { value: "0,5 μm", label: "Membrana de ultrafiltração" },
  { value: "8,5–9,5", label: "Faixa de pH alcalino" },
  { value: "Até 6.000 L", label: "Tratados por ciclo de refil" },
  { value: "12 meses", label: "De garantia" },
];

const models = [
  {
    name: "Slim",
    full: "Ion Center Slim",
    image: "/images/SLIMIMG.webp",
    alt: "Ion Center Slim instalado sob a bancada de uma cozinha branca",
    desc: "Instalado sob a bancada ou na parede. Fornece água em temperatura natural sem ocupar espaço sobre a superfície.",
    tint: "bg-[#eef6fa]",
  },
  {
    name: "Smart",
    full: "Ion Center Smart",
    image: "/images/SMARTIMG.webp",
    alt: "Ion Center Smart preto sobre a bancada de uma cozinha contemporânea",
    desc: "Água natural, fria ou gelada em um equipamento compacto com refrigeração eletrônica.",
    tint: "bg-[#e6f7fc]",
  },
  {
    name: "Turbo",
    full: "Ion Center Turbo",
    image: "/images/TURBOIMG.webp",
    alt: "Ion Center Turbo preto sobre a bancada de uma cozinha escura",
    desc: "Mais capacidade e água gelada por mais tempo, com sistema de refrigeração por compressor.",
    tint: "bg-[#f1f5f8]",
  },
];

export default function FitAcademiaPage() {
  const [contactOpen, setContactOpen] = useState(false);

  useEffect(() => {
    const previousTitle = document.title;
    document.title = "Water Diamond Ion Center | Fit Academia";

    // Página acessada só por QR code. Fora do índice de busca para não
    // concorrer com a home nem aparecer em resultado orgânico.
    const robots = document.createElement("meta");
    robots.name = "robots";
    robots.content = "noindex, nofollow";
    document.head.appendChild(robots);

    return () => {
      document.title = previousTitle;
      robots.remove();
    };
  }, []);

  return (
    <div className="min-h-screen overflow-x-hidden bg-white text-foreground selection:bg-primary selection:text-white">
      <main>
        {/* HERO — Watermelon UI hero-19, com logos trocadas para o lockup Waterfall + Fit Academia */}
        <Hero19
          headingLine1="Você cuida do seu corpo."
          headingLine2="Comece pela água."
          description="Cinco etapas de tratamento entre a rede e o seu copo. Conheça a linha Water Diamond Ion Center."
          primaryCtaLabel="Conhecer a linha"
          primaryCtaHref={WHATSAPP_FIT_URL}
          primaryCtaOnClick={() => setContactOpen(true)}
          bookingLabel="Falar agora"
          bookingHref={WHATSAPP_FIT_URL}
          bookingOnClick={() => setContactOpen(true)}
          scrollLabel="Descubra como funciona"
        />

        {/* O QUE PODE CHEGAR COM A ÁGUA */}
        <section className="bg-white px-5 py-24 md:px-10 md:py-36">
          <div className="mx-auto w-full max-w-[1400px] text-center">
            <Reveal>
              <h2
                className="mx-auto max-w-5xl font-medium tracking-[-0.03em] leading-[1.05]"
                style={{ fontSize: "clamp(1.8rem, 3.6vw, 3.1rem)" }}
              >
                Antes de chegar ao seu copo, a água percorre um longo caminho.
              </h2>
            </Reveal>

            <Reveal delay={0.06}>
              <p className="mx-auto mt-6 max-w-2xl text-base font-light leading-8 text-muted-foreground">
                Ao passar por tubulações, caixas-d'água e reservatórios, ela pode carregar elementos que
                nem sempre são visíveis.
              </p>
            </Reveal>

            <BentoGrid className="mt-16 text-left md:mt-20">
              {waterCarries.map((item, i) => (
                <Reveal key={item.title} delay={i * 0.07} className={`${item.span} flex`}>
                  <BentoCard
                    className="w-full"
                    eyebrow={item.eyebrow}
                    title={item.title}
                    description={item.desc}
                    fade={["bottom"]}
                    graphic={<BentoImage src={item.image} alt={item.alt} />}
                  />
                </Reveal>
              ))}
            </BentoGrid>
          </div>
        </section>

        {/* O CONCEITO — vídeo de fundo, mesma tipografia do hero */}
        <section className="relative isolate overflow-hidden px-5 py-24 text-white md:px-10 md:py-40">
          <AmbientVideo
            videoDesktop="/videos/ioncenter.mp4"
            videoMobile="/videos/ioncenter-mobile.mp4"
            poster="/images/hero-poster.webp"
            posterMobile="/images/hero-poster-sm.webp"
            className="pointer-events-none absolute inset-0"
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/55 via-black/35 to-black/60" />

          <div className="relative mx-auto w-full max-w-[1400px]">
            <Reveal>
              <h2 className="max-w-5xl text-[clamp(3rem,5.25vw,4.4rem)] leading-[1.04] font-normal tracking-[-0.055em] text-balance text-white">
                Filtrar é apenas o começo.
                <span className="block">Tratar é cuidar da água por inteiro.</span>
              </h2>
            </Reveal>

            <Reveal delay={0.1}>
              <p className="mt-10 max-w-xl text-[0.78rem] leading-[1.55] font-medium text-pretty text-white/85 md:mt-14">
                O Ion Center vai além de um filtro convencional. É uma central de tratamento instalada na
                sua cozinha, com cinco etapas que atuam da retenção de partículas à alcalinização e à
                ionização. A água entra pela rede. O Ion Center cuida de todo o caminho até o seu copo.
              </p>
            </Reveal>
          </div>
        </section>

        {/* AS CINCO ETAPAS */}
        <section className="bg-white px-5 py-24 md:px-10 md:py-36">
          <div className="mx-auto w-full max-w-[1400px] text-center">
            <Reveal>
              <h2
                className="mx-auto max-w-4xl font-medium tracking-[-0.035em] leading-[1.05]"
                style={{ fontSize: "clamp(2rem, 4.4vw, 3.6rem)" }}
              >
                Quatro etapas.
                <span className="text-muted-foreground"> Cada uma com uma função essencial.</span>
              </h2>
            </Reveal>

            <BentoGrid className="mt-16 text-left md:mt-24">
              {stages.map((stage, i) => (
                <Reveal key={stage.n} delay={i * 0.05} className={`${stage.span} flex`}>
                  <BentoCard
                    className="w-full"
                    tone="light"
                    overlap={false}
                    mediaClassName="h-[15rem] md:h-[17rem]"
                    eyebrow={stage.refill}
                    title={stage.title}
                    description={stage.desc}
                    graphic={
                      <div className="flex h-full w-full items-center justify-center bg-gradient-to-b from-white to-[#eef6fa] p-10 md:p-12">
                        <img
                          src={stage.image}
                          srcSet={`${stage.image.replace(".webp", "-sm.webp")} 460w, ${stage.image} 800w`}
                          sizes="(max-width: 768px) 90vw, 40vw"
                          alt={`Refil ${stage.refill}`}
                          className="h-full w-full object-contain"
                          loading="lazy"
                          decoding="async"
                        />
                      </div>
                    }
                  />
                </Reveal>
              ))}
            </BentoGrid>
          </div>
        </section>

        {/* IONIZAÇÃO — seção escura, pico técnico da página */}
        <section className="relative overflow-hidden bg-navy-900 px-5 py-24 text-white md:px-10 md:py-40">
          <div className="mx-auto grid w-full max-w-[1400px] items-center gap-14 lg:grid-cols-[1.1fr_.9fr] lg:gap-24">
            <Reveal>
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-primary-light">
                Tecnologia Water Diamond®
              </p>

              <h2
                className="mt-5 font-medium tracking-[-0.035em] leading-[1]"
                style={{ fontSize: "clamp(2.2rem, 5vw, 4.2rem)" }}
              >
                A etapa que vai além da purificação.
              </h2>

              <p className="mt-9 max-w-lg text-lg font-light leading-9 text-white/65 md:text-xl">
                Depois de filtrada, purificada e alcalinizada, a água passa pelo Water Diamond®. Essa
                etapa atua em seu equilíbrio iônico, convertendo íons positivos em negativos e
                completando o processo de tratamento.
              </p>

              <p className="mt-10 border-l border-primary-light pl-6 text-base font-medium leading-8 md:text-lg">
                Uma água tratada em cinco dimensões. Pronta para fazer parte da sua rotina.
              </p>
            </Reveal>

            <Reveal delay={0.12}>
              <div className="overflow-hidden rounded-[24px] border border-white/12 bg-white/5">
                <AmbientVideo
                  videoDesktop="/videos/bastao.mp4"
                  videoMobile="/videos/bastao-mobile.mp4"
                  poster="/images/bastao-poster.webp"
                  label="Bastão de ionização Water Diamond em funcionamento"
                  className="relative aspect-[4/5] w-full"
                />
              </div>
            </Reveal>
          </div>
        </section>

        {/* NÚMEROS + MODELOS */}
        <section className="bg-white px-5 py-24 md:px-10 md:py-36">
          <div className="mx-auto w-full max-w-[1400px]">
            <div className="grid grid-cols-2 gap-y-10 border-y border-border py-12 md:grid-cols-4 md:py-14">
              {specs.map((spec, i) => (
                <Reveal key={spec.label} delay={i * 0.06}>
                  <div className="px-1 md:px-2">
                    <p
                      className="font-medium tracking-[-0.04em] text-primary"
                      style={{ fontSize: "clamp(2rem, 3.4vw, 3.2rem)" }}
                    >
                      {spec.value}
                    </p>
                    <p className="mt-2 max-w-[15ch] text-[13px] font-light leading-6 text-muted-foreground">
                      {spec.label}
                    </p>
                  </div>
                </Reveal>
              ))}
            </div>

            <div className="mt-20 text-center md:mt-28">
              <Reveal>
                <h2
                  className="mx-auto max-w-4xl font-medium tracking-[-0.035em] leading-[1.05]"
                  style={{ fontSize: "clamp(2rem, 4.4vw, 3.6rem)" }}
                >
                  Três modelos.
                  <span className="text-muted-foreground"> O mesmo cuidado com a água.</span>
                </h2>
              </Reveal>

              <Reveal delay={0.06}>
                <p className="mx-auto mt-6 max-w-xl text-base font-light leading-8 text-muted-foreground">
                  Escolha o Ion Center que combina com o espaço, o consumo e a rotina da sua casa.
                </p>
              </Reveal>
            </div>

            <div className="mt-14 grid grid-cols-1 gap-6 text-left min-[560px]:grid-cols-2 lg:grid-cols-3 md:gap-8">
              {models.map((model, i) => (
                <Reveal key={model.name} delay={i * 0.09}>
                  <article className={`group flex h-full flex-col overflow-hidden rounded-[24px] p-3 ${model.tint}`}>
                    <div className="relative overflow-hidden rounded-[16px]">
                      <img
                        src={model.image}
                        srcSet={`${model.image.replace(".webp", "-sm.webp")} 500w, ${model.image} 900w`}
                        sizes="(max-width: 768px) 100vw, 460px"
                        alt={model.alt}
                        loading="lazy"
                        decoding="async"
                        width={900}
                        height={1200}
                        className="aspect-[3/4] w-full object-cover transition-transform duration-700 group-hover:scale-[1.02]"
                      />
                    </div>

                    <div className="flex flex-1 flex-col px-3 pb-4 pt-7">
                      <h3
                        className="font-medium tracking-[-0.03em] leading-none"
                        style={{ fontSize: "clamp(2rem, 3.2vw, 2.8rem)" }}
                      >
                        {model.name}
                      </h3>
                      <p className="mt-4 text-[15px] font-light leading-7 text-muted-foreground">
                        {model.desc}
                      </p>
                    </div>
                  </article>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* CTA FINAL */}
        <section className="relative overflow-hidden bg-navy-900 pt-24 pb-14 text-white md:pt-40 md:pb-20">
          <div className="mx-auto w-full max-w-[1400px] px-5 md:px-10">
            <Reveal>
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-primary-light">
                Encontre o seu Ion Center
              </p>

              <h2
                className="mt-5 max-w-3xl font-medium tracking-[-0.035em] leading-[0.98]"
                style={{ fontSize: "clamp(2.4rem, 6vw, 5rem)" }}
              >
                O cuidado com o seu corpo começa pela água.
              </h2>

              <p className="mt-8 max-w-lg text-lg font-light leading-9 text-white/60">
                Fale com um especialista Waterfall e descubra qual modelo combina com a sua rotina.
              </p>

              <div className="mt-10">
                <CtaButton tone="light" onClick={() => setContactOpen(true)}>
                  Falar com um especialista
                </CtaButton>
              </div>
            </Reveal>

            <div className="mt-20 border-t border-white/10 pt-8 md:mt-28">
              <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                <CoBrand invert />

                <div className="flex items-center gap-3">
                  {socialLinks.map(({ label, href, icon: Icon }) => (
                    <a
                      key={label}
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`Waterfall Company no ${label}`}
                      className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 text-white/50 transition-all duration-300 hover:-translate-y-0.5 hover:border-primary hover:bg-primary hover:text-white"
                    >
                      <Icon size={18} strokeWidth={1.8} />
                    </a>
                  ))}
                </div>
              </div>

              <div className="mt-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div className="flex flex-wrap gap-x-5 gap-y-2 text-xs font-light text-white/50">
                  <button
                    type="button"
                    onClick={() => setContactOpen(true)}
                    className="transition-colors hover:text-white"
                    // A regra global `button` em index.css fica fora de @layer e vence as
                    // utilities do Tailwind. Inline é o único jeito de igualar aos links ao lado.
                    style={{ textTransform: "none", letterSpacing: "normal" }}
                  >
                    Contato
                  </button>
                  <a href="/politica-de-privacidade" className="transition-colors hover:text-white">
                    Política de Privacidade
                  </a>
                  <a href="/termos-de-uso" className="transition-colors hover:text-white">
                    Termos de Uso
                  </a>
                </div>

                <p className="text-xs font-light text-white/35">
                  Waterfall + Fit Academia · Joinville, SC
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* CTA fixo no mobile. Em página de QR code isso não é opcional. */}
      <div className="fixed inset-x-0 bottom-0 z-40 px-4 pb-4 pt-10 md:hidden bg-gradient-to-t from-black/55 to-transparent">
        <CtaButton className="w-full" onClick={() => setContactOpen(true)}>
          Falar com um especialista
        </CtaButton>
      </div>
      <div className="h-24 md:hidden" />

      <AnimatePresence>
        {contactOpen && <FitContactModal isOpen={contactOpen} onClose={() => setContactOpen(false)} />}
      </AnimatePresence>
    </div>
  );
}
