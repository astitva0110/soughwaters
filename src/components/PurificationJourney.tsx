import { useRef, useEffect, useState } from 'react';

function useInView(th = 0.05) {
  const ref = useRef<HTMLElement>(null);
  const [v, setV] = useState(false);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setV(true); obs.disconnect(); } }, { threshold: th });
    obs.observe(el); return () => obs.disconnect();
  }, [th]);
  return { ref, inView: v };
}

const stages = [
  { id: 1, name: 'Raw Source',       sub: 'Collected from pristine underground aquifers',       color: '#93C5FD' },
  { id: 2, name: 'Sand Filtration',  sub: 'Multi-layer sand removes particles & sediment',       color: '#7DD3FC' },
  { id: 3, name: 'Activated Carbon', sub: 'Carbon absorption eliminates odours & chlorine',       color: '#38BDF8' },
  { id: 4, name: 'Micron Filter',    sub: 'Sub-micron barrier traps all remaining contaminants',  color: '#1FAEFF' },
  { id: 5, name: 'Reverse Osmosis',  sub: 'RO membrane removes dissolved solids completely',     color: '#0EA5E9' },
  { id: 6, name: 'UV Sterilisation', sub: 'UV light destroys 99.99% of bacteria & viruses',       color: '#0284C7' },
  { id: 7, name: 'Ozonation',        sub: 'Ozone adds a final impenetrable shield',               color: '#0369A1' },
  { id: 8, name: 'Mineral Balance',  sub: 'Essential minerals restored for perfect taste & health', color: '#075985' },
  { id: 9, name: 'Lab Testing',      sub: '200+ quality parameters verified — every single batch', color: '#0C4A6E' },
  { id: 10,name: 'Sealed & Pure',    sub: 'Tamper-proof sealing in a sterile environment',         color: '#003D8F' },
];

export default function PurificationJourney() {
  const { ref, inView } = useInView();
  const [active, setActive] = useState(-1);
  const [dropPos, setDropPos] = useState(0); // 0–1 through stages
  const rafRef = useRef(0);
  const startRef = useRef(0);

  useEffect(() => {
    if (!inView) return;
    startRef.current = performance.now();
    const totalDuration = 10000; // 10 s for full journey

    const anim = (now: number) => {
      const elapsed = now - startRef.current;
      const t = Math.min(elapsed / totalDuration, 1);
      setDropPos(t);
      const stageIndex = Math.min(Math.floor(t * stages.length), stages.length - 1);
      setActive(stageIndex);
      if (t < 1) rafRef.current = requestAnimationFrame(anim);
      else {
        // loop
        setTimeout(() => {
          startRef.current = performance.now();
          rafRef.current = requestAnimationFrame(anim);
        }, 2000);
      }
    };
    rafRef.current = requestAnimationFrame(anim);
    return () => cancelAnimationFrame(rafRef.current);
  }, [inView]);

  const r = (d: number) => ({
    opacity: inView ? 1 : 0,
    transform: inView ? 'translateY(0)' : 'translateY(30px)',
    transition: `opacity 0.7s ease ${d}s, transform 0.7s ease ${d}s`,
  });

  return (
    <section ref={ref} id="purification" className="relative py-32 px-6 overflow-hidden"
      style={{ background: 'linear-gradient(180deg,#F8FBFF 0%,#EEF7FF 60%,#F8FBFF 100%)' }}>

      <div className="caustics" />

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-20">
          <div style={r(0)} className="flex items-center justify-center gap-3 mb-4">
            <div className="w-8 h-px bg-water/40" />
            <span className="text-[11px] tracking-[0.4em] text-water/70 uppercase font-medium">Our Process</span>
            <div className="w-8 h-px bg-water/40" />
          </div>
          <h2 style={r(0.1)} className="text-5xl md:text-6xl font-extralight text-navy tracking-tight">
            The Purification <span className="text-gradient font-semibold">Journey</span>
          </h2>
          <p style={r(0.2)} className="mt-4 text-navy/35 text-sm max-w-sm mx-auto leading-relaxed">
            Watch the water travel through ten stages of relentless refinement.
          </p>
        </div>

        {/* Stages — two columns with animated path between them */}
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-16 items-start">

          {/* Left column: stages 1–5 */}
          <div className="flex-1 flex flex-col gap-0">
            {stages.slice(0,5).map((s, i) => (
              <StageRow key={s.id} stage={s} index={i} active={active} inView={inView} side="left" />
            ))}
          </div>

          {/* Center: vertical path + traveling droplet */}
          <div className="hidden lg:flex flex-col items-center flex-shrink-0" style={{ width: 60, paddingTop: 28 }}>
            <svg width="60" height="580" viewBox="0 0 60 580" fill="none" style={{ overflow: 'visible' }}>
              <defs>
                <linearGradient id="pathGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#BEEFFF" />
                  <stop offset="100%" stopColor="#003D8F" />
                </linearGradient>
                <radialGradient id="dropHaloGrad" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="rgba(31,174,255,0.3)" />
                  <stop offset="100%" stopColor="transparent" />
                </radialGradient>
                <filter id="dpGlow">
                  <feGaussianBlur stdDeviation="3" result="b"/>
                  <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
                </filter>
              </defs>

              {/* Track */}
              <line x1="30" y1="0" x2="30" y2="580" stroke="rgba(31,174,255,0.12)" strokeWidth="2" strokeDasharray="6 4" />

              {/* Filled progress */}
              <line x1="30" y1="0" x2="30" y2={dropPos * 580} stroke="url(#pathGrad)" strokeWidth="2.5"
                style={{ transition: 'none' }} />

              {/* Stage dots */}
              {stages.map((s, i) => {
                const y = (i / (stages.length - 1)) * 580;
                const passed = active >= i;
                return (
                  <g key={s.id}>
                    <circle cx="30" cy={y} r={passed ? 6 : 4}
                      fill={passed ? '#1FAEFF' : 'rgba(31,174,255,0.2)'}
                      stroke={passed ? '#fff' : 'rgba(31,174,255,0.3)'}
                      strokeWidth="2"
                      style={{ transition: 'all 0.4s ease' }} />
                    {active === i && (
                      <circle cx="30" cy={y} r="10" fill="none" stroke="rgba(31,174,255,0.3)" strokeWidth="1.5"
                        style={{ animation: 'rippleRing 1.2s ease-out infinite' }} />
                    )}
                  </g>
                );
              })}

              {/* Traveling droplet */}
              {inView && (
                <g transform={`translate(30, ${dropPos * 580})`} filter="url(#dpGlow)">
                  <circle cx="0" cy="0" r="14" fill="rgba(31,174,255,0.15)" />
                  <path d="M0,-11 C0,-11 -7,-3 -7,2 C-7,6 -4,9 0,9 C4,9 7,6 7,2 C7,-3 0,-11 0,-11Z"
                    fill="#1FAEFF" style={{ animation: 'dropGlow 1.5s ease-in-out infinite' }} />
                  <ellipse cx="-2.5" cy="2" rx="1.5" ry="2.5" fill="rgba(255,255,255,0.5)" transform="rotate(-15,-2.5,2)" />
                </g>
              )}
            </svg>
          </div>

          {/* Right column: stages 6–10 */}
          <div className="flex-1 flex flex-col gap-0">
            {stages.slice(5).map((s, i) => (
              <StageRow key={s.id} stage={s} index={5 + i} active={active} inView={inView} side="right" />
            ))}

            {/* Output: the result */}
            <div className="mt-8 flex flex-col items-center gap-3 pt-6"
              style={{ borderTop: '1px solid rgba(31,174,255,0.1)', opacity: active >= 9 ? 1 : 0.3, transition: 'opacity 0.5s ease' }}>
              <span className="text-xs text-water font-semibold tracking-widest uppercase">Pure. Perfect. Yours.</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function StageRow({ stage, index, active, inView, side }: {
  stage: typeof stages[0]; index: number; active: number; inView: boolean; side: 'left' | 'right';
}) {
  const isActive  = active === index;
  const isPassed  = active > index;

  return (
    <div className="group flex items-start gap-4 py-5 relative"
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? 'translateX(0)' : (side === 'left' ? 'translateX(-20px)' : 'translateX(20px)'),
        transition: `opacity 0.5s ease ${0.15 + index * 0.08}s, transform 0.5s ease ${0.15 + index * 0.08}s`,
        borderBottom: '1px solid rgba(31,174,255,0.06)',
      }}>

      {/* Number */}
      <div className="flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center text-[10px] font-bold tracking-wider transition-all duration-500"
        style={{
          background: isActive ? '#1FAEFF' : isPassed ? 'rgba(31,174,255,0.12)' : 'rgba(0,61,143,0.05)',
          color: isActive ? '#fff' : isPassed ? '#1FAEFF' : 'rgba(0,35,86,0.3)',
          boxShadow: isActive ? '0 0 16px rgba(31,174,255,0.4)' : 'none',
        }}>
        {String(stage.id).padStart(2, '0')}
      </div>

      <div className="flex-1 min-w-0 pt-1">
        <h3 className="text-sm font-semibold transition-colors duration-400"
          style={{ color: isActive ? '#003D8F' : isPassed ? 'rgba(0,61,143,0.7)' : 'rgba(0,35,86,0.35)' }}>
          {stage.name}
        </h3>
        <p className="text-xs leading-relaxed mt-0.5 transition-all duration-400"
          style={{ color: 'rgba(0,35,86,0.3)', maxHeight: isActive ? 40 : 0, overflow: 'hidden', opacity: isActive ? 1 : 0, transition: 'max-height 0.4s ease, opacity 0.4s ease' }}>
          {stage.sub}
        </p>
      </div>

      {/* Active glow line */}
      {isActive && <div className="absolute left-0 top-0 bottom-0 w-0.5 rounded-full bg-water" style={{ boxShadow: '0 0 8px rgba(31,174,255,0.5)' }} />}
    </div>
  );
}
