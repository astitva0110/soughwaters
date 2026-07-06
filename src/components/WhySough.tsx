import { useRef, useEffect, useState } from 'react';

function useInView(th = 0.1) {
  const ref = useRef<HTMLElement>(null);
  const [v, setV] = useState(false);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setV(true); obs.disconnect(); } }, { threshold: th });
    obs.observe(el); return () => obs.disconnect();
  }, [th]);
  return { ref, inView: v };
}

export default function WhySough() {
  const { ref, inView } = useInView();

  const r = (d: number) => ({
    opacity: inView ? 1 : 0,
    transform: inView ? 'translateY(0)' : 'translateY(60px)',
    transition: `opacity 1s ease ${d}s, transform 1.1s cubic-bezier(0.4,0,0.2,1) ${d}s`,
  });

  return (
    <section ref={ref} id="why-sough" className="relative min-h-screen flex items-center py-32 px-8 overflow-hidden"
      style={{ background: '#F8FBFF' }}>

      <div className="caustics" />
      <div className="caustics-spot" style={{ width: '45vw', height: '45vw', right: '-5%', top: '20%' }} />

      {/* Watermark */}
      <div className="absolute inset-0 flex items-center pointer-events-none select-none overflow-hidden" aria-hidden>
        <span className="font-black text-navy/[0.025] whitespace-nowrap"
          style={{ fontSize: '20vw', letterSpacing: '-0.05em', transform: 'translateY(10%)' }}>
          SOUGH
        </span>
      </div>

      <div className="max-w-6xl mx-auto w-full relative z-10">
        <div style={r(0)} className="flex items-center gap-3 mb-20">
          <div className="w-10 h-px bg-water/40" />
          <span className="text-[11px] tracking-[0.4em] text-water/70 uppercase font-medium">Why Sough</span>
        </div>

        {/* Cinematic type sequence */}
        <div className="flex flex-col gap-4 mb-24">
          <div style={r(0.1)}>
            <p className="font-serif italic text-navy/30 text-2xl md:text-3xl">Not just water.</p>
          </div>
          <div style={r(0.25)}>
            <h2 className="text-[clamp(4rem,12vw,10rem)] font-black text-gradient tracking-[-0.04em] leading-none">Purity.</h2>
          </div>
          <div style={r(0.4)}>
            <h2 className="text-[clamp(3rem,9vw,8rem)] font-extralight text-navy/60 tracking-tight leading-none">Trust.</h2>
          </div>
          <div style={r(0.52)}>
            <h2 className="text-[clamp(2.5rem,7vw,6rem)] font-light text-navy/40 tracking-tight leading-none">Every drop.</h2>
          </div>
        </div>

        <div style={{ ...r(0.65), height: 1 }}
          className="max-w-lg bg-gradient-to-r from-water/25 via-water/15 to-transparent mb-16" />

        <div style={r(0.75)} className="grid grid-cols-3 gap-0 max-w-md rounded-2xl overflow-hidden border border-water/10">
          {[
            { value: '10+',  label: 'Filter Stages',  sub: 'Advanced barrier' },
            { value: '200+', label: 'Quality Tests',  sub: 'Every batch' },
            { value: '100%', label: 'Natural Source', sub: 'Pristine aquifer' },
          ].map((s, i) => (
            <div key={s.label} className="flex flex-col items-center py-6 px-4 gap-1"
              style={{ background: i === 1 ? 'rgba(31,174,255,0.07)' : 'rgba(255,255,255,0.8)', borderRight: i < 2 ? '1px solid rgba(31,174,255,0.08)' : 'none' }}>
              <span className="text-3xl font-bold text-ocean" style={{ animation: `glowPulse ${4 + i}s ease-in-out infinite` }}>{s.value}</span>
              <span className="text-[10px] font-semibold text-navy/50 tracking-wider mt-0.5">{s.label}</span>
              <span className="text-[9px] text-navy/25">{s.sub}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
