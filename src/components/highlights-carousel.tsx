import { useCallback, useEffect, useRef, useState } from "react";
import { Pause, Play } from "lucide-react";

export type Highlight = {
  id: string;
  title: string;
  description: string;
  /** Nome-base em /images, sem extensão (existe também a versão -sm). */
  image: string;
  alt: string;
};

const SLIDE_MS = 3000;

/** Recuo à esquerda que alinha o primeiro card com o conteúdo da página (max-w 1440 + padding). */
const edge = "max(1.25rem, calc((100vw - 1440px) / 2 + 3rem))";

/**
 * Carrossel de destaques no estilo "palco escuro": cards grandes com foto P&B e frase no topo,
 * rolagem horizontal com snap, pontos de navegação e play/pause. Só avança sozinho quando está
 * visível e quando a pessoa não pediu menos movimento.
 */
export default function HighlightsCarousel({ items }: { items: Highlight[] }) {
  const trackRef = useRef<HTMLUListElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  // Enquanto a rolagem vem de goTo(), o ponto ativo já está certo: ignora as posições intermediárias.
  const lockUntil = useRef(0);
  const [active, setActive] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [inView, setInView] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => {
      setReducedMotion(mq.matches);
      if (mq.matches) setPlaying(false);
    };
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { threshold: 0.35 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const goTo = useCallback((index: number) => {
    const track = trackRef.current;
    const card = track?.children[index] as HTMLElement | undefined;
    if (!track || !card) return;
    const padLeft = parseFloat(getComputedStyle(track).paddingLeft) || 0;
    lockUntil.current = Date.now() + 900;
    track.scrollTo({ left: card.offsetLeft - padLeft, behavior: reducedMotion ? "auto" : "smooth" });
    setActive(index);
  }, [reducedMotion]);

  // Rolagem manual (arrastar, trackpad) também atualiza o ponto ativo.
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    let frame = 0;
    const onScroll = () => {
      if (Date.now() < lockUntil.current) return;
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const padLeft = parseFloat(getComputedStyle(track).paddingLeft) || 0;
        const cards = Array.from(track.children) as HTMLElement[];
        let nearest = 0;
        let best = Infinity;
        cards.forEach((c, i) => {
          const d = Math.abs(c.offsetLeft - padLeft - track.scrollLeft);
          if (d < best) {
            best = d;
            nearest = i;
          }
        });
        setActive(nearest);
      });
    };
    track.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      track.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(frame);
    };
  }, []);

  const running = playing && inView && !reducedMotion;

  useEffect(() => {
    if (!running) return;
    const t = setTimeout(() => goTo((active + 1) % items.length), SLIDE_MS);
    return () => clearTimeout(t);
  }, [running, active, items.length, goTo]);

  return (
    <div ref={rootRef} role="region" aria-roledescription="carrossel" aria-label="O caminho da água">
      <ul
        ref={trackRef}
        className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2 [scrollbar-width:none] md:gap-5 [&::-webkit-scrollbar]:hidden"
        style={{ paddingLeft: edge, paddingRight: edge, scrollPaddingLeft: edge }}
      >
        {items.map((item, i) => (
          <li
            key={item.id}
            aria-roledescription="slide"
            aria-label={`${i + 1} de ${items.length}: ${item.title}`}
            className="relative aspect-[3/4] w-[84vw] shrink-0 snap-start overflow-hidden rounded-[28px] bg-obsidian sm:aspect-[4/3] md:aspect-[16/9] md:w-[min(78vw,1180px)]"
          >
            <img
              src={`/images/${item.image}.webp`}
              srcSet={`/images/${item.image}-sm.webp 700w, /images/${item.image}.webp 1100w`}
              sizes="(max-width: 768px) 84vw, min(78vw, 1180px)"
              alt={item.alt}
              loading={i === 0 ? "eager" : "lazy"}
              decoding="async"
              className="absolute inset-0 h-full w-full object-cover grayscale"
            />
            {/* Véu só no topo, onde a frase pousa. */}
            <div className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-black/60 to-transparent" />
            <p className="relative max-w-[34rem] p-7 text-[1.0625rem] font-medium leading-snug tracking-[-0.015em] text-frost md:p-10 md:text-[1.3125rem]">
              <span className="font-semibold text-white">{item.title}.</span> {item.description}
            </p>
          </li>
        ))}
      </ul>

      {/* Controles: pontos (o ativo enche com o tempo) e play/pause. */}
      <div className="mt-8 flex items-center justify-center gap-3">
        <div className="flex h-14 items-center gap-2.5 rounded-full bg-graphite/70 px-6 backdrop-blur-xl">
          {items.map((item, i) => {
            const isActive = i === active;
            return (
              <button
                type="button"
                key={item.id}
                onClick={() => goTo(i)}
                aria-label={`Ir para ${item.title}`}
                aria-current={isActive}
                className={`relative h-2 cursor-pointer overflow-hidden rounded-full transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                  isActive ? "w-12 bg-platinum/60" : "w-2 bg-platinum/60 hover:bg-platinum"
                }`}
              >
                {isActive && (
                  <span
                    key={`${active}-${running}`}
                    className="absolute inset-0 origin-left rounded-full bg-frost"
                    style={
                      running
                        ? { animation: `wd-progress ${SLIDE_MS}ms linear forwards` }
                        : { transform: "scaleX(1)" }
                    }
                  />
                )}
              </button>
            );
          })}
        </div>
        <button
          type="button"
          onClick={() => setPlaying((p) => !p)}
          aria-label={playing ? "Pausar destaques" : "Reproduzir destaques"}
          className="flex h-14 w-14 cursor-pointer items-center justify-center rounded-full bg-graphite/70 text-frost backdrop-blur-xl transition-colors hover:bg-graphite"
        >
          {playing ? <Pause size={18} fill="currentColor" strokeWidth={0} /> : <Play size={18} fill="currentColor" strokeWidth={0} className="ml-0.5" />}
        </button>
      </div>
    </div>
  );
}
