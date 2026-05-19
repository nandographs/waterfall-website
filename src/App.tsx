import { motion } from 'motion/react';
import { ArrowRight, Check, Droplet, Sparkles, Shield, Activity, ChevronRight, Menu, User, MapPin, ShoppingBag } from 'lucide-react';
import React, { useState, useEffect } from 'react';

// --- Reusable Components ---

const FadeIn = ({ children, delay = 0, className = "" }: { children: React.ReactNode, delay?: number, className?: string }) => (
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

const Button = ({ children, variant = 'primary', className = "" }: { children: React.ReactNode, variant?: 'primary' | 'secondary' | 'outline', className?: string }) => {
  const baseStyle = "inline-flex items-center justify-center rounded-full px-8 py-3.5 text-sm font-medium transition-all duration-300";
  const variants = {
    primary: "bg-black text-white hover:bg-neutral-800",
    secondary: "bg-white text-black hover:bg-neutral-100",
    outline: "border border-black text-black hover:bg-black hover:text-white"
  };
  
  return (
    <button className={`${baseStyle} ${variants[variant]} ${className}`}>
      {children}
    </button>
  );
}

// --- Main App ---

export default function App() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-white selection:bg-neutral-200">
      
      {/* Navigation (Sticky & Minimalist) */}
      <nav className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${scrolled ? 'bg-white/90 backdrop-blur-md border-b border-neutral-100 py-4' : 'bg-transparent py-6'}`}>
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <button className="p-2 -ml-2 text-white mix-blend-difference hover:opacity-70 transition-opacity">
              <Menu size={20} />
            </button>
          </div>
          
          <div className="absolute left-1/2 -translate-x-1/2 text-center text-white mix-blend-difference">
            <div className="font-semibold tracking-widest text-xs uppercase">Water Diamond</div>
            <div className="text-[9px] tracking-widest uppercase opacity-70">Ion Center</div>
          </div>

          <div className="flex items-center gap-6 text-white mix-blend-difference">
            <button className="hover:opacity-70 transition-opacity hidden md:block"><User size={20} strokeWidth={1.5} /></button>
            <button className="hover:opacity-70 transition-opacity hidden md:block"><MapPin size={20} strokeWidth={1.5} /></button>
            <button className="hover:opacity-70 transition-opacity"><ShoppingBag size={20} strokeWidth={1.5} /></button>
          </div>
        </div>
      </nav>

      {/* HERO 1 — IMERSÃO / IMPACTO VISUAL */}
      <section className="relative h-screen w-full flex items-center bg-black overflow-hidden">
        {/* Abstract water image background */}
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1548839140-29a749e1bc4e?q=80&w=2000&auto=format&fit=crop" 
            alt="Water Ripples" 
            className="w-full h-full object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/80" />
        </div>
        
        <div className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-12 pt-20">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="text-white max-w-3xl"
          >
            <p className="text-xs uppercase tracking-[0.2em] mb-6 opacity-80">Water Diamond Ion Center</p>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-medium tracking-tight leading-[1.1] mb-6">
              Você não bebe só água.<br/>
              <span className="text-neutral-400">Você consome tudo o que ela carrega.</span>
            </h1>
            <p className="text-base md:text-lg font-light text-neutral-300 max-w-2xl mb-10 leading-relaxed">
              A central de tratamento que transforma a água da sua casa em um novo padrão de pureza, equilíbrio e tecnologia. Água ultra filtrada, purificada, alcalinizada e ionizada em um único sistema.
            </p>
            <Button variant="secondary" className="px-10">
              Transformar minha água
            </Button>
          </motion.div>
        </div>

        <div className="absolute bottom-10 left-6 md:left-12 flex items-center gap-4 text-white/50 text-xs tracking-widest uppercase">
          <span>Scroll to discover</span>
        </div>
      </section>

      {/* HERO SECUNDÁRIO — PRODUTO CENTRALIZADO */}
      <section className="py-24 md:py-40 bg-[#f8f8f6]">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="grid md:grid-cols-2 gap-16 lg:gap-32 items-center">
            
            <FadeIn className="order-2 md:order-1 relative aspect-square rounded-3xl overflow-hidden bg-white/50 border border-black/5 p-12">
              <img 
                src="https://images.unsplash.com/photo-1584824486509-112e4181f1ce?q=80&w=1500&auto=format&fit=crop" 
                alt="Product Minimal Device" 
                className="w-full h-full object-contain mix-blend-multiply opacity-90"
              />
            </FadeIn>

            <div className="order-1 md:order-2">
              <FadeIn>
                <p className="text-xs font-semibold tracking-widest uppercase text-neutral-500 mb-4">Water Diamond Ion Center</p>
                <h2 className="text-4xl md:text-5xl font-medium tracking-tight mb-8">A melhor água do mundo.</h2>
                
                <p className="text-lg font-light text-neutral-600 mb-10">
                  Uma nova geração de tratamento de água criada para elevar o padrão da sua rotina diária.
                </p>

                <ul className="space-y-4 mb-12">
                  {[
                    "Ultra Filtragem Classe A",
                    "Purificação em múltiplas etapas",
                    "Água Alcalina pH 9.5",
                    "Mineralização Inteligente",
                    "Ionização Water Diamond®",
                    "Estrutura Molecular Reorganizada"
                  ].map((item, i) => (
                    <li key={i} className="flex items-center gap-4 text-sm font-medium">
                      <div className="w-1.5 h-1.5 rounded-full bg-black/20" />
                      {item}
                    </li>
                  ))}
                </ul>

                <Button variant="outline">
                  Descobrir mais detalhes
                </Button>
              </FadeIn>
            </div>

          </div>
        </div>
      </section>

      {/* SECTION — INTRODUÇÃO / PROBLEMA */}
      <section className="py-32 md:py-48 px-6 bg-white text-center">
        <div className="max-w-3xl mx-auto">
          <FadeIn>
            <h2 className="text-4xl md:text-6xl font-medium tracking-tight leading-tight mb-8">
              A água parece limpa. <br className="hidden md:block"/>
              <span className="text-neutral-400">Mas o que você não vê é o que mais importa.</span>
            </h2>
            <p className="text-lg md:text-xl font-light text-neutral-500 leading-relaxed">
              A água que chega até você percorre tubulações, sistemas de distribuição e processos químicos antes de ser consumida. Nesse caminho, ela pode carregar contaminantes invisíveis que permanecem presentes mesmo após tratamentos convencionais.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* SECTION — IMAGEM FULL / CONTAMINAÇÃO */}
      <section className="relative aspect-[3/4] md:aspect-[21/9] bg-black text-white w-full overflow-hidden flex items-end">
        <img 
          src="https://images.unsplash.com/photo-1523362628745-0c100150b504?q=80&w=2000&auto=format&fit=crop" 
          alt="Water purity" 
          className="absolute inset-0 w-full h-full object-cover opacity-40 mix-blend-luminosity"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
        
        <div className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-12 pb-16 md:pb-32">
          <FadeIn className="max-w-3xl">
            <h2 className="text-3xl md:text-5xl font-medium tracking-tight mb-12">
              Contaminantes invisíveis fazem parte da rotina diária.
            </h2>
            <div className="grid md:grid-cols-3 gap-10">
              <div>
                <h3 className="font-medium text-lg mb-3">Contaminantes físicos</h3>
                <p className="text-neutral-400 font-light text-sm leading-relaxed">Partículas como areia, ferrugem, barro e sedimentos podem estar presentes na água consumida diariamente.</p>
              </div>
              <div>
                <h3 className="font-medium text-lg mb-3">Contaminantes químicos</h3>
                <p className="text-neutral-400 font-light text-sm leading-relaxed">Cloro, metais pesados, resíduos industriais e compostos químicos invisíveis podem permanecer mesmo após processos tradicionais.</p>
              </div>
              <div>
                <h3 className="font-medium text-lg mb-3">Contaminantes biológicos</h3>
                <p className="text-neutral-400 font-light text-sm leading-relaxed">Bactérias, vírus e microrganismos podem surgir por falhas no sistema ou contaminações externas.</p>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* SECTION — SPLIT LAYOUT / DESEQUILÍBRIO */}
      <section className="py-24 md:py-40 bg-white">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <FadeIn>
              <h2 className="text-4xl md:text-5xl font-medium tracking-tight mb-8 leading-tight">
                A água moderna perdeu o seu equilíbrio natural.
              </h2>
              <div className="space-y-6 text-lg font-light text-neutral-600">
                <p>Grande parte da água disponível atualmente possui um pH mais ácido do que o encontrado naturalmente em fontes puras.</p>
                <p>Ao mesmo tempo, minerais importantes acabam sendo removidos durante os processos convencionais de tratamento.</p>
                <div className="flex gap-4 pt-4">
                  <span className="px-4 py-1.5 rounded-full border border-neutral-200 text-sm">Cálcio</span>
                  <span className="px-4 py-1.5 rounded-full border border-neutral-200 text-sm">Magnésio</span>
                  <span className="px-4 py-1.5 rounded-full border border-neutral-200 text-sm">Potássio</span>
                </div>
                <p className="font-medium text-black pt-4">
                  O resultado é uma água pobre em minerais e distante do equilíbrio ideal para o consumo contínuo.
                </p>
              </div>
            </FadeIn>
            <FadeIn className="aspect-square bg-[#f0f0f0] rounded-2xl overflow-hidden">
               <img 
                  src="https://images.unsplash.com/photo-1610557892470-55d9e80c0bce?q=80&w=1500&auto=format&fit=crop" 
                  alt="Nature pure stream" 
                  className="w-full h-full object-cover scale-105 hover:scale-100 transition-transform duration-1000"
                />
            </FadeIn>
          </div>
        </div>
      </section>

      {/* SECTION — EXPERIÊNCIA SENSORIAL (Inverse Split) */}
      <section className="py-24 md:py-40 bg-[#f8f8f6]">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <FadeIn className="order-2 md:order-1 aspect-square bg-[#e8e8e5] rounded-2xl overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1544551763-46a013bb70d5?q=80&w=1500&auto=format&fit=crop" 
                alt="Water detail" 
                className="w-full h-full object-cover scale-105 hover:scale-100 transition-transform duration-1000"
              />
            </FadeIn>
            <FadeIn className="order-1 md:order-2">
              <h2 className="text-4xl md:text-5xl font-medium tracking-tight mb-8 leading-tight">
                Não é apenas sobre pureza.<br/>
                <span className="text-neutral-500">É sobre energia, estrutura e equilíbrio.</span>
              </h2>
              <div className="space-y-6 text-lg font-light text-neutral-600">
                <p>Em ambientes cercados por dispositivos eletrônicos e interferências constantes, a água pode acumular íons positivos.</p>
                <p>Mesmo sem alterar aparência, sabor ou cheiro, isso impacta o estado elétrico da água e sua interação com o organismo.</p>
                <p className="font-medium text-black border-l-2 border-black pl-6 pt-2 pb-2 mt-8">
                  O equilíbrio invisível da água influencia a experiência diária de consumo.
                </p>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* SECTION — SOLUÇÃO / TRANSIÇÃO */}
      <section className="py-32 md:py-48 px-6 bg-white text-center">
        <div className="max-w-4xl mx-auto">
          <FadeIn>
            <h2 className="text-4xl md:text-6xl font-medium tracking-tight leading-tight mb-8">
              Uma nova geração de<br/>tratamento de água.
            </h2>
            <p className="text-lg md:text-xl font-light text-neutral-500 mb-16 max-w-2xl mx-auto">
              Water Diamond Ion Center combina múltiplas tecnologias em um único sistema para criar uma água de pureza inigualável.
            </p>
            
            <div className="flex flex-wrap justify-center gap-3">
              {[
                "Ultra filtrada", "Purificada profundamente", "Alcalina", 
                "Rica em minerais", "Ionizada", "Estruturalmente reorganizada"
              ].map((pill, i) => (
                <span key={i} className="px-6 py-2.5 rounded-full border border-neutral-200 text-sm tracking-wide bg-neutral-50">
                  {pill}
                </span>
              ))}
            </div>
          </FadeIn>
        </div>
      </section>

      {/* SECTION — ETAPAS MÚLTIPLAS (Grid Setup) */}
      <section className="bg-[#f0ece9] py-24 md:py-40">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          
          <div className="grid md:grid-cols-2 gap-x-8 gap-y-24">
            
            {/* Etapa 1 */}
            <FadeIn>
              <div className="aspect-[4/3] bg-white rounded-xl mb-8 overflow-hidden flex items-center justify-center p-12">
                 <img src="https://images.unsplash.com/photo-1601056588235-86b3dc21deac?q=80&w=1000&auto=format&fit=crop" alt="Ultra filtration abstract" className="w-full h-full object-cover opacity-60 mix-blend-multiply" />
              </div>
              <p className="text-xs font-semibold tracking-widest uppercase text-neutral-500 mb-3">Etapa 01 / Max Ultra</p>
              <h3 className="text-3xl font-medium tracking-tight mb-4">Ultra Filtragem Inteligente</h3>
              <p className="text-neutral-600 font-light mb-6">A primeira barreira do sistema. O refil Max Ultra utiliza membrana de ultrafiltragem de 0,5μ com classificação A do INMETRO para bloquear partículas microscópicas e contaminantes físicos invisíveis.</p>
              <div className="text-sm font-medium text-black">
                Remoção: Sedimentos, Ferrugem, Microplásticos.
              </div>
            </FadeIn>

            {/* Etapa 2 */}
            <FadeIn delay={0.2}>
              <div className="aspect-[4/3] bg-white rounded-xl mb-8 overflow-hidden flex items-center justify-center p-12">
                <img src="https://images.unsplash.com/photo-1590059345242-b7e6b797435f?q=80&w=1000&auto=format&fit=crop" alt="Carbon pure" className="w-full h-full object-cover opacity-60 mix-blend-multiply grayscale" />
              </div>
              <p className="text-xs font-semibold tracking-widest uppercase text-neutral-500 mb-3">Etapa 02 / Max Carbon</p>
              <h3 className="text-3xl font-medium tracking-tight mb-4">Purificação Química</h3>
              <p className="text-neutral-600 font-light mb-6">O Max Carbon utiliza carvão ativado granulado combinado com polipropileno para reduzir compostos químicos. Remove substâncias responsáveis por odores, sabores residuais e impurezas invisíveis.</p>
              <div className="text-sm font-medium text-black">
                Benefícios: Água mais pura, sabor mais neutro.
              </div>
            </FadeIn>

            {/* Etapa 3 */}
            <FadeIn>
              <div className="aspect-[4/3] bg-neutral-800 rounded-xl mb-8 overflow-hidden flex items-center justify-center p-12">
                 <img src="https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?q=80&w=1000&auto=format&fit=crop" alt="Deep filtration abstract" className="w-full h-full object-cover opacity-50 mix-blend-screen" />
              </div>
              <p className="text-xs font-semibold tracking-widest uppercase text-neutral-500 mb-3">Etapa 03 / Max Block</p>
              <h3 className="text-3xl font-medium tracking-tight mb-4">Purificação Profunda</h3>
              <p className="text-neutral-600 font-light mb-6">O Max Block utiliza carvão ativado compactado em alta densidade. Seu fluxo controlado aumenta o tempo de contato, elevando drasticamente a eficiência da purificação contra contaminantes persistentes.</p>
              <div className="text-sm font-medium text-black">
                Remoção: Bactérias, Metais pesados.
              </div>
            </FadeIn>

            {/* Etapa 4 */}
            <FadeIn delay={0.2}>
              <div className="aspect-[4/3] bg-white rounded-xl mb-8 overflow-hidden flex items-center justify-center p-12">
                 <img src="https://images.unsplash.com/photo-1579541591970-e598cb6b16d0?q=80&w=1000&auto=format&fit=crop" alt="Minerals abstract" className="w-full h-full object-cover opacity-30 mix-blend-darken" />
              </div>
              <p className="text-xs font-semibold tracking-widest uppercase text-neutral-500 mb-3">Etapa 04 / Max Alka</p>
              <h3 className="text-3xl font-medium tracking-tight mb-4">Alcalinização e Mineralização</h3>
              <p className="text-neutral-600 font-light mb-6">O Max Alka eleva o pH da água para níveis alcalinos entre 8.5 e 9.5. Ao mesmo tempo, reintroduz minerais importantes para devolver equilíbrio à água.</p>
              <div className="text-sm font-medium text-black">
                Adiciona: Cálcio, Magnésio, Potássio.
              </div>
            </FadeIn>

          </div>
        </div>
      </section>

      {/* SECTION — TECNOLOGIA EXCLUSIVA */}
      <section className="py-24 md:py-40 bg-black text-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <FadeIn>
              <h2 className="text-4xl md:text-5xl font-medium tracking-tight mb-6">
                Mais do que filtrar.<br/>Transformar a estrutura.
              </h2>
              <p className="text-xl text-neutral-400 font-light mb-12">Tecnologia Exclusiva: Ionização Water Diamond®</p>
              <ul className="space-y-6 text-neutral-300 font-light">
                <li className="flex items-start gap-4">
                  <Check className="mt-1 flex-shrink-0" size={18} />
                  <span>Quebra de clusters moleculares para melhor hidratação.</span>
                </li>
                <li className="flex items-start gap-4">
                  <Check className="mt-1 flex-shrink-0" size={18} />
                  <span>Conversão de íons positivos em negativos.</span>
                </li>
                <li className="flex items-start gap-4">
                  <Check className="mt-1 flex-shrink-0" size={18} />
                  <span>Restauração do equilíbrio eletromagnético.</span>
                </li>
              </ul>
            </FadeIn>
            <FadeIn className="hidden md:flex justify-end">
              <div className="w-96 h-96 rounded-full border border-white/10 relative flex items-center justify-center bg-gradient-to-tr from-transparent to-white/5">
                <div className="w-64 h-64 rounded-full border border-white/20 relative flex items-center justify-center animate-[spin_60s_linear_infinite]">
                   <div className="w-32 h-32 rounded-full border border-white/30" />
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* SECTION — BENEFÍCIOS */}
      <section className="py-24 md:py-40 bg-white">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="text-center mb-20">
            <FadeIn>
              <h2 className="text-3xl md:text-5xl font-medium tracking-tight">O que muda quando a água muda?</h2>
              <p className="mt-6 text-lg text-neutral-500">Uma água de qualidade superior impacta diretamente a experiência diária.</p>
            </FadeIn>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-x-8 gap-y-16 text-center">
             {[
               { icon: Droplet, title: "Mais leveza", desc: "Estrutura molecular otimizada" },
               { icon: Shield, title: "Mais pureza", desc: "Livre de contaminantes invisíveis" },
               { icon: Activity, title: "Mais equilíbrio", desc: "pH ideal e minerais essenciais" },
               { icon: Sparkles, title: "Melhor sabor", desc: "Sensação neutra e refrescante" },
               { icon: Check, title: "Consumo agradável", desc: "Facilidade de hidratação contínua" },
               { icon: User, title: "Mais confiança", desc: "Segurança no que você bebe" }
             ].map((benefit, i) => (
               <FadeIn key={i} delay={i * 0.1} className="flex flex-col items-center">
                 <div className="w-16 h-16 rounded-full bg-neutral-100 flex items-center justify-center mb-6">
                   <benefit.icon className="text-black" size={24} strokeWidth={1.5} />
                 </div>
                 <h4 className="text-lg font-medium mb-2">{benefit.title}</h4>
                 <p className="text-sm text-neutral-500">{benefit.desc}</p>
               </FadeIn>
             ))}
          </div>
        </div>
      </section>

      {/* SECTION — DESIGN & SPECS (Split) */}
      <section className="py-24 md:py-40 bg-[#f8f8f6] border-t border-neutral-200">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="grid md:grid-cols-2 gap-20">
            
            <FadeIn>
              <h2 className="text-3xl font-medium tracking-tight mb-8">Tecnologia premium para qualquer ambiente.</h2>
              <p className="text-neutral-600 font-light mb-10 leading-relaxed">
                O Water Diamond Ion Center foi desenvolvido para unir performance, design minimalista, instalação inteligente e versatilidade. Compatível com máquinas de café, bebedouros, faucets gourmet e sistemas hidráulicos.
              </p>
              
              <div className="aspect-[4/3] bg-neutral-200 rounded-xl overflow-hidden">
                <img src="https://images.unsplash.com/photo-1556910103-1c02745aae4d?q=80&w=1500&auto=format&fit=crop" alt="Modern kitchen integration" className="w-full h-full object-cover" />
              </div>
            </FadeIn>

            <FadeIn>
              <h2 className="text-sm font-semibold tracking-widest uppercase text-neutral-500 mb-8 pt-2">Especificações Técnicas</h2>
              <h3 className="text-2xl font-medium mb-12">Water Diamond Ion Center Slim</h3>
              
              <ul className="divide-y divide-neutral-200 border-y border-neutral-200">
                {[
                  { label: "Instalação", value: "Bancada ou Parede" },
                  { label: "Vazão nominal", value: "0,75L / min" },
                  { label: "Vida útil dos refis", value: "9 a 18 meses (Até 6.000L)" },
                  { label: "Cores disponíveis", value: "Preto Matte, Branco Neve" },
                  { label: "Sistema de filtragem", value: "4 refis MAX WaterDiamond" },
                  { label: "Garantia", value: "1 ano contra defeitos de fabricação" },
                ].map((spec, i) => (
                  <li key={i} className="py-5 flex items-start justify-between gap-4">
                    <span className="text-sm font-medium text-black shrink-0">{spec.label}</span>
                    <span className="text-sm font-light text-neutral-500 text-right">{spec.value}</span>
                  </li>
                ))}
              </ul>
            </FadeIn>

          </div>
        </div>
      </section>

      {/* SECTION — FECHAMENTO / CTA FINAL */}
       <section className="py-32 md:py-48 px-6 bg-black text-white text-center">
        <div className="max-w-4xl mx-auto">
          <FadeIn>
            <h2 className="text-4xl md:text-6xl font-medium tracking-tight leading-tight mb-8">
              A água que você bebe todos os dias define mais do que sede.
            </h2>
            <p className="text-xl md:text-2xl font-light text-neutral-400 mb-16">
              Ela define o padrão da sua rotina.
            </p>
            
            <p className="text-sm tracking-widest uppercase mb-10 text-neutral-500">
              Ultra filtração, purificação profunda, alcalinização e ionização.<br className="hidden md:block"/> A melhor água do mundo.
            </p>

            <Button variant="secondary" className="px-12 py-4 text-base">
              Quero transformar minha água
            </Button>
          </FadeIn>
        </div>
      </section>

      {/* SUPER FOOTER */}
      <footer className="bg-[#050505] pt-20 pb-10 px-6 border-t border-white/10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-end gap-10">
          <div>
            <div className="font-semibold tracking-widest text-lg uppercase text-white">Water Diamond</div>
            <div className="text-xs tracking-widest uppercase text-neutral-500 mb-8">Ion Center</div>
            <div className="flex gap-4 text-neutral-400 text-sm">
              <a href="#" className="hover:text-white transition-colors">Instagram</a>
              <a href="#" className="hover:text-white transition-colors">Suporte</a>
              <a href="#" className="hover:text-white transition-colors">Contato</a>
            </div>
          </div>
          <div className="text-neutral-500 text-xs text-left md:text-right">
            © {new Date().getFullYear()} Water Diamond. Todos os direitos reservados.
          </div>
        </div>
      </footer>

    </div>
  );
}

