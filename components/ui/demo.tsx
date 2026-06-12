import {
  Activity,
  Droplets,
  ShieldCheck,
  Sparkles,
  Waves,
} from "lucide-react";
import { CardItem, ExpandingCards } from "@/components/ui/expanding-cards";

const waterJourneyCards: CardItem[] = [
  {
    id: "captacao",
    title: "Captação",
    description:
      "Tudo começa na fonte. Rios, represas e poços já carregam características e impurezas do ambiente de origem.",
    imgSrc: "/images/CAPTACAO.png",
    icon: <Waves size={24} />,
    linkHref: "#",
  },
  {
    id: "tratamento",
    title: "Tratamento",
    description:
      "A água recebe processos para distribuição, mas isso não elimina todas as variáveis que afetam sua composição final.",
    imgSrc: "/images/TRATAMENTO.png",
    icon: <Sparkles size={24} />,
    linkHref: "#",
  },
  {
    id: "distribuicao",
    title: "Distribuição",
    description:
      "No trajeto até a casa, ela passa por redes, conexões e tubulações que podem alterar a pureza percebida.",
    imgSrc: "/images/DISTRIBUICAO.png",
    icon: <Activity size={24} />,
    linkHref: "#",
  },
  {
    id: "reservacao",
    title: "Reservatórios",
    description:
      "Caixas d'água e sistemas internos acumulam tempo, resíduos e manutenção irregular antes do consumo diário.",
    imgSrc: "/images/RESERVATORIOS.png",
    icon: <ShieldCheck size={24} />,
    linkHref: "#",
  },
  {
    id: "consumo",
    title: "Consumo",
    description:
      "É no copo, no café e no preparo dos alimentos que todo esse caminho finalmente impacta a sua rotina.",
    imgSrc: "/images/CONSUMO.jpg",
    icon: <Droplets size={24} />,
    linkHref: "#",
  },
];

export default function ExpandingCardsDemo() {
  return (
    <div className="w-full rounded-[2rem] border border-[#dbe7ed] bg-white/70 p-4 shadow-[0_24px_80px_-32px_rgba(0,154,206,0.28)] backdrop-blur-sm md:p-5">
      <ExpandingCards
        items={waterJourneyCards}
        defaultActiveIndex={1}
        className="max-w-none"
      />
    </div>
  );
}
