/**
 * Esquema animado do bastão Water Diamond®: a água corre pelo tubo entre os ímãs de neodímio (N em cima,
 * S embaixo) e as esferas da tecnologia Water Diamond. Ao passar pelo campo, os cátions (+) viram ânions (−), ou seja, mais elétrons.
 * Tudo em SVG + CSS, sem bibliotecas. Com "reduzir movimento" ligado, o desenho fica parado.
 */

// Cores do esquema (mantidas) e tokens do site para texto e linhas.
const NAVY = "#1d3a73";
const NAVY_LIGHT = "#2f56a3";
const RED = "#d8343c";
const RED_LIGHT = "#ef5a5f";
const INK = "#1d1d1f"; // --obsidian
const MUTED = "#6e6e73"; // --pewter
const HAIRLINE = "#d2d2d7"; // --hairline

const H_X = [250, 325, 400, 475, 550];
const IONS = [
  { y: 376, delay: 0 },
  { y: 412, delay: -1.1 },
  { y: 392, delay: -2.3 },
  { y: 428, delay: -3.4 },
  { y: 382, delay: -4.6 },
  { y: 420, delay: -5.7 },
  { y: 400, delay: -6.8 },
];
const ION_DURATION = 8;

function Magnet({ x, y, letter, from, to }: { x: number; y: number; letter: string; from: string; to: string }) {
  const id = `wd-mag-${letter}-${x}-${y}`;
  return (
    <g className="wd-magnet" style={{ transformOrigin: `${x}px ${y}px` }}>
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={to} />
          <stop offset="100%" stopColor={from} />
        </linearGradient>
      </defs>
      <rect x={x - 42} y={y - 42} width={84} height={84} rx={24} fill={`url(#${id})`} filter="url(#wd-soft)" />
      <text x={x} y={y + 12} textAnchor="middle" fontSize={34} fontWeight={600} fill="#fff">
        {letter}
      </text>
    </g>
  );
}

function Sphere({ x, y, index, row }: { x: number; y: number; index: number; row: number; key?: string }) {
  return (
    <g>
      <circle cx={x} cy={y} r={29} fill="#ffffff" stroke={HAIRLINE} strokeWidth={1.5} filter="url(#wd-soft)" />
      <circle
        cx={x}
        cy={y}
        r={21}
        fill="url(#wd-h)"
        className="wd-sphere"
        style={{ animationDelay: `${index * 0.28 + row * 0.14}s`, transformOrigin: `${x}px ${y}px` }}
      />
      {/* Diamante lapidado: coroa reta em cima, ponta embaixo, com as facetas marcadas */}
      <g transform={`translate(${x} ${y + 1})`}>
        <path d="M-11 -4 L-6 -10 H6 L11 -4 L0 11 Z" fill="#ffffff" />
        <path d="M-11 -4 H11 M-6 -10 L-3 -4 L0 11 L3 -4 L6 -10 M-3 -4 L0 -10 L3 -4" fill="none" stroke="#2f9e4b" strokeWidth={1.2} strokeLinejoin="round" />
      </g>
    </g>
  );
}

export default function IonizationDiagram({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 800 640"
      className={className}
      role="img"
      aria-label="Esquema do bastão Water Diamond: a água passa entre ímãs de neodímio e as esferas da tecnologia Water Diamond, e os cátions se transformam em ânions, com mais elétrons."
      style={{ fontFamily: "inherit" }}
    >
      <style>{`
        .wd-flow { animation: wd-flow 3.2s linear infinite; }
        .wd-flow-slow { animation: wd-flow 5.5s linear infinite; }
        @keyframes wd-flow { from { transform: translateX(-200px); } to { transform: translateX(0); } }

        .wd-sphere { animation: wd-pulse 1.4s ease-in-out infinite; }
        @keyframes wd-pulse {
          0%, 100% { transform: scale(1); filter: none; }
          50% { transform: scale(1.12); filter: drop-shadow(0 0 8px rgba(80, 220, 120, 0.9)); }
        }

        .wd-magnet { animation: wd-hum 2.8s ease-in-out infinite; }
        @keyframes wd-hum { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.03); } }

        .wd-ion { animation: wd-ion ${ION_DURATION}s linear infinite; }
        @keyframes wd-ion { from { transform: translateX(-40px); } to { transform: translateX(840px); } }
        .wd-cation { animation: wd-cation ${ION_DURATION}s linear infinite; }
        .wd-anion { animation: wd-anion ${ION_DURATION}s linear infinite; }
        @keyframes wd-cation { 0%, 44% { opacity: 1; } 52%, 100% { opacity: 0; } }
        @keyframes wd-anion { 0%, 44% { opacity: 0; } 52%, 100% { opacity: 1; } }

        .wd-spark { animation: wd-spark 1.4s ease-out infinite; opacity: 0; }
        @keyframes wd-spark {
          0% { opacity: 0; transform: translateY(0); }
          20% { opacity: 1; }
          100% { opacity: 0; transform: translateY(var(--dy)); }
        }

        @media (prefers-reduced-motion: reduce) {
          .wd-flow, .wd-flow-slow, .wd-sphere, .wd-magnet, .wd-ion, .wd-cation, .wd-anion, .wd-spark { animation: none; }
          .wd-spark { opacity: 0; }
        }
      `}</style>

      <defs>
        <radialGradient id="wd-h" cx="38%" cy="32%" r="70%">
          <stop offset="0%" stopColor="#7fe08f" />
          <stop offset="55%" stopColor="#2f9e4b" />
          <stop offset="100%" stopColor="#1c6b31" />
        </radialGradient>
        <linearGradient id="wd-water" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#bfe6ff" />
          <stop offset="45%" stopColor="#3aa0e6" />
          <stop offset="100%" stopColor="#0b5fa8" />
        </linearGradient>
        <linearGradient id="wd-glass" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#dfe5ec" />
          <stop offset="50%" stopColor="#ffffff" />
          <stop offset="100%" stopColor="#d6dde5" />
        </linearGradient>
        <filter id="wd-soft" x="-30%" y="-30%" width="160%" height="170%">
          <feDropShadow dx="0" dy="6" stdDeviation="8" floodColor="#000" floodOpacity="0.12" />
        </filter>
        <clipPath id="wd-pipe">
          <rect x="0" y="354" width="800" height="92" />
        </clipPath>
      </defs>

      {/* Equação no topo, no padrão dos títulos do site: principal em preto, complemento em cinza */}
      <g fontWeight={600} letterSpacing="-0.5">
        <text x="352" y="84" fontSize={44} textAnchor="end" fill={INK}>Cátions</text>
        <path d="M374 70 H420" stroke={INK} strokeWidth={3.5} strokeLinecap="round" />
        <path d="M410 59 L424 70 L410 81" fill="none" stroke={INK} strokeWidth={3.5} strokeLinecap="round" strokeLinejoin="round" />
        <text x="446" y="84" fontSize={44} fill={INK}>Ânions</text>
        <text x="400" y="132" fontSize={30} textAnchor="middle" fill={MUTED}>= mais elétrons</text>
      </g>

      {/* Rótulos */}
      <g fontSize={19} fontWeight={500} textAnchor="middle" fill={MUTED}>
        <text x="150" y="196">Ímãs de neodímio</text>
        <text x="150" y="616">Ímãs de neodímio</text>
      </g>
      <text x="400" y="214" fontSize={20} fontWeight={600} textAnchor="middle" fill={INK}>Tecnologia Water Diamond</text>

      {/* Circuito que liga os ímãs */}
      <rect x="60" y="268" width="680" height="264" rx="132" fill="none" stroke={INK} strokeWidth={2.5} />

      {/* Tubo com a água correndo */}
      <rect x="0" y="345" width="800" height="110" fill="url(#wd-glass)" opacity={0.9} />
      <g clipPath="url(#wd-pipe)">
        <rect x="0" y="354" width="800" height="92" fill="url(#wd-water)" />
        <g className="wd-flow-slow" opacity={0.35}>
          <path
            d="M0 396 q50 -16 100 0 t100 0 t100 0 t100 0 t100 0 t100 0 t100 0 t100 0 t100 0 t100 0 V446 H0 Z"
            fill="#0a4f8f"
          />
        </g>
        <g className="wd-flow" opacity={0.55}>
          <path
            d="M0 378 q50 -10 100 0 t100 0 t100 0 t100 0 t100 0 t100 0 t100 0 t100 0 t100 0 t100 0"
            fill="none"
            stroke="#ffffff"
            strokeWidth={3}
          />
          <path
            d="M0 422 q50 8 100 0 t100 0 t100 0 t100 0 t100 0 t100 0 t100 0 t100 0 t100 0 t100 0"
            fill="none"
            stroke="#d7f1ff"
            strokeWidth={2}
          />
        </g>

        {/* Íons: entram como cátions (+) e saem como ânions (−) depois do centro */}
        {IONS.map((ion, i) => (
          <g key={i} className="wd-ion" style={{ animationDelay: `${ion.delay}s` }}>
            <g className="wd-cation" style={{ animationDelay: `${ion.delay}s` }}>
              <circle cx={0} cy={ion.y} r={10} fill="#fff4e5" stroke="#f08a24" strokeWidth={2.5} />
              <path d={`M-5 ${ion.y} H5 M0 ${ion.y - 5} V${ion.y + 5}`} stroke="#d0661a" strokeWidth={2.5} strokeLinecap="round" />
            </g>
            <g className="wd-anion" style={{ animationDelay: `${ion.delay}s` }}>
              <circle cx={0} cy={ion.y} r={10} fill="#ffffff" stroke="#7dd3ff" strokeWidth={2.5} style={{ filter: "drop-shadow(0 0 6px #9be3ff)" }} />
              <path d={`M-5 ${ion.y} H5`} stroke="#0b6fbf" strokeWidth={2.5} strokeLinecap="round" />
            </g>
          </g>
        ))}
      </g>
      <rect x="0" y="345" width="800" height="110" fill="none" stroke={HAIRLINE} strokeWidth={1.5} />

      {/* Elétrons descendo das esferas para a água */}
      {H_X.map((x, i) => (
        <g key={`spark-${x}`}>
          <circle cx={x} cy={302} r={4} fill="#9be3ff" className="wd-spark" style={{ animationDelay: `${i * 0.28}s`, ["--dy" as string]: "46px" }} />
          <circle cx={x} cy={498} r={4} fill="#9be3ff" className="wd-spark" style={{ animationDelay: `${i * 0.28 + 0.14}s`, ["--dy" as string]: "-46px" }} />
        </g>
      ))}

      {/* Linhas que ligam ímãs e esferas */}
      <path d="M150 268 H650" stroke={INK} strokeWidth={2.5} />
      <path d="M150 532 H650" stroke={INK} strokeWidth={2.5} />

      {H_X.map((x, i) => (
        <Sphere key={`top-${x}`} x={x} y={268} index={i} row={0} />
      ))}
      {H_X.map((x, i) => (
        <Sphere key={`bot-${x}`} x={x} y={532} index={i} row={1} />
      ))}

      <Magnet x={150} y={268} letter="N" from={NAVY} to={NAVY_LIGHT} />
      <Magnet x={650} y={268} letter="N" from={NAVY} to={NAVY_LIGHT} />
      <Magnet x={150} y={532} letter="S" from={RED} to={RED_LIGHT} />
      <Magnet x={650} y={532} letter="S" from={RED} to={RED_LIGHT} />
    </svg>
  );
}
