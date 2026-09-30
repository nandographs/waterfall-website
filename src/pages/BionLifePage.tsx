import { ArrowRight, Menu, Plus, X } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { whatsappLink } from "@/lib/forms";
import "./bionlife.css";

const CONSULTANT_URL = whatsappLink(
  "Olá! Vim pelo site da BionLife e quero ajuda para escolher o colchão ideal.",
);
const PAGE_TITLE = "BionLife | Conforto, bem-estar e tecnologia para o seu descanso";
const PAGE_DESCRIPTION = "Conheça as linhas de colchões BionLife. Diferentes sensações de conforto, tecnologia em camadas e ajuda para escolher o seu.";

const navItems = [
  { label: "Colchões", href: "#modelos" },
  { label: "Conforto", href: "#bem-estar" },
  { label: "Tecnologia", href: "#tecnologia" },
  { label: "Dúvidas", href: "#duvidas" },
];

const lines = [
  {
    name: "Especiais",
    swatch: "var(--bl-swatch-1)",
    feel: "Completo e sofisticado",
    description: "Construções sofisticadas e a combinação mais completa de recursos da marca.",
    image: "elite",
    cardImage: "/images/colchoesespeciais.jpg",
  },
  {
    name: "Relax",
    swatch: "var(--bl-swatch-2)",
    feel: "Macio e acolhedor",
    description: "Uma superfície que recebe o corpo com suavidade, do primeiro contato ao descanso.",
    image: "sense-pro",
    cardImage: "/images/colchoesrelax.jpg",
  },
  {
    name: "A Vácuo",
    swatch: "var(--bl-swatch-3)",
    feel: "Macio e adaptável",
    description: "Conforto que acompanha o corpo, em uma embalagem prática para transportar.",
    image: "dream",
    cardImage: "/images/colchoesvacuo.jpg",
  },
  {
    name: "Magnético",
    swatch: "var(--bl-swatch-4)",
    feel: "Firme e estruturado",
    description: "Mais firmeza e sustentação, com ionização e recursos magnéticos na construção.",
    image: "benefits",
    cardImage: "/images/colchoesmagnetico02.jpg",
  },
];

const faqs = [
  {
    question: "Todos os colchões têm ionização?",
    answer: "A ionização faz parte da proposta BionLife. Os outros recursos mudam conforme a linha e o modelo.",
  },
  {
    question: "Qual linha é mais macia?",
    answer: "As linhas Relax e A Vácuo.",
  },
  {
    question: "Qual linha é mais firme?",
    answer: "A linha Magnético.",
  },
  {
    question: "Qual é a linha mais completa?",
    answer: "A linha Especiais, que reúne o maior número de recursos da marca.",
  },
  {
    question: "Todos os colchões têm massagem?",
    answer: "Não. A massagem está em modelos e configurações específicas.",
  },
  {
    question: "Qual é a diferença entre Life Vibro e Cromos LCD?",
    answer: "O Life Vibro tem 8 tipos de massagem e até 15 minutos. O Cromos LCD tem 20 tipos, 5 intensidades e até 50 minutos.",
  },
  {
    question: "O que são as camadas do colchão?",
    answer: "São espumas diferentes na mesma construção: as de cima acolhem o corpo, as de baixo sustentam.",
  },
  {
    question: "Quanto tempo o colchão a vácuo leva para expandir?",
    answer: "Até 72 horas depois de abrir. Siga as orientações que vêm com o produto.",
  },
  {
    question: "A ionização e os recursos magnéticos substituem cuidados de saúde?",
    answer: "Não. São recursos de conforto e bem-estar, e não substituem orientação de um profissional de saúde.",
  },
];

function Wordmark() {
  return (
    <a href="#inicio" className="bl-wordmark" aria-label="BionLife — voltar ao início">
      <img src="/images/LOGO_BIONLIFE.svg" alt="BionLife" width={600} height={144} />
    </a>
  );
}
// Odômetro: cada dígito sobe até o seu número quando entra na tela.
// Os rolos ficam sempre no DOM do React, então o número nunca some num novo render.
function Odometer({ value }: { value: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || !("IntersectionObserver" in window)) {
      setShown(true);
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setShown(true);
        observer.disconnect();
      },
      { threshold: 0.35 },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return (
    <span ref={ref} className="bl-odometer">
      <span className="bl-sr-only">{value}</span>
      {String(value).split("").map((digit, index) => (
        <span className="bl-digit" key={index} aria-hidden="true">
          <span
            className="bl-reel"
            style={{
              transform: shown ? `translateY(${-Number(digit) * 10}%)` : undefined,
              transitionDelay: `${140 + index * 110}ms`,
            }}
          >
            {Array.from({ length: 10 }, (_, n) => <span key={n}>{n}</span>)}
          </span>
        </span>
      ))}
    </span>
  );
}

// Massagem: as fotos das quatro linhas se revezam, com troca suave.
function LineSlideshow() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = window.setInterval(() => setActive((index) => (index + 1) % lines.length), 3800);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <div className="bl-massage-image bl-slideshow">
      {lines.map((line, index) => (
        <img
          key={line.name}
          className={index === active ? "is-active" : undefined}
          src={line.cardImage}
          alt={index === active ? `Colchão da linha BionLife ${line.name} em um quarto` : ""}
          aria-hidden={index !== active}
          width={1080}
          height={1440}
          loading="lazy"
          decoding="async"
        />
      ))}
    </div>
  );
}

export default function BionLifePage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const technologyRef = useRef<HTMLElement>(null);
  const layersVideoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const section = technologyRef.current;
    const video = layersVideoRef.current;
    if (!section || !video) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let animationFrame = 0;
    let lastTimestamp = 0;

    // O avanço acompanha toda a rolagem da seção: começa quando ela entra na tela
    // e termina quando ela está saindo, em vez de se concentrar nos primeiros pixels.
    const targetTimeForScroll = () => {
      const bounds = section.getBoundingClientRect();
      const videoBounds = video.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      // A animação termina antes do fim da seção, com folga maior no celular.
      const finishFraction = window.innerWidth < 768 ? 0.45 : 0.55;

      // Enquanto o vídeo rola junto com a página, o avanço segue a travessia dele pela tela.
      const crossing = (viewportHeight + videoBounds.height) * finishFraction;
      const crossingProgress = (viewportHeight * 0.95 - videoBounds.top) / crossing;

      // Quando o vídeo fica preso na tela, a posição dele não muda: aí vale a rolagem da seção.
      const sectionStart = viewportHeight * 0.2;
      const sectionSpan =
        sectionStart + Math.max(1, bounds.height - videoBounds.height) * finishFraction;
      const sectionProgress = (sectionStart - bounds.top) / sectionSpan;

      const progress = Math.min(1, Math.max(0, Math.max(crossingProgress, sectionProgress)));
      return Math.min(video.duration - 0.04, progress * video.duration);
    };

    const updateVideoFrame = (timestamp: number) => {
      animationFrame = 0;
      if (reduceMotion.matches || !Number.isFinite(video.duration) || video.duration <= 0) return;

      const elapsed = lastTimestamp ? Math.min(0.1, (timestamp - lastTimestamp) / 1000) : 1 / 60;
      lastTimestamp = timestamp;

      const targetTime = targetTimeForScroll();
      const currentTime = video.currentTime;
      const distance = targetTime - currentTime;
      // Aproximação gradual do alvo: a imagem persegue a rolagem em vez de saltar.
      // O fator depende do tempo entre quadros para ficar igual em qualquer taxa de atualização.
      const smoothing = 1 - Math.exp(-elapsed / 0.14);
      const nextTime = Math.abs(distance) < 0.01 ? targetTime : currentTime + distance * smoothing;

      if (Math.abs(nextTime - currentTime) >= 1 / 240) {
        video.currentTime = nextTime;
      }

      if (Math.abs(targetTime - nextTime) >= 0.01) requestFrameUpdate();
    };

    const requestFrameUpdate = () => {
      if (!animationFrame) animationFrame = window.requestAnimationFrame(updateVideoFrame);
    };

    const prepareVideo = () => {
      if (reduceMotion.matches) return;

      const playback = video.play();
      if (!playback) {
        video.pause();
        requestFrameUpdate();
        return;
      }

      void playback
        .then(() => {
          video.pause();
          requestFrameUpdate();
        })
        .catch(() => {
          video.currentTime = 0.001;
          requestFrameUpdate();
        });
    };

    const onMotionPreferenceChange = () => {
      if (reduceMotion.matches) {
        if (animationFrame) window.cancelAnimationFrame(animationFrame);
        animationFrame = 0;
        video.currentTime = 0;
      } else {
        requestFrameUpdate();
      }
    };

    video.pause();
    video.addEventListener("loadedmetadata", requestFrameUpdate);
    video.addEventListener("loadeddata", prepareVideo);
    window.addEventListener("scroll", requestFrameUpdate, { passive: true });
    window.addEventListener("resize", requestFrameUpdate, { passive: true });
    reduceMotion.addEventListener("change", onMotionPreferenceChange);
    if (video.readyState >= 2) prepareVideo();
    requestFrameUpdate();

    return () => {
      if (animationFrame) window.cancelAnimationFrame(animationFrame);
      video.removeEventListener("loadedmetadata", requestFrameUpdate);
      video.removeEventListener("loadeddata", prepareVideo);
      window.removeEventListener("scroll", requestFrameUpdate);
      window.removeEventListener("resize", requestFrameUpdate);
      reduceMotion.removeEventListener("change", onMotionPreferenceChange);
    };
  }, []);

  // Dois movimentos, cada um com um motivo:
  // o título entra palavra a palavra (ordem de leitura) e os números do controle
  // sobem no odômetro (é o número que diferencia um controle do outro).
  // Base: efeitos 16 e 18 de naocodei.com/free-code, em JavaScript puro.
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const splitIntoWords = (element: HTMLElement) => {
      if (element.dataset.blSplit === "done") return;
      const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT);
      const textNodes: Text[] = [];
      while (walker.nextNode()) textNodes.push(walker.currentNode as Text);
      textNodes.forEach((node) => {
        const words = (node.textContent ?? "").split(/(\s+)/);
        if (!words.some((word) => word.trim())) return;
        const fragment = document.createDocumentFragment();
        words.forEach((word) => {
          if (!word.trim()) {
            fragment.appendChild(document.createTextNode(word));
            return;
          }
          const span = document.createElement("span");
          span.className = "bl-word";
          span.textContent = word;
          fragment.appendChild(span);
        });
        node.parentNode?.replaceChild(fragment, node);
      });
      element.dataset.blSplit = "done";
    };

    const revealWords = (element: HTMLElement) => {
      const words = element.querySelectorAll<HTMLElement>(".bl-word");
      words.forEach((word, index) => {
        window.setTimeout(() => word.classList.add("is-in"), index * 45);
      });
    };

    const headings = Array.from(document.querySelectorAll<HTMLElement>(".bl-split"));
    headings.forEach(splitIntoWords);
    // Só esconde o que ainda está abaixo da dobra: o que já está na tela fica visível.
    const armed = headings.filter((heading) => {
      if (heading.getBoundingClientRect().top > window.innerHeight * 0.9) {
        heading.classList.add("is-armed");
        return true;
      }
      return false;
    });
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          revealWords(entry.target as HTMLElement);
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.35 },
    );

    armed.forEach((element) => observer.observe(element));

    // Rede de segurança: se o observador não disparar, o título aparece assim mesmo.
    const safety = window.setTimeout(() => {
      armed.forEach((heading) => {
        if (heading.getBoundingClientRect().top < window.innerHeight) revealWords(heading);
      });
    }, 2500);

    return () => {
      observer.disconnect();
      window.clearTimeout(safety);
    };
  }, []);

  useEffect(() => {
    const previousTitle = document.title;
    const hadBodyClass = document.body.classList.contains("bionlife-active");
    const metaUpdates = [
      ['meta[name="description"]', PAGE_DESCRIPTION],
      ['meta[name="keywords"]', "bionlife, colchão ionizado, colchão com massagem, colchão magnético, colchão para bem-estar"],
      ['meta[property="og:title"]', PAGE_TITLE],
      ['meta[property="og:description"]', PAGE_DESCRIPTION],
      ['meta[property="og:site_name"]', "BionLife"],
      ['meta[property="og:image"]', `${window.location.origin}/images/herobionlife.jpg`],
      ['meta[name="theme-color"]', "#f8f8f2"],
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
      if (!hadBodyClass) document.body.classList.remove("bionlife-active");
      previousMeta.forEach(([element, content]) => {
        if (element) element.content = content;
      });
    };
  }, []);

  return (
    <div className="bionlife-page" id="inicio">
      {/*
        THESIS: cada linha BionLife é uma cor da mesma cartela; a página é o catálogo de amostras,
        e recusa o arranjo padrão de colchão (hero com foto de casal, cards arredondados, selos).
        OWN-WORLD: campos de cor chapados em quatro valores de um verde só, tinta #0E1310 sobre papel
        #F1F2EE, grotesca Archivo com largura variável, fios de 1px, cantos retos, zero sombra.
        STORY: o visitante lê as quatro sensações como amostras, escolhe a sua e fala com um consultor.
        FIRST VIEWPORT: tela dividida, campo verde-sinal à esquerda com o título em escala grande e o
        botão em tinta cheia, foto sangrando à direita, régua técnica escura logo abaixo da dobra.
        FORM: cartela de amostras, candidata 3 da lista ordenada; seed bion01, índice indicado 3.
        FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review,
        the verdict, DESIGN.md, and every shipping raster carrying its provenance.
      */}
      <a className="bl-skip-link" href="#conteudo">Pular para o conteúdo</a>
      <header className={`bl-header ${scrolled || menuOpen ? "is-solid" : "is-over"}`}>
        <Wordmark />
        <nav className="bl-desktop-nav" aria-label="Navegação principal">
          {navItems.map((item) => <a key={item.href} href={item.href}>{item.label}</a>)}
        </nav>
        <div className="bl-header-actions">
          <a className="bl-button bl-header-cta" href={CONSULTANT_URL} target="_blank" rel="noopener noreferrer">
            Falar com um consultor <ArrowRight size={15} aria-hidden="true" />
          </a>
          <button
            className="bl-menu-toggle"
            type="button"
            aria-label={menuOpen ? "Fechar menu" : "Abrir menu"}
            aria-expanded={menuOpen}
            aria-controls="bl-mobile-nav"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
        <nav
          id="bl-mobile-nav"
          className="bl-mobile-nav"
          aria-label="Navegação móvel"
          hidden={!menuOpen}
          onKeyDown={(event) => {
            if (event.key === "Escape") {
              setMenuOpen(false);
              document.querySelector<HTMLButtonElement>(".bl-menu-toggle")?.focus();
            }
          }}
        >
          {navItems.map((item) => (
            <a key={item.href} href={item.href} onClick={() => setMenuOpen(false)}>
              {item.label}<ArrowRight size={16} aria-hidden="true" />
            </a>
          ))}
          <a href={CONSULTANT_URL} target="_blank" rel="noopener noreferrer" onClick={() => setMenuOpen(false)}>Falar com um consultor</a>
        </nav>
      </header>

      <main id="conteudo">
        <section className="bl-hero" aria-labelledby="bl-hero-title">
          <div className="bl-hero-copy">
            <h1 id="bl-hero-title">Seu corpo sente<br />onde descansa.</h1>
            <p>Encontre o conforto que combina com você.<br className="bl-desktop-break" /> Do mais macio ao mais firme, conheça seu BionLife.</p>
            <a className="bl-button" href="#modelos">Explorar os colchões <ArrowRight size={16} aria-hidden="true" /></a>
          </div>
          <picture className="bl-hero-image">
            <source media="(max-width: 639px)" srcSet="/images/herobionlife_mobile.jpg" width={1080} height={1920} />
            <img src="/images/herobionlife.jpg" alt="Família lendo junta sobre um colchão BionLife azul em um quarto iluminado" width={2560} height={1440} loading="eager" fetchPriority="high" decoding="async" />
          </picture>
        </section>

        <section id="modelos" className="bl-section bl-catalog" aria-labelledby="bl-model-title">
          <div className="bl-section-heading">
            <h2 id="bl-model-title" className="bl-split">Qual é o seu conforto? <span className="bl-dim">Quatro linhas. Diferentes formas de se sentir em casa.</span></h2>
          </div>
          <div className="bl-product-grid">
            {lines.map((line) => {
              const href = whatsappLink(`Olá! Vim pelo site da BionLife e quero conhecer a linha ${line.name}. Podem me ajudar com os modelos e configurações?`);
              return (
                <article
                  className="bl-product"
                  key={line.name}
                  style={{ "--swatch": line.swatch } as React.CSSProperties}
                >
                  <a className="bl-product-image" href={href} target="_blank" rel="noopener noreferrer" aria-label={`Conhecer a linha ${line.name} com um consultor`}>
                    <img
                      src={line.cardImage}
                      alt={`Colchão da linha BionLife ${line.name} em um quarto`}
                      width={1080}
                      height={1440}
                      loading="lazy"
                      decoding="async"
                    />
                    <span aria-hidden="true"><ArrowRight size={19} /></span>
                  </a>
                  <div className="bl-product-heading">
                    <h3>{line.name}</h3>
                    <p>{line.feel}</p>
                  </div>
                  <p className="bl-product-description">{line.description}</p>
                  <a className="bl-text-link" href={href} target="_blank" rel="noopener noreferrer">
                    Conhecer a linha <ArrowRight size={15} aria-hidden="true" />
                    <span className="bl-sr-only">{line.name}</span>
                  </a>
                </article>
              );
            })}
          </div>
          <p className="bl-catalog-note">Os recursos mudam conforme a linha e o modelo.</p>
        </section>

        <section id="bem-estar" className="bl-lifestyle bl-section" aria-labelledby="bl-comfort-title">
          <div className="bl-lifestyle-image">
            <img src="/images/bionlife02.jpg" alt="Família abraçada sobre um colchão BionLife" width={1920} height={1080} loading="lazy" decoding="async" />
          </div>
          <div className="bl-editorial-copy">
            <h2 id="bl-comfort-title" className="bl-split">Deitar. Desacelerar. <span>Se sentir em casa.</span></h2>
            <p>O conforto começa no primeiro contato. Na maciez que acolhe, no apoio que sustenta e na liberdade para encontrar sua posição.</p>
            <p>Por isso, cada linha BionLife tem uma forma diferente de receber o corpo.</p>
            <a className="bl-text-link" href="#modelos">Encontre a sua <ArrowRight size={16} aria-hidden="true" /></a>
          </div>
        </section>

        <section ref={technologyRef} id="tecnologia" className="bl-technology bl-section" aria-labelledby="bl-technology-title">
          <div className="bl-editorial-copy">
            <h2 id="bl-technology-title" className="bl-split">O conforto vem de dentro. <span className="bl-dim">Camadas que trabalham juntas para acolher o corpo e sustentar o descanso.</span></h2>
            <dl className="bl-tech-list">
              <div><dt>Camadas que se adaptam</dt><dd>Espumas diferentes: as de cima acolhem, as de baixo sustentam.</dd></div>
              <div><dt>Resposta aos movimentos</dt><dd>Voltam à forma quando você muda de posição.</dd></div>
              <div id="ionizacao"><dt>Ionização integrada</dt><dd>Presente na construção BionLife, junto às camadas do colchão.</dd></div>
            </dl>
            <p className="bl-fine-print">Os recursos mudam conforme o modelo.</p>
          </div>
          <div className="bl-layer-video">
            <video
              ref={layersVideoRef}
              muted
              playsInline
              preload="auto"
              aria-label="Animação das camadas internas de um colchão BionLife"
              disablePictureInPicture
            >
              <source src="/videos/colchaocamadas-scrub.mp4" type="video/mp4" />
            </video>
            <span>Imagem ilustrativa</span>
          </div>
        </section>

        <section id="quantica" className="bl-quantum bl-section" aria-labelledby="bl-quantum-title">
          <div className="bl-quantum-inner">
            <div className="bl-quantum-heading">
              <h2 id="bl-quantum-title">Seu descanso <span>também é cuidado.</span></h2>
              <p className="bl-quantum-note">O dia pede muito de você. A noite é o seu momento de receber cuidado.</p>
            </div>
            <div className="bl-quantum-body">
              <h3>Energia Bioquântica BionLife</h3>
              <p className="bl-quantum-lead">A energia bioquântica integra as tecnologias de bem-estar da BionLife. Incorporada ao colchão, ela acompanha o momento em que você deixa o ritmo do dia para trás e dedica um tempo ao seu corpo.</p>
              <p>O cuidado está na combinação: a superfície acolhe, as camadas sustentam e as tecnologias complementam a experiência de descanso.</p>
              <p>Bioquântica, ionização, magnetismo, infravermelho e massagem se somam em diferentes configurações. Você escolhe os recursos e a sensação de conforto que quer ter ao deitar.</p>
            </div>
          </div>
        </section>

        <section id="massagem" className="bl-massage bl-section" aria-labelledby="bl-massage-title">
          <LineSlideshow />
          <div className="bl-editorial-copy">
            <h2 id="bl-massage-title" className="bl-split">O descanso pode começar antes do sono.</h2>
            <div className="bl-massage-columns">
              <div className="bl-massage-col">
                <h3 className="bl-massage-eyebrow">Massagem integrada BionLife</h3>
                <p>O sistema de vibroterapia leva a massagem para dentro do próprio colchão, criando uma experiência pensada para relaxar o corpo antes e durante o descanso.</p>
                <p>As vibrações percorrem diferentes regiões do colchão e podem ser ajustadas de acordo com o momento, com diferentes programas, intensidades e tempos de funcionamento.</p>
                <p className="bl-massage-choice">É você quem escolhe como quer desacelerar.</p>
                <ul className="bl-massage-moments">
                  <li>Uma massagem mais leve no fim do dia.</li>
                  <li>Uma intensidade maior quando o corpo pede mais estímulo.</li>
                  <li>Ou alguns minutos de relaxamento antes de dormir.</li>
                </ul>
              </div>
              <div className="bl-massage-col">
                <div className="bl-massage-stats" aria-label="Nos sistemas mais completos">
                  <p className="bl-metric"><Odometer value={20} /> <small>tipos de massagem</small></p>
                  <p className="bl-metric"><Odometer value={5} /> <small>níveis de intensidade</small></p>
                  <p className="bl-metric"><Odometer value={50} /> <small>minutos por sessão</small></p>
                </div>
                <p className="bl-fine-print">Nos sistemas mais completos, com motores integrados à estrutura do colchão. Os recursos mudam conforme o modelo.</p>
                <p>Combinada às demais tecnologias BionLife, a massagem transforma o momento de deitar em algo que vai além do conforto da superfície.</p>
                <p className="bl-quantum-close bl-massage-close">O colchão deixa de ser apenas onde você descansa. Ele passa a participar desse descanso.</p>
                <a className="bl-text-link" href={whatsappLink("Olá! Vim pelo site da BionLife e quero conhecer os modelos com massagem.")} target="_blank" rel="noopener noreferrer">
                  Encontrar um modelo com massagem <ArrowRight size={16} aria-hidden="true" />
                </a>
              </div>
            </div>
          </div>
        </section>

        <section id="cromoterapia" className="bl-chromo bl-section" aria-labelledby="bl-chromo-title">
          <div className="bl-chromo-media" aria-hidden="true">
            <video autoPlay muted loop playsInline preload="metadata">
              <source src="/videos/cromovid.mp4" type="video/mp4" />
            </video>
          </div>
          <div className="bl-chromo-content">
            <h2 id="bl-chromo-title" className="bl-split">Cor que transforma o ambiente. <span className="bl-dim">Sensação que acompanha o corpo.</span></h2>
            <div className="bl-chromo-body">
              <h3 className="bl-chromo-eyebrow"><span className="bl-chromo-spectrum" aria-hidden="true" />Cromoterapia BionLife</h3>
              <p className="bl-chromo-lead">A cromoterapia utiliza diferentes frequências de luz e cor para criar estímulos sensoriais associados a estados de relaxamento, equilíbrio e bem-estar.</p>
              <ul className="bl-chromo-points">
                <li>Integrada aos modelos compatíveis da BionLife, ela transforma o momento de deitar em uma experiência mais envolvente, criando uma atmosfera pensada para desacelerar o corpo e preparar a mente para o descanso.</li>
                <li>Cada tonalidade produz uma percepção diferente no ambiente, permitindo criar momentos mais tranquilos, acolhedores ou energizantes de acordo com a experiência desejada.</li>
                <li>Combinada à massagem e às demais tecnologias BionLife, a cromoterapia amplia a sensação de cuidado e transforma o colchão em um espaço dedicado ao seu bem-estar.</li>
              </ul>
            </div>
            <p className="bl-quantum-close bl-chromo-close">Um ambiente diferente muda a forma como você se sente dentro dele.</p>
          </div>
        </section>

        <section className="bl-help bl-section" aria-labelledby="bl-help-title">
          <h2 id="bl-help-title">Seu próximo colchão<br />começa com uma conversa.</h2>
          <p>Conte como você gosta de dormir. Um consultor ajuda a escolher a linha, a firmeza e os recursos que fazem sentido para você.</p>
          <a className="bl-button" href={CONSULTANT_URL} target="_blank" rel="noopener noreferrer">Encontrar meu BionLife <ArrowRight size={16} aria-hidden="true" /></a>
          <span>Atendimento pelo WhatsApp</span>
        </section>

        <section id="duvidas" className="bl-faq bl-section" aria-labelledby="bl-faq-title">
          <div>
            <h2 id="bl-faq-title">Antes de escolher.</h2>
            <p>Respostas para suas dúvidas.</p>
          </div>
          <div className="bl-faq-list">
            {faqs.map((faq, index) => (
              <div className="bl-faq-item" key={faq.question}>
                <h3><button
                  type="button"
                  id={`bl-question-${index}`}
                  aria-expanded={openFaq === index}
                  aria-controls={`bl-answer-${index}`}
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                >
                  {faq.question}<Plus size={18} aria-hidden="true" />
                </button></h3>
                <div id={`bl-answer-${index}`} aria-labelledby={`bl-question-${index}`} hidden={openFaq !== index}>
                  <p>{faq.answer}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      <footer className="bl-footer">
        <div className="bl-footer-top">
          <div><Wordmark /><p>Conforto para o seu jeito de descansar.</p></div>
          <nav aria-label="Navegação do rodapé">
            {navItems.map((item) => <a key={item.href} href={item.href}>{item.label}</a>)}
            <a href={CONSULTANT_URL} target="_blank" rel="noopener noreferrer">Fale conosco</a>
          </nav>
        </div>
        <p className="bl-health-note">Os recursos de bem-estar não substituem diagnóstico, tratamento ou orientação de profissionais de saúde.</p>
        <div className="bl-footer-bottom">
          <p>© {new Date().getFullYear()} BionLife. Uma marca Waterfall.</p>
          <a href="/politica-de-privacidade">Política de privacidade</a>
        </div>
      </footer>
    </div>
  );
}
