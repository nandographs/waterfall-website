import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, Check, Droplet, Sparkles, Shield, Activity, ChevronRight, Facebook, Instagram, Menu, User, X, Youtube } from 'lucide-react';
import React, { useState, useEffect, useRef } from 'react';
import NavHeader from "@/components/ui/nav-header";
import ExpandingCardsDemo from "@/components/ui/demo";


// --- Reusable Components ---

const FadeIn = ({ children, delay = 0, className = "" }: { children: React.ReactNode, delay?: number, className?: string, key?: React.Key }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-100px" }}
    transition={{ duration: 0.8, delay, ease: [0.21, 0.47, 0.32, 0.98] }}
    className={className}
  >
    {children}
  </motion.div>
);

const Button = ({ children, variant = 'primary', className = "", onClick }: { children: React.ReactNode, variant?: 'primary' | 'secondary' | 'outline', className?: string, onClick?: () => void }) => {
  const baseStyle = "inline-flex items-center justify-center rounded-full px-8 py-3.5 text-sm font-medium transition-all duration-300";
  const variants = {
    primary: "bg-primary text-white hover:bg-primary-hover",
    secondary: "bg-white border border-neutral-200 text-black hover:bg-primary hover:text-white hover:border-transparent",
    outline: "bg-transparent border border-neutral-200 text-black hover:bg-primary hover:text-white hover:border-transparent"
  };
  
  return (
    <button onClick={onClick} className={`${baseStyle} ${variants[variant]} ${className}`}>
      {children}
    </button>
  );
}

const routineMoments = [
  { title: "no copo matinal", image: "/images/COPO AGUA.png" },
  { title: "no seu café", image: "/images/CAFE.png" },
  { title: "na sua comida", image: "/images/ALIMENTACAO.png" },
  { title: "na sua rotina", image: "/images/HIDRATACAO.png" },
];

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
    image: "/images/MAX.png",
    alt: "Refil MAX Water Diamond",
    className: "md:absolute md:left-[0%] md:bottom-[-64%] md:h-[168%] md:-rotate-[24deg] lg:left-[1%]",
    textAlign: "right",
  },
  {
    name: "CARBON",
    refill: "Max Carbon",
    title: "Purificação",
    description: "Reduz cloro, odores, resíduos químicos, compostos orgânicos e substâncias que alteram o sabor da água.",
    result: "Resultado: água mais pura, leve e agradável.",
    image: "/images/CARBON.png",
    alt: "Refil Carbon Water Diamond",
    className: "md:absolute md:right-[7%] md:bottom-[-44%] md:h-[174%] md:rotate-[19deg] lg:right-[8%]",
    textAlign: "left",
  },
  {
    name: "BLOCK",
    refill: "Max Block",
    title: "Purificação profunda",
    description: "Utiliza carvão ativado compactado para reter metais pesados, bactérias, partículas finas e impurezas persistentes.",
    result: "Resultado: mais controle, segurança e qualidade no consumo diário.",
    image: "/images/BLOCK.png",
    alt: "Refil Block Water Diamond",
    className: "md:absolute md:left-[0%] md:bottom-[-54%] md:h-[166%] md:-rotate-[7deg] lg:left-[1%]",
    textAlign: "right",
  },
  {
    name: "ALKA",
    refill: "Max Alka",
    title: "Alcalinização e minerais",
    description: "Eleva o pH para uma faixa alcalina entre 8,5 e 9,5 e reintroduz minerais como cálcio, magnésio e potássio.",
    result: "Resultado: água mais equilibrada, mineralizada e completa.",
    image: "/images/ALKA.png",
    alt: "Refil ALKA Water Diamond",
    className: "md:absolute md:right-[7%] md:bottom-[-50%] md:h-[182%] md:rotate-[18deg] lg:right-[8%]",
    textAlign: "left",
  },
];

// --- Reusable Components for Navigation & Forms ---

const WHATSAPP_URL = `https://wa.me/5547992828752?text=${encodeURIComponent("Olá, acabei de enviar meus dados pelo site Water Diamond Ion Center e quero falar com um consultor.")}`;

const WhatsAppIcon = ({ className = "h-6 w-6" }: { className?: string }) => (
  <svg viewBox="0 0 32 32" className={className} fill="currentColor" aria-hidden="true">
    <path d="M16.01 3.2C8.96 3.2 3.23 8.91 3.23 15.93c0 2.24.59 4.43 1.7 6.36L3.12 28.8l6.68-1.75a12.77 12.77 0 0 0 6.21 1.58c7.04 0 12.77-5.71 12.77-12.73S23.05 3.2 16.01 3.2Zm0 23.28c-1.95 0-3.86-.52-5.52-1.5l-.4-.24-3.96 1.04 1.06-3.86-.26-.4a10.42 10.42 0 0 1-1.59-5.59c0-5.83 4.78-10.58 10.66-10.58 5.87 0 10.65 4.75 10.65 10.58S21.88 26.48 16 26.48Zm5.84-7.92c-.32-.16-1.9-.94-2.2-1.04-.3-.11-.51-.16-.72.16-.21.32-.83 1.04-1.02 1.25-.19.21-.38.24-.7.08-.32-.16-1.36-.5-2.59-1.6-.96-.85-1.6-1.9-1.79-2.22-.19-.32-.02-.49.14-.65.14-.14.32-.38.48-.57.16-.19.21-.32.32-.54.11-.21.05-.4-.03-.57-.08-.16-.72-1.73-.99-2.38-.26-.62-.53-.54-.72-.55h-.62c-.21 0-.56.08-.85.4-.3.32-1.12 1.09-1.12 2.65s1.15 3.08 1.31 3.29c.16.21 2.27 3.45 5.5 4.84.77.33 1.37.53 1.83.68.77.24 1.47.21 2.03.13.62-.09 1.9-.78 2.17-1.53.27-.75.27-1.4.19-1.53-.08-.13-.29-.21-.61-.37Z" />
  </svg>
);

const socialLinks = [
  { label: "Instagram", href: "https://www.instagram.com/waterfallcompanybr", icon: Instagram },
  { label: "Facebook", href: "https://www.facebook.com/waterfallcompanybr", icon: Facebook },
  { label: "YouTube", href: "https://www.youtube.com/@waterfallcompanybr", icon: Youtube },
];

const SidebarMenu = ({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) => {
  const links = [
    { label: "Início", href: "#home" },
    { label: "O Problema", href: "#problema" },
    { label: "Tecnologia", href: "#tecnologia" },
    { label: "Ion Center", href: "#ion-center" },
    { label: "Por que importa", href: "#porque" },
  ];

  const handleScroll = (href: string) => {
    onClose();
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className={`fixed inset-0 z-50 pointer-events-none`}>
      {/* Backdrop */}
      <div 
        className={`absolute inset-0 bg-black/30 backdrop-blur-xs transition-opacity duration-500 pointer-events-auto ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} 
        onClick={onClose}
      />
      {/* Drawer */}
      <div 
        className={`absolute top-0 left-0 w-80 h-full bg-white shadow-2xl p-8 flex flex-col justify-between transition-transform duration-500 ease-[0.21, 0.47, 0.32, 0.98] pointer-events-auto ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <div>
          <div className="flex justify-between items-center mb-12">
            <div className="flex items-center gap-2">
              <img src="/images/LOGO.png" alt="Water Diamond Logo" className="h-7 w-auto object-contain" />
              <div>
                <div className="font-semibold tracking-widest text-xs uppercase text-black">Water Diamond</div>
                <div className="text-[9px] tracking-widest uppercase text-neutral-500">Ion Center</div>
              </div>
            </div>
            <button onClick={onClose} className="p-2 text-black hover:opacity-75 transition-opacity cursor-pointer">
              <X size={20} />
            </button>
          </div>

          <nav className="flex flex-col gap-6">
            {links.map((link, i) => (
              <button 
                key={i} 
                onClick={() => handleScroll(link.href)}
                className="text-left text-lg font-light hover:text-primary transition-colors uppercase tracking-wider text-black py-2 cursor-pointer"
              >
                {link.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="text-neutral-400 text-[10px] tracking-widest uppercase">
          A melhor água do mundo.
        </div>
      </div>
    </div>
  );
};

const ContactModal = ({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) => {
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

    const payload = new FormData(e.currentTarget);
    payload.append("access_key", "8994e420-29d7-4bce-b0e8-a5c5fb4b0ccb");
    payload.append("subject", "Novo contato pelo site Water Diamond Ion Center");
    payload.append("from_name", "Water Diamond Ion Center");

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: payload,
      });
      const result = await response.json();

      if (!response.ok || result.success === false) {
        throw new Error(result.message || "Não foi possível enviar sua solicitação.");
      }

      setFormSubmitted(true);
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : "Algo deu errado. Tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
      {/* Backdrop */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/60 backdrop-blur-md"
        onClick={onClose}
      />

      {/* Modal Box */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ duration: 0.4, ease: [0.21, 0.47, 0.32, 0.98] }}
        className="relative bg-white text-black w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl z-10 border border-neutral-100"
      >
        <button 
          onClick={onClose} 
          className="absolute top-6 right-6 p-2 text-neutral-400 hover:text-primary transition-colors cursor-pointer"
        >
          <X size={20} />
        </button>

        <div className="p-8 md:p-10">
          {!formSubmitted ? (
            <>
              <div className="mb-8">
                <h3 className="text-2xl title-dark mb-2">Falar com um consultor</h3>
                <p className="text-sm font-light text-neutral-500">Deixe seus dados e um de nossos especialistas entrará em contato para um orçamento personalizado.</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label htmlFor="modal-name" className="block text-xs font-semibold uppercase tracking-wider text-neutral-500 mb-2">Nome Completo</label>
                  <input 
                    id="modal-name"
                    name="name"
                    type="text" 
                    required 
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="Seu nome"
                    className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary transition-colors"
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-5">
                  <div>
                    <label htmlFor="modal-phone" className="block text-xs font-semibold uppercase tracking-wider text-neutral-500 mb-2">WhatsApp / Telefone</label>
                    <input 
                      id="modal-phone"
                      name="phone"
                      type="tel" 
                      required 
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      placeholder="(00) 00000-0000"
                      className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary transition-colors"
                    />
                  </div>
                  <div>
                    <label htmlFor="modal-email" className="block text-xs font-semibold uppercase tracking-wider text-neutral-500 mb-2">E-mail</label>
                    <input 
                      id="modal-email"
                      name="email"
                      type="email" 
                      required 
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      placeholder="seu@email.com"
                      className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="modal-install" className="block text-xs font-semibold uppercase tracking-wider text-neutral-500 mb-2">Preferência de Instalação</label>
                  <select 
                    id="modal-install"
                    name="installation"
                    value={formData.installation}
                    onChange={(e) => setFormData({...formData, installation: e.target.value})}
                    className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary transition-colors appearance-none"
                  >
                    <option value="Bancada">Bancada de Cozinha</option>
                    <option value="Parede">Fixado na Parede</option>
                    <option value="Faucet Gourmet">Conexão Faucet Gourmet</option>
                    <option value="Outros">Outros / Comercial</option>
                  </select>
                </div>

                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="w-full bg-primary text-white rounded-full py-4 text-sm font-medium hover:bg-primary-hover transition-colors mt-4 cursor-pointer disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {isSubmitting ? "Enviando..." : "Falar com um consultor Waterfall"}
                </button>
                {submitError && (
                  <p className="text-center text-xs font-medium text-red-600" role="alert">
                    {submitError}
                  </p>
                )}
              </form>
            </>
          ) : (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-10"
            >
              <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Check size={28} className="text-black" />
              </div>
              <h3 className="text-2xl title-dark mb-2">Obrigado, {formData.name.split(' ')[0]}!</h3>
              <p className="text-sm font-light text-neutral-500 max-w-xs mx-auto mb-8">
                Nossos consultores receberam sua solicitação e entrarão em contato no WhatsApp em breve.
              </p>
              <button 
                onClick={() => {
                  window.location.href = WHATSAPP_URL;
                }}
                className="inline-flex items-center justify-center gap-2 bg-[#25D366] text-white rounded-full px-8 py-3 text-sm font-medium hover:bg-[#1ebe5d] transition-all duration-300 cursor-pointer"
              >
                <WhatsAppIcon className="h-5 w-5" />
                WhatsApp
              </button>
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

const FloatingWhatsAppButton = ({ onClick }: { onClick: () => void }) => (
  <button
    type="button"
    onClick={onClick}
    aria-label="Abrir formulário antes de falar no WhatsApp"
    className="fixed bottom-5 right-5 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-2xl shadow-black/20 transition-all duration-300 hover:-translate-y-1 hover:bg-[#1ebe5d] focus:outline-none focus:ring-2 focus:ring-[#25D366] focus:ring-offset-4 md:bottom-8 md:right-8 md:h-16 md:w-16"
  >
    <WhatsAppIcon className="h-8 w-8" />
  </button>
);

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

const SiteFooter = () => (
  <footer className="bg-[#050505] pt-10 pb-10 px-6 border-t border-white/5">
    <div className="w-full mx-auto flex flex-col md:flex-row justify-between items-start md:items-end gap-10">
      <div>
        <div className="flex items-center gap-3 mb-8">
          <img src="/images/LOGO.png" alt="Water Diamond Logo" className="h-9 w-auto object-contain brightness-0 invert" />
          <div>
            <div className="font-semibold tracking-widest text-base uppercase text-white leading-tight">Water Diamond</div>
            <div className="text-[10px] tracking-widest uppercase text-neutral-500 leading-none">Ion Center</div>
          </div>
        </div>
        <div className="mb-6 flex items-center gap-3">
          {socialLinks.map(({ label, href, icon: Icon }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Waterfall Company no ${label}`}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 text-neutral-400 transition-all duration-300 hover:-translate-y-0.5 hover:border-primary hover:bg-primary hover:text-white"
            >
              <Icon size={18} strokeWidth={1.8} />
            </a>
          ))}
        </div>
        <div className="flex flex-wrap gap-x-4 gap-y-3 text-neutral-400 text-sm">
          <a href="#" className="hover:text-white transition-colors">Contato</a>
          <a href="/politica-de-privacidade" className="hover:text-white transition-colors">Política de Privacidade</a>
          <a href="/termos-de-uso" className="hover:text-white transition-colors">Termos de Uso</a>
        </div>
      </div>
      <div className="text-neutral-500 text-xs text-left md:text-right">
        © {new Date().getFullYear()} Water Diamond. Todos os direitos reservados.
      </div>
    </div>
  </footer>
);

const LegalPage = ({ document }: { document: LegalDocument }) => (
  <div className="min-h-screen bg-[#f8f8f6] text-foreground selection:bg-neutral-200">
    <main className="mx-auto w-full max-w-5xl px-6 pb-20 pt-10 md:px-12 md:pb-28 md:pt-16">
      <a href="/" className="mb-16 inline-flex items-center gap-3 text-primary transition-opacity hover:opacity-75">
        <img
          src="/images/LOGO.png"
          alt="Water Diamond Logo"
          className="h-8 w-auto object-contain"
          style={{
            filter: 'brightness(0) saturate(100%) invert(47%) sepia(95%) saturate(1897%) hue-rotate(162deg) brightness(97%) contrast(101%)',
          }}
        />
        <span className="text-[11px] font-semibold uppercase tracking-[0.2em]">Voltar ao site</span>
      </a>

      <section className="mb-14 border-b border-neutral-200 pb-12 md:mb-16 md:pb-16">
        <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-primary">{document.eyebrow}</p>
        <h1 className="max-w-3xl text-4xl leading-tight tracking-[-0.03em] md:text-6xl">{document.title}</h1>
        <p className="mt-6 max-w-3xl text-base font-light leading-relaxed text-neutral-600 md:text-lg">{document.intro}</p>
        <p className="mt-6 text-xs font-medium uppercase tracking-[0.16em] text-neutral-400">{document.updatedAt}</p>
      </section>

      <div className="space-y-10 md:space-y-12">
        {document.sections.map((section) => (
          <section key={section.title} className="grid gap-4 md:grid-cols-[minmax(220px,0.45fr)_1fr] md:gap-10">
            <h2 className="text-xl font-medium tracking-[-0.02em] text-foreground">{section.title}</h2>
            <div className="space-y-4 text-sm font-light leading-relaxed text-neutral-600 md:text-base">
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

// --- Main App ---

export default function App() {
  const normalizedPath = window.location.pathname.replace(/\/$/, "") || "/";
  const legalDocument = legalDocuments[normalizedPath];

  if (legalDocument) {
    return <LegalPage document={legalDocument} />;
  }

  return <HomePage />;
}

const ionCenterProducts = [
  {
    tag: "Slim",
    name: "Ion Center Slim",
    headline: "Compacto e discreto",
    image: "/images/white01.png",
    imageAlt: "Ion Center Slim branco com quatro refis Max WaterDiamond",
    description: "Ideal para quem busca uma central de tratamento eficiente, elegante e integrada ao ambiente.",
    highlights: [
      "Design slim",
      "Água natural",
      "4 refis Max WaterDiamond",
      "Instalação em parede, bancada ou sob a pia",
      "Compatível com Faucet, Gourmet, máquinas de café e bebedouros",
    ],
    indicated: "Cozinhas residenciais, ambientes gourmet e aplicações sob bancada.",
    cta: "Conhecer Slim",
  },
  {
    tag: "Smart",
    name: "Ion Center Smart",
    headline: "Praticidade no dia a dia",
    image: "/images/SMART.png",
    imageAlt: "Ion Center Smart em acabamento preto e prata",
    description: "Une tratamento completo com a conveniência de água fria, gelada e natural em um sistema compacto.",
    highlights: [
      "Água fria, gelada e natural",
      "600ml de armazenamento de água gelada",
      "Refrigeração eletrônica",
      "Disponível em branco, preto e prata",
      "Sistema integrado ao tratamento WaterDiamond",
    ],
    indicated: "Famílias, cozinhas modernas, escritórios e ambientes de uso frequente.",
    cta: "Conhecer Smart",
    featured: true,
  },
  {
    tag: "Turbo",
    name: "Ion Center Turbo",
    headline: "Mais capacidade e performance",
    image: "/images/TURBO.png",
    imageAlt: "Ion Center Turbo preto com reservatório de água gelada",
    description: "A versão mais robusta da linha, criada para ambientes que precisam de mais volume e água gelada disponível por mais tempo.",
    highlights: [
      "Água gelada e natural",
      "1,5L/h de capacidade de refrigeração",
      "2,8L de armazenamento de água gelada",
      "Refrigeração por compressor",
      "Disponível em branco e preto",
    ],
    indicated: "Famílias maiores, empresas, consultórios, escritórios e espaços com alto consumo.",
    cta: "Conhecer Turbo",
  },
];

function HomePage() {
  const [scrolled, setScrolled] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const routineSectionRef = useRef<HTMLElement | null>(null);
  const [routineActiveIndex, setRoutineActiveIndex] = useState(0);
  const [routineScrollProgress, setRoutineScrollProgress] = useState(0);

  const activeColor = activeIndex < 2 ? 'white' : 'black';

  const setActiveColor = (color: 'white' | 'black') => {
    if (color === 'white' && activeIndex >= 2) {
      setDirection(-1);
      setActiveIndex(0);
    } else if (color === 'black' && activeIndex < 2) {
      setDirection(1);
      setActiveIndex(2);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleRoutineScroll = () => {
      const section = routineSectionRef.current;
      if (!section) return;

      const rect = section.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const totalScrollable = Math.max(section.offsetHeight - viewportHeight, 1);
      const travelled = Math.min(Math.max(-rect.top, 0), totalScrollable);
      const progress = travelled / totalScrollable;
      const nextIndex = Math.min(
        routineMoments.length - 1,
        Math.floor(progress * routineMoments.length)
      );

      setRoutineScrollProgress(progress);
      setRoutineActiveIndex(nextIndex);
    };

    handleRoutineScroll();
    window.addEventListener('scroll', handleRoutineScroll, { passive: true });
    window.addEventListener('resize', handleRoutineScroll);

    return () => {
      window.removeEventListener('scroll', handleRoutineScroll);
      window.removeEventListener('resize', handleRoutineScroll);
    };
  }, []);

  const handleNext = () => {
    setDirection(1);
    setActiveIndex(prev => (prev + 1) % 4);
  };

  const handlePrev = () => {
    setDirection(-1);
    setActiveIndex(prev => (prev - 1 + 4) % 4);
  };

  const setPage = (index: number) => {
    if (index === activeIndex) return;
    setDirection(index > activeIndex ? 1 : -1);
    setActiveIndex(index);
  };

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div id="home" className="min-h-screen bg-white selection:bg-neutral-200">
      <nav className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${scrolled ? 'bg-white/55 backdrop-blur-md border-b border-white/40 py-4' : 'bg-transparent py-6'}`}>
        <div className="w-full mx-auto px-6 md:px-12 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsMenuOpen(true)}
              className={`p-2 -ml-2 transition-colors cursor-pointer md:hidden ${
                scrolled ? 'text-primary hover:text-primary-hover' : 'text-white mix-blend-difference hover:text-primary'
              }`}
            >
              <Menu size={20} />
            </button>
            <div 
              onClick={() => document.querySelector('#home')?.scrollIntoView({ behavior: 'smooth' })}
              className={`flex items-center gap-2 cursor-pointer ${scrolled ? 'text-primary' : 'text-white mix-blend-difference'}`}
            >
              <img
                src="/images/LOGO.png"
                alt="Water Diamond Logo"
                className="h-7 w-auto object-contain"
                style={{
                  filter: scrolled
                    ? 'brightness(0) saturate(100%) invert(47%) sepia(95%) saturate(1897%) hue-rotate(162deg) brightness(97%) contrast(101%)'
                    : 'brightness(0) invert(1)',
                }}
              />
            </div>
          </div>
          
          <div className="hidden md:block absolute left-1/2 -translate-x-1/2">
            <NavHeader 
              scrolled={scrolled}
              tabs={[
                { label: "Início", onClick: () => document.querySelector('#home')?.scrollIntoView({ behavior: 'smooth' }) },
                { label: "O Problema", onClick: () => document.querySelector('#problema')?.scrollIntoView({ behavior: 'smooth' }) },
                { label: "Tecnologia", onClick: () => document.querySelector('#tecnologia')?.scrollIntoView({ behavior: 'smooth' }) },
                { label: "Ion Center", onClick: () => document.querySelector('#ion-center')?.scrollIntoView({ behavior: 'smooth' }) },
              ]} 
            />
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className={`inline-flex items-center justify-center rounded-full border px-4 py-2 text-[11px] font-medium uppercase tracking-[0.18em] backdrop-blur-md transition-all duration-300 active:scale-[0.98] ${
              scrolled
                ? 'border-primary bg-primary text-white hover:bg-primary-hover'
                : 'border-white/20 bg-white/10 text-white hover:bg-white/20'
            }`}
          >
            Contato
          </button>
        </div>
      </nav>

      {/* SEÇÃO 1 — HERO */}
      <section className="relative w-full bg-[#f3eee6] px-0 pt-0 md:px-4">
        <div className="relative flex min-h-screen w-full items-center overflow-hidden bg-black md:rounded-b-[38px]">
        <div className="absolute inset-0 z-0">
          <video
            autoPlay
            loop
            muted
            playsInline
            poster="https://images.unsplash.com/photo-1548839140-29a749e1bc4e?q=80&w=2000&auto=format&fit=crop"
            className="w-full h-full object-cover opacity-60"
          >
            <source src="/videos/IONCENTER_VIDEO.mp4" type="video/mp4" />
            Seu navegador não suporta vídeos HTML5.
          </video>
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/10 to-black/78" />
          <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black/40 to-transparent" />
        </div>
        
        <div className="relative z-10 w-full mx-auto px-6 md:px-12 pt-20">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="text-white max-w-3xl"
          >
            <p className="text-xs uppercase tracking-[0.2em] mb-6 text-primary font-semibold">Water Diamond Ion Center</p>
            <h1 className="text-5xl md:text-6xl lg:text-7xl title-light leading-[1.05] mb-8">
              A melhor água do mundo.
            </h1>
            <Button onClick={() => setIsModalOpen(true)} variant="primary" className="px-10">
              quero conhecer
            </Button>
          </motion.div>
        </div>
        </div>
      </section>

      {/* SEÇÃO 2 — O PROBLEMA INVISÍVEL */}
      <section id="problema" className="bg-[#f3eee6] px-6 py-16 md:py-24">
        <div className="max-w-5xl md:max-w-[90rem] mx-auto">
          <FadeIn>
            <div className="flex flex-col items-center text-center">
              <h2 className="max-w-4xl md:max-w-[72rem] text-4xl sm:text-5xl md:text-[3.5rem] lg:text-[4rem] font-semibold title-dark leading-[1.05] mb-0">
                Sua água parece limpa,
                <br className="hidden md:block" />
                <span className="md:hidden"> </span>
                <span className="title-accent md:inline-block md:whitespace-nowrap">mas aparência não garante pureza.</span>
              </h2>
              <div className="w-[calc(100%+4rem)] max-w-none -mx-8 -mt-12 md:w-full md:max-w-[72rem] md:mx-0 md:-mt-28 lg:-mt-34 mb-2 md:mb-0">
                <img
                  src="/images/GALAO_FILTRO_CAIXA.png"
                  alt="Galão e filtro em caixa"
                  className="w-full h-auto object-cover"
                />
              </div>

              <div className="max-w-4xl md:max-w-[56rem] space-y-6 md:-mt-4 text-center">
                <p className="text-lg md:text-xl font-light text-neutral-600 leading-relaxed text-justify">
                  Antes de chegar ao seu copo, a sua água passa por tratamentos, tubulações, reservatórios e instalações internas. Nesse caminho, ela pode entrar em contato com partículas sólidas, resíduos químicos, microrganismos e substâncias que não aparecem na cor, no cheiro ou no sabor. Por isso, mesmo transparente e sem odor aparente, ela ainda pode carregar elementos invisíveis que fazem parte do que você consome todos os dias.
                </p>
                <p className="text-2xl md:text-3xl font-medium title-dark leading-tight">
                  O maior problema da sua água não é o que aparece. É o que passa despercebido.
                </p>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* SEÇÃO 3 — O CAMINHO DA ÁGUA */}
      <section id="tecnologia" className="py-24 md:py-40 bg-[#f8f8f6]">
        <div className="w-full mx-auto px-6 md:px-12">
          <div className="grid items-start gap-12 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.35fr)] lg:gap-16">
            <FadeIn className="lg:sticky lg:top-28">
              <div className="max-w-xl">
                <h2 className="text-3xl md:text-5xl title-dark leading-tight mb-6">
                  Da origem ao seu copo, muita coisa pode acontecer.
                </h2>
                <p className="text-lg font-light text-neutral-500 leading-relaxed">
                  A água que você consome passa por captação, tratamento, distribuição e reservação antes de chegar à sua rotina. Em cada etapa, existem fatores invisíveis que podem interferir diretamente na qualidade final.
                </p>
              </div>
            </FadeIn>

            <FadeIn delay={0.1}>
              <div className="w-full">
                <ExpandingCardsDemo />
              </div>
            </FadeIn>
          </div>

          <FadeIn delay={0.15}>
            <div className="max-w-3xl mt-14 pt-8 border-t border-neutral-200">
              <p className="text-lg font-light text-neutral-600 leading-relaxed">
                Entre a origem e o consumo, existe um caminho inteiro que você não vê, mas sente todos os dias.
              </p>
            </div>
          </FadeIn>
        </div>
      </section>
      {/* SEÇÃO 4 — CONTAMINAÇÃO */}
      <section className="bg-[#f4f1ec] text-black w-full">
        <div className="w-full max-w-7xl mx-auto px-6 md:px-12 py-24 md:py-32">
          <FadeIn>
            <div className="mx-auto max-w-5xl text-center mb-16 md:mb-20">
              <span className="inline-flex items-center justify-center rounded-full border border-neutral-300/80 px-4 py-1 text-[10px] font-medium uppercase tracking-[0.28em] text-neutral-500">
                Contaminantes invisíveis
              </span>
              <h2 className="mt-5 text-4xl md:text-6xl title-dark leading-[0.95] mb-6">
                Sua água pode carregar mais do que você imagina.
              </h2>
              <p className="mx-auto max-w-4xl text-lg md:text-xl font-light text-neutral-600 leading-relaxed">
                A contaminação da água pode surgir em diferentes camadas — físicas, químicas e biológicas — muitas vezes sem alterar sua aparência. Por isso, uma solução simples nem sempre é suficiente.
              </p>
            </div>
          </FadeIn>

          <div className="grid gap-y-12 gap-x-8 sm:grid-cols-2 xl:grid-cols-5">
            {contaminationLayers.map((item, index) => (
              <FadeIn key={item.title} delay={0.08 + index * 0.06}>
                <article className="mx-auto flex h-full max-w-[240px] flex-col items-center text-center">
                  <div className="mb-5 flex h-24 w-24 items-center justify-center rounded-full bg-[#bfe1e7] text-[#344966] shadow-[inset_0_1px_0_rgba(255,255,255,0.4)]">
                    {item.icon}
                  </div>
                  <h3 className="text-[1.35rem] leading-tight title-dark">
                    {item.title}
                  </h3>
                  <p className="mt-3 text-[0.96rem] font-light leading-relaxed text-neutral-600">
                    {item.desc}
                  </p>
                </article>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* SEÇÃO 5 — DESEQUILÍBRIO DA ÁGUA */}
      <section className="py-18 md:py-24 bg-white">
        <div className="w-full max-w-6xl mx-auto px-6 md:px-12">
          <div className="grid md:grid-cols-[minmax(0,0.82fr)_minmax(320px,1fr)] gap-10 md:gap-14 items-center">
            <FadeIn className="order-1 md:order-1 max-w-xl">
              <h2 className="text-[1.9rem] md:text-[2.85rem] title-dark leading-[1.02] mb-5">
                Água pura também precisa de
                <span className="block text-primary">equilíbrio.</span>
              </h2>
              <div className="max-w-md space-y-4 text-base md:text-[1.05rem] leading-relaxed font-light text-neutral-600">
                <p>Não basta remover impurezas. A água que você consome também precisa manter um pH adequado e uma composição mineral equilibrada.</p>
                <p>Em processos convencionais, ela pode perder minerais importantes e se tornar mais ácida do que o ideal, comprometendo a sensação de qualidade no consumo diário.</p>
              </div>
              <p className="mt-6 inline-flex max-w-lg border-l-2 border-primary pl-4 text-sm md:text-base font-medium text-neutral-900 leading-relaxed">
                pH baixo e baixa mineralização afastam a água do padrão natural e reduzem parte do equilíbrio que ela deveria entregar.
              </p>
            </FadeIn>
            <FadeIn className="order-2 md:order-2 flex items-center justify-center">
               <img
                  src="/images/PH.png"
                  alt="Ilustracao sobre equilibrio de pH da agua"
                  className="w-full max-w-[330px] md:max-w-[420px] h-auto object-contain"
                />
            </FadeIn>
          </div>
        </div>
      </section>

      {/* SEÇÃO 6 — O PERIGO INVISÍVEL */}
      <section className="py-18 md:py-24 bg-[#f6f2ea]">
        <div className="w-full max-w-6xl mx-auto px-6 md:px-12">
          <div className="grid md:grid-cols-[minmax(0,0.82fr)_minmax(320px,1fr)] gap-10 md:gap-14 items-center">
            <FadeIn className="order-1 md:order-1 max-w-xl">
              <h2 className="text-[1.9rem] md:text-[2.85rem] title-dark leading-[1.02] mb-5">
                Não é só sobre filtrar.
                <span className="block font-semibold title-accent">É sobre equilibrar a água.</span>
              </h2>
              <div className="max-w-md space-y-4 text-base md:text-[1.05rem] leading-relaxed font-light text-neutral-600">
                <p>Campos eletromagnéticos, redes e interferências fazem parte da rotina moderna e podem impactar o estado da água.</p>
                <p>A tecnologia Water Diamond® entra nesse ponto para reorganizar e devolver mais equilíbrio ao que você consome todos os dias.</p>
              </div>
              <p className="mt-6 inline-flex max-w-lg border-l-2 border-primary pl-4 text-sm md:text-base font-medium text-neutral-900 leading-relaxed">
                Uma proposta mais direta: transformar a água da casa em um novo padrão de qualidade.
              </p>
            </FadeIn>
            <FadeIn className="order-2 md:order-2 aspect-[1.18/1] md:aspect-[1.12/1] bg-[#e8e1d6] rounded-[1.75rem] overflow-hidden">
              <img 
                src="/images/AGUA%20EQUILIBRIO.jpeg" 
                alt="Copo com agua representando equilibrio" 
                className="w-full h-full object-cover"
              />
            </FadeIn>
          </div>
        </div>
      </section>

      {/* SEÇÃO 7 — OS EFEITOS DE UMA ÁGUA DE BAIXA QUALIDADE */}
      <section
        ref={routineSectionRef}
        className="relative h-[320vh]"
        style={{
          background:
            "radial-gradient(circle at center, #7fc8ff 0%, #69bbfb 42%, #4ea8ef 72%, #3a93dc 100%)",
        }}
      >
        <div className="sticky top-0 flex min-h-screen items-center">
          <div className="w-full mx-auto px-6 py-16 md:px-12 md:py-20">
            <div className="mx-auto flex max-w-5xl flex-col items-center text-center">
              <FadeIn>
                <h2 className="text-3xl md:text-5xl title-light leading-tight">
                  O que você consome todos os dias se torna <strong className="font-bold">parte da sua rotina.</strong>
                </h2>
              </FadeIn>

              <div className="mt-14 w-full max-w-4xl">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={routineMoments[routineActiveIndex].title}
                    initial={{ opacity: 0, y: 56, filter: 'blur(20px)' }}
                    animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                    exit={{ opacity: 0, y: -20, filter: 'blur(16px)' }}
                    transition={{ duration: 0.82, ease: [0.16, 1, 0.3, 1] }}
                    className="relative flex flex-col items-center"
                  >
                    <h3 className="relative z-0 mb-[-0.8rem] translate-y-8 text-5xl font-semibold title-light md:mb-[-1.6rem] md:translate-y-10 md:text-7xl">
                      {routineMoments[routineActiveIndex].title}
                    </h3>
                    <img
                      src={routineMoments[routineActiveIndex].image}
                      alt={routineMoments[routineActiveIndex].title}
                      className="relative z-10 h-auto w-[118%] max-w-none object-cover md:w-full md:max-w-[56rem]"
                    />
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SEÇÃO 8 — POR QUE FILTROS COMUNS SÃO INCOMPLETOS */}
      <section className="px-6 py-32 text-center md:py-48 bg-[#f0ece9]">
        <div className="mx-auto max-w-5xl">
          <FadeIn>
            <p className="mb-5 text-[11px] font-semibold uppercase tracking-[0.24em] text-neutral-500">
              Filtrar x tratar
            </p>
            <h2 className="mx-auto mb-8 max-w-4xl text-4xl title-dark leading-[1.02] md:text-6xl">
              Filtrar é importante.<br/>
              <span className="title-accent">Mas filtrar não é tratar por completo.</span>
            </h2>
            <p className="mx-auto mb-14 max-w-2xl text-lg font-light text-neutral-600 md:text-xl">
              Muitos filtros comuns foram desenvolvidos para resolver apenas parte do problema.
            </p>

            <div className="rounded-[2rem] border border-black/6 bg-white/55 p-5 shadow-[0_20px_60px_rgba(24,24,27,0.04)] backdrop-blur-[2px] md:p-8">
              <div className="grid gap-4 md:grid-cols-[1fr_auto_1fr] md:items-center">
                <div className="rounded-[1.6rem] border border-neutral-200 bg-white px-5 py-6 text-left md:px-6">
                  <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-neutral-400">
                    O que um filtro comum costuma resolver
                  </p>
                  <div className="flex flex-wrap gap-2.5">
                    {commonFilterBenefits.map((pill) => (
                      <motion.span
                        key={pill}
                        whileHover={{ y: -2 }}
                        transition={{ duration: 0.2, ease: 'easeOut' }}
                        className="rounded-full border border-neutral-200 bg-neutral-50 px-4 py-2 text-sm tracking-wide text-neutral-600"
                      >
                        {pill}
                      </motion.span>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-center gap-3 px-2 py-1 text-neutral-400 md:flex-col">
                  <span className="h-px w-10 bg-neutral-300 md:h-10 md:w-px" />
                  <div className="flex h-11 w-11 items-center justify-center rounded-full border border-neutral-300 bg-white text-neutral-500 shadow-sm">
                    <ArrowRight className="h-4 w-4 md:rotate-90" />
                  </div>
                  <span className="h-px w-10 bg-neutral-300 md:h-10 md:w-px" />
                </div>

                <div className="rounded-[1.6rem] border border-[#344966]/12 bg-[#344966] px-5 py-6 text-left text-white md:px-6">
                  <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/60">
                    O que um tratamento completo também considera
                  </p>
                  <div className="flex flex-wrap gap-2.5">
                    {fullTreatmentBenefits.map((pill) => (
                      <motion.span
                        key={pill}
                        whileHover={{ y: -2 }}
                        transition={{ duration: 0.2, ease: 'easeOut' }}
                        className="rounded-full border border-white/16 bg-white/8 px-4 py-2 text-sm font-medium tracking-wide text-white"
                      >
                        {pill}
                      </motion.span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <p className="mx-auto mt-8 max-w-2xl text-base font-light leading-relaxed text-neutral-600 md:text-lg">
              Em outras palavras: um filtro pode melhorar a experiência imediata. Um sistema de tratamento busca elevar o padrão da água de forma mais ampla e consistente.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* SEÇÃO 9 — UMA NOVA CATEGORIA */}
      <section
        id="ion-center"
        className="relative overflow-hidden text-center"
      >
        <div
          className="relative flex min-h-[32rem] w-full flex-col items-center justify-start bg-center bg-no-repeat bg-cover px-6 py-12 md:min-h-[52rem] md:py-16"
          style={{ backgroundImage: "url('/images/PRODUTOS.jpg')" }}
        >
          <FadeIn>
            <h2 className="relative z-10 max-w-5xl text-3xl md:text-5xl title-light leading-tight">
              Não é um filtro.<br/>
              <span className="title-light">É uma central de tratamento de água.</span>
            </h2>
          </FadeIn>

          <FadeIn delay={0.1} className="relative z-10 mt-auto hidden w-full max-w-7xl pt-12 md:block">
            <div className="grid grid-cols-4 gap-x-4 gap-y-8 lg:grid-cols-8">
              {technologyHighlights.map((item) => (
                <div key={item.title} className="flex flex-col items-center text-center">
                  <div className="mb-4 flex h-18 w-18 items-center justify-center rounded-full border border-white/20 bg-[#d6eff8]/90 text-[#103b5b] shadow-[0_10px_30px_rgba(4,18,34,0.18)]">
                    {item.icon}
                  </div>
                  <p className="max-w-[9rem] text-sm font-medium leading-snug text-white md:text-[0.95rem]">
                    {item.title}
                  </p>
                </div>
              ))}
            </div>
          </FadeIn>
        </div>

        <FadeIn delay={0.1} className="bg-[#0b95cf] px-6 py-10 md:hidden">
          <div className="grid grid-cols-2 gap-x-4 gap-y-8">
            {technologyHighlights.map((item) => (
              <div key={item.title} className="flex flex-col items-center text-center">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full border border-white/20 bg-[#d6eff8] text-[#103b5b] shadow-[0_10px_30px_rgba(4,18,34,0.18)]">
                  {item.icon}
                </div>
                <p className="max-w-[9rem] text-sm font-medium leading-snug text-white">
                  {item.title}
                </p>
              </div>
            ))}
          </div>
        </FadeIn>
      </section>

      {/* SEÇÃO 10 — A SOLUÇÃO (Produto com carrossel) */}
      <section id="detalhes" className="py-24 md:py-40 bg-[#f8f8f6]">
        <div className="w-full mx-auto px-6 md:px-12">
          <div className="grid md:grid-cols-2 gap-16 lg:gap-32 items-center">
            
            <div className="order-2 md:order-1 flex flex-col gap-6">
              <div className="relative aspect-square w-full overflow-hidden flex items-center justify-center">
                <AnimatePresence initial={false} custom={direction} mode="popLayout">
                  <motion.img
                    key={activeIndex}
                    custom={direction}
                    variants={{
                      enter: (dir: number) => ({
                        x: dir > 0 ? '100%' : dir < 0 ? '-100%' : 0,
                        opacity: 0
                      }),
                      center: {
                        x: 0,
                        opacity: 1
                      },
                      exit: (dir: number) => ({
                        x: dir > 0 ? '-100%' : dir < 0 ? '100%' : 0,
                        opacity: 0
                      })
                    }}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{
                      x: { type: 'spring', stiffness: 300, damping: 30 },
                      opacity: { duration: 0.2 }
                    }}
                    src={activeIndex === 0 ? '/images/white01.png'
                      : activeIndex === 1 ? '/images/white02.png'
                      : activeIndex === 2 ? '/images/black01.png'
                      : '/images/black02.png'
                    }
                    alt="Water Diamond Ion Center"
                   
                   
                   
                   
                    className="w-full h-full object-contain absolute"
                  />
                </AnimatePresence>
              </div>

              {/* Controles do Carrossel */}
              <div className="flex justify-between items-center px-4 mt-2">
                <div className="flex gap-2.5">
                  {[0, 1, 2, 3].map((index) => (
                    <button
                      key={index}
                      onClick={() => setPage(index)}
                  className={`w-1.5 h-1.5 rounded-full transition-all duration-300 cursor-pointer ${activeIndex === index ? 'bg-primary scale-125' : 'bg-neutral-300 hover:bg-neutral-400'}`}
                      aria-label={`Ir para imagem ${index + 1}`}
                    />
                  ))}
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={handlePrev}
                    className="w-10 h-10 rounded-full border border-neutral-200 bg-white text-black flex items-center justify-center hover:bg-neutral-800 hover:text-white hover:border-transparent transition-colors cursor-pointer"
                    aria-label="Imagem anterior"
                  >
                    <ChevronRight size={18} className="rotate-180" />
                  </button>
                  <button
                    onClick={handleNext}
                    className="w-10 h-10 rounded-full border border-neutral-200 bg-white text-black flex items-center justify-center hover:bg-neutral-800 hover:text-white hover:border-transparent transition-colors cursor-pointer"
                    aria-label="Próxima imagem"
                  >
                    <ChevronRight size={18} />
                  </button>
                </div>
              </div>
            </div>

            <div className="order-1 md:order-2">
              <FadeIn>
                <p className="text-[10px] tracking-[0.2em] uppercase text-primary font-semibold mb-3">
                  Water Diamond Ion Center
                </p>
                <h2 className="text-3xl md:text-4xl title-dark leading-tight mb-5">
                  Uma central de tratamento de água desenvolvida para quem entende que água não é detalhe.
                </h2>
                <p className="text-sm font-light text-neutral-500 leading-relaxed mb-8">
                  O Ion Center combina tecnologia, ciência e design para entregar uma experiência completa de água tratada dentro de casa. Com ele, a água passa por etapas complementares que atuam desde a remoção de impurezas até a ionização Water Diamond®.
                </p>

                <hr className="border-t border-neutral-200 my-6" />

                <div className="mb-6">
                  <p className="text-sm font-medium text-neutral-700 mb-4">Em um único sistema:</p>
                  <div className="flex flex-wrap gap-2">
                    {["Ultra filtragem", "Purificação", "Purificação profunda", "Alcalinização", "Mineralização", "Ionização Water Diamond®", "Reorganização molecular", "Equilíbrio eletromagnético"].map((item, i) => (
                      <span key={i} className="text-xs px-3 py-1.5 rounded-full border border-neutral-200 text-neutral-600 bg-neutral-50">{item}</span>
                    ))}
                  </div>
                </div>

                {/* Seletor de Acabamento */}
                <hr className="border-t border-neutral-200 my-6" />
                <div className="flex items-center justify-between py-2">
                  <span className="text-sm font-light text-neutral-600">
                    {activeColor === 'white' ? 'White' : 'Black'}
                  </span>
                  <div className="flex gap-5 px-1">
                    <button 
                      onClick={() => setActiveColor('white')}
                      className="w-5 h-5 rounded-full bg-white border border-neutral-300 transition-all duration-300 cursor-pointer relative flex items-center justify-center"
                      aria-label="White"
                    >
                      {activeColor === 'white' && (
                        <span className="absolute w-7 h-7 rounded-full border border-primary pointer-events-none" />
                      )}
                    </button>
                    <button 
                      onClick={() => setActiveColor('black')}
                      className="w-5 h-5 rounded-full bg-neutral-900 border border-neutral-800 transition-all duration-300 cursor-pointer relative flex items-center justify-center"
                      aria-label="Black"
                    >
                      {activeColor === 'black' && (
                        <span className="absolute w-7 h-7 rounded-full border border-primary pointer-events-none" />
                      )}
                    </button>
                  </div>
                </div>

                <hr className="border-t border-neutral-200 my-6" />

                <div className="pt-4">
                  <Button 
                    onClick={() => document.querySelector('#etapas')?.scrollIntoView({ behavior: 'smooth' })} 
                    variant="outline"
                  >
                    Ver cada etapa do sistema
                  </Button>
                </div>
              </FadeIn>
            </div>

          </div>
        </div>
      </section>

      {/* SEÇÃO 11 — ETAPAS DO SISTEMA */}
      <section id="etapas" className="relative overflow-hidden bg-[#f0ece9] py-24 md:py-40">
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(circle at 10% 12%, rgba(0,154,206,0.16), transparent 30%), radial-gradient(circle at 90% 8%, rgba(255,255,255,0.75), transparent 28%), linear-gradient(180deg, #f0ece9 0%, #edf5f6 52%, #f8f8f6 100%)",
          }}
        />
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.16]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(23,32,51,0.18) 1px, transparent 1px), linear-gradient(90deg, rgba(23,32,51,0.18) 1px, transparent 1px)",
            backgroundSize: "44px 44px",
          }}
        />

        <div className="relative w-full mx-auto px-6 md:px-12">
          <FadeIn>
            <div className="mx-auto max-w-[92rem]">
              <div className="grid gap-6 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,0.72fr)] lg:items-end">
                <h2 className="max-w-5xl text-4xl md:text-6xl title-dark leading-[0.96]">
                  Um sistema completo precisa agir em sequência.
                </h2>
                <p className="max-w-2xl text-lg md:text-xl font-light leading-relaxed text-neutral-600 lg:pb-1">
                  Cada refil assume uma função específica. Em vez de repetir a mesma filtragem, o Ion Center conduz a água por camadas complementares: remoção física, purificação química, retenção profunda e equilíbrio mineral.
                </p>
              </div>
            </div>
          </FadeIn>

          <div className="mx-auto mt-16 max-w-[92rem] space-y-5 md:mt-20 md:space-y-6">
            {refillVisualBlocks.map((item, index) => (
              <FadeIn key={item.name} delay={0.08 + index * 0.06}>
                <div className="relative flex min-h-[34rem] w-full flex-col overflow-hidden rounded-[2rem] bg-primary md:block md:h-64 md:min-h-0 lg:h-72">
                  <img
                    src={item.image}
                    alt={item.alt}
                    className={`relative z-0 mx-auto mt-6 h-56 w-auto max-w-[84%] object-contain md:mt-0 md:w-auto md:max-w-none ${item.className}`}
                  />
                  <div
                    className={`relative z-10 flex flex-1 items-start px-7 pb-8 pt-4 text-left text-white md:h-full md:items-center md:px-12 md:py-7 lg:px-16 ${
                      item.textAlign === 'right' ? 'md:justify-end md:text-right' : 'md:justify-start md:text-left'
                    }`}
                  >
                    <div className="max-w-[31rem]">
                      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-white/72 md:text-sm">
                        {item.refill}
                      </p>
                      <h3 className="mt-2 text-2xl font-medium leading-none tracking-tight md:text-4xl">
                        {item.title}
                      </h3>
                      <p className="mt-4 text-sm font-light leading-relaxed text-white/86 md:text-base">
                        {item.description}
                      </p>
                      <p className="mt-4 text-sm font-medium leading-relaxed text-white md:text-base">
                        {item.result}
                      </p>
                    </div>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* SEÇÃO 11b — IONIZAÇÃO WATER DIAMOND (Destaque especial) */}
      <section className="py-24 md:py-40 bg-primary text-white relative overflow-hidden">
        <div className="w-full max-w-6xl mx-auto px-6 md:px-12 relative z-10">
          <div className="grid md:grid-cols-2 gap-16 lg:gap-20 items-center">
            <FadeIn>
              <p className="text-xs font-semibold tracking-widest uppercase text-neutral-900 mb-4">Etapa 05 — Tecnologia Exclusiva</p>
              <h2 className="text-4xl md:text-5xl title-light mb-6">
                Ionização Water Diamond®
              </h2>
              <p className="text-xl text-neutral-900 font-light mb-8">Equilíbrio e reorganização da água</p>
              <p className="text-neutral-900 font-light leading-relaxed mb-10">
                Atua no estado elétrico e estrutural da água, convertendo íons positivos em íons negativos e reorganizando sua estrutura molecular.
              </p>
              <div className="border-t border-white/10 pt-6">
                <p className="text-sm font-medium text-white">Resultado: água mais equilibrada, organizada e em um novo padrão de qualidade.</p>
              </div>
            </FadeIn>
            <FadeIn className="flex justify-center md:justify-end">
              <div className="relative w-full max-w-md overflow-hidden rounded-2xl border border-white/20 bg-white/10 shadow-2xl shadow-black/20">
                <video
                  className="aspect-[4/5] w-full object-cover"
                  src="/videos/BASTAO_VIDEO.mp4"
                  autoPlay
                  muted
                  loop
                  playsInline
                  aria-label="Vídeo do bastão Water Diamond"
                />
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* SEÇÃO 12 — LINHA WATER DIAMOND ION CENTER */}
      <section id="modelos" className="overflow-hidden bg-white py-24 md:py-36">
        <div className="mx-auto w-full max-w-[1480px] px-5 md:px-10">
          <FadeIn>
            <div className="mb-12 grid gap-8 md:mb-16 md:grid-cols-[minmax(0,0.95fr)_minmax(360px,0.7fr)] md:items-end">
              <div>
                <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-primary">Linha Water Diamond Ion Center</p>
                <h2 className="max-w-3xl text-4xl leading-[0.98] tracking-[-0.03em] text-foreground md:text-6xl">
                  Uma tecnologia.
                  <span className="block text-primary">Três formas de viver a melhor água.</span>
                </h2>
              </div>

              <div className="space-y-4 text-base font-light leading-relaxed text-neutral-500 md:text-lg">
                <p>
                  Cada rotina pede uma solução diferente. Por isso, a linha Ion Center conta com três modelos: Slim, Smart e Turbo.
                </p>
                <p>
                  Todos entregam o mesmo princípio de tratamento Water Diamond: água mais pura, equilibrada e preparada para o consumo diário. O que muda é a forma de uso, a capacidade e a experiência.
                </p>
              </div>
            </div>
          </FadeIn>

          <div className="pb-4">
            <div className="grid grid-cols-1 gap-5 md:grid-cols-3 md:gap-4 lg:gap-5">
              {ionCenterProducts.map((product, index) => (
                <FadeIn key={product.name} delay={0.16 + index * 0.08} className="h-full">
                  <article
                    className={`group relative flex h-full flex-col rounded-[18px] border p-3 transition-all duration-300 hover:-translate-y-1 md:min-h-[720px] ${
                      product.featured
                        ? "border-primary/60 bg-[#eef8fb] shadow-xl shadow-primary/10"
                      : "border-neutral-200 bg-[#f4f5f4] hover:border-neutral-300"
                    }`}
                  >
                    <div className="relative mb-5 flex h-[260px] items-center justify-center overflow-hidden rounded-[14px] bg-white/70 p-8 md:h-[300px]">
                      <div className="absolute inset-x-10 bottom-8 h-10 rounded-full bg-primary/10 blur-2xl transition-transform duration-500 group-hover:scale-110" />
                      <img
                        src={product.image}
                        alt={product.imageAlt}
                        className={`relative z-[1] h-full w-full object-contain transition-transform duration-500 group-hover:scale-[1.03] ${
                          product.tag === "Slim" ? "scale-[1.18]" : ""
                        }`}
                      />
                    </div>

                    <div className="flex flex-1 flex-col px-2 pb-2">
                      <div className="mb-6 min-h-[150px]">
                        <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-neutral-400">{product.name}</p>
                        <h3 className="mb-3 text-2xl font-medium tracking-[-0.02em] text-foreground md:text-3xl">{product.headline}</h3>
                        <p className="text-sm font-light leading-relaxed text-neutral-600">{product.description}</p>
                      </div>

                      <div className="mb-6">
                        <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-neutral-400">Destaques</p>
                        <ul className="space-y-2.5">
                          {product.highlights.map((item) => (
                            <li key={item} className="flex gap-2.5 text-sm font-light leading-snug text-neutral-700">
                              <Check size={15} strokeWidth={1.8} className="mt-0.5 shrink-0 text-primary" />
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="mt-auto rounded-[14px] bg-white/70 p-4">
                        <p className="mb-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-neutral-400">Indicado para</p>
                        <p className="text-sm font-light leading-relaxed text-neutral-600">{product.indicated}</p>
                      </div>

                      <button
                        onClick={() => setIsModalOpen(true)}
                        className={`mt-4 flex w-full items-center justify-between rounded-full px-5 py-4 text-xs font-semibold uppercase tracking-[0.16em] transition-all duration-300 cursor-pointer ${
                          product.featured
                            ? "bg-primary text-white hover:bg-primary-hover"
                            : "bg-foreground text-white hover:bg-primary"
                        }`}
                      >
                        {product.cta}
                        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/15 transition-transform duration-300 group-hover:translate-x-1">
                          <ArrowRight size={16} strokeWidth={1.8} />
                        </span>
                      </button>
                    </div>
                  </article>
                </FadeIn>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* SEÇÃO 13 — TORNEIRAS E APLICAÇÕES */}
      <section id="especificacoes" className="relative overflow-hidden py-24 md:py-40 bg-[#f8f8f6] border-t border-neutral-200">
        <div className="pointer-events-none absolute left-0 top-0 h-56 w-56 rounded-full bg-primary/15 blur-3xl" />
        <div className="pointer-events-none absolute right-0 bottom-10 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />

        <div className="relative w-full mx-auto px-6 md:px-12">
          <div className="mx-auto max-w-5xl">
            <FadeIn className="mb-12 text-center">
              <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-primary">Torneiras e aplicações</p>
              <h2 className="text-3xl md:text-5xl title-dark mb-6">A tecnologia se adapta ao seu ambiente.</h2>
              <p className="mx-auto max-w-2xl text-neutral-600 font-light leading-relaxed">
                A linha Ion Center pode ser integrada a diferentes formas de uso, dependendo da estrutura da cozinha e da experiência desejada.
              </p>
            </FadeIn>

            <div className="grid grid-cols-1 gap-6 min-[560px]:grid-cols-2 md:gap-8">
              {[
                {
                  title: "Modelo Faucet",
                  image: "/images/FAUCET.png",
                  alt: "Torneira modelo Faucet em cozinha moderna",
                  desc: "Uma opção elegante para quem deseja uma saída dedicada para água tratada, com visual limpo e prático.",
                },
                {
                  title: "Modelo Gourmet",
                  image: "/images/GOURMET.png",
                  alt: "Torneira gourmet preta instalada em bancada de cozinha",
                  desc: "Ideal para cozinhas sofisticadas, ambientes planejados e espaços gourmet, unindo funcionalidade, estética e experiência premium.",
                },
              ].map((item, i) => (
                <FadeIn key={item.title} delay={i * 0.1}>
                  <article className="group flex h-full flex-col overflow-hidden rounded-[18px] border border-neutral-200 bg-white p-3 shadow-sm shadow-primary/5 transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-xl hover:shadow-primary/10">
                    <div className="relative aspect-[3/4] overflow-hidden rounded-[14px] bg-neutral-100">
                      <img
                        src={item.image}
                        alt={item.alt}
                        className="h-full w-full object-contain transition-transform duration-700 group-hover:scale-[1.02]"
                      />
                    </div>

                    <div className="flex flex-1 flex-col px-3 pb-5 pt-6 text-center">
                      <h3 className="mb-3 text-xl font-medium tracking-[-0.02em] text-foreground">{item.title}</h3>
                      <p className="mx-auto max-w-sm text-sm font-light leading-relaxed text-neutral-500">{item.desc}</p>
                    </div>
                  </article>
                </FadeIn>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* SEÇÃO 14 — USO DIÁRIO E LIFESTYLE */}
      <section className="py-24 md:py-40 bg-white">
        <div className="w-full mx-auto px-6 md:px-12">
          <div className="max-w-3xl mx-auto mb-20 text-center">
            <FadeIn>
              <h2 className="text-3xl md:text-5xl title-dark leading-tight mb-6">
                Uma água melhor muda tudo o que passa por ela.
              </h2>
              <p className="text-lg font-light text-neutral-500 leading-relaxed">
                A água não está presente apenas no copo. Ela está nos detalhes da rotina.
              </p>
            </FadeIn>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {[
              { icon: Droplet, title: "Para beber", desc: "Água mais pura, equilibrada e agradável para o consumo diário." },
              { icon: Sparkles, title: "Para cozinhar", desc: "Uma água melhor para preparar alimentos, caldos, massas e refeições da família." },
              { icon: Activity, title: "Para o café", desc: "A qualidade da água interfere diretamente no aroma, sabor e percepção final da bebida." },
              { icon: Shield, title: "Para frutas e verduras", desc: "Mais cuidado na higienização dos alimentos que chegam à mesa." },
              { icon: User, title: "Para a família", desc: "Uma escolha que participa da rotina de todos, todos os dias." },
            ].map((benefit, i) => (
              <FadeIn key={i} delay={i * 0.1} className="flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-full bg-neutral-100 flex items-center justify-center mb-6">
                  <benefit.icon className="text-primary" size={24} strokeWidth={1.5} />
                </div>
                <h4 className="text-base font-medium mb-2">{benefit.title}</h4>
                <p className="text-sm text-neutral-500 font-light leading-relaxed">{benefit.desc}</p>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* SEÇÃO 15 — POR QUE ISSO IMPORTA */}
      <section id="porque" className="py-24 md:py-40 bg-[#f8f8f6]">
        <div className="w-full mx-auto px-6 md:px-12">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <FadeIn>
              <h2 className="text-4xl md:text-5xl title-dark mb-8 leading-tight">
                Porque a água é simples demais para ser ignorada.<br/>
                <span className="title-accent">E importante demais para ser tratada de qualquer forma.</span>
              </h2>
            </FadeIn>
            <FadeIn>
              <p className="text-lg font-light text-neutral-500 leading-relaxed mb-8">
                Muitas decisões de cuidado começam por coisas complexas. Suplementos. Alimentação. Exercícios. Rotina. Sono.
              </p>
              <p className="text-lg font-light text-neutral-500 leading-relaxed mb-8">
                Mas antes de tudo isso, existe algo ainda mais básico: a água.
              </p>
              <p className="text-lg font-light text-neutral-500 leading-relaxed mb-8">
                Ela está presente no corpo, na casa, na cozinha e em cada hábito diário.
              </p>
              <p className="text-xl font-medium text-black border-l-2 border-primary pl-6 py-2">
                Por isso, tratar melhor a água não é um luxo exagerado. É uma decisão de qualidade de vida.
              </p>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* SEÇÃO 17 — CTA FINAL CURTO */}
      <section className="relative flex min-h-[520px] items-center overflow-hidden bg-black py-28 text-center text-white md:min-h-[680px] md:py-36">
        <div className="absolute inset-0 z-0">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="h-full w-full object-cover opacity-55"
          >
            <source src="/videos/IONCENTER_VIDEO.mp4" type="video/mp4" />
            Seu navegador não suporta vídeos HTML5.
          </video>
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/45 to-black/80" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(12,161,207,0.16),transparent_42%)]" />
        </div>

        <div className="relative z-10 mx-auto max-w-2xl px-6">
          <FadeIn>
            <h2 className="text-2xl md:text-3xl title-light mb-4">
              Sua água pode estar em outro nível.
            </h2>
            <p className="text-white/70 font-light mb-8 leading-relaxed">
              Conheça a linha Water Diamond Ion Center e descubra qual modelo combina com a sua casa, sua rotina e sua forma de viver.
            </p>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-black/20 px-8 py-3.5 text-sm font-medium text-white backdrop-blur-md transition-all duration-300 hover:border-transparent hover:bg-primary hover:text-white cursor-pointer"
            >
              Quero conhecer a linha Ion Center
              <ArrowRight size={16} />
            </button>
          </FadeIn>
        </div>
      </section>

      {/* SUPER FOOTER */}
      <SiteFooter />

      {/* Menu Lateral */}
      <SidebarMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />

      <FloatingWhatsAppButton onClick={() => setIsModalOpen(true)} />

      {/* Modal de Orçamento */}
      <AnimatePresence>
        {isModalOpen && (
          <ContactModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
        )}
      </AnimatePresence>

    </div>
  );
}

