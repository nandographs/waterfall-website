'use client';

import { ArrowDown, ArrowRight } from 'lucide-react';
import { motion, type Variants } from 'motion/react';

interface Hero19Props {
  eyebrow?: string;
  headingLine1?: string;
  headingLine2?: string;
  description?: string;
  primaryCtaLabel?: string;
  primaryCtaHref?: string;
  /** Quando definido, o CTA primário chama esta função em vez de navegar pelo href. */
  primaryCtaOnClick?: () => void;
  secondaryCtaLabel?: string;
  secondaryCtaHref?: string;
  bookingLabel?: string;
  bookingHref?: string;
  /** Quando definido, o CTA de agendamento chama esta função em vez de navegar pelo href. */
  bookingOnClick?: () => void;
  scrollLabel?: string;
  /** Imagem exibida em telas ≥640px (breakpoint sm do Tailwind). */
  backgroundImageDesktop?: string;
  /** Imagem exibida em telas <640px. Crop dedicado, sem depender de object-position. */
  backgroundImageMobile?: string;
}

const sectionVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.14,
    },
  },
};

const navVariants: Variants = {
  hidden: { opacity: 0, y: -12, filter: 'blur(7px)' },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { type: 'spring', duration: 0.62, bounce: 0 },
  },
};

const copyVariants: Variants = {
  hidden: { opacity: 0, x: -22, filter: 'blur(8px)' },
  visible: {
    opacity: 1,
    x: 0,
    filter: 'blur(0px)',
    transition: { type: 'spring', duration: 0.78, bounce: 0 },
  },
};

const buildingVariants: Variants = {
  hidden: { opacity: 0, x: 30, y: 18, scale: 1.04, filter: 'blur(12px)' },
  visible: {
    opacity: 1,
    x: 0,
    y: 0,
    scale: 1,
    filter: 'blur(0px)',
    transition: { type: 'spring', duration: 1.08, bounce: 0 },
  },
};

const buttonRowVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.1,
    },
  },
};

const buttonVariants: Variants = {
  hidden: { opacity: 0, y: 12, scale: 0.98, filter: 'blur(6px)' },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    filter: 'blur(0px)',
    transition: { type: 'spring', duration: 0.58, bounce: 0 },
  },
};

export default function Hero19({
  eyebrow,
  headingLine1 = 'Build The Future With',
  headingLine2 = 'AI-Native Products',
  description = 'Build powerful digital systems and AI-driven platforms that shape how modern cities, businesses, and people move forward.',
  primaryCtaLabel = 'See Our Work',
  primaryCtaHref = '#',
  primaryCtaOnClick,
  secondaryCtaLabel,
  secondaryCtaHref = '#',
  bookingLabel = 'Book Demo',
  bookingHref = '#',
  bookingOnClick,
  scrollLabel = 'Scroll to Explore',
  backgroundImageDesktop = '/images/herobg.webp',
  backgroundImageMobile = '/images/herobgmobile.webp',
}: Hero19Props) {
  return (
    <section className="relative isolate aspect-[1080/1700] overflow-hidden font-sans text-white antialiased sm:aspect-auto sm:min-h-screen">
      <motion.div
        className="relative flex h-full w-full flex-col overflow-hidden px-6 py-4 sm:min-h-screen sm:px-9 lg:px-12"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.36 }}
        variants={sectionVariants}
      >
        <motion.picture variants={buildingVariants} className="absolute inset-0 block h-full w-full">
          <source media="(min-width: 640px)" srcSet={backgroundImageDesktop} />
          <img
            src={backgroundImageMobile}
            alt=""
            fetchPriority="high"
            decoding="async"
            className="pointer-events-none h-full w-full object-cover object-top sm:object-center"
          />
        </motion.picture>
        {/* Scrim: reforça o contraste do texto/logos brancos sobre a foto. */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/45 via-black/20 to-black/55" />

        <motion.nav
          variants={navVariants}
          className="relative z-20 flex min-h-10 w-full items-center justify-between"
        >
          <div className="flex items-center gap-4">
            <img
              src="/images/LOGO.webp"
              alt="Waterfall"
              className="h-6 w-auto object-contain md:h-7"
              style={{ filter: 'brightness(0) invert(1)' }}
            />
            <span className="h-5 w-px bg-white/25" />
            <img
              src="/images/fitpng.webp"
              alt="Fit Academia"
              className="h-9 w-auto object-contain md:h-10"
              style={{ filter: 'brightness(0) invert(1)' }}
            />
          </div>

          <a
            href={bookingHref}
            onClick={
              bookingOnClick
                ? (event) => {
                    event.preventDefault();
                    bookingOnClick();
                  }
                : undefined
            }
            className="group inline-flex min-h-10 items-center justify-center gap-1 rounded-full bg-zinc-100 px-6 text-sm font-normal text-slate-800 shadow-[inset_0_2px_0_0_rgba(255,255,255,1),inset_0_-1px_0_0_rgba(0,0,0,0.2)] transition-[background-color,color,transform] duration-200 ease-out text-shadow-2xs hover:bg-zinc-200 hover:text-slate-950 active:scale-[0.96]"
          >
            {bookingLabel}
            <ArrowRight className="size-3 transition-transform duration-200 ease-out group-hover:translate-x-0.5" />
          </a>
        </motion.nav>

        <div className="relative z-10 flex min-w-0 flex-1 items-start pt-14 pb-12 sm:items-center sm:pt-14 lg:pt-4">
          <div className="min-w-0 max-w-[39rem]">
            {eyebrow && (
              <motion.p
                variants={copyVariants}
                className="text-[0.72rem] leading-none font-medium text-white/95"
              >
                {eyebrow} <span aria-hidden="true">-&gt;</span>
              </motion.p>
            )}

            <motion.h1
              variants={copyVariants}
              className={`max-w-[38rem] text-[clamp(1.75rem,7.8vw,4.4rem)] leading-[1.1] font-normal tracking-[-0.035em] sm:leading-[1.04] sm:tracking-[-0.055em] text-balance whitespace-nowrap sm:whitespace-normal text-white ${eyebrow ? 'mt-5' : ''}`}
            >
              <span className="block">{headingLine1}</span>
              <span className="block">{headingLine2}</span>
            </motion.h1>

            <motion.p
              variants={copyVariants}
              className="mt-5 max-w-[31rem] text-[0.78rem] leading-[1.55] font-medium text-pretty text-white/85"
            >
              {description}
            </motion.p>

            <motion.div
              variants={buttonRowVariants}
              className="mt-7 flex flex-wrap items-center gap-5"
            >
              <motion.a
                variants={buttonVariants}
                href={primaryCtaHref}
                onClick={
                  primaryCtaOnClick
                    ? (event) => {
                        event.preventDefault();
                        primaryCtaOnClick();
                      }
                    : undefined
                }
                className="inline-flex min-h-11 items-center justify-center gap-1 rounded-full bg-zinc-100 px-6 text-sm font-normal text-slate-800 shadow-[inset_0_2px_0_0_rgba(255,255,255,1),inset_0_-1px_0_0_rgba(0,0,0,0.2)] transition-[background-color,color,transform] duration-200 ease-out text-shadow-2xs hover:bg-zinc-200 hover:text-slate-950 active:scale-[0.96]"
              >
                {primaryCtaLabel}
              </motion.a>
              {secondaryCtaLabel && (
                <motion.a
                  variants={buttonVariants}
                  href={secondaryCtaHref}
                  className="group inline-flex min-h-11 items-center gap-2 text-sm font-normal text-white/90 transition-[opacity,transform] duration-200 ease-out hover:opacity-100 active:scale-[0.96]"
                >
                  {secondaryCtaLabel}
                  <ArrowRight className="size-3.5 transition-transform duration-200 ease-out group-hover:translate-x-0.5" />
                </motion.a>
              )}
            </motion.div>
          </div>
        </div>

        <motion.a
          variants={copyVariants}
          href="#"
          className="absolute right-7 bottom-6 z-20 hidden min-h-10 items-center gap-3 text-[0.73rem] font-medium text-white/85 transition-[opacity,transform] duration-200 ease-out hover:opacity-100 active:scale-[0.96] md:inline-flex lg:right-12 lg:bottom-8"
        >
          {scrollLabel}
          <ArrowDown className="size-3.5" />
        </motion.a>
      </motion.div>
    </section>
  );
}
