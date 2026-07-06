import { useEffect, useRef, useState } from 'react';

type Ring    = { id: number; x: number; y: number; ring: 0 | 1 | 2 };
type Flash   = { id: number; x: number; y: number };
type Dot     = { id: number; x: number; y: number; dx: number; dy: number };

const RING_CFG = [
  { anim: 'cursorRipple0', dur: '0.65s', delay: '0s',    size: 12, border: '1.5px solid rgba(31,174,255,0.7)' },
  { anim: 'cursorRipple1', dur: '0.9s',  delay: '0.05s', size: 12, border: '1px solid rgba(31,174,255,0.45)' },
  { anim: 'cursorRipple2', dur: '1.2s',  delay: '0.12s', size: 12, border: '1px solid rgba(0,61,143,0.25)' },
] as const;

export default function CustomCursor() {
  const dropRef  = useRef<HTMLDivElement>(null);
  const trailRef = useRef<HTMLDivElement>(null);
  const [rings,  setRings]  = useState<Ring[]>([]);
  const [flashes,setFlashes]= useState<Flash[]>([]);
  const [dots,   setDots]   = useState<Dot[]>([]);
  const [hov, setHov] = useState(false);
  const pos   = useRef({ x: -200, y: -200 });
  const trail = useRef({ x: -200, y: -200 });
  const raf   = useRef(0);
  const rid   = useRef(0);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      pos.current = { x: e.clientX, y: e.clientY };
      if (dropRef.current)
        dropRef.current.style.transform = `translate(${e.clientX - 14}px,${e.clientY - 22}px)`;
    };
    const onOver = (e: MouseEvent) => {
      if ((e.target as Element).closest('a,button,[data-hover]')) setHov(true);
    };
    const onOut = (e: MouseEvent) => {
      if ((e.target as Element).closest('a,button,[data-hover]')) setHov(false);
    };
    const onClick = (e: MouseEvent) => {
      const base = rid.current;
      rid.current += 10;

      // 3 concentric rings
      const newRings: Ring[] = [0, 1, 2].map(i => ({ id: base + i, x: e.clientX, y: e.clientY, ring: i as 0|1|2 }));
      setRings(p => [...p, ...newRings]);
      setTimeout(() => setRings(p => p.filter(r => r.id !== base && r.id !== base+1 && r.id !== base+2)), 1400);

      // Central flash
      const fid = base + 3;
      setFlashes(p => [...p, { id: fid, x: e.clientX, y: e.clientY }]);
      setTimeout(() => setFlashes(p => p.filter(f => f.id !== fid)), 600);

      // 8 radial splash dots
      const newDots: Dot[] = Array.from({ length: 8 }, (_, i) => {
        const angle = (i / 8) * Math.PI * 2;
        const dist  = 28 + Math.random() * 20;
        return {
          id: base + 4 + i,
          x: e.clientX,
          y: e.clientY,
          dx: Math.cos(angle) * dist,
          dy: Math.sin(angle) * dist,
        };
      });
      setDots(p => [...p, ...newDots]);
      setTimeout(() => setDots(p => p.filter(d => d.id < base + 4 || d.id >= base + 12)), 700);
    };

    const loop = () => {
      trail.current.x += (pos.current.x - trail.current.x) * 0.1;
      trail.current.y += (pos.current.y - trail.current.y) * 0.1;
      if (trailRef.current)
        trailRef.current.style.transform = `translate(${trail.current.x - 20}px,${trail.current.y - 20}px)`;
      raf.current = requestAnimationFrame(loop);
    };
    raf.current = requestAnimationFrame(loop);

    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseover', onOver);
    document.addEventListener('mouseout',  onOut);
    document.addEventListener('click',     onClick);
    return () => {
      cancelAnimationFrame(raf.current);
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseover', onOver);
      document.removeEventListener('mouseout',  onOut);
      document.removeEventListener('click',     onClick);
    };
  }, []);

  return (
    <>
      {/* Soft trail */}
      <div ref={trailRef} className="fixed pointer-events-none z-[9997] w-10 h-10 rounded-full"
        style={{ top: 0, left: 0, willChange: 'transform',
          background: 'radial-gradient(circle, rgba(31,174,255,0.18) 0%, transparent 70%)' }} />

      {/* Water droplet cursor */}
      <div ref={dropRef} className="fixed pointer-events-none z-[9999]"
        style={{ top: 0, left: 0, willChange: 'transform', transition: 'none' }}>
        <div style={{ transform: hov ? 'scale(1.6)' : 'scale(1)', transition: 'transform 0.25s cubic-bezier(0.4,0,0.2,1)' }}>
          <svg width="28" height="40" viewBox="0 0 28 40" fill="none">
            <defs>
              <radialGradient id="cdg" cx="40%" cy="35%" r="55%">
                <stop offset="0%" stopColor="#7BD4FF" />
                <stop offset="55%" stopColor="#1FAEFF" />
                <stop offset="100%" stopColor="#003D8F" />
              </radialGradient>
              <filter id="cdf"><feGaussianBlur stdDeviation="1.5" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
            </defs>
            <path d="M14,2 C14,2 2,16 2,25 C2,33 7.37,38 14,38 C20.63,38 26,33 26,25 C26,16 14,2 14,2Z"
              fill="url(#cdg)" filter="url(#cdf)" />
            <ellipse cx="9" cy="22" rx="3.5" ry="6" fill="rgba(255,255,255,0.4)" transform="rotate(-18,9,22)" />
            <ellipse cx="17" cy="10" rx="2" ry="3.5" fill="rgba(255,255,255,0.6)" transform="rotate(-10,17,10)" />
          </svg>
        </div>
      </div>

      {/* Ripple rings */}
      {rings.map(r => {
        const cfg = RING_CFG[r.ring];
        return (
          <div key={r.id} className="fixed pointer-events-none z-[9996] rounded-full"
            style={{
              left: r.x - cfg.size / 2, top: r.y - cfg.size / 2,
              width: cfg.size, height: cfg.size,
              border: cfg.border,
              animation: `${cfg.anim} ${cfg.dur} ${cfg.delay} ease-out forwards`,
            }} />
        );
      })}

      {/* Central flash */}
      {flashes.map(f => (
        <div key={f.id} className="fixed pointer-events-none z-[9998] rounded-full"
          style={{
            left: f.x - 5, top: f.y - 5, width: 10, height: 10,
            background: 'radial-gradient(circle, rgba(31,174,255,0.9) 0%, rgba(31,174,255,0.3) 60%, transparent 100%)',
            animation: 'cursorFlash 0.5s ease-out forwards',
          }} />
      ))}

      {/* Splash dots */}
      {dots.map(d => (
        <div key={d.id} className="fixed pointer-events-none z-[9995] rounded-full"
          style={{
            left: d.x - 2.5, top: d.y - 2.5, width: 5, height: 5,
            background: 'rgba(31,174,255,0.7)',
            '--dx': `${d.dx}px`,
            '--dy': `${d.dy}px`,
            animation: 'splashDot 0.65s cubic-bezier(0.2,0,0.8,1) forwards',
          } as React.CSSProperties} />
      ))}
    </>
  );
}
