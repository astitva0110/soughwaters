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

const promises = [
  { title: 'Lab Tested',           sub: 'Every batch tested against 200+ quality parameters before a single bottle ships.' },
  { title: 'Advanced Purification', sub: '10-stage system: sand → carbon → micron → RO → UV → ozone. Zero shortcuts.' },
  { title: 'Safe & Hygienic',      sub: 'FSSAI-licensed facility. Sterile filling rooms. Food-grade materials throughout.' },
  { title: 'Batch Inspection',     sub: 'No bottle leaves without passing our zero-tolerance quality checkpoint.' },
  { title: 'Always Fresh',         sub: 'Short production-to-delivery cycles. Maximum freshness. Always.' },
];

export default function OurPromise() {
  const { ref, inView } = useInView();
  const [active, setActive] = useState<number | null>(null);
  const r = (d: number) => ({
    opacity: inView ? 1 : 0,
    transform: inView ? 'translateY(0)' : 'translateY(40px)',
    transition: `opacity 0.7s ease ${d}s, transform 0.7s ease ${d}s`,
  });

  return (
    <section ref={ref} id="our-promise" className="relative py-32 px-8 overflow-hidden"
      style={{ background: 'linear-gradient(180deg,#F8FBFF 0%,#EEF7FF 60%,#F8FBFF 100%)' }}>
      <div className="caustics-spot" style={{ width: '35vw', height: '35vw', left: '-5%', top: '30%' }} />

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="text-center mb-20">
          <div style={r(0)} className="flex items-center justify-center gap-3 mb-4">
            <div className="w-8 h-px bg-water/40" />
            <span className="text-[11px] tracking-[0.4em] text-water/70 uppercase font-medium">Our Promise</span>
            <div className="w-8 h-px bg-water/40" />
          </div>
          <h2 style={r(0.1)} className="text-5xl md:text-6xl font-extralight text-navy tracking-tight">
            Built on <span className="text-gradient font-semibold">Trust</span>
          </h2>
        </div>

        {/* List instead of cards */}
        <div className="flex flex-col max-w-2xl mx-auto">
          {promises.map((p, i) => (
            <div key={p.title} style={{ ...r(0.15 + i * 0.1), borderBottom: '1px solid rgba(31,174,255,0.08)' }}
              className="group flex items-start gap-6 py-7 cursor-default"
              onMouseEnter={() => setActive(i)} onMouseLeave={() => setActive(null)} data-hover>
              <div className="flex-shrink-0 w-10 h-10 rounded-2xl flex items-center justify-center transition-all duration-400"
                style={{
                  background: active === i ? '#1FAEFF' : 'rgba(31,174,255,0.07)',
                  border: `1px solid ${active === i ? 'rgba(31,174,255,0.5)' : 'rgba(31,174,255,0.12)'}`,
                  boxShadow: active === i ? '0 0 20px rgba(31,174,255,0.25)' : 'none',
                }}>
                <span className="text-[11px] font-bold" style={{ color: active === i ? '#fff' : '#1FAEFF' }}>
                  {String(i + 1).padStart(2, '0')}
                </span>
              </div>
              <div className="flex-1 pt-1">
                <h3 className="font-semibold text-navy transition-colors duration-300"
                  style={{ color: active === i ? '#003D8F' : 'rgba(0,35,86,0.7)' }}>
                  {p.title}
                </h3>
                <p className="text-sm text-navy/35 leading-relaxed mt-1 transition-all duration-400"
                  style={{ maxHeight: active === i ? 50 : 0, overflow: 'hidden', opacity: active === i ? 1 : 0, transition: 'max-height 0.4s ease, opacity 0.3s ease' }}>
                  {p.sub}
                </p>
              </div>
              <div className="flex-shrink-0 pt-2 transition-all duration-300"
                style={{ opacity: active === i ? 1 : 0 }}>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M3 8H13M9 4L13 8L9 12" stroke="#1FAEFF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
