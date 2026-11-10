import { useLayoutEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import { Plus } from "lucide-react";

export type Contaminant = {
  title: string;
  desc: string;
  icon: ReactNode;
};

/**
 * Cartão preto com uma lista de "pílulas" à esquerda e o produto (aqui, o copo d'água) à direita.
 * Uma pílula fica aberta por vez; a aberta mostra o ícone do contaminante e a descrição.
 * O fundo do cartão é o mesmo preto da foto, para ela não ter borda.
 */
export default function ContaminantsExplorer({ eyebrow, title, items }: { eyebrow: string; title: string; items: Contaminant[] }) {
  const [active, setActive] = useState(0);

  // A altura do cartão não pode depender de qual pílula está aberta: senão ele "mexe" a cada clique
  // (e a foto, que acompanha a altura, escala junto). A lista ganha uma altura mínima fixa =
  // cabeçalhos das pílulas + espaços + o MAIOR painel. Qualquer troca acontece dentro dessa caixa.
  const panelRefs = useRef<(HTMLParagraphElement | null)[]>([]);
  const headerRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const [listHeight, setListHeight] = useState(0);

  useLayoutEffect(() => {
    const GAP = 10; // gap-2.5
    const measure = () => {
      const headers = headerRefs.current.reduce((sum, b) => sum + (b?.offsetHeight ?? 0), 0);
      const tallest = Math.max(0, ...panelRefs.current.map((p) => p?.offsetHeight ?? 0));
      setListHeight(headers + GAP * Math.max(0, items.length - 1) + tallest);
    };
    measure();
    const ro = new ResizeObserver(measure);
    [...panelRefs.current, ...headerRefs.current].forEach((el) => el && ro.observe(el));
    return () => ro.disconnect();
  }, [items.length]);

  return (
    <div className="grid overflow-hidden rounded-[28px] bg-black md:min-h-[720px] md:grid-cols-2">
      {/* Foto: em cima no celular, à direita no desktop */}
      <div className="relative order-first aspect-square md:order-last md:aspect-auto">
        <img
          src="/images/copo-agua.webp"
          srcSet="/images/copo-agua-sm.webp 640w, /images/copo-agua.webp 1100w"
          sizes="(max-width: 768px) 100vw, 50vw"
          width={1100}
          height={1474}
          alt="Copo de água transparente com gotas de condensação sobre fundo preto"
          loading="lazy"
          decoding="async"
          className="absolute inset-0 h-full w-full object-cover object-center md:origin-center md:scale-[1.22] md:object-contain"
        />
      </div>

      <div className="flex flex-col justify-center px-6 pb-8 pt-4 md:px-12 md:py-20 lg:pl-20 xl:pl-28">
        {/* Medidor invisível: mesma largura da pílula aberta (max 30rem), sem ocupar espaço. */}
        <div aria-hidden="true" className="relative h-0">
          <div inert className="pointer-events-none invisible absolute left-0 top-0 w-full max-w-[30rem]">
            {items.map((item, i) => (
              <p key={item.title} ref={(el) => { panelRefs.current[i] = el; }} className="t-small w-0 min-w-full pb-4 pl-[3.75rem] pr-5 text-platinum">
                {item.desc}
              </p>
            ))}
          </div>
        </div>

        <p className="t-eyebrow text-signal">{eyebrow}</p>
        <h2 className="t-display mt-3 max-w-[16ch] text-frost">{title}</h2>

        <ul className="@container mt-10 flex flex-col gap-2.5 md:mt-12" style={{ minHeight: listHeight || undefined }}>
        {items.map((item, i) => {
          const open = i === active;
          return (
            <li key={item.title} className={open ? "w-full max-w-[30rem]" : "w-fit max-w-full"}>
              <div className={`overflow-hidden rounded-[26px] transition-colors duration-300 ${open ? "bg-[#2a2a2d]" : "bg-obsidian hover:bg-[#262628]"}`}>
                <button
                  type="button"
                  ref={(el) => { headerRefs.current[i] = el; }}
                  id={`contaminante-${i}`}
                  aria-expanded={open}
                  aria-controls={`contaminante-${i}-painel`}
                  onClick={() => setActive(i)}
                  className="flex w-full cursor-pointer items-center gap-3 py-2.5 pl-2.5 pr-5 text-left"
                >
                  <span
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition-colors duration-300 [&>svg]:h-[18px] [&>svg]:w-[18px] ${
                      open ? "bg-frost text-black" : "border-[1.5px] border-frost/75 text-frost"
                    }`}
                  >
                    {open ? item.icon : <Plus size={16} strokeWidth={2} aria-hidden="true" />}
                  </span>
                  <span className="text-[1.0625rem] font-semibold tracking-[-0.014em] text-frost">{item.title}</span>
                </button>

                <div
                  id={`contaminante-${i}-painel`}
                  role="region"
                  aria-labelledby={`contaminante-${i}`}
                  className={`grid w-0 min-w-full transition-[grid-template-rows] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}
                >
                  <div className="overflow-hidden">
                    <p className="t-small w-[min(30rem,100cqw)] pb-4 pl-[3.75rem] pr-5 text-platinum">{item.desc}</p>
                  </div>
                </div>
              </div>
            </li>
          );
        })}
        </ul>
      </div>
    </div>
  );
}
