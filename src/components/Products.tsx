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

const bottles = [
  {
    size: '250ml',
    vol: '250 ml',
    desc: 'Compact and convenient. The ideal choice for events, travel, and single servings.',
    imgH: 200,
    delay: 0.8,
    tilt: '4deg',
  },
  {
    size: '500ml',
    vol: '500 ml',
    desc: 'Perfect for on-the-go hydration. Slim, lightweight, and refreshingly pure.',
    imgH: 260,
    delay: 0,
    tilt: '-4deg',
  },
  {
    size: '1L',
    vol: '1 Litre',
    desc: 'Family favourite. More water, same premium purity. Ideal for home and office.',
    imgH: 360,
    delay: 1.5,
    tilt: '0deg',
  },
];

const badges = ['BPA Free', 'Food Grade', 'Tamper Proof', 'Eco Packaging', 'Lab Certified', 'FSSAI Approved'];

export default function Products() {
  const { ref, inView } = useInView();
  const [selected, setSelected] = useState(1);

  const r = (d: number) => ({
    opacity: inView ? 1 : 0,
    transform: inView ? 'translateY(0)' : 'translateY(40px)',
    transition: `opacity 0.8s ease ${d}s, transform 0.8s ease ${d}s`,
  });

  return (
    <section ref={ref} id="products" className="relative py-32 px-6 overflow-hidden"
      style={{ background: 'linear-gradient(180deg,#EEF7FF 0%,#F8FBFF 50%,#EEF7FF 100%)' }}>

      <div className="caustics" />

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-24">
          <div style={r(0)} className="flex items-center justify-center gap-3 mb-4">
            <div className="w-8 h-px bg-water/40" />
            <span className="text-[11px] tracking-[0.4em] text-water/70 uppercase font-medium">Products</span>
            <div className="w-8 h-px bg-water/40" />
          </div>
          <h2 style={r(0.1)} className="text-5xl md:text-6xl font-extralight text-navy tracking-tight">
            The <span className="text-gradient font-semibold">Collection</span>
          </h2>
          <p style={r(0.2)} className="mt-4 text-navy/35 text-sm font-light">
            Three sizes. One uncompromising standard.
          </p>
          {/* Custom label callout */}
          <div style={r(0.3)} className="mt-6 flex justify-center">
            <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full"
              style={{
                background: 'linear-gradient(135deg, rgba(31,174,255,0.08) 0%, rgba(0,61,143,0.06) 100%)',
                border: '1px solid rgba(31,174,255,0.2)',
              }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#1FAEFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/>
                <line x1="7" y1="7" x2="7.01" y2="7"/>
              </svg>
              <span className="text-[11px] tracking-[0.2em] font-semibold uppercase" style={{ color: '#1FAEFF' }}>
                Label stickers can be customised
              </span>
            </div>
          </div>
        </div>

        {/* Museum-style floating display */}
        <div className="flex flex-col md:flex-row items-end justify-center gap-0 md:gap-16 mb-20">
          {bottles.map((b, i) => (
            <div key={b.size}
              style={{
                ...r(0.25 + i * 0.15),
                opacity: inView ? (selected === i ? 1 : 0.45) : 0,
                transition: `opacity 0.6s ease, transform 0.6s ease`,
              }}
              className="flex flex-col items-center cursor-default"
              onMouseEnter={() => setSelected(i)}
              data-hover>

              {/* Ambient light behind bottle */}
              <div className="relative flex flex-col items-center">
                <div className="absolute pointer-events-none"
                  style={{
                    width: b.imgH * 1.2, height: b.imgH * 1.2,
                    top: '50%', left: '50%', transform: 'translate(-50%,-50%)',
                    borderRadius: '50%',
                    background: selected === i
                      ? 'radial-gradient(circle, rgba(31,174,255,0.12) 0%, transparent 65%)'
                      : 'radial-gradient(circle, rgba(31,174,255,0.04) 0%, transparent 65%)',
                    transition: 'background 0.6s ease',
                  }} />

                <img src="/Bottle.png" alt={`Sough Waters ${b.vol}`}
                  style={{
                    height: b.imgH,
                    width: 'auto',
                    objectFit: 'contain',
                    transform: `rotate(${b.tilt}) scale(${selected === i ? 1.04 : 0.97})`,
                    filter: selected === i
                      ? `drop-shadow(0 40px 60px rgba(0,61,143,0.2)) drop-shadow(0 0 30px rgba(31,174,255,0.18))`
                      : `drop-shadow(0 20px 30px rgba(0,61,143,0.1))`,
                    animation: `floatBottle ${7 + i * 2}s ${b.delay}s ease-in-out infinite`,
                    transition: 'transform 0.6s ease, filter 0.6s ease',
                  }} />

                {/* Ground shadow */}
                <div style={{
                  width: b.imgH * 0.45, height: 12, marginTop: 8,
                  background: 'radial-gradient(ellipse, rgba(0,61,143,0.1) 0%, transparent 70%)',
                  filter: 'blur(4px)',
                  opacity: selected === i ? 1 : 0.4,
                  transition: 'opacity 0.6s ease',
                }} />
              </div>

              {/* Label */}
              <div className="mt-10 text-center" style={{ minWidth: 160 }}>
                <div className="flex items-center justify-center gap-2 mb-2">
                  <div className="h-px flex-1" style={{ background: 'rgba(31,174,255,0.15)' }} />
                  <span className="text-[10px] tracking-[0.4em] font-semibold uppercase"
                    style={{ color: selected === i ? '#1FAEFF' : 'rgba(31,174,255,0.35)' }}>
                    {b.vol}
                  </span>
                  <div className="h-px flex-1" style={{ background: 'rgba(31,174,255,0.15)' }} />
                </div>
                <h3 className="text-xl font-light mb-2 transition-colors duration-400"
                  style={{ color: selected === i ? '#002356' : 'rgba(0,35,86,0.4)' }}>
                  Sough Waters
                </h3>
                <p className="text-xs leading-relaxed font-light transition-all duration-400"
                  style={{
                    color: 'rgba(0,35,86,0.4)',
                    maxHeight: selected === i ? 60 : 0,
                    overflow: 'hidden',
                    opacity: selected === i ? 1 : 0,
                    transition: 'max-height 0.5s ease, opacity 0.4s ease',
                  }}>
                  {b.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Certification badges */}
        <div style={r(0.55)} className="flex flex-wrap items-center justify-center gap-3">
          {badges.map(f => (
            <div key={f} className="flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-300"
              style={{
                background: 'rgba(31,174,255,0.05)',
                border: '1px solid rgba(31,174,255,0.12)',
              }}>
              <div className="w-1 h-1 rounded-full bg-water/60" />
              <span className="text-xs text-navy/50 font-medium">{f}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
