import { motion, AnimatePresence } from 'motion/react';
import { Check, Droplet, Sparkles, Shield, Activity, ChevronRight, User, X } from 'lucide-react';
import React, { useState, useEffect, lazy, Suspense } from 'react';
import ExpandingCardsDemo from "@/components/ui/demo";
import { submitWeb3Form, WHATSAPP_AFTER_FORM_URL } from "@/lib/forms";
import { FloatingWhatsAppButton, SidebarMenu, SiteFooter, SiteHeader, WhatsAppIcon, goToBuy, scrollToSection } from "@/components/site-shell";
import IonCenterBuy, { priceText } from "@/components/ion-center-buy";
import { ionCenterProducts, type IonCenterModel } from "@/lib/ion-center";
import { isPurchasable, useProducts } from "@/lib/catalog";
import AmbientVideo from "@/components/ui/ambient-video";
// Rotas secundárias entram em chunks próprios: quem abre a home não baixa o código delas.
const ConsultorPage = lazy(() => import("./pages/ConsultorPage"));
const FitAcademiaPage = lazy(() => import("./pages/FitAcademiaPage"));
const BionLifePage = lazy(() => import("./pages/BionLifePage"));
const LojaPage = lazy(() => import("./pages/LojaPage"));
const AfiliadosPage = lazy(() => import("./pages/AfiliadosPage"));
const CarrinhoPage = lazy(() => import("./pages/CarrinhoPage"));
const PedidoPage = lazy(() => import("./pages/CarrinhoPage").then((m) => ({ default: m.PedidoPage })));


// --- Reusable Components ---

const FadeIn = ({ children, delay = 0, className = "" }: { children: React.ReactNode, delay?: number, className?: string, key?: React.Key }) => (
  <motion.div
    initial={{ opacity: 0, y: 24 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-80px" }}
    transition={{ duration: 0.9, delay, ease: [0.22, 1, 0.36, 1] }}
    className={className}
  >
    {children}
  </motion.div>
);

const commonFilterBenefits = [
  "Retém partículas",
  "Reduz odores",
  "Melhora o sabor",
  "Atua no cloro",
];

const fullTreatmentBenefits = [
  "Remoção física",
  "Redução química",
  "Purificação profunda",
  "Equilíbrio mineral",
  "Alcalinização",
  "Ionização",
];

const contaminationLayers = [
  {
    title: "Partículas físicas",
    desc: "Areia, barro, ferrugem e sedimentos que alteram a pureza da água.",
    icon: (
      <svg viewBox="0 0 48 48" className="h-9 w-9" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M11 31c5-8 8-14 13-14 4 0 6 3 9 3 3 0 4-2 4-5" />
        <path d="M14 18l20 14" />
        <path d="M18 15l2 2" />
        <path d="M12 24l2 2" />
        <path d="M27 14l2 2" />
        <path d="M31 28l2 2" />
      </svg>
    ),
  },
  {
    title: "Microplásticos",
    desc: "Fragmentos minúsculos que podem estar presentes mesmo sem sinais visíveis.",
    icon: (
      <svg viewBox="0 0 48 48" className="h-9 w-9" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M17 15h14l4 7-4 11H17l-4-11 4-7Z" />
        <path d="M24 13v22" />
        <path d="M16 22h16" />
        <path d="M19 29h10" />
      </svg>
    ),
  },
  {
    title: "Substâncias químicas",
    desc: "Cloro, metais e compostos dissolvidos que afetam sabor, odor e qualidade.",
    icon: (
      <svg viewBox="0 0 48 48" className="h-9 w-9" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M18 14v8l-6 10a7 7 0 0 0 6 10h12a7 7 0 0 0 6-10l-6-10v-8" />
        <path d="M18 18h12" />
        <path d="M19 28c3-2 7-2 10 0" />
      </svg>
    ),
  },
  {
    title: "Cloro residual",
    desc: "Usado no tratamento, mas em excesso pode impactar o paladar e o cheiro.",
    icon: (
      <svg viewBox="0 0 48 48" className="h-9 w-9" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M24 11c4 6 8 10 8 16a8 8 0 1 1-16 0c0-6 4-10 8-16Z" />
        <path d="M31 17c2 1 4 3 4 6" />
        <path d="M24 26v6" />
      </svg>
    ),
  },
  {
    title: "Microrganismos",
    desc: "Bactérias, vírus e coliformes ligados a riscos biológicos invisíveis.",
    icon: (
      <svg viewBox="0 0 48 48" className="h-9 w-9" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <circle cx="24" cy="24" r="8" />
        <path d="M24 10v4M24 34v4M10 24h4M34 24h4M14.5 14.5l2.8 2.8M30.7 30.7l2.8 2.8M33.5 14.5l-2.8 2.8M17.3 30.7l-2.8 2.8" />
        <circle cx="21" cy="22" r="1" fill="currentColor" stroke="none" />
        <circle cx="27" cy="25" r="1" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
];

const technologyHighlights = [
  {
    title: "Remove partículas",
    icon: (
      <svg viewBox="0 0 48 48" className="h-8 w-8" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M11 31c5-8 8-14 13-14 4 0 6 3 9 3 3 0 4-2 4-5" />
        <path d="M14 18l20 14" />
        <path d="M18 15l2 2" />
        <path d="M12 24l2 2" />
        <path d="M27 14l2 2" />
        <path d="M31 28l2 2" />
      </svg>
    ),
  },
  {
    title: "Reduz químicos",
    icon: (
      <svg viewBox="0 0 48 48" className="h-8 w-8" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M18 14v8l-6 10a7 7 0 0 0 6 10h12a7 7 0 0 0 6-10l-6-10v-8" />
        <path d="M18 18h12" />
        <path d="M19 28c3-2 7-2 10 0" />
      </svg>
    ),
  },
  {
    title: "Purifica a água",
    icon: (
      <svg viewBox="0 0 48 48" className="h-8 w-8" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M24 10c4 6 10 12 10 19a10 10 0 1 1-20 0c0-7 6-13 10-19Z" />
        <path d="M18 30c2 2 4 3 6 3 3 0 5-1 7-4" />
      </svg>
    ),
  },
  {
    title: "Eleva o pH",
    icon: (
      <svg viewBox="0 0 48 48" className="h-8 w-8" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M24 13v22" />
        <path d="M13 24h22" />
        <circle cx="24" cy="24" r="12" />
      </svg>
    ),
  },
  {
    title: "Repõe minerais",
    icon: (
      <svg viewBox="0 0 48 48" className="h-8 w-8" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M24 11 34 24 24 37 14 24 24 11Z" />
        <path d="M18 24h12" />
        <path d="M24 17v14" />
      </svg>
    ),
  },
  {
    title: "Ioniza a água",
    icon: (
      <svg viewBox="0 0 48 48" className="h-8 w-8" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M21 14c-5 2-8 6-8 11 0 7 5 12 11 12 6 0 11-5 11-12 0-5-3-9-8-11" />
        <path d="M24 10v10" />
        <path d="M20 24h8" />
      </svg>
    ),
  },
  {
    title: "Equilibra cargas",
    icon: (
      <svg viewBox="0 0 48 48" className="h-8 w-8" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M16 18h16" />
        <path d="M14 30h20" />
        <path d="M18 14v8" />
        <path d="M30 26v8" />
        <path d="M10 24h6" />
        <path d="M32 24h6" />
      </svg>
    ),
  },
  {
    title: "Reorganiza moléculas",
    icon: (
      <svg viewBox="0 0 48 48" className="h-8 w-8" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <circle cx="16" cy="18" r="4" />
        <circle cx="31" cy="15" r="3" />
        <circle cx="30" cy="31" r="5" />
        <path d="M19.5 20.5 28 28" />
        <path d="M20 17h8" />
        <path d="M16 22v7" />
      </svg>
    ),
  },
];

const refillVisualBlocks = [
  {
    name: "MAX",
    refill: "Max Ultra",
    title: "Ultra filtragem",
    description: "Remove partículas físicas como areia, ferrugem, sedimentos, microplásticos e microrganismos com membrana de 0,5μ.",
    result: "Resultado: água mais limpa desde a primeira etapa.",
    image: "/images/MAX.webp",
    imageSm: "/images/MAX-sm.webp",
    alt: "Refil MAX Water Diamond",
    step: "01",
    accent: "var(--refill-ultra)",
    rotate: "-rotate-[18deg]",
  },
  {
    name: "CARBON",
    refill: "Max Carbon",
    title: "Purificação",
    description: "Reduz cloro, odores, resíduos químicos, compostos orgânicos e substâncias que alteram o sabor da água.",
    result: "Resultado: água mais pura, leve e agradável.",
    image: "/images/CARBON.webp",
    imageSm: "/images/CARBON-sm.webp",
    alt: "Refil Carbon Water Diamond",
    step: "02",
    accent: "var(--refill-carbon)",
    rotate: "rotate-[14deg]",
  },
  {
    name: "BLOCK",
    refill: "Max Block",
    title: "Purificação profunda",
    description: "Utiliza carvão ativado compactado para reter metais pesados, bactérias, partículas finas e impurezas persistentes.",
    result: "Resultado: mais controle, segurança e qualidade no consumo diário.",
    image: "/images/BLOCK.webp",
    imageSm: "/images/BLOCK-sm.webp",
    alt: "Refil Block Water Diamond",
    step: "03",
    accent: "var(--refill-block)",
    rotate: "-rotate-[6deg]",
  },
  {
    name: "ALKA",
    refill: "Max Alka",
    title: "Alcalinização e minerais",
    description: "Eleva o pH para uma faixa alcalina entre 8,5 e 9,5 e reintroduz minerais como cálcio, magnésio e potássio.",
    result: "Resultado: água mais equilibrada, mineralizada e completa.",
    image: "/images/ALKA.webp",
    imageSm: "/images/ALKA-sm.webp",
    alt: "Refil ALKA Water Diamond",
    step: "04",
    accent: "var(--refill-alka)",
    rotate: "rotate-[12deg]",
  },
];

const ContactModal = ({ isOpen, onClose, product }: { isOpen: boolean, onClose: () => void, product?: string | null }) => {
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [formData, setFormData] = useState({ name: '', phone: '', email: '', installation: 'Bancada' });

  useEffect(() => {
    if (!isOpen) {
      const timer = setTimeout(() => {
        setFormSubmitted(false);
        setIsSubmitting(false);
        setSubmitError("");
        setFormData({ name: '', phone: '', email: '', installation: 'Bancada' });
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError("");

    try {
      await submitWeb3Form(e.currentTarget, {
        kind: "contato",
        subject: product
          ? `Novo contato pelo site — interesse em ${product}`
          : "Novo contato pelo site Water Diamond Ion Center",
        fromName: "Water Diamond Ion Center",
        extraFields: { produto_de_interesse: product ?? "Não especificado" },
      });
      setFormSubmitted(true);
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : "Algo deu errado. Tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  const labelClass = "mb-1.5 block text-[0.8125rem] font-medium text-pewter";

  return (
    <div className="wd fixed inset-0 z-[70] flex items-end justify-center p-3 sm:items-center sm:p-6">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/70 backdrop-blur-md"
        onClick={onClose}
      />

      <motion.div
        role="dialog"
        aria-modal="true"
        aria-labelledby="contact-title"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 24 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 max-h-[92svh] w-full max-w-lg overflow-y-auto rounded-[28px] bg-white text-obsidian"
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Fechar formulário de contato"
          className="absolute right-4 top-4 flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-frost text-pewter transition-colors hover:text-obsidian"
        >
          <X size={18} />
        </button>

        <div className="p-7 md:p-10">
          {!formSubmitted ? (
            <>
              <div className="mb-7 pr-10">
                <h3 id="contact-title" className="t-headline-lg">Falar com um consultor</h3>
                <p className="t-small mt-3 text-pewter">
                  {product
                    ? `Deixe seus dados e um especialista entrará em contato com um orçamento do ${product}.`
                    : "Deixe seus dados e um de nossos especialistas entrará em contato para um orçamento personalizado."}
                </p>
              </div>

              {product && (
                <div className="mb-6 flex items-center justify-between gap-4 rounded-[16px] bg-frost px-4 py-3">
                  <div>
                    <p className="t-caption text-pewter">Produto de interesse</p>
                    <p className="text-[0.9375rem] font-semibold">{product}</p>
                  </div>
                  <Check size={18} className="shrink-0 text-action" />
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Honeypot: bots preenchem, humanos não veem. O Web3Forms descarta o envio. */}
                <input type="checkbox" name="botcheck" tabIndex={-1} autoComplete="off" aria-hidden="true" className="hidden" style={{ display: "none" }} />

                <div>
                  <label htmlFor="modal-name" className={labelClass}>Nome completo</label>
                  <input
                    id="modal-name"
                    name="name"
                    type="text"
                    required
                    autoComplete="name"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="Seu nome"
                    className="wd-input"
                  />
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label htmlFor="modal-phone" className={labelClass}>WhatsApp / telefone</label>
                    <input
                      id="modal-phone"
                      name="phone"
                      type="tel"
                      required
                      autoComplete="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      placeholder="(00) 00000-0000"
                      className="wd-input"
                    />
                  </div>
                  <div>
                    <label htmlFor="modal-email" className={labelClass}>E-mail</label>
                    <input
                      id="modal-email"
                      name="email"
                      type="email"
                      required
                      autoComplete="email"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      placeholder="seu@email.com"
                      className="wd-input"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="modal-install" className={labelClass}>Preferência de instalação</label>
                  <select
                    id="modal-install"
                    name="installation"
                    value={formData.installation}
                    onChange={(e) => setFormData({...formData, installation: e.target.value})}
                    className="wd-input appearance-none"
                  >
                    <option value="Bancada">Bancada de Cozinha</option>
                    <option value="Parede">Fixado na Parede</option>
                    <option value="Faucet Gourmet">Conexão Faucet Gourmet</option>
                    <option value="Outros">Outros / Comercial</option>
                  </select>
                </div>

                <button type="submit" disabled={isSubmitting} className="btn-action mt-3 min-h-12 w-full text-base">
                  {isSubmitting ? "Enviando..." : "Falar com um consultor Waterfall"}
                </button>
                {submitError && (
                  <p className="t-small text-center font-medium text-red-600" role="alert">
                    {submitError}
                  </p>
                )}
              </form>
            </>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="py-8 text-center"
            >
              <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-frost">
                <Check size={26} className="text-action" />
              </div>
              <h3 className="t-headline-lg">Obrigado, {formData.name.split(' ')[0]}!</h3>
              <p className="t-small mx-auto mb-8 mt-3 max-w-xs text-pewter">
                Nossos consultores receberam sua solicitação e entrarão em contato no WhatsApp em breve.
              </p>
              <a
                href={WHATSAPP_AFTER_FORM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-[#25D366] px-6 text-[0.9375rem] font-medium text-white transition-colors duration-200 hover:bg-[#1ebe5d]"
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

const ProductSpecsModal = ({ product, onClose }: { product: IonCenterModel | null, onClose: () => void }) => {
  if (!product) return null;

  return (
    <div className="wd fixed inset-0 z-[70] flex items-end justify-center p-3 sm:items-center sm:p-6">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/70 backdrop-blur-md"
        onClick={onClose}
      />

      <motion.div
        role="dialog"
        aria-modal="true"
        aria-labelledby="specs-title"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 24 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 flex max-h-[85svh] w-full max-w-lg flex-col overflow-hidden rounded-[28px] bg-white text-obsidian"
      >
        <div className="flex items-start justify-between gap-4 px-7 pb-5 pt-7 md:px-9 md:pt-9">
          <div>
            <p className="t-small font-semibold text-signal-ink">Ficha técnica</p>
            <h3 id="specs-title" className="t-headline-lg mt-1">{product.name}</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Fechar ficha técnica"
            className="flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-full bg-frost text-pewter transition-colors hover:text-obsidian"
          >
            <X size={18} />
          </button>
        </div>

        <div className="overflow-y-auto px-7 pb-7 md:px-9 md:pb-9">
          <dl className="border-t border-hairline">
            {product.specs.map(([label, value]) => (
              <div key={label} className="grid grid-cols-[1fr_1.2fr] gap-4 border-b border-hairline py-3.5">
                <dt className="t-small text-pewter">{label}</dt>
                <dd className="t-small font-medium text-obsidian [font-variant-numeric:tabular-nums]">{value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </motion.div>
    </div>
  );
};

type LegalDocument = {
  eyebrow: string;
  title: string;
  updatedAt: string;
  intro: string;
  sections: {
    title: string;
    body: string[];
  }[];
};

const legalDocuments: Record<string, LegalDocument> = {
  "/politica-de-privacidade": {
    eyebrow: "Política de Privacidade",
    title: "Política de Privacidade",
    updatedAt: "Última atualização: 11 de junho de 2026",
    intro:
      "Esta Política de Privacidade explica como os dados enviados pelo site Water Diamond Ion Center podem ser coletados, usados e protegidos quando você navega pelo site ou solicita contato por meio dos formulários disponíveis.",
    sections: [
      {
        title: "1. Dados que podemos coletar",
        body: [
          "Podemos coletar dados fornecidos voluntariamente por você, como nome, telefone, e-mail, preferência de instalação e demais informações enviadas em mensagens ou formulários de contato.",
          "Também podemos coletar informações técnicas básicas de navegação, como endereço IP, tipo de dispositivo, navegador, páginas acessadas e interações com o site, quando ferramentas de análise, segurança ou desempenho estiverem ativas.",
        ],
      },
      {
        title: "2. Como usamos esses dados",
        body: [
          "Os dados podem ser usados para responder solicitações, entrar em contato pelo WhatsApp, telefone ou e-mail, enviar informações comerciais solicitadas, melhorar a experiência do site e proteger nossos canais contra uso indevido.",
          "Não vendemos seus dados pessoais. O uso das informações é limitado às finalidades relacionadas ao atendimento, relacionamento comercial, segurança e melhoria dos nossos serviços.",
        ],
      },
      {
        title: "3. Compartilhamento de informações",
        body: [
          "Podemos compartilhar dados com fornecedores que ajudam na operação do site, hospedagem, envio de mensagens, análise de tráfego, armazenamento de respostas e atendimento ao cliente.",
          "Esses terceiros devem utilizar as informações apenas para prestar os serviços contratados e de acordo com medidas adequadas de segurança e confidencialidade.",
        ],
      },
      {
        title: "4. Cookies e tecnologias semelhantes",
        body: [
          "O site pode usar cookies e tecnologias semelhantes para lembrar preferências, medir desempenho, entender interações e melhorar a navegação.",
          "Você pode gerenciar ou bloquear cookies diretamente nas configurações do seu navegador. Algumas funcionalidades podem ser afetadas caso determinados cookies sejam desativados.",
        ],
      },
      {
        title: "5. Armazenamento e segurança",
        body: [
          "Mantemos os dados pelo tempo necessário para cumprir as finalidades descritas nesta política, atender obrigações legais, resolver disputas e preservar registros comerciais legítimos.",
          "Adotamos medidas razoáveis de segurança para proteger as informações contra acesso não autorizado, perda, alteração ou divulgação indevida.",
        ],
      },
      {
        title: "6. Seus direitos",
        body: [
          "Nos termos da Lei Geral de Proteção de Dados, você pode solicitar confirmação de tratamento, acesso, correção, exclusão, portabilidade ou informações sobre o uso dos seus dados pessoais.",
          "Para exercer seus direitos, entre em contato pelos canais oficiais informados no site.",
        ],
      },
      {
        title: "7. Alterações nesta política",
        body: [
          "Esta política pode ser atualizada periodicamente para refletir mudanças no site, nos serviços, em requisitos legais ou em práticas internas.",
          "A versão mais recente estará sempre disponível nesta página.",
        ],
      },
    ],
  },
  "/termos-de-uso": {
    eyebrow: "Termos de Uso",
    title: "Termos de Uso",
    updatedAt: "Última atualização: 11 de junho de 2026",
    intro:
      "Estes Termos de Uso regulam o acesso e a utilização do site Water Diamond Ion Center. Ao navegar pelo site ou enviar informações por meio dos formulários, você declara estar ciente destas condições.",
    sections: [
      {
        title: "1. Uso do site",
        body: [
          "O site tem finalidade informativa e comercial, apresentando produtos, tecnologias, conteúdos institucionais e canais de contato relacionados à linha Water Diamond Ion Center.",
          "Você se compromete a utilizar o site de forma lícita, ética e compatível com estes termos, sem tentar comprometer sua segurança, funcionamento ou integridade.",
        ],
      },
      {
        title: "2. Informações e disponibilidade",
        body: [
          "Buscamos manter as informações atualizadas e claras, mas conteúdos, imagens, características, disponibilidade, condições comerciais e funcionalidades podem ser alterados sem aviso prévio.",
          "As informações apresentadas no site não substituem orientação técnica, instalação profissional, análise individual do ambiente ou confirmação comercial por um consultor autorizado.",
        ],
      },
      {
        title: "3. Solicitações de contato",
        body: [
          "Ao enviar um formulário, você declara que as informações fornecidas são verdadeiras e autoriza o contato por canais como telefone, WhatsApp ou e-mail para atendimento da sua solicitação.",
          "O envio do formulário não cria obrigação de contratação, compra, instalação ou fornecimento de produto.",
        ],
      },
      {
        title: "4. Propriedade intelectual",
        body: [
          "Textos, imagens, vídeos, marcas, elementos visuais, layout e demais conteúdos do site são protegidos por direitos de propriedade intelectual.",
          "É proibido copiar, reproduzir, distribuir, modificar ou utilizar comercialmente qualquer conteúdo sem autorização prévia e expressa.",
        ],
      },
      {
        title: "5. Links e serviços de terceiros",
        body: [
          "O site pode conter links, integrações ou ferramentas de terceiros. Não nos responsabilizamos por políticas, conteúdos, disponibilidade ou práticas desses ambientes externos.",
          "Recomendamos a leitura dos termos e políticas de privacidade de qualquer serviço externo acessado por meio do site.",
        ],
      },
      {
        title: "6. Limitação de responsabilidade",
        body: [
          "Não nos responsabilizamos por danos decorrentes de indisponibilidade temporária, falhas técnicas, uso indevido do site, informações fornecidas incorretamente pelo usuário ou decisões tomadas exclusivamente com base no conteúdo apresentado.",
          "Nada nestes termos limita direitos garantidos por lei ao consumidor quando aplicáveis.",
        ],
      },
      {
        title: "7. Alterações dos termos",
        body: [
          "Estes termos podem ser alterados a qualquer momento para refletir mudanças no site, nos serviços, na legislação ou nas práticas comerciais.",
          "A continuidade de uso do site após a publicação de uma nova versão indica ciência dos termos atualizados.",
        ],
      },
    ],
  },
};

const LegalPage = ({ document }: { document: LegalDocument }) => (
  <div className="wd min-h-screen bg-white text-obsidian selection:bg-action/15">
    <main className="mx-auto w-full max-w-5xl px-5 pb-24 pt-10 md:px-12 md:pb-32 md:pt-16">
      <a href="/" className="link-arrow mb-16 text-[0.9375rem] text-link">
        <ChevronRight size={16} className="rotate-180" />
        Voltar ao site
      </a>

      <section className="mb-14 border-b border-hairline pb-12 md:mb-16 md:pb-16">
        <p className="t-eyebrow text-signal-ink">{document.eyebrow}</p>
        <h1 className="t-display mt-3 max-w-3xl">{document.title}</h1>
        <p className="t-body mt-6 max-w-3xl text-pewter">{document.intro}</p>
        <p className="t-caption mt-6 text-pewter">{document.updatedAt}</p>
      </section>

      <div className="space-y-10 md:space-y-12">
        {document.sections.map((section) => (
          <section key={section.title} className="grid gap-3 md:grid-cols-[minmax(220px,0.45fr)_1fr] md:gap-10">
            <h2 className="t-title">{section.title}</h2>
            <div className="t-body space-y-4 text-pewter">
              {section.body.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </section>
        ))}
      </div>
    </main>

    <SiteFooter />
  </div>
);

/** Tela neutra enquanto o chunk da rota carrega. */
const RouteFallback = () => (
  <div className="flex min-h-screen items-center justify-center bg-white">
    <span className="sr-only">Carregando…</span>
    <span className="h-8 w-8 animate-spin rounded-full border-2 border-neutral-200 border-t-primary" aria-hidden="true" />
  </div>
);

// --- Main App ---

export default function App() {
  const normalizedPath = window.location.pathname.replace(/\/$/, "") || "/";
  const legalDocument = legalDocuments[normalizedPath];

  // Subdomínio bionlife.: rota decidida pelo host, não pelo caminho.
  // O /bionlife só existe em desenvolvimento, onde não há subdomínio. Em produção
  // ele não abre a BionLife, senão o Google indexa a página dentro do site principal.
  const host = window.location.hostname.toLowerCase();
  const isBionLifeHost = host === "bionlife" || host.startsWith("bionlife.");
  if (isBionLifeHost || (import.meta.env.DEV && normalizedPath === "/bionlife")) {
    return (
      <Suspense fallback={<RouteFallback />}>
        <BionLifePage />
      </Suspense>
    );
  }

  if (normalizedPath === "/loja" || normalizedPath.startsWith("/loja/")) {
    return (
      <Suspense fallback={<RouteFallback />}>
        <LojaPage />
      </Suspense>
    );
  }

  if (normalizedPath === "/afiliados") {
    return (
      <Suspense fallback={<RouteFallback />}>
        <AfiliadosPage />
      </Suspense>
    );
  }

  if (normalizedPath === "/carrinho" || normalizedPath === "/pedido") {
    const Page = normalizedPath === "/carrinho" ? CarrinhoPage : PedidoPage;
    return (
      <Suspense fallback={<RouteFallback />}>
        <Page />
      </Suspense>
    );
  }

  if (normalizedPath === "/consultor") {
    return (
      <Suspense fallback={<RouteFallback />}>
        <ConsultorPage />
      </Suspense>
    );
  }

  // Acessada apenas por QR code na Fit Academia. Nenhum link do site aponta para cá.
  if (normalizedPath === "/fitacademia") {
    return (
      <Suspense fallback={<RouteFallback />}>
        <FitAcademiaPage />
      </Suspense>
    );
  }

  if (legalDocument) {
    return <LegalPage document={legalDocument} />;
  }

  return <HomePage />;
}

const shell = "mx-auto w-full max-w-[1440px] px-5 md:px-12";
const sectionY = "py-24 md:py-32";

const dailyUses = [
  { icon: Droplet, title: "Para beber", desc: "Água mais pura, equilibrada e agradável para o consumo diário." },
  { icon: Sparkles, title: "Para cozinhar", desc: "Uma água melhor para preparar alimentos, caldos, massas e refeições da família." },
  { icon: Activity, title: "Para o café", desc: "A qualidade da água interfere diretamente no aroma, sabor e percepção final da bebida." },
  { icon: Shield, title: "Para frutas e verduras", desc: "Mais cuidado na higienização dos alimentos que chegam à mesa." },
  { icon: User, title: "Para a família", desc: "Uma escolha que participa da rotina de todos, todos os dias." },
];

const faucetModels = [
  {
    title: "Modelo Faucet",
    image: "/images/FAUCET.webp",
    alt: "Torneira modelo Faucet em cozinha moderna",
    desc: "Uma opção elegante para quem deseja uma saída dedicada para água tratada, com visual limpo e prático.",
  },
  {
    title: "Modelo Gourmet",
    image: "/images/GOURMET.webp",
    alt: "Torneira gourmet preta instalada em bancada de cozinha",
    desc: "Ideal para cozinhas sofisticadas, ambientes planejados e espaços gourmet, unindo funcionalidade, estética e experiência premium.",
  },
];

const systemStages = [
  "Ultra filtragem",
  "Purificação",
  "Purificação profunda",
  "Alcalinização",
  "Mineralização",
  "Ionização Water Diamond®",
  "Reorganização molecular",
  "Equilíbrio eletromagnético",
];

function HomePage() {
  const [scrolled, setScrolled] = useState(false);
  const products = useProducts();
  const [buySlug, setBuySlug] = useState(ionCenterProducts[0].slug);

  // Qualquer "Comprar X" da página leva ao configurador já com o modelo escolhido.
  const buyModel = (slug: string) => {
    setBuySlug(slug);
    scrollToSection('#comprar');
  };

  useEffect(() => {
    let frame = 0;
    const handleScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        setScrolled(window.scrollY > 50);
      });
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  useEffect(() => {
    if (window.location.hash) {
      const timer = setTimeout(() => scrollToSection(window.location.hash), 300);
      return () => clearTimeout(timer);
    }
  }, []);

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [interestProduct, setInterestProduct] = useState<string | null>(null);
  const [specsProduct, setSpecsProduct] = useState<IonCenterModel | null>(null);

  // Guarda qual produto originou o lead para que o consultor não precise reperguntar.
  const openContact = (product: string | null = null) => {
    setInterestProduct(product);
    setIsModalOpen(true);
  };

  return (
    <div id="home" className="wd min-h-screen bg-stage text-frost selection:bg-action/30">
      <SiteHeader scrolled={scrolled} onMenuOpen={() => setIsMenuOpen(true)} />

      {/* ATO 1 — PALCO: o produto fala primeiro */}
      <section className="relative isolate flex min-h-[100svh] flex-col justify-end overflow-hidden bg-stage">
        <div className="absolute inset-0 -z-10">
          <AmbientVideo
            videoDesktop="/videos/ioncenter.mp4"
            videoMobile="/videos/ioncenter-mobile.mp4"
            poster="/images/hero-poster.webp"
            posterMobile="/images/hero-poster-sm.webp"
            priority
            className="absolute inset-0 opacity-80"
          />
          {/* Véu só onde o texto pousa, para a foto continuar dominando o quadro. */}
          <div className="absolute inset-x-0 bottom-0 h-[62%] bg-gradient-to-t from-black via-black/70 to-transparent" />
        </div>

        <div className={`${shell} pb-16 pt-32 md:pb-24`}>
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.1, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          >
            <h1 className="t-hero max-w-[11ch] text-frost">A melhor água do mundo.</h1>
            <p className="t-body mt-5 text-platinum">Water Diamond Ion Center</p>
            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-4">
              <button type="button" onClick={goToBuy} className="btn-action">
                Comprar
              </button>
              <button type="button" onClick={() => openContact()} className="link-arrow text-halo">
                Falar com um consultor
                <ChevronRight size={18} aria-hidden="true" />
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* A LINHA — compra rápida logo depois do palco */}
      <section id="linha" className="bg-stage pb-24 pt-6 md:pb-32">
        <div className={shell}>
          <FadeIn>
            <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-3">
              <h2 className="t-headline-lg">Escolha o seu Ion Center.</h2>
              <button type="button" onClick={() => scrollToSection('#modelos')} className="link-arrow text-halo">
                Comparar modelos
                <ChevronRight size={18} aria-hidden="true" />
              </button>
            </div>
          </FadeIn>

          <div className="mt-8 grid gap-4 md:grid-cols-3 md:gap-5">
            {ionCenterProducts.map((model, index) => {
              const product = products?.find((p) => p.slug === model.slug);
              return (
                <FadeIn key={model.slug} delay={index * 0.06}>
                  <article className="flex h-full flex-col overflow-hidden rounded-[28px] bg-obsidian">
                    <a href={`/loja/${model.slug}`} className="block aspect-[5/4] overflow-hidden" tabIndex={-1} aria-hidden="true">
                      <img
                        src={model.image}
                        srcSet={`${model.imageSm} 500w, ${model.image} 900w`}
                        sizes="(max-width: 768px) 100vw, 33vw"
                        alt=""
                        loading="lazy"
                        decoding="async"
                        className="h-full w-full object-cover object-[50%_62%] transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] hover:scale-[1.03]"
                      />
                    </a>
                    <div className="flex flex-1 flex-col p-7">
                      <h3 className="t-headline">{model.name}</h3>
                      <p className="t-small mt-1 text-platinum">{model.headline}</p>
                      <p className="t-body mt-5 font-medium text-frost [font-variant-numeric:tabular-nums]">
                        {products ? priceText(product) : <span className="inline-block h-5 w-24 animate-pulse rounded bg-graphite align-middle" />}
                      </p>
                      <div className="mt-auto flex flex-wrap items-center gap-x-5 gap-y-3 pt-6">
                        <button type="button" onClick={() => buyModel(model.slug)} className="btn-action min-h-9 px-4 text-[0.875rem]">
                          {!products || isPurchasable(product) ? 'Comprar' : 'Pedir orçamento'}
                        </button>
                        <a href={`/loja/${model.slug}`} className="link-arrow text-[0.9375rem] text-halo">
                          Saiba mais
                          <ChevronRight size={16} aria-hidden="true" />
                        </a>
                      </div>
                    </div>
                  </article>
                </FadeIn>
              );
            })}
          </div>
        </div>
      </section>

      {/* O PROBLEMA INVISÍVEL — faixa clara */}
      <section id="problema" className={`bg-white text-obsidian ${sectionY}`}>
        <div className={shell}>
          <FadeIn>
            <p className="t-eyebrow text-signal-ink">O problema invisível</p>
            <h2 className="t-display mt-3 max-w-[18ch]">
              Sua água parece limpa, <span className="text-pewter">mas aparência não garante pureza.</span>
            </h2>
          </FadeIn>

          <div className="mt-14 grid items-center gap-10 md:mt-20 lg:grid-cols-12 lg:gap-16">
            <FadeIn className="lg:col-span-7">
              <img
                src="/images/GALAO_FILTRO_CAIXA.webp"
                srcSet="/images/GALAO_FILTRO_CAIXA-sm.webp 700w, /images/GALAO_FILTRO_CAIXA.webp 1200w"
                sizes="(max-width: 1024px) 100vw, 58vw"
                width={1200}
                height={675}
                loading="lazy"
                decoding="async"
                alt="Galão, filtro de barro e caixa-d'água: as soluções mais comuns"
                className="h-auto w-full object-contain"
              />
            </FadeIn>
            <FadeIn delay={0.1} className="lg:col-span-5">
              <p className="t-body text-pewter">
                Antes de chegar ao seu copo, a sua água passa por tratamentos, tubulações, reservatórios e instalações internas. Nesse caminho, ela pode entrar em contato com partículas sólidas, resíduos químicos, microrganismos e substâncias que não aparecem na cor, no cheiro ou no sabor. Por isso, mesmo transparente e sem odor aparente, ela ainda pode carregar elementos invisíveis que fazem parte do que você consome todos os dias.
              </p>
              <p className="t-headline mt-8 border-t border-hairline pt-8">
                O maior problema da sua água não é o que aparece. É o que passa despercebido.
              </p>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* O CAMINHO DA ÁGUA — faixa cinza-clara */}
      <section id="tecnologia" className={`bg-frost text-obsidian ${sectionY}`}>
        <div className={shell}>
          <FadeIn>
            <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.8fr)] lg:items-end lg:gap-16">
              <div>
                <p className="t-eyebrow text-signal-ink">O caminho da água</p>
                <h2 className="t-display mt-3 max-w-[16ch]">Da origem ao seu copo, muita coisa pode acontecer.</h2>
              </div>
              <p className="t-body max-w-xl text-pewter">
                A água que você consome passa por captação, tratamento, distribuição e reservação antes de chegar à sua rotina. Em cada etapa, existem fatores invisíveis que podem interferir diretamente na qualidade final.
              </p>
            </div>
          </FadeIn>

          <FadeIn delay={0.1} className="mt-14 md:mt-20">
            <ExpandingCardsDemo />
          </FadeIn>

          <FadeIn delay={0.15}>
            <p className="t-headline mt-16 max-w-2xl md:mt-20">
              Entre a origem e o consumo, existe um caminho inteiro que você não vê, <span className="text-pewter">mas sente todos os dias.</span>
            </p>
          </FadeIn>
        </div>
      </section>

      {/* CONTAMINAÇÃO — palco escuro */}
      <section className={`bg-stage ${sectionY}`}>
        <div className={shell}>
          <FadeIn>
            <p className="t-eyebrow text-signal">Contaminantes invisíveis</p>
            <h2 className="t-display mt-3 max-w-[16ch]">Sua água pode carregar mais do que você imagina.</h2>
            <p className="t-body mt-6 max-w-2xl text-platinum">
              A contaminação da água pode surgir em diferentes camadas — físicas, químicas e biológicas — muitas vezes sem alterar sua aparência. Por isso, uma solução simples nem sempre é suficiente.
            </p>
          </FadeIn>

          <ul className="mt-16 grid border-t border-smoke md:mt-20 lg:grid-cols-5">
            {contaminationLayers.map((item, index) => (
              <FadeIn key={item.title} delay={0.06 + index * 0.05} className="border-b border-smoke lg:border-b-0 lg:border-l lg:first:border-l-0 lg:first:*:pl-0">
                <li className="grid h-full gap-x-6 gap-y-3 py-7 sm:grid-cols-[3rem_minmax(0,14rem)_1fr] sm:items-start lg:flex lg:flex-col lg:gap-4 lg:px-6 lg:py-10">
                  <span className="text-frost">{item.icon}</span>
                  <h3 className="t-title">{item.title}</h3>
                  <p className="t-small text-platinum">{item.desc}</p>
                </li>
              </FadeIn>
            ))}
          </ul>
        </div>
      </section>

      {/* EQUILÍBRIO — cartão obsidiana sobre o palco */}
      <section className="bg-stage pb-24 md:pb-32">
        <div className={shell}>
          <FadeIn>
            <div className="grid items-center overflow-hidden rounded-[28px] bg-obsidian md:grid-cols-2">
              <div className="px-7 pb-4 pt-12 md:px-14 md:py-20 lg:px-20">
                <p className="t-eyebrow text-signal">pH e minerais</p>
                <h2 className="t-display mt-3">
                  Água pura também precisa de equilíbrio.
                </h2>
                <div className="t-body mt-6 max-w-md space-y-4 text-platinum">
                  <p>Não basta remover impurezas. A água que você consome também precisa manter um pH adequado e uma composição mineral equilibrada.</p>
                  <p>Em processos convencionais, ela pode perder minerais importantes e se tornar mais ácida do que o ideal, comprometendo a sensação de qualidade no consumo diário.</p>
                </div>
                <p className="t-title mt-8 max-w-md border-t border-smoke pt-6 text-frost">
                  pH baixo e baixa mineralização afastam a água do padrão natural e reduzem parte do equilíbrio que ela deveria entregar.
                </p>
              </div>
              <div className="flex items-center justify-center px-7 pb-12 md:py-16">
                <img
                  src="/images/PH.webp"
                  srcSet="/images/PH-sm.webp 500w, /images/PH.webp 840w"
                  sizes="(max-width: 768px) 260px, 340px"
                  width={840}
                  height={1505}
                  loading="lazy"
                  decoding="async"
                  alt="Silhueta de uma pessoa bebendo água, em degradê da escala de pH"
                  className="h-auto w-full max-w-[220px] object-contain md:max-w-[300px]"
                />
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* FILTRAR NÃO É TRATAR — faixa clara */}
      <section className={`bg-white text-obsidian ${sectionY}`}>
        <div className={shell}>
          <FadeIn>
            <h2 className="t-display max-w-[20ch]">
              Filtrar é importante. <span className="text-pewter">Mas filtrar não é tratar por completo.</span>
            </h2>
            <p className="t-body mt-6 max-w-xl text-pewter">
              Muitos filtros comuns foram desenvolvidos para resolver apenas parte do problema.
            </p>
          </FadeIn>

          <div className="mt-14 grid gap-4 md:mt-20 md:grid-cols-2 md:gap-5">
            <FadeIn>
              <div className="h-full rounded-[28px] bg-frost p-8 md:p-12">
                <p className="t-small font-semibold text-pewter">O que um filtro comum costuma resolver</p>
                <ul className="mt-6 border-t border-hairline">
                  {commonFilterBenefits.map((item) => (
                    <li key={item} className="t-title border-b border-hairline py-4 font-medium text-obsidian/80">{item}</li>
                  ))}
                </ul>
              </div>
            </FadeIn>
            <FadeIn delay={0.08}>
              <div className="h-full rounded-[28px] bg-obsidian p-8 text-frost md:p-12">
                <p className="t-small font-semibold text-platinum">O que um tratamento completo também considera</p>
                <ul className="mt-6 border-t border-smoke">
                  {fullTreatmentBenefits.map((item) => (
                    <li key={item} className="t-title flex items-center justify-between gap-4 border-b border-smoke py-4">
                      {item}
                      <Check size={18} className="shrink-0 text-halo" aria-hidden="true" />
                    </li>
                  ))}
                </ul>
              </div>
            </FadeIn>
          </div>

          <FadeIn>
            <p className="t-body mt-10 max-w-2xl text-pewter">
              Em outras palavras: um filtro pode melhorar a experiência imediata. Um sistema de tratamento busca elevar o padrão da água de forma mais ampla e consistente.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* UMA NOVA CATEGORIA — palco com a linha completa */}
      <section id="ion-center" className={`bg-stage ${sectionY}`}>
        <div className={shell}>
          <FadeIn>
            <p className="t-eyebrow text-signal">Uma nova categoria</p>
            <h2 className="t-display mt-3 max-w-[22ch]">
              <span className="text-platinum">Não é um filtro.</span> É uma central de tratamento de água.
            </h2>
          </FadeIn>

          <FadeIn delay={0.1}>
            <div className="mt-14 overflow-hidden rounded-[28px] bg-carbon md:mt-20">
              <img
                src="/images/PRODUTOS.webp"
                srcSet="/images/PRODUTOS-sm.webp 900w, /images/PRODUTOS.webp 1800w"
                sizes="(max-width: 1440px) 100vw, 1340px"
                alt="Linha Water Diamond Ion Center: modelos Smart, Slim e Turbo lado a lado"
                loading="lazy"
                decoding="async"
                className="aspect-[4/5] w-full object-cover sm:aspect-[16/10] lg:aspect-[16/8]"
              />
            </div>
          </FadeIn>

          <ul className="mt-12 grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-4 md:mt-16 lg:grid-cols-8">
            {technologyHighlights.map((item, index) => (
              <FadeIn key={item.title} delay={0.04 * index}>
                <li className="flex flex-col gap-3">
                  <span className="text-frost">{item.icon}</span>
                  <p className="t-small font-medium text-frost">{item.title}</p>
                </li>
              </FadeIn>
            ))}
          </ul>
        </div>
      </section>

      {/* A SOLUÇÃO — faixa cinza-clara */}
      <section id="detalhes" className={`bg-frost text-obsidian ${sectionY}`}>
        <div className={shell}>
          <div className="grid items-center gap-12 md:grid-cols-2 lg:gap-24">
            <FadeIn className="order-2 md:order-1">
              <div className="overflow-hidden rounded-[28px] bg-white">
                <img
                  src="/images/ioncenterkitchen.webp"
                  srcSet="/images/ioncenterkitchen-sm.webp 700w, /images/ioncenterkitchen.webp 1376w"
                  sizes="(max-width: 768px) 92vw, 46vw"
                  width={1376}
                  height={768}
                  loading="lazy"
                  decoding="async"
                  alt="Ion Center nos acabamentos branco e preto sobre bancada de mármore"
                  className="aspect-[4/5] h-full w-full object-cover object-[58%_50%] md:aspect-square"
                />
              </div>
            </FadeIn>

            <FadeIn className="order-1 md:order-2">
              <p className="t-eyebrow text-signal-ink">Water Diamond Ion Center</p>
              <h2 className="t-headline-lg mt-3">
                Uma central de tratamento de água desenvolvida para quem entende que água não é detalhe.
              </h2>
              <p className="t-body mt-5 text-pewter">
                O Ion Center combina tecnologia, ciência e design para entregar uma experiência completa de água tratada dentro de casa. Com ele, a água passa por etapas complementares que atuam desde a remoção de impurezas até a ionização Water Diamond®.
              </p>

              <p className="t-title mt-10">Em um único sistema:</p>
              <ul className="mt-4 flex flex-wrap gap-2">
                {systemStages.map((item) => (
                  <li key={item} className="t-small rounded-full bg-white px-3.5 py-1.5 text-obsidian">{item}</li>
                ))}
              </ul>

              <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3 border-t border-hairline pt-8">
                <p className="t-small text-pewter">Disponível em branco e preto.</p>
                <button type="button" onClick={() => scrollToSection('#etapas')} className="link-arrow text-link">
                  Ver cada etapa do sistema
                  <ChevronRight size={18} aria-hidden="true" />
                </button>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ETAPAS — palco escuro, cada refil com a cor da própria lata */}
      <section id="etapas" className={`bg-stage ${sectionY}`}>
        <div className={shell}>
          <FadeIn>
            <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.8fr)] lg:items-end lg:gap-16">
              <div>
                <p className="t-eyebrow text-signal">Quatro refis, uma sequência</p>
                <h2 className="t-display mt-3">Um sistema completo precisa agir em sequência.</h2>
              </div>
              <p className="t-body max-w-xl text-platinum">
                Cada refil assume uma função específica. Em vez de repetir a mesma filtragem, o Ion Center conduz a água por camadas complementares: remoção física, purificação química, retenção profunda e equilíbrio mineral.
              </p>
            </div>
          </FadeIn>

          <div className="mt-14 space-y-4 md:mt-20 md:space-y-5">
            {refillVisualBlocks.map((item, index) => (
              <FadeIn key={item.name} delay={0.04}>
                <article className="grid overflow-hidden rounded-[28px] bg-obsidian md:grid-cols-2">
                  <div className={`relative flex h-72 items-center justify-center overflow-hidden md:h-auto md:min-h-[30rem] ${index % 2 === 1 ? 'md:order-2' : ''}`}>
                    <img
                      src={item.image}
                      srcSet={`${item.imageSm} 460w, ${item.image} 800w`}
                      sizes="(max-width: 768px) 60vw, 30vw"
                      loading="lazy"
                      decoding="async"
                      alt={item.alt}
                      className={`h-[118%] w-auto max-w-none object-contain md:h-[112%] ${item.rotate}`}
                    />
                  </div>
                  <div className="flex flex-col justify-center px-7 pb-10 pt-2 md:px-14 md:py-16 lg:px-20">
                    <p className="t-eyebrow" style={{ color: item.accent }}>
                      Etapa {item.step} · {item.refill}
                    </p>
                    <h3 className="t-headline-lg mt-3">{item.title}</h3>
                    <p className="t-body mt-5 max-w-md text-platinum">{item.description}</p>
                    <p className="t-body mt-8 max-w-md border-t border-smoke pt-6 font-medium text-frost">{item.result}</p>
                  </div>
                </article>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* IONIZAÇÃO WATER DIAMOND — o clímax técnico */}
      <section className="bg-stage pb-24 md:pb-32">
        <div className={shell}>
          <div className="grid items-center gap-12 md:grid-cols-2 lg:gap-24">
            <FadeIn>
              <p className="t-eyebrow text-halo">Etapa 05 · Tecnologia exclusiva</p>
              <h2 className="t-display mt-3">Ionização Water Diamond®</h2>
              <p className="t-headline mt-4 text-platinum">Equilíbrio e reorganização da água</p>
              <p className="t-body mt-8 max-w-md text-platinum">
                Atua no estado elétrico e estrutural da água, convertendo íons positivos em íons negativos e reorganizando sua estrutura molecular.
              </p>
              <p className="t-body mt-8 max-w-md border-t border-smoke pt-6 font-medium text-frost">
                Resultado: água mais equilibrada, organizada e em um novo padrão de qualidade.
              </p>
            </FadeIn>
            <FadeIn delay={0.1} className="flex justify-center md:justify-end">
              <div className="relative w-full max-w-md overflow-hidden rounded-[28px] bg-carbon">
                <AmbientVideo
                  videoDesktop="/videos/bastao.mp4"
                  videoMobile="/videos/bastao-mobile.mp4"
                  poster="/images/bastao-poster.webp"
                  label="Vídeo do bastão Water Diamond"
                  className="relative aspect-[4/5] w-full"
                />
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* COMPARAR MODELOS — colunas lado a lado, faixa clara */}
      <section id="modelos" className={`bg-white text-obsidian ${sectionY}`}>
        <div className={shell}>
          <FadeIn>
            <p className="t-eyebrow text-signal-ink">Linha Water Diamond Ion Center</p>
            <h2 className="t-display mt-3 max-w-[20ch]">
              Uma tecnologia. <span className="text-pewter">Três formas de viver a melhor água.</span>
            </h2>
            <p className="t-body mt-6 max-w-xl text-pewter">
              Todos entregam o mesmo tratamento Water Diamond. O que muda é a forma de uso, a capacidade e a experiência.
            </p>
          </FadeIn>

          <div className="mt-14 grid grid-cols-1 gap-x-8 gap-y-14 md:mt-20 md:grid-cols-3">
            {ionCenterProducts.map((product, index) => {
              const catalogItem = products?.find((p) => p.slug === product.slug);
              return (
                <FadeIn key={product.name} delay={index * 0.08}>
                  <article className="flex h-full flex-col border-t border-obsidian pt-8">
                    <h3 className="t-headline-lg">{product.name}</h3>
                    <p className="t-title mt-2 font-medium text-pewter">{product.headline}</p>
                    <p className="t-headline mt-6 [font-variant-numeric:tabular-nums]">
                      {products ? priceText(catalogItem) : <span className="inline-block h-6 w-28 animate-pulse rounded-lg bg-frost align-middle" />}
                    </p>
                    <p className="t-body mt-5 text-pewter">{product.description}</p>

                    <ul className="mt-6 border-t border-hairline">
                      {product.highlights.map((highlight) => (
                        <li key={highlight} className="t-small flex items-start gap-3 border-b border-hairline py-3 text-obsidian">
                          <Check size={16} className="mt-0.5 shrink-0 text-action" aria-hidden="true" />
                          {highlight}
                        </li>
                      ))}
                    </ul>
                    <p className="t-small mt-5 text-pewter">
                      <span className="font-semibold text-obsidian">Indicado para:</span> {product.indicated}
                    </p>

                    <div className="mt-auto flex flex-wrap items-center gap-x-6 gap-y-3 pt-8">
                      <button type="button" onClick={() => buyModel(product.slug)} className="btn-action">
                        {!products || isPurchasable(catalogItem) ? product.cta : 'Pedir orçamento'}
                      </button>
                      <button type="button" onClick={() => setSpecsProduct(product)} className="link-arrow text-link">
                        Ficha técnica
                        <ChevronRight size={18} aria-hidden="true" />
                      </button>
                    </div>
                  </article>
                </FadeIn>
              );
            })}
          </div>
        </div>
      </section>

      {/* COMPRAR — configurador: modelo, acabamento, sacola */}
      <section id="comprar" className={`bg-frost text-obsidian ${sectionY}`}>
        <div className={shell}>
          <FadeIn>
            <p className="t-eyebrow text-signal-ink">Comprar</p>
            <h2 className="t-display mt-3 max-w-[18ch]">
              Leve a melhor água do mundo <span className="text-pewter">para dentro de casa.</span>
            </h2>
          </FadeIn>
          <div className="mt-14 md:mt-20">
            <IonCenterBuy
              products={products}
              slug={buySlug}
              onSlugChange={setBuySlug}
              onConsult={(label) => openContact(label)}
            />
          </div>
        </div>
      </section>

      {/* TORNEIRAS E APLICAÇÕES — faixa clara */}
      <section id="especificacoes" className={`bg-white text-obsidian ${sectionY}`}>
        <div className={shell}>
          <FadeIn>
            <p className="t-eyebrow text-signal-ink">Torneiras e aplicações</p>
            <h2 className="t-display mt-3 max-w-[18ch]">A tecnologia se adapta ao seu ambiente.</h2>
            <p className="t-body mt-6 max-w-xl text-pewter">
              A linha Ion Center pode ser integrada a diferentes formas de uso, dependendo da estrutura da cozinha e da experiência desejada.
            </p>
          </FadeIn>

          <div className="mt-14 grid gap-x-5 gap-y-12 md:mt-20 md:grid-cols-2">
            {faucetModels.map((item, i) => (
              <FadeIn key={item.title} delay={i * 0.08}>
                <article>
                  <div className="aspect-[4/5] overflow-hidden rounded-[28px] bg-frost">
                    <img
                      src={item.image}
                      srcSet={`${item.image.replace('.webp', '-sm.webp')} 500w, ${item.image} 900w`}
                      sizes="(max-width: 768px) 100vw, 50vw"
                      width={900}
                      height={1205}
                      loading="lazy"
                      decoding="async"
                      alt={item.alt}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <h3 className="t-headline mt-7">{item.title}</h3>
                  <p className="t-body mt-3 max-w-md text-pewter">{item.desc}</p>
                  <button type="button" onClick={() => openContact(item.title)} className="link-arrow mt-4 text-link">
                    Consultar instalação
                    <ChevronRight size={18} aria-hidden="true" />
                  </button>
                </article>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* USO DIÁRIO — faixa cinza-clara */}
      <section className={`bg-frost text-obsidian ${sectionY}`}>
        <div className={shell}>
          <FadeIn>
            <h2 className="t-display max-w-[18ch]">Uma água melhor muda tudo o que passa por ela.</h2>
            <p className="t-body mt-6 max-w-xl text-pewter">
              A água não está presente apenas no copo. Ela está nos detalhes da rotina.
            </p>
          </FadeIn>

          <ul className="mt-14 grid border-t border-hairline md:mt-20 lg:grid-cols-5">
            {dailyUses.map((benefit, i) => (
              <FadeIn key={benefit.title} delay={i * 0.05} className="border-b border-hairline lg:border-b-0 lg:border-l lg:first:border-l-0 lg:first:*:pl-0">
                <li className="grid h-full gap-x-6 gap-y-3 py-7 sm:grid-cols-[3rem_minmax(0,14rem)_1fr] sm:items-start lg:flex lg:flex-col lg:gap-3 lg:px-6 lg:py-10">
                  <benefit.icon size={26} strokeWidth={1.6} className="text-obsidian" aria-hidden="true" />
                  <h3 className="t-title lg:mt-2">{benefit.title}</h3>
                  <p className="t-small text-pewter">{benefit.desc}</p>
                </li>
              </FadeIn>
            ))}
          </ul>
        </div>
      </section>

      {/* POR QUE ISSO IMPORTA — declaração em duas tonalidades */}
      <section id="porque" className={`bg-stage ${sectionY}`}>
        <div className={shell}>
          <FadeIn>
            <h2 className="t-display max-w-[24ch]">
              Porque a água é simples demais para ser ignorada.{' '}
              <span className="text-platinum">E importante demais para ser tratada de qualquer forma.</span>
            </h2>
          </FadeIn>
          <FadeIn delay={0.1}>
            <div className="mt-14 grid gap-10 border-t border-smoke pt-10 md:mt-20 md:grid-cols-2 md:gap-16">
              <p className="t-body text-platinum">
                Cuidar da saúde costuma começar pelo que é complexo: suplementos, alimentação, treino, sono. Antes de tudo isso existe algo mais básico, presente no corpo, na cozinha e em cada hábito do dia.
              </p>
              <p className="t-headline text-frost">
                Tratar melhor a água não é luxo. É uma decisão de qualidade de vida.
              </p>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="relative isolate flex min-h-[560px] items-center overflow-hidden bg-stage py-28 md:min-h-[720px]">
        <div className="absolute inset-0 -z-10">
          <AmbientVideo
            videoDesktop="/videos/ioncenter.mp4"
            videoMobile="/videos/ioncenter-mobile.mp4"
            poster="/images/hero-poster.webp"
            posterMobile="/images/hero-poster-sm.webp"
            className="absolute inset-0 opacity-45"
          />
          <div className="absolute inset-0 bg-black/45" />
        </div>

        <div className={`${shell} text-center`}>
          <FadeIn>
            <h2 className="t-display mx-auto max-w-[16ch]">Sua água pode estar em outro nível.</h2>
            <p className="t-body mx-auto mt-6 max-w-xl text-frost/75">
              Conheça a linha Water Diamond Ion Center e descubra qual modelo combina com a sua casa, sua rotina e sua forma de viver.
            </p>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-x-6 gap-y-4">
              <button type="button" onClick={goToBuy} className="btn-action">
                Comprar
              </button>
              <button type="button" onClick={() => openContact()} className="link-arrow text-halo">
                Falar com um consultor
                <ChevronRight size={18} aria-hidden="true" />
              </button>
            </div>
          </FadeIn>
        </div>
      </section>

      <SiteFooter />

      <SidebarMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />

      <FloatingWhatsAppButton />

      <AnimatePresence>
        {isModalOpen && (
          <ContactModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} product={interestProduct} />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {specsProduct && (
          <ProductSpecsModal product={specsProduct} onClose={() => setSpecsProduct(null)} />
        )}
      </AnimatePresence>
    </div>
  );
}
