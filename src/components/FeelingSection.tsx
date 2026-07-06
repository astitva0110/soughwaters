import { useRef, useEffect, useState } from 'react';

const words = [
  { text: 'Pure.',          size: 'clamp(5rem,14vw,12rem)', weight: 800 },
  { text: 'Calm.',          size: 'clamp(4rem,11vw,9rem)',  weight: 200 },
  { text: 'Trusted.',       size: 'clamp(3.5rem,9vw,7.5rem)', weight: 300 },
  { text: 'Every Drop Matters.', size: 'clamp(1.8rem,4.5vw,4rem)', weight: 200 },
];

function useInView(th = 0.15) {
  const ref = useRef<HTMLElement>(null);
  const [v, setV] = useState(false);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setV(true); obs.disconnect(); } }, { threshold: th });
    obs.observe(el); return () => obs.disconnect();
  }, [th]);
  return { ref, inView: v };
}

export default function FeelingSection() {
  const { ref, inView } = useInView();

  return (
    <section ref={ref} className="relative min-h-screen flex items-center justify-center py-32 px-8 overflow-hidden"
      style={{ background: 'linear-gradient(180deg, #001A4D 0%, #002056 50%, #001235 100%)' }}>

      {/* Animated caustics on dark bg */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div style={{
          position: 'absolute', width: '70vw', height: '70vw',
          left: '-15%', top: '-20%', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(31,174,255,0.08) 0%, transparent 65%)',
          filter: 'blur(60px)',
          animation: 'causticsDrift1 20s ease-in-out infinite',
        }} />
        <div style={{
          position: 'absolute', width: '50vw', height: '50vw',
          right: '-10%', bottom: '-10%', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(0,61,143,0.15) 0%, transparent 65%)',
          filter: 'blur(80px)',
          animation: 'causticsDrift2 25s ease-in-out infinite',
        }} />
      </div>

      {/* Floating micro particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {Array.from({ length: 12 }, (_, i) => (
          <div key={i} className="absolute rounded-full"
            style={{
              width: 2 + (i % 3),
              height: 2 + (i % 3),
              left: `${(i * 27 + 5) % 90 + 5}%`,
              top: `${(i * 37 + 10) % 80 + 10}%`,
              background: 'rgba(31,174,255,0.25)',
              animation: `particleDrift ${6 + (i % 4)}s ${i * 0.5}s ease-in-out infinite`,
            }} />
        ))}
      </div>

      <div className="relative z-10 max-w-4xl mx-auto text-center">
        {/* Label */}
        <div style={{ opacity: inView ? 1 : 0, transition: 'opacity 1s ease 0.2s' }}
          className="flex items-center justify-center gap-3 mb-20">
          <div className="w-10 h-px" style={{ background: 'rgba(31,174,255,0.3)' }} />
          <span className="text-[11px] tracking-[0.4em] uppercase font-medium"
            style={{ color: 'rgba(31,174,255,0.5)' }}>The Feeling of Sough</span>
          <div className="w-10 h-px" style={{ background: 'rgba(31,174,255,0.3)' }} />
        </div>

        {/* Words */}
        <div className="flex flex-col items-center gap-8">
          {words.map((w, i) => (
            <div key={w.text}
              style={{
                opacity: inView ? 1 : 0,
                transform: inView ? 'translateY(0)' : 'translateY(50px)',
                transition: `opacity 1.2s ease ${0.4 + i * 0.35}s, transform 1.2s cubic-bezier(0.2,0,0,1) ${0.4 + i * 0.35}s`,
              }}>
              <span style={{
                fontSize: w.size,
                fontWeight: w.weight,
                letterSpacing: '-0.03em',
                lineHeight: 1,
                color: i === 0 ? 'rgba(255,255,255,0.95)' :
                       i === 1 ? 'rgba(255,255,255,0.55)' :
                       i === 2 ? 'rgba(255,255,255,0.38)' :
                                 'rgba(255,255,255,0.22)',
                display: 'block',
                fontFamily: i === 0 ? "'Playfair Display', serif" : "'Manrope', sans-serif",
                fontStyle: i === 0 ? 'italic' : 'normal',
              }}>
                {i === 0 ? (
                  <span style={{
                    background: 'linear-gradient(135deg, #fff 0%, #BEEFFF 50%, #5BB8FF 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                  }}>{w.text}</span>
                ) : w.text}
              </span>
            </div>
          ))}
        </div>

        {/* Bottom line */}
        <div style={{
          opacity: inView ? 1 : 0,
          transition: 'opacity 1s ease 1.9s',
          height: 1,
          maxWidth: 200,
          margin: '80px auto 0',
          background: 'linear-gradient(90deg, transparent, rgba(31,174,255,0.3), transparent)',
        }} />
      </div>

      {/* Bottom fade into light */}
      <div className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none"
        style={{ background: 'linear-gradient(to bottom, transparent, #F8FBFF)' }} />
    </section>
  );
}
