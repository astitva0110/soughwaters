import { useState, useEffect, useRef } from 'react';

/* Floating micro-particles */
function AirBubbles() {
  const bubbles = Array.from({ length: 16 }, (_, i) => ({
    left: `${(i * 23 + 7) % 90 + 5}%`,
    top:  `${(i * 31 + 11) % 80 + 10}%`,
    size: 2 + (i % 3),
    dur:  `${5 + (i % 5)}s`,
    del:  `${(i % 6) * 0.7}s`,
    opacity: 0.15 + (i % 4) * 0.08,
  }));
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {bubbles.map((b, i) => (
        <div key={i} className="particle absolute rounded-full bg-water"
          style={{ left: b.left, top: b.top, width: b.size, height: b.size, opacity: b.opacity,
            '--dur': b.dur, '--delay': b.del } as React.CSSProperties} />
      ))}
    </div>
  );
}

/* Condensation drops on bottle */
function Condensation({ visible }: { visible: boolean }) {
  const conds = [
    { x: 22, y: 38, r: 3.5 }, { x: 68, y: 52, r: 2.5 }, { x: 35, y: 65, r: 4 },
    { x: 58, y: 30, r: 2 }, { x: 18, y: 72, r: 3 }, { x: 75, y: 45, r: 2.5 },
    { x: 45, y: 80, r: 2 }, { x: 82, y: 62, r: 3 },
  ];
  return (
    <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 3 }}>
      {conds.map((c, i) => (
        <ellipse key={i} cx={`${c.x}%`} cy={`${c.y}%`}
          rx={c.r} ry={c.r * 1.3}
          fill="rgba(31,174,255,0.22)"
          style={{ opacity: visible ? 1 : 0, transition: `opacity 0.4s ease ${i * 0.15}s`, animation: `condAppear ${4 + i * 0.5}s ${i * 0.3}s ease-in-out infinite` }} />
      ))}
    </svg>
  );
}

/* THE SIGNATURE: Water fill animation inside bottle */
function BottleWaterFill({ level }: { level: number }) {
  const fillH = level * 70;

  return (
    <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 2 }}>
      <div style={{
        position: 'absolute',
        left: '30%', right: '30%',
        top: '14%', bottom: '6%',
        overflow: 'hidden',
        borderRadius: '2px 2px 18% 18%',
      }}>
        <div style={{
          position: 'absolute',
          left: 0, right: 0, bottom: 0,
          height: `${fillH}%`,
          transition: 'height 1.2s cubic-bezier(0.2,0,0,1)',
          background: 'linear-gradient(to top, rgba(0,61,143,0.28) 0%, rgba(31,174,255,0.18) 70%, transparent 100%)',
        }}>
          <div style={{
            position: 'absolute',
            top: -10, left: -30, right: -30,
            height: 20,
            borderRadius: '50%',
            background: 'rgba(31,174,255,0.2)',
            animation: 'waterSurfaceWave 2.8s ease-in-out infinite',
          }} />
          <div style={{
            position: 'absolute',
            top: -6, left: -20, right: -20,
            height: 12,
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.1)',
            animation: 'waterSurfaceWave 3.6s 0.8s ease-in-out infinite reverse',
          }} />
        </div>

        {fillH > 10 && (
          <div style={{
            position: 'absolute',
            left: '15%', width: '8%',
            bottom: 0, height: `${fillH * 0.6}%`,
            background: 'linear-gradient(to top, transparent, rgba(255,255,255,0.15), transparent)',
            transition: 'height 1.2s cubic-bezier(0.2,0,0,1)',
          }} />
        )}
      </div>
    </div>
  );
}

export default function HeroSection() {
  const [vis, setVis] = useState(false);
  const [bottleVis, setBottleVis] = useState(false);
  const [waterLevel, setWaterLevel] = useState(0);
  const bottleRef = useRef<HTMLDivElement>(null);
  const fillAnimRef = useRef(0);
  const fillStartRef = useRef(0);

  useEffect(() => {
    const t1 = setTimeout(() => setVis(true), 100);
    const t2 = setTimeout(() => setBottleVis(true), 400);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  useEffect(() => {
    if (!bottleVis) return;
    const delay = setTimeout(() => {
      fillStartRef.current = performance.now();
      const totalDuration = 4500;
      const fill = (now: number) => {
        const elapsed = now - fillStartRef.current;
        const t = Math.min(elapsed / totalDuration, 1);
        const eased = 1 - Math.pow(1 - t, 3);
        setWaterLevel(eased * 0.76);
        if (t < 1) fillAnimRef.current = requestAnimationFrame(fill);
      };
      fillAnimRef.current = requestAnimationFrame(fill);
    }, 600);
    return () => { clearTimeout(delay); cancelAnimationFrame(fillAnimRef.current); };
  }, [bottleVis]);

  useEffect(() => {
    const onScroll = () => {
      const hero = document.getElementById('hero');
      if (!hero) return;
      const rect = hero.getBoundingClientRect();
      const progress = Math.max(0, Math.min(1, -rect.top / (rect.height * 0.7)));
      setWaterLevel(0.76 - progress * 0.56);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      if (!bottleRef.current) return;
      const cx = window.innerWidth / 2, cy = window.innerHeight / 2;
      const rx = ((e.clientY - cy) / cy) * -5;
      const ry = ((e.clientX - cx) / cx) * 7;
      bottleRef.current.style.transform = `perspective(1000px) rotateX(${rx}deg) rotateY(${ry}deg)`;
    };
    window.addEventListener('mousemove', onMove);
    return () => window.removeEventListener('mousemove', onMove);
  }, []);

  const r = (d: number, dir = 'up') => ({
    opacity: vis ? 1 : 0,
    transform: vis ? 'translate(0,0)' : (dir === 'up' ? 'translateY(50px)' : 'translateY(-20px)'),
    transition: `opacity 1s ease ${d}s, transform 1.1s cubic-bezier(0.4,0,0.2,1) ${d}s`,
  });

  return (
    <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden"
      style={{ background: 'linear-gradient(180deg, #F8FBFF 0%, #EEF7FF 60%, #F8FBFF 100%)' }}>

      <div className="caustics" />
      <div className="caustics-spot" style={{ width: '40vw', height: '40vw', left: '55%', top: '30%' }} />
      <AirBubbles />

      {/* Subtle grid */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.025]"
        style={{ backgroundImage: 'linear-gradient(rgba(0,61,143,1) 1px,transparent 1px),linear-gradient(90deg,rgba(0,61,143,1) 1px,transparent 1px)', backgroundSize: '80px 80px' }} />

      <div className="relative z-10 max-w-7xl mx-auto px-8 w-full flex flex-col lg:flex-row items-center gap-12 pt-28 pb-20">

        {/* Left: copy */}
        <div className="flex-1 flex flex-col items-start max-w-xl">
          <div style={r(0.2)} className="flex items-center gap-3 mb-10">
            <span className="animate-pulse-soft w-2 h-2 rounded-full bg-water inline-block" />
            <span className="text-[11px] tracking-[0.4em] text-water/70 uppercase font-medium">Premium Packaged Water</span>
          </div>

          <div style={r(0.35)} className="mb-3">
            <p className="font-serif italic text-ocean/30 text-xl mb-1">Every bottle begins with</p>
            <h1 className="text-[clamp(3.5rem,9vw,8rem)] font-black tracking-[-0.03em] text-navy leading-[0.88]">
              Pure.
            </h1>
          </div>
          <div style={r(0.48)} className="mb-8">
            <h1 className="text-[clamp(2.5rem,7vw,6rem)] font-extralight tracking-tight text-navy/40 leading-none">Trust.</h1>
          </div>
          <div style={r(0.58)} className="mb-10">
            <h2 className="text-[clamp(1.1rem,2.8vw,2rem)] font-light text-navy/55 tracking-tight leading-relaxed">
              Sourced from pristine aquifers.<br />
              <span className="text-gradient font-medium">Perfected through 10 stages.</span>
            </h2>
          </div>

          {/* Stats */}
          <div style={r(0.7)} className="flex items-stretch gap-px mb-10 rounded-2xl overflow-hidden border border-water/10">
            {[['10+', 'Filter Stages'], ['200+', 'Quality Tests'], ['100%', 'Natural Source']].map(([v, l], i) => (
              <div key={l} className="flex flex-col items-center px-5 py-4 gap-0.5"
                style={{ background: i === 1 ? 'rgba(31,174,255,0.06)' : 'rgba(255,255,255,0.7)' }}>
                <span className="text-2xl font-bold text-ocean" style={{ animation: 'glowPulse 4s ease-in-out infinite' }}>{v}</span>
                <span className="text-[10px] text-navy/40 tracking-wider uppercase">{l}</span>
              </div>
            ))}
          </div>

          <div style={r(0.82)} className="flex items-center gap-4 flex-wrap">
            <button className="btn-primary" data-hover
              onClick={() => document.getElementById('why-sough')?.scrollIntoView({ behavior: 'smooth' })}>
              <span>Discover Sough</span>
            </button>
            <button className="btn-outline" data-hover
              onClick={() => document.getElementById('distributors')?.scrollIntoView({ behavior: 'smooth' })}>
              Become a Distributor
            </button>
          </div>
        </div>

        {/* Right: single hero bottle with water fill */}
        <div className="flex-1 flex items-center justify-center relative py-8">
          {/* Ambient glow rings */}
          <div className="absolute pointer-events-none" style={{ width: 500, height: 500, left: '50%', top: '50%', transform: 'translate(-50%,-50%)' }}>
            <div className="absolute inset-0 rounded-full animate-orb1"
              style={{ background: 'radial-gradient(circle, rgba(31,174,255,0.1) 0%, transparent 65%)' }} />
            <div className="absolute rounded-full animate-orb2"
              style={{ inset: '15%', background: 'radial-gradient(circle, rgba(0,61,143,0.06) 0%, transparent 65%)' }} />
          </div>

          {/* Floating micro-drops */}
          {[{t:'12%',l:'10%',s:7,d:'0s',dur:'4s'},{t:'28%',r:'8%',s:5,d:'1.2s',dur:'5.5s'},
            {t:'55%',l:'5%',s:8,d:'0.6s',dur:'3.8s'},{t:'75%',r:'12%',s:6,d:'1.8s',dur:'6s'},
            {t:'42%',r:'3%',s:4,d:'0.3s',dur:'4.5s'},{t:'85%',l:'22%',s:9,d:'2.2s',dur:'5s'}].map((p,i) => (
            <div key={i} className="absolute rounded-full"
              style={{ top: p.t, left: (p as any).l, right: (p as any).r, width: p.s, height: p.s,
                background: i%2 ? 'rgba(31,174,255,0.4)' : 'rgba(0,61,143,0.2)',
                animation: `floatBottle ${p.dur} ${p.d} ease-in-out infinite`, filter: 'blur(0.5px)' }} />
          ))}

          {/* Bottle with tilt perspective */}
          <div ref={bottleRef}
            style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
              opacity: bottleVis ? 1 : 0,
              transformStyle: 'preserve-3d', transition: 'opacity 0.8s ease 0.4s, transform 0.1s ease-out' }}>

            {/* 1L — hero bottle with water fill */}
            <div style={{ animation: 'floatBottle 6.5s ease-in-out infinite', transformOrigin: 'bottom center' }}
              className="relative flex flex-col items-center">
              {/* Shine sweep */}
              <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-3xl" style={{ zIndex: 5 }}>
                <div className="animate-shine" style={{ position: 'absolute', top: 0, left: 0, width: '28%', height: '100%',
                  background: 'linear-gradient(90deg,transparent,rgba(255,255,255,0.18),transparent)' }} />
              </div>

              <div className="relative">
                <BottleWaterFill level={waterLevel} />
                <Condensation visible={bottleVis} />
              </div>
              <div style={{ width: 120, height: 16, marginTop: 6, background: 'radial-gradient(ellipse,rgba(0,61,143,0.14) 0%,transparent 70%)', filter: 'blur(4px)' }} />
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div style={{ opacity: vis ? 1 : 0, transition: 'opacity 1s ease 1.8s' }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
        <div className="animate-scroll flex flex-col items-center gap-1">
          <div className="w-px h-10 bg-gradient-to-b from-transparent to-water/40" />
          <svg width="12" height="8" viewBox="0 0 12 8" fill="none">
            <path d="M1 1L6 6L11 1" stroke="rgba(0,61,143,0.35)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <span className="text-[9px] text-navy/25 tracking-[0.5em] uppercase">Scroll</span>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-24 pointer-events-none"
        style={{ background: 'linear-gradient(to bottom, transparent, #F8FBFF)' }} />
    </section>
  );
}
