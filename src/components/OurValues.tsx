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

const values = [
  { word: 'Purity',           sub: 'Water in its most natural, perfect form — untouched by compromise.' },
  { word: 'Trust',            sub: 'Complete transparency and honesty at every step of the journey.' },
  { word: 'Consistency',      sub: 'Same perfect quality, every single day, every single bottle.' },
  { word: 'Transparency',     sub: 'Open about our process, and immensely proud of our results.' },
  { word: 'Customer First',   sub: 'Your satisfaction and health are the only metrics that matter.' },
  { word: 'Quality Above All', sub: 'No shortcuts. No compromises. Ever. That is our unbreakable vow.' },
];

export default function OurValues() {
  const { ref, inView } = useInView();
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <section ref={ref} id="values" className="relative py-32 px-6 overflow-hidden"
      style={{ background: '#F8FBFF' }}>

      <div className="caustics-spot" style={{ width: '40vw', height: '40vw', left: '-8%', top: '20%' }} />

      {/* Giant watermark */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden" aria-hidden>
        <span className="font-black text-navy/[0.025] whitespace-nowrap"
          style={{ fontSize: '20vw', letterSpacing: '-0.05em' }}>
          VALUES
        </span>
      </div>

      <div className="max-w-5xl mx-auto relative z-10">
        <div className="mb-20">
          <div style={{ opacity: inView ? 1 : 0, transition: 'opacity 0.7s ease' }}
            className="flex items-center gap-3 mb-5">
            <div className="w-8 h-px bg-water/40" />
            <span className="text-[11px] tracking-[0.4em] text-water/70 uppercase font-medium">Our Values</span>
          </div>
          <h2 style={{ opacity: inView ? 1 : 0, transform: inView ? 'none' : 'translateY(30px)', transition: 'opacity 0.7s ease 0.1s, transform 0.7s ease 0.1s' }}
            className="text-5xl md:text-6xl font-extralight text-navy tracking-tight">
            What We <span className="text-gradient font-semibold">Stand For</span>
          </h2>
        </div>

        <div className="flex flex-col">
          {values.map((v, i) => (
            <div key={v.word}
              style={{
                opacity: inView ? 1 : 0,
                transform: inView ? 'translateX(0)' : 'translateX(-40px)',
                transition: `opacity 0.6s ease ${0.15 + i * 0.1}s, transform 0.6s ease ${0.15 + i * 0.1}s`,
                borderBottom: `1px solid ${hovered === i ? 'rgba(31,174,255,0.2)' : 'rgba(31,174,255,0.07)'}`,
              }}
              className="group flex items-center justify-between py-6 cursor-default"
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
              data-hover>

              <div className="flex items-center gap-6 md:gap-10">
                <span className="text-[11px] font-bold tracking-wider tabular-nums w-7 flex-shrink-0 transition-colors duration-300"
                  style={{ color: hovered === i ? '#1FAEFF' : 'rgba(31,174,255,0.3)' }}>
                  {String(i + 1).padStart(2, '0')}
                </span>
                <h3
                  className="tracking-tight leading-none"
                  style={{
                    fontSize: 'clamp(2rem, 5vw, 4rem)',
                    fontWeight: hovered === i ? 300 : 200,
                    color: hovered === i ? '#002356' : 'rgba(0,35,86,0.4)',
                    transition: 'color 0.4s ease, font-weight 0.4s ease',
                  }}>
                  {v.word}
                </h3>
              </div>

              <div className="hidden md:flex items-center gap-6 ml-8">
                <p className="text-sm text-navy/40 leading-relaxed max-w-[280px] text-right font-light"
                  style={{ opacity: hovered === i ? 1 : 0, transition: 'opacity 0.3s ease' }}>
                  {v.sub}
                </p>
                <div className="w-7 h-7 rounded-full border flex items-center justify-center flex-shrink-0 transition-all duration-300"
                  style={{
                    borderColor: hovered === i ? 'rgba(31,174,255,0.4)' : 'rgba(31,174,255,0.1)',
                    opacity: hovered === i ? 1 : 0.4,
                  }}>
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <path d="M2 6H10M7 3L10 6L7 9" stroke={hovered === i ? '#1FAEFF' : 'rgba(0,35,86,0.4)'} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
