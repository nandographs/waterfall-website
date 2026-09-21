'use client';

import { useEffect, useRef, useState } from "react";

/**
 * Vídeo decorativo que só baixa depois do primeiro render e usa um arquivo menor no mobile.
 * O poster (WebP leve) aparece imediatamente, então a seção nunca fica vazia.
 */
const AmbientVideo = ({
  videoDesktop,
  videoMobile,
  poster,
  posterMobile,
  className = "",
  label,
  priority = false,
}: {
  videoDesktop: string;
  videoMobile: string;
  poster: string;
  posterMobile?: string;
  className?: string;
  label?: string;
  priority?: boolean;
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(true);
  const [inView, setInView] = useState(false);
  const [idle, setIdle] = useState(false);

  // Começa assumindo mobile para nunca baixar o arquivo grande por engano.
  useEffect(() => {
    const query = window.matchMedia("(min-width: 768px)");
    const update = () => setIsMobile(!query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  // Espera a página terminar de carregar para não competir com o conteúdo principal.
  useEffect(() => {
    if (document.readyState === "complete") {
      setIdle(true);
      return;
    }
    const onLoad = () => setIdle(true);
    window.addEventListener("load", onLoad);
    return () => window.removeEventListener("load", onLoad);
  }, []);

  useEffect(() => {
    const node = containerRef.current;
    if (!node || typeof IntersectionObserver === "undefined") {
      setInView(true);
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setInView(true);
          observer.disconnect();
        }
      },
      { rootMargin: "300px" },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  // Respeita quem pediu economia de dados ou menos animação no sistema.
  const saveData = typeof navigator !== "undefined"
    && (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData === true;
  const reducedMotion = typeof window !== "undefined"
    && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const showVideo = inView && idle && !saveData && !reducedMotion;
  const posterSrc = isMobile && posterMobile ? posterMobile : poster;

  return (
    <div ref={containerRef} className={`overflow-hidden ${className}`}>
      <img
        src={posterSrc}
        alt=""
        aria-hidden="true"
        loading={priority ? "eager" : "lazy"}
        fetchPriority={priority ? "high" : "auto"}
        decoding="async"
        className="absolute inset-0 h-full w-full object-cover"
      />
      {showVideo && (
        <video
          key={isMobile ? videoMobile : videoDesktop}
          src={isMobile ? videoMobile : videoDesktop}
          poster={posterSrc}
          autoPlay
          loop
          muted
          playsInline
          preload="none"
          aria-label={label}
          className="absolute inset-0 h-full w-full object-cover"
        />
      )}
    </div>
  );
};

export default AmbientVideo;
