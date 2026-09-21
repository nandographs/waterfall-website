import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import {
  ArrowRight,
  BedDouble,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  CircleDashed,
  Layers3,
  MessageCircle,
  MoonStar,
  PackageOpen,
  RotateCcw,
  SlidersHorizontal,
  Sparkles,
  Timer,
  Waves,
} from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { whatsappLink } from "@/lib/forms";
import "./bionlife.css";

const CONSULTANT_URL = whatsappLink(
  "Olá! Vim pelo site da BionLife e quero ajuda para escolher o colchão ideal.",
);

const PAGE_TITLE = "BionLife | Conforto, bem-estar e tecnologia para o seu descanso";
const PAGE_DESCRIPTION =
  "Colchões BionLife desenvolvidos para diferentes formas de descansar, com ionização, conforto em camadas e recursos de bem-estar.";

const navItems = [
  { label: "Bem-estar", href: "#bem-estar" },
  { label: "Tecnologia", href: "#tecnologia" },
  { label: "Modelos", href: "#modelos" },
  { label: "Dúvidas", href: "#duvidas" },
];

const lines = [
  {
    name: "Especiais",
    headline: "A experiência mais completa BionLife.",
    description: [
      "A linha que reúne construções mais sofisticadas e a maior combinação de recursos da marca.",
      "Conforto em camadas, ionização e diferentes tecnologias trabalham juntas para criar uma experiência de descanso mais completa.",
      "Para quem procura o que a BionLife tem de melhor.",
    ],
    image: "/images/bionlife-elite.webp",
    imageSm: "/images/bionlife-elite-sm.webp",
    specs: [
      ["Sensação", "completa e sofisticada"],
      ["Perfil", "premium"],
      ["Recursos", "variam conforme o modelo"],
    ],
  },
  {
    name: "Relax",
    headline: "Um colchão que recebe o corpo com mais suavidade.",
    description: [
      "A linha Relax prioriza uma experiência mais macia e acolhedora.",
      "A superfície cede com suavidade ao contato, criando aquela sensação confortável de finalmente deitar depois de um dia longo.",
    ],
    image: "/images/bionlife-sense-pro.webp",
    imageSm: "/images/bionlife-sense-pro-sm.webp",
    specs: [
      ["Sensação", "macia e acolhedora"],
      ["Perfil", "conforto e relaxamento"],
      ["Tecnologia", "ionização integrada"],
    ],
  },
  {
    name: "A Vácuo",
    headline: "Maciez que acompanha o corpo.",
    description: [
      "Uma experiência confortável e envolvente para quem prefere superfícies mais macias.",
      "A construção compactada facilita o transporte e recupera gradualmente sua forma depois da abertura, mantendo a proposta de conforto BionLife dentro de uma solução prática para o dia a dia.",
    ],
    image: "/images/bionlife-dream.webp",
    imageSm: "/images/bionlife-dream-sm.webp",
    specs: [
      ["Sensação", "macia e adaptável"],
      ["Perfil", "conforto e praticidade"],
      ["Tecnologia", "ionização integrada"],
    ],
  },
  {
    name: "Magnético",
    headline: "Para quem encontra conforto em uma superfície mais firme.",
    description: [
      "A linha Magnético oferece uma sensação de maior presença e sustentação sob o corpo.",
      "Uma construção mais firme combinada à ionização e aos recursos magnéticos presentes na linha.",
    ],
    image: "/images/bionlife-benefits.webp",
    imageSm: "/images/bionlife-benefits-sm.webp",
    specs: [
      ["Sensação", "firme e estruturada"],
      ["Perfil", "sustentação"],
      ["Tecnologias", "ionização + recursos magnéticos"],
    ],
  },
];

const faqs = [
  {
    question: "Todos os colchões BionLife possuem ionização?",
    answer:
      "A ionização faz parte da proposta tecnológica da BionLife. A configuração e os demais recursos presentes no colchão variam conforme a linha e o modelo.",
  },
  {
    question: "Qual linha BionLife é mais macia?",
    answer: "As linhas Relax e A Vácuo possuem uma proposta de conforto mais macia e acolhedora.",
  },
  {
    question: "Qual linha possui uma sensação mais firme?",
    answer: "A linha Magnético possui uma proposta de maior firmeza e sustentação.",
  },
  {
    question: "Qual é a linha mais completa?",
    answer:
      "A linha Especiais reúne as construções e combinações de recursos mais completas da BionLife.",
  },
  {
    question: "Todos os colchões possuem massagem?",
    answer: "Não. Os sistemas de massagem estão disponíveis em modelos e configurações específicas.",
  },
  {
    question: "Qual é a diferença entre Life Vibro e Cromos LCD?",
    answer:
      "O Life Vibro possui 8 tipos de massagem e programação de até 15 minutos. O Cromos LCD oferece 20 tipos, 5 níveis de intensidade, programação de até 50 minutos e cromoterapia nas versões compatíveis.",
  },
  {
    question: "O que significa densidade progressiva?",
    answer:
      "É a combinação de espumas com densidades diferentes dentro do mesmo colchão. Cada camada contribui de uma forma para a sensação de conforto, adaptação e sustentação.",
  },
  {
    question: "Quanto tempo um colchão a vácuo leva para expandir?",
    answer:
      "A expansão começa após a abertura e pode levar até 72 horas para ser concluída. As orientações que acompanham o produto devem ser seguidas durante o processo.",
  },
  {
    question: "Tecnologias como ionização e magnetismo substituem cuidados de saúde?",
    answer:
      "Não. Esses recursos fazem parte da proposta de conforto e bem-estar dos colchões BionLife e não substituem diagnóstico, tratamento ou acompanhamento profissional de saúde.",
  },
];

const revealTransition = {
  duration: 0.72,
  ease: [0.16, 1, 0.3, 1] as const,
};

function Reveal({
  children,
  className = "",
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  key?: React.Key;
}) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      className={className}
      initial={reduceMotion ? false : { opacity: 0, y: 24 }}
      whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ ...revealTransition, delay }}
    >
      {children}
    </motion.div>
  );
}

function Wordmark({ light = false }: { light?: boolean }) {
  return (
    <a
      href="#inicio"
      aria-label="BionLife — voltar ao início"
      className="inline-flex shrink-0 items-center"
    >
      <img
        src="/images/LOGO_BIONLIFE.svg"
        alt=""
        width={600}
        height={144}
        aria-hidden="true"
        className={`h-auto w-[132px] sm:w-[146px] ${light ? "brightness-0 invert" : ""}`}
      />
    </a>
  );
}

function ResponsiveImage({
  src,
  srcSm,
  alt,
  className = "",
  priority = false,
  width = 1448,
  height = 1086,
  sizes = "(max-width: 768px) 100vw, 55vw",
}: {
  src: string;
  srcSm: string;
  alt: string;
  className?: string;
  priority?: boolean;
  width?: number;
  height?: number;
  sizes?: string;
}) {
  return (
    <img
      src={src}
      srcSet={`${srcSm} 800w, ${src} ${width}w`}
      sizes={sizes}
      alt={alt}
      width={width}
      height={height}
      loading={priority ? "eager" : "lazy"}
      fetchPriority={priority ? "high" : "auto"}
      decoding="async"
      className={className}
    />
  );
}

function PrimaryLink({
  children,
  href,
  light = false,
  onClick,
}: {
  children: React.ReactNode;
  href: string;
  light?: boolean;
  onClick?: React.MouseEventHandler<HTMLAnchorElement>;
}) {
  return (
    <a
      href={href}
      onClick={onClick}
      target={href.startsWith("http") ? "_blank" : undefined}
      rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
      className={`bl-button bl-button-primary ${light ? "bl-button-light" : ""}`}
    >
      <span>{children}</span>
      <ArrowRight size={16} strokeWidth={1.7} />
    </a>
  );
}

function SecondaryLink({
  children,
  href,
  light = false,
}: {
  children: React.ReactNode;
  href: string;
  light?: boolean;
}) {
  return (
    <a
      href={href}
      target={href.startsWith("http") ? "_blank" : undefined}
      rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
      className={`bl-button bl-button-secondary ${light ? "bl-button-secondary-light" : ""}`}
    >
      {children}
    </a>
  );
}

export default function BionLifePage() {
  const [scrolled, setScrolled] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const modelTrackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const previousTitle = document.title;
    const previousBodyClass = document.body.className;
    const metaUpdates = [
      ['meta[name="description"]', PAGE_DESCRIPTION],
      ['meta[name="keywords"]', "bionlife, colchão ionizado, colchão com massagem, colchão magnético, colchão para bem-estar, colchão tecnológico"],
      ['meta[property="og:title"]', PAGE_TITLE],
      ['meta[property="og:description"]', PAGE_DESCRIPTION],
      ['meta[property="og:site_name"]', "BionLife"],
      ['meta[property="og:image"]', `${window.location.origin}/images/bionlife-hero.webp`],
      ['meta[name="theme-color"]', "#111411"],
    ] as const;
    const previousMeta = metaUpdates.map(([selector, value]) => {
      const element = document.querySelector<HTMLMetaElement>(selector);
      const oldContent = element?.content ?? "";
      if (element) element.content = value;
      return [element, oldContent] as const;
    });

    document.title = PAGE_TITLE;
    document.body.classList.add("bionlife-active");

    return () => {
      document.title = previousTitle;
      document.body.className = previousBodyClass;
      previousMeta.forEach(([element, content]) => {
        if (element) element.content = content;
      });
    };
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollModels = (direction: number) => {
    const track = modelTrackRef.current;
    if (!track) return;
    track.scrollBy({ left: direction * track.clientWidth * 0.82, behavior: "smooth" });
  };

  return (
    <div className="bionlife-page min-h-screen">
      <header className={`bl-header ${scrolled ? "is-solid" : "is-over"}`}>
        <Wordmark light={!scrolled} />

        <nav aria-label="Navegação principal" className="hidden items-center gap-8 lg:flex">
          {navItems.map((item) => (
            <a key={item.href} href={item.href} className="bl-nav-link">
              {item.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <a
            href={CONSULTANT_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="bl-header-cta inline-flex whitespace-nowrap"
          >
            Encontrar meu BionLife
            <ArrowRight size={15} className="hidden sm:block" />
          </a>
        </div>
      </header>

      <div className="bl-shell">
        <main>
          <section id="inicio" className="bl-hero">
            <div className="bl-hero-bg">
              <picture>
                <source
                  media="(max-width: 767px)"
                  srcSet="/images/herobionlife_mobile.jpg"
                  width={1080}
                  height={1920}
                />
                <img
                  src="/images/herobionlife.jpg"
                  alt="Colchão BionLife em um quarto contemporâneo"
                  width={2560}
                  height={1440}
                  loading="eager"
                  fetchPriority="high"
                  decoding="async"
                  className="bl-hero-img"
                />
              </picture>
              <div className="bl-hero-scrim" aria-hidden="true" />
            </div>

            <div className="bl-hero-inner">
              <div className="bl-hero-lead">
                <motion.h1
                  initial={{ opacity: 0, y: 22 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ ...revealTransition, delay: 0.08 }}
                  className="bl-display bl-hero-title"
                >
                  Seu corpo sente onde descansa.
                </motion.h1>

                <motion.div
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ ...revealTransition, delay: 0.2 }}
                  className="bl-hero-actions"
                >
                  <PrimaryLink href="#modelos" light>
                    Conhecer os modelos
                  </PrimaryLink>
                </motion.div>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ ...revealTransition, delay: 0.32 }}
                className="bl-hero-stats"
              >
                {[
                  { icon: Sparkles, value: "Ionização integrada", label: "Presente na experiência BionLife." },
                  { icon: Waves, value: "Conforto para cada corpo", label: "Do mais macio ao mais firme." },
                  {
                    icon: CircleDashed,
                    value: "Recursos de bem-estar",
                    label: "Tecnologias que complementam o seu momento de descanso.",
                  },
                ].map(({ icon: Icon, value, label }) => (
                  <div key={value} className="bl-hero-stat">
                    <Icon size={17} strokeWidth={1.5} />
                    <strong>{value}</strong>
                    <span>{label}</span>
                  </div>
                ))}
                <p className="bl-hero-note">Os recursos variam conforme a linha e o modelo.</p>
              </motion.div>
            </div>
          </section>

          <section id="bem-estar" className="bl-section scroll-mt-24">
            <Reveal className="text-center">
              <h2 className="bl-section-title mx-auto max-w-[26ch]">
                O descanso começa na forma como o colchão recebe o corpo.
              </h2>
              <p className="mx-auto mt-6 max-w-[84rem] text-sm font-light leading-7 text-[#5d605a] 2xl:text-[0.95rem]">
                Quando você deita, o peso muda de lugar. Ombros, quadril, costas e pernas encontram
                novos pontos de contato e apoio. É aí que a sensação do colchão realmente importa. A
                BionLife combina diferentes construções, níveis de firmeza e materiais para criar
                experiências que acompanham diferentes formas de dormir.
              </p>
            </Reveal>

            <Reveal className="bl-feature-image bl-feature-image-wide mt-12">
              <img
                src="/images/bionlife02.jpg"
                alt="Família abraçada sobre um colchão BionLife"
                width={1920}
                height={1080}
                loading="lazy"
                decoding="async"
                className="h-full w-full object-cover"
              />
            </Reveal>

            <div className="mt-4">
              <div className="grid gap-4 lg:grid-cols-3">
                {[
                  {
                    icon: Layers3,
                    title: "Mais conforto onde o corpo encontra o colchão.",
                    copy:
                      "Camadas com diferentes respostas ajudam a criar uma superfície mais agradável ao contato e uma sustentação consistente ao longo da noite.",
                  },
                  {
                    icon: RotateCcw,
                    title: "Um colchão que acompanha seus movimentos.",
                    copy:
                      "Espumas de alta resiliência respondem às mudanças de posição e recuperam sua forma com rapidez.",
                  },
                  {
                    icon: Sparkles,
                    title: "Recursos para tornar o descanso mais completo.",
                    copy:
                      "Ionização, massagem e outras tecnologias aparecem de formas diferentes entre as linhas BionLife, complementando a experiência de conforto e bem-estar.",
                  },
                ].map(({ icon: Icon, title, copy }, index) => (
                  <Reveal key={title} delay={index * 0.06} className="bl-dark-feature">
                    <div className="bl-dark-feature-icon">
                      <Icon size={22} strokeWidth={1.45} />
                    </div>
                    <div>
                      <h3>{title}</h3>
                      <p>{copy}</p>
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>
          </section>

          <section id="tecnologia" className="bl-section scroll-mt-24 pt-0">
            <div className="bl-technology-panel">
              <Reveal className="order-2 lg:order-1">
                <ResponsiveImage
                  src="/images/bionlife-layers.webp"
                  srcSm="/images/bionlife-layers-sm.webp"
                  alt="Representação das camadas de espuma do colchão"
                  className="h-full min-h-[360px] w-full object-contain p-4 md:min-h-[520px] md:p-8"
                />
              </Reveal>

              <Reveal className="order-1 flex flex-col justify-center lg:order-2">
                <h2 className="bl-section-title max-w-[18ch]">
                  A sensação que você percebe começa por dentro.
                </h2>
                <div className="mt-6 max-w-xl space-y-4 text-base font-light leading-8 text-[#5d605a]">
                  <p>
                    Um colchão pode parecer simples por fora. Por dentro, cada camada interfere na
                    maneira como o corpo sente a superfície.
                  </p>
                  <p>
                    A BionLife combina espumas com características diferentes para trabalhar conforto,
                    adaptação e sustentação dentro de uma mesma construção.
                  </p>
                </div>

                <div className="mt-9 divide-y divide-black/10 border-y border-black/10">
                  {[
                    {
                      icon: Layers3,
                      title: "Densidade progressiva",
                      copy: "Diferentes densidades cumprem funções diferentes dentro do colchão, criando uma transição mais equilibrada entre contato e suporte.",
                    },
                    {
                      icon: RotateCcw,
                      title: "Espumas HR",
                      copy: "Materiais de alta resiliência respondem à pressão e recuperam rapidamente sua forma depois de cada movimento.",
                    },
                    {
                      icon: BedDouble,
                      title: "Estrutura 100% espuma",
                      copy: "Uma construção uniforme, desenvolvida para distribuir o suporte por toda a superfície do colchão.",
                    },
                  ].map(({ icon: Icon, title, copy }) => (
                    <div key={title} className="grid grid-cols-[44px_1fr] gap-4 py-5">
                      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-[#171915] shadow-sm">
                        <Icon size={20} strokeWidth={1.45} />
                      </div>
                      <div>
                        <h3 className="text-base font-medium tracking-[-0.02em]">{title}</h3>
                        <p className="mt-1 text-sm font-light leading-6 text-[#696c66]">{copy}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </Reveal>
            </div>
          </section>

          <section id="ionizacao" className="bl-section scroll-mt-24 pt-0">
            <Reveal className="grid gap-8 lg:grid-cols-[0.86fr_1.14fr] lg:items-start">
              <h2 className="bl-section-title max-w-[16ch]">
                Uma tecnologia presente em toda a experiência BionLife.
              </h2>
              <div className="max-w-[58ch] space-y-5 text-base font-light leading-8 text-[#5d605a] lg:justify-self-end lg:text-lg">
                <p>A ionização faz parte da identidade dos colchões BionLife.</p>
                <p>
                  Integrada à construção, ela complementa uma proposta que une conforto, tecnologia e
                  bem-estar em um produto pensado para acompanhar o corpo durante horas de descanso.
                </p>
                <p>
                  Não aparece como um recurso separado da experiência.
                  <br />
                  Está ali, junto das camadas, dos materiais e das características de cada colchão.
                </p>
              </div>
            </Reveal>

            <Reveal className="bl-dark-feature mt-12 lg:ml-auto lg:max-w-[calc(57%-1rem)]">
              <div className="bl-dark-feature-icon">
                <Sparkles size={22} strokeWidth={1.45} />
              </div>
              <div>
                <h3>Tecnologia incorporada ao descanso.</h3>
                <p>
                  Cada linha BionLife combina a ionização com uma experiência diferente de conforto,
                  das opções mais macias e acolhedoras às construções de maior firmeza e sustentação.
                </p>
              </div>
            </Reveal>
          </section>

          <section id="massagem" className="bl-massage scroll-mt-24">
            <div className="bl-massage-media">
              <ResponsiveImage
                src="/images/bionlife-elite.webp"
                srcSm="/images/bionlife-elite-sm.webp"
                alt="Colchão BionLife Elite em um quarto sofisticado"
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-[#111310]/75 lg:bg-gradient-to-t" />
            </div>

            <div className="bl-massage-copy">
              <Reveal>
                <h2 className="bl-section-title max-w-[16ch] text-white">
                  Tem dias em que o corpo pede alguns minutos a mais.
                </h2>
                <div className="mt-6 max-w-xl space-y-4 text-base font-light leading-8 text-white/62">
                  <p>
                    Nos modelos equipados com sistema de massagem, o próprio colchão pode fazer parte
                    daquele momento entre chegar ao quarto e finalmente dormir.
                  </p>
                  <p>
                    Escolha o modo, ajuste a intensidade e programe o tempo de acordo com o que estiver
                    buscando naquele momento.
                  </p>
                </div>
              </Reveal>

              <div className="mt-10 grid gap-4">
                <Reveal className="bl-control-card">
                  <div className="flex items-start justify-between gap-6">
                    <div>
                      <h3>Life Vibro</h3>
                      <p>
                        Uma experiência direta para quem quer deitar, ativar e aproveitar alguns
                        minutos de relaxamento.
                      </p>
                    </div>
                    <Timer className="shrink-0 text-[#d8ff74]" size={24} strokeWidth={1.4} />
                  </div>
                  <div className="mt-5 flex flex-wrap gap-2">
                    <span>8 tipos de massagem</span>
                    <span>Até 15 minutos</span>
                  </div>
                </Reveal>

                <Reveal delay={0.08} className="bl-control-card bl-control-card-accent">
                  <div className="flex items-start justify-between gap-6">
                    <div>
                      <h3>Cromos LCD</h3>
                      <p>
                        Seis motores e diferentes possibilidades de configuração para personalizar a
                        experiência. Nas versões compatíveis, o sistema também incorpora cromoterapia.
                      </p>
                    </div>
                    <SlidersHorizontal className="shrink-0" size={24} strokeWidth={1.4} />
                  </div>
                  <div className="mt-5 flex flex-wrap gap-2">
                    <span>20 tipos de massagem</span>
                    <span>5 intensidades</span>
                    <span>Até 50 minutos</span>
                  </div>
                </Reveal>
              </div>

              <Reveal className="mt-8">
                <PrimaryLink href="#modelos" light>
                  Conhecer modelos com massagem
                </PrimaryLink>
                <p className="mt-5 max-w-xl text-xs font-light leading-5 text-white/42">
                  Controles e funções variam conforme o modelo e a configuração.
                </p>
              </Reveal>
            </div>
          </section>

          <section id="modelos" className="bl-catalog scroll-mt-24">
            <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
              <Reveal>
                <h2 className="bl-section-title max-w-[17ch]">
                  Diferentes corpos procuram diferentes formas de conforto.
                </h2>
                <div className="mt-6 max-w-xl space-y-4 text-base font-light leading-8 text-[#5d605a]">
                  <p>
                    Tem gente que gosta de sentir o colchão envolver o corpo.
                    <br />
                    Tem quem prefira uma superfície mais firme e presente.
                    <br />
                    E tem quem queira reunir o máximo de recursos em uma experiência mais completa.
                  </p>
                  <p>Por isso, a BionLife trabalha com diferentes linhas de descanso.</p>
                </div>
              </Reveal>
              <Reveal className="flex items-center gap-3">
                <button
                  type="button"
                  aria-label="Ver linha anterior"
                  className="bl-round-button"
                  onClick={() => scrollModels(-1)}
                >
                  <ChevronLeft size={20} />
                </button>
                <button
                  type="button"
                  aria-label="Ver próxima linha"
                  className="bl-round-button"
                  onClick={() => scrollModels(1)}
                >
                  <ChevronRight size={20} />
                </button>
              </Reveal>
            </div>

            <div ref={modelTrackRef} className="bl-model-track mt-12">
              {lines.map((line, index) => (
                <Reveal key={line.name} delay={index * 0.08} className="bl-model-card">
                  <div className="bl-model-image">
                    <ResponsiveImage
                      src={line.image}
                      srcSm={line.imageSm}
                      alt={`Colchão da linha BionLife ${line.name} em um quarto contemporâneo`}
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.025]"
                    />
                  </div>
                  <div className="flex flex-1 flex-col p-6 md:p-7">
                    <div className="flex items-start justify-between gap-5">
                      <div>
                        <h3 className="text-[1.65rem] font-medium leading-none tracking-[-0.045em]">
                          {line.name}
                        </h3>
                        <p className="mt-3 text-sm font-medium text-[#555851]">{line.headline}</p>
                      </div>
                      <span className="pt-1 text-[0.68rem] font-medium tracking-[0.12em] text-[#8a8d86]">
                        0{index + 1}
                      </span>
                    </div>
                    <div className="mt-5 space-y-3 text-sm font-light leading-6 text-[#6c6f69]">
                      {line.description.map((paragraph) => (
                        <p key={paragraph}>{paragraph}</p>
                      ))}
                    </div>
                    <dl className="mb-6 mt-6 divide-y divide-black/10 border-t border-black/10">
                      {line.specs.map(([label, value]) => (
                        <div key={label} className="flex items-baseline justify-between gap-4 py-3 text-[0.8rem] leading-5">
                          <dt className="font-medium">{label}</dt>
                          <dd className="text-right font-light text-[#6c6f69]">{value}</dd>
                        </div>
                      ))}
                    </dl>
                    <a
                      href={CONSULTANT_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-auto flex items-center justify-between border-t border-black/10 pt-6 text-sm font-medium transition-colors hover:text-[#586f19]"
                    >
                      Conhecer a linha {line.name}
                      <ArrowRight size={17} />
                    </a>
                  </div>
                </Reveal>
              ))}
            </div>
          </section>

          <section className="bl-section">
            <div className="bl-guidance-panel">
              <Reveal className="max-w-3xl">
                <h2 className="bl-section-title max-w-[18ch]">
                  Gostar de um colchão começa por saber como você gosta de deitar.
                </h2>
                <div className="mt-6 max-w-2xl space-y-4 text-base font-light leading-8 text-[#60635d] md:text-lg">
                  <p>
                    Maciez ou firmeza.
                    <br />
                    Mais acolhimento ou uma superfície mais estruturada.
                    <br />
                    Recursos adicionais ou uma experiência mais simples.
                  </p>
                  <p>
                    Essas diferenças importam muito mais na escolha do que apenas a medida do colchão.
                  </p>
                  <p>
                    Um consultor BionLife ajuda você a entender as linhas e encontrar uma experiência
                    mais próxima daquilo que procura.
                  </p>
                </div>
                <div className="mt-8">
                  <PrimaryLink href={CONSULTANT_URL}>Encontrar meu BionLife</PrimaryLink>
                </div>
              </Reveal>

              <Reveal delay={0.08} className="bl-guidance-steps">
                {[
                  {
                    number: "01",
                    icon: MessageCircle,
                    title: "Conte como você gosta de dormir",
                    copy: "Sua preferência de firmeza, posição de dormir e a sensação que procura ao deitar.",
                  },
                  {
                    number: "02",
                    icon: BedDouble,
                    title: "Conheça as diferenças",
                    copy: "Compare linhas, construções e recursos disponíveis.",
                  },
                  {
                    number: "03",
                    icon: MoonStar,
                    title: "Encontre o seu BionLife",
                    copy: "Escolha com mais clareza qual experiência combina melhor com você.",
                  },
                ].map(({ number, icon: Icon, title, copy }) => (
                  <div key={number} className="bl-guidance-step">
                    <span>{number}</span>
                    <div className="bl-guidance-step-icon">
                      <Icon size={20} strokeWidth={1.45} />
                    </div>
                    <div>
                      <h3>{title}</h3>
                      <p>{copy}</p>
                    </div>
                  </div>
                ))}
              </Reveal>
            </div>
          </section>

          <section className="px-5 pb-5 md:px-8 md:pb-8">
            <Reveal className="bl-delivery">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#111310] text-white">
                <PackageOpen size={23} strokeWidth={1.45} />
              </div>
              <div className="max-w-3xl">
                <h2 className="text-2xl font-medium tracking-[-0.04em] md:text-3xl">
                  Do transporte ao quarto com mais facilidade.
                </h2>
                <p className="mt-3 text-sm font-light leading-7 text-[#62655f] md:text-base">
                  Os modelos BionLife produzidos com embalagem a vácuo são compactados para ocupar menos
                  espaço durante o transporte. Depois da abertura, o colchão recupera gradualmente sua
                  forma e altura.
                </p>
                <p className="mt-3 text-sm font-medium">
                  Mais simples de transportar. Pronto para fazer parte da sua rotina.
                </p>
              </div>
            </Reveal>
          </section>

          <section id="duvidas" className="bl-section scroll-mt-24">
            <div className="grid gap-12 lg:grid-cols-[0.7fr_1.3fr] lg:gap-24">
              <Reveal>
                <h2 className="bl-section-title max-w-[14ch]">
                  Antes de escolher, vale entender o que você vai sentir.
                </h2>
              </Reveal>

              <div className="border-t border-black/12">
                {faqs.map((faq, index) => {
                  const isOpen = openFaq === index;
                  return (
                    <Reveal key={faq.question} delay={Math.min(index * 0.035, 0.15)}>
                      <div className="border-b border-black/12">
                        <button
                          type="button"
                          className="flex w-full items-center justify-between gap-6 py-6 text-left"
                          aria-expanded={isOpen}
                          onClick={() => setOpenFaq(isOpen ? null : index)}
                        >
                          <span className="text-base font-medium leading-6 tracking-[-0.02em] md:text-lg">
                            {faq.question}
                          </span>
                          <motion.span
                            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-black/12"
                            animate={{ rotate: isOpen ? 180 : 0 }}
                            transition={{ duration: 0.24 }}
                          >
                            <ChevronDown size={17} />
                          </motion.span>
                        </button>
                        <AnimatePresence initial={false}>
                          {isOpen ? (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                              className="overflow-hidden"
                            >
                              <p className="max-w-2xl pb-6 pr-12 text-sm font-light leading-7 text-[#62655f] md:text-base">
                                {faq.answer}
                              </p>
                            </motion.div>
                          ) : null}
                        </AnimatePresence>
                      </div>
                    </Reveal>
                  );
                })}
              </div>
            </div>
          </section>

          <section className="bl-final-cta">
            <div className="bl-final-image">
              <ResponsiveImage
                src="/images/bionlife-hero.webp"
                srcSm="/images/bionlife-hero-sm.webp"
                alt=""
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-[#111310] via-[#111310]/92 to-[#111310]/30" />
            </div>
            <Reveal className="relative z-10 max-w-3xl">
              <Sparkles size={24} strokeWidth={1.35} className="mb-8 text-[#d8ff74]" />
              <h2 className="bl-section-title max-w-[17ch] text-white">
                Você passa horas da sua vida aqui.
              </h2>
              <div className="mt-6 max-w-2xl space-y-4 text-base font-light leading-8 text-white/64 md:text-lg">
                <p>Vale escolher um colchão pensando em algo além do tamanho da cama.</p>
                <p>
                  Na forma como o corpo é recebido.
                  <br />
                  Na sensação que você prefere.
                  <br />
                  Nos recursos que fazem sentido para a sua rotina.
                </p>
                <p>
                  Conheça as linhas BionLife e encontre uma experiência de descanso que combine melhor
                  com você.
                </p>
              </div>
              <div className="mt-9 flex flex-wrap gap-3">
                <PrimaryLink href={CONSULTANT_URL} light>
                  Encontrar meu BionLife
                </PrimaryLink>
                <SecondaryLink href="#modelos" light>
                  Conhecer as linhas
                </SecondaryLink>
              </div>
            </Reveal>
          </section>
        </main>

        <footer className="bl-footer">
          <div className="grid gap-12 border-b border-white/10 pb-12 md:grid-cols-[1fr_auto] md:items-end">
            <div>
              <Wordmark light />
              <p className="mt-6 max-w-md text-sm font-light leading-7 text-white/50">
                Colchões desenvolvidos em torno do conforto, do corpo e da experiência de descansar.
              </p>
            </div>
            <nav aria-label="Navegação do rodapé" className="flex max-w-xl flex-wrap gap-x-6 gap-y-3 text-sm text-white/60">
              {navItems.map((item) => (
                <a key={item.href} href={item.href} className="transition-colors hover:text-white">
                  {item.label}
                </a>
              ))}
              <a href={CONSULTANT_URL} target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-white">
                Fale conosco
              </a>
              <a href="/politica-de-privacidade" className="transition-colors hover:text-white">
                Política de privacidade
              </a>
            </nav>
          </div>
          <div className="flex flex-col gap-3 pt-7 text-xs font-light text-white/36 sm:flex-row sm:items-center sm:justify-between">
            <p>© {new Date().getFullYear()} BionLife. Todos os direitos reservados.</p>
          </div>
        </footer>
      </div>
    </div>
  );
}
