import { useEffect, useRef, useState } from 'react';

interface Props { onComplete: () => void; }

type Stage = 'drop' | 'flood' | 'full' | 'logo' | 'recede' | 'exit';

/* Bubbles rising through the water */
function Bubbles({ active }: { active: boolean }) {
  const items = Array.from({ length: 20 }, (_, i) => ({
    x: `${(i * 13 + 5) % 90 + 5}%`,
    size: 4 + (i % 5) * 2,
    dur: `${3 + (i % 4)}s`,
    del: `${(i * 0.4) % 3}s`,
  }));
  if (!active) return null;
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 3 }}>
      {items.map((b, i) => (
        <div key={i} style={{
          position: 'absolute',
          bottom: '-10%',
          left: b.x,
          width: b.size,
          height: b.size,
          borderRadius: '50%',
          background: 'rgba(255,255,255,0.18)',
          border: '1px solid rgba(255,255,255,0.3)',
          animation: `bubbleRise ${b.dur} ${b.del} ease-in infinite`,
        }} />
      ))}
    </div>
  );
}

/* Caustic light patterns inside water */
function Caustics({ active }: { active: boolean }) {
  if (!active) return null;
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 2 }}>
      {[0, 1, 2].map(i => (
        <div key={i} style={{
          position: 'absolute',
          borderRadius: '50%',
          filter: 'blur(40px)',
          opacity: 0.15 + i * 0.04,
          width: `${40 + i * 15}vw`,
          height: `${40 + i * 15}vw`,
          left: `${(i * 33 + 5) % 60}%`,
          top: `${(i * 27 + 10) % 50}%`,
          background: 'radial-gradient(circle, rgba(255,255,255,0.5) 0%, rgba(31,174,255,0.3) 40%, transparent 70%)',
          animation: `causticsDrift${i + 1} ${12 + i * 4}s ease-in-out infinite`,
        }} />
      ))}
    </div>
  );
}

/* Animated wave at the water surface */
function WaveSurface() {
  return (
    <div style={{
      position: 'absolute', top: -48, left: -100, right: -100,
      height: 100, zIndex: 5, overflow: 'visible',
    }}>
      <svg viewBox="0 0 1440 100" preserveAspectRatio="none"
        style={{ width: '120%', height: '100%', display: 'block' }}>
        {/* Back wave */}
        <path d="M0,50 C240,20 480,80 720,50 C960,20 1200,80 1440,50 L1440,100 L0,100 Z"
          fill="rgba(0,93,160,0.6)"
          style={{ animation: 'waveSlide 4s ease-in-out infinite' }} />
        {/* Front wave - lighter */}
        <path d="M0,62 C180,42 360,78 540,60 C720,42 900,78 1080,60 C1260,42 1380,68 1440,60 L1440,100 L0,100 Z"
          fill="rgba(31,174,255,0.5)"
          style={{ animation: 'waveSlide 3s 0.8s ease-in-out infinite reverse' }} />
        {/* Foam */}
        <path d="M0,70 C120,60 240,78 360,68 C480,58 600,76 720,68 C840,60 960,76 1080,68 C1200,60 1320,74 1440,68 L1440,100 L0,100 Z"
          fill="rgba(255,255,255,0.15)"
          style={{ animation: 'waveSlide 5s 1.5s ease-in-out infinite' }} />
      </svg>
    </div>
  );
}

export default function LoadingScreen({ onComplete }: Props) {
  const [stage, setStage] = useState<Stage>('drop');
  const [dropY, setDropY] = useState(-120);
  const [floodH, setFloodH] = useState(0);      // px height of water fill
  const [recedePct, setRecedePct] = useState(0); // 0→100 recede progress
  const [showLogo, setShowLogo] = useState(false);
  const [showLine, setShowLine] = useState(false);

  const rafRef = useRef(0);
  const startRef = useRef(0);

  /* Target Y for drop impact — center of screen */
  const impactY = typeof window !== 'undefined' ? window.innerHeight / 2 - 20 : 360;
  const cx = typeof window !== 'undefined' ? window.innerWidth / 2 : 768;

  /* ─── Drop falls with acceleration ─── */
  useEffect(() => {
    if (stage !== 'drop') return;
    let y = -120;
    const loop = () => {
      const progress = Math.max(0, (y + 120) / (impactY + 120));
      y += 1.2 + progress * 7;
      setDropY(y);
      if (y < impactY) {
        rafRef.current = requestAnimationFrame(loop);
      } else {
        // Impact — start flooding
        setStage('flood');
      }
    };
    rafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafRef.current);
  }, [stage, impactY]);

  /* ─── Flood: water rises to fill screen ─── */
  useEffect(() => {
    if (stage !== 'flood') return;
    const totalH = typeof window !== 'undefined' ? window.innerHeight : 800;
    startRef.current = performance.now();
    const duration = 2000; // 2s flood

    const animate = (now: number) => {
      const t = Math.min((now - startRef.current) / duration, 1);
      // Ease-in-out for organic water rise
      const eased = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
      setFloodH(eased * totalH);

      if (t < 1) {
        rafRef.current = requestAnimationFrame(animate);
      } else {
        setFloodH(totalH);
        setStage('full');
      }
    };
    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  }, [stage]);

  /* ─── Full: show logo ─── */
  useEffect(() => {
    if (stage !== 'full') return;
    const t1 = setTimeout(() => setShowLogo(true), 400);
    const t2 = setTimeout(() => setShowLine(true), 900);
    const t3 = setTimeout(() => setStage('recede'), 2200);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [stage]);

  /* ─── Recede: water drops back down ─── */
  useEffect(() => {
    if (stage !== 'recede') return;
    startRef.current = performance.now();
    const duration = 2400; // 2.4s recede

    const animate = (now: number) => {
      const t = Math.min((now - startRef.current) / duration, 1);
      // Ease-in for water-drain feel (slow at start, faster as gravity takes over)
      const eased = t * t * (3 - 2 * t);
      setRecedePct(eased * 100);

      if (t < 1) {
        rafRef.current = requestAnimationFrame(animate);
      } else {
        setStage('exit');
        setTimeout(onComplete, 500);
      }
    };
    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  }, [stage, onComplete]);

  const totalH = typeof window !== 'undefined' ? window.innerHeight : 800;
  const currentWaterH = stage === 'recede' || stage === 'exit'
    ? totalH * (1 - recedePct / 100)
    : floodH;

  const waterVisible = stage !== 'drop' || floodH > 0;
  const contentFadingOut = stage === 'recede' && recedePct > 60;

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 9999,
      background: '#F8FBFF',
      overflow: 'hidden',
      opacity: stage === 'exit' ? 0 : 1,
      transition: stage === 'exit' ? 'opacity 0.5s ease' : 'none',
      pointerEvents: stage === 'exit' ? 'none' : 'all',
    }}>

      {/* ─── Phase 1: Falling drop ─── */}
      {stage === 'drop' && (
        <svg className="absolute inset-0 pointer-events-none" width="100%" height="100%" style={{ overflow: 'visible' }}>
          <defs>
            <radialGradient id="dropGradLS" cx="40%" cy="30%" r="60%">
              <stop offset="0%" stopColor="#BEEFFF" />
              <stop offset="50%" stopColor="#1FAEFF" />
              <stop offset="100%" stopColor="#003D8F" />
            </radialGradient>
            <filter id="dropGlowLS">
              <feGaussianBlur stdDeviation="4" result="b"/>
              <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
            </filter>
          </defs>
          {/* Drop shadow on ground */}
          <ellipse cx={cx} cy={impactY + 28} rx={Math.max(0, 28 * ((dropY + 120) / (impactY + 120)))} ry={4}
            fill="rgba(0,61,143,0.12)" filter="url(#dropGlowLS)" />
          {/* Main droplet */}
          <g transform={`translate(${cx},${dropY})`} filter="url(#dropGlowLS)">
            <path d="M0,-52 C0,-52 -28,-14 -28,8 C-28,24 -15,38 0,38 C15,38 28,24 28,8 C28,-14 0,-52 0,-52Z"
              fill="url(#dropGradLS)" />
            <ellipse cx="-10" cy="10" rx="6" ry="10" fill="rgba(255,255,255,0.45)" transform="rotate(-18,-10,10)" />
            <ellipse cx="6" cy="-18" rx="3" ry="6" fill="rgba(255,255,255,0.65)" transform="rotate(-10,6,-18)" />
          </g>
        </svg>
      )}

      {/* ─── Phases 2–4: Water flood (rises from bottom) ─── */}
      {waterVisible && (
        <div style={{
          position: 'absolute',
          left: 0, right: 0, bottom: 0,
          height: currentWaterH,
          overflow: 'hidden',
          zIndex: 4,
          transition: 'none',
        }}>
          {/* Deep water gradient */}
          <div style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(to top, #001235 0%, #002B6A 25%, #003D8F 50%, #0076C0 75%, #1FAEFF 90%, #5BBFFF 100%)',
          }} />

          {/* Caustic light effects */}
          <Caustics active={stage === 'full' || stage === 'recede'} />

          {/* Bubbles */}
          <Bubbles active={stage === 'full' || (stage === 'recede' && recedePct < 60)} />

          {/* Wave surface */}
          <WaveSurface />

          {/* Shimmer/light rays */}
          {(stage === 'full' || stage === 'recede') && (
            <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', zIndex: 1 }}>
              {[0, 1, 2].map(i => (
                <div key={i} style={{
                  position: 'absolute',
                  top: 0, bottom: 0,
                  width: 2,
                  left: `${25 + i * 25}%`,
                  background: 'linear-gradient(to bottom, rgba(255,255,255,0.15) 0%, transparent 40%)',
                  transform: `skewX(${-8 + i * 6}deg)`,
                  animation: `lightRay ${4 + i}s ${i * 0.7}s ease-in-out infinite`,
                }} />
              ))}
            </div>
          )}

          {/* Logo + bottle — centered in water */}
          <div style={{
            position: 'absolute', inset: 0,
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            zIndex: 10,
            opacity: showLogo && !contentFadingOut ? 1 : 0,
            transform: showLogo ? 'translateY(0)' : 'translateY(60px)',
            transition: 'opacity 1.4s cubic-bezier(0.2,0,0,1), transform 1.6s cubic-bezier(0.2,0,0,1)',
          }}>
            {/* Soft glow behind logo */}
            <div style={{
              position: 'absolute', width: 400, height: 400,
              top: '50%', left: '50%', transform: 'translate(-50%,-50%)',
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(31,174,255,0.25) 0%, transparent 60%)',
              filter: 'blur(20px)',
            }} />

            {/* Logo — main reveal */}
            <img src="/ChatGPT_Image_Jul_2__2026__02_35_28_AM-removebg-preview.png" alt="Sough Waters"
              style={{
                height: 220, width: 'auto', objectFit: 'contain', position: 'relative', zIndex: 1,
                filter: 'brightness(0) invert(1) drop-shadow(0 0 40px rgba(255,255,255,0.4)) drop-shadow(0 10px 40px rgba(0,0,61,0.4))',
                animation: 'floatBottle 5s ease-in-out infinite',
              }} />

            {/* Tagline */}
            <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, position: 'relative', zIndex: 1 }}>
              {/* Expanding line */}
              <div style={{
                height: 1,
                width: showLine ? 180 : 0,
                background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.5), transparent)',
                transition: 'width 1s ease',
              }} />
              <p style={{
                fontSize: 10, letterSpacing: '0.5em', color: 'rgba(255,255,255,0.45)',
                textTransform: 'uppercase', fontWeight: 300,
                opacity: showLine ? 1 : 0, transition: 'opacity 0.6s ease 0.4s',
              }}>Pure by Nature, Perfected for You</p>
            </div>
          </div>
        </div>
      )}

      {/* ─── Impact flash when drop hits ─── */}
      {stage === 'flood' && floodH < 10 && (
        <div style={{
          position: 'absolute', inset: 0, zIndex: 20,
          background: 'rgba(31,174,255,0.3)',
          animation: 'impactFlash 0.4s ease-out forwards',
          pointerEvents: 'none',
        }} />
      )}
    </div>
  );
}
