import { useEffect, useRef } from 'react';

export default function WaterLevel() {
  const leftRef = useRef<SVGPathElement>(null);
  const rightRef = useRef<SVGPathElement>(null);
  const progress = useRef(0);
  const raf = useRef(0);

  useEffect(() => {
    const update = () => {
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      const target = maxScroll > 0 ? Math.min(window.scrollY / maxScroll, 1) : 0;
      progress.current += (target - progress.current) * 0.05;
      const p = progress.current;
      const fillPct = 5 + p * 70;
      const yPct = 100 - fillPct;
      const h = window.innerHeight;
      const w = 24;
      const yPx = (yPct / 100) * h;
      const now = Date.now() / 1000;
      const amp = 2 + p * 6;
      const wo = Math.sin(now * 0.9) * amp;
      const wo2 = Math.sin(now * 1.3 + 1) * amp * 0.4;

      const lPath = `M0 ${yPx+wo} C${w*0.5} ${yPx+wo2} ${w} ${yPx-wo*0.5} ${w} ${yPx+wo} L${w} ${h} L0 ${h} Z`;
      const rPath = `M${w} ${yPx+wo} C${w*0.5} ${yPx+wo2} 0 ${yPx-wo*0.5} 0 ${yPx+wo} L0 ${h} L${w} ${h} Z`;

      if (leftRef.current) leftRef.current.setAttribute('d', lPath);
      if (rightRef.current) rightRef.current.setAttribute('d', rPath);
      raf.current = requestAnimationFrame(update);
    };
    raf.current = requestAnimationFrame(update);
    return () => cancelAnimationFrame(raf.current);
  }, []);

  const h = typeof window !== 'undefined' ? window.innerHeight : 800;

  return (
    <>
      <div className="water-edge-left" aria-hidden="true">
        <svg width="24" style={{ width: '100%', height: '100vh' }} preserveAspectRatio="none" viewBox={`0 0 24 ${h}`}>
          <defs>
            <linearGradient id="wgl" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#1FAEFF" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#003D8F" stopOpacity="0.5" />
            </linearGradient>
          </defs>
          <path ref={leftRef} d="" fill="url(#wgl)" />
        </svg>
      </div>
      <div className="water-edge-right" aria-hidden="true">
        <svg width="24" style={{ width: '100%', height: '100vh' }} preserveAspectRatio="none" viewBox={`0 0 24 ${h}`}>
          <defs>
            <linearGradient id="wgr" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#1FAEFF" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#003D8F" stopOpacity="0.5" />
            </linearGradient>
          </defs>
          <path ref={rightRef} d="" fill="url(#wgr)" />
        </svg>
      </div>
    </>
  );
}
