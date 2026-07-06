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

const links = ['Why Sough', 'Purification', 'Products', 'Values', 'Distributors', 'Contact'];

const socials = [
  {
    name: 'Instagram',
    href: 'https://www.instagram.com/soughwaters?igsh=MTBmeTd3a280YWVicg==',
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
        <rect x="1" y="1" width="14" height="14" rx="3.5"/><circle cx="8" cy="8" r="3"/>
        <circle cx="11.8" cy="4.2" r="0.7" fill="currentColor" stroke="none"/>
      </svg>
    ),
  },
  {
    name: 'Facebook',
    href: 'https://www.facebook.com/share/191xZ6hw4z/',
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M10 1H8C6.34 1 5 2.34 5 4v2H3v3h2v6h3V9h2.5l.5-3H8V4c0-.28.22-.5.5-.5H10V1z"/>
      </svg>
    ),
  },
  {
    name: 'Gmail',
    href: 'mailto:soughwaters@gmail.com',
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" strokeLinecap="round" strokeLinejoin="round">
        <path d="M1 3.5h14v9a1 1 0 01-1 1H2a1 1 0 01-1-1v-9z" stroke="currentColor" strokeWidth="1.3"/>
        <path d="M1 3.5l7 5.5 7-5.5" stroke="currentColor" strokeWidth="1.3"/>
      </svg>
    ),
  },
];

export default function Footer() {
  const { ref, inView } = useInView();

  const r = (d: number) => ({
    opacity: inView ? 1 : 0,
    transform: inView ? 'translateY(0)' : 'translateY(20px)',
    transition: `opacity 0.7s ease ${d}s, transform 0.7s ease ${d}s`,
  });

  const scrollTo = (id: string) =>
    document.getElementById(id.toLowerCase().replace(/\s/g, '-'))?.scrollIntoView({ behavior: 'smooth' });

  return (
    <footer ref={ref} className="relative overflow-hidden">
      {/* Transition wave — site "melts" into water */}
      <div className="relative overflow-hidden" style={{ height: 120, background: '#F8FBFF' }}>
        <svg viewBox="0 0 1440 120" preserveAspectRatio="none" className="absolute inset-0 w-full h-full">
          <defs>
            <linearGradient id="waveGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#F8FBFF" stopOpacity="1"/>
              <stop offset="100%" stopColor="#003D8F" stopOpacity="1"/>
            </linearGradient>
          </defs>
          <path d="M0,60 C240,20 480,100 720,60 C960,20 1200,100 1440,60 L1440,120 L0,120 Z"
            fill="url(#waveGrad)" style={{ animation: 'waterRecede 8s ease-in-out infinite' }}/>
          <path d="M0,75 C360,35 720,95 1080,65 C1260,50 1380,80 1440,70 L1440,120 L0,120 Z"
            fill="rgba(0,61,143,0.5)" style={{ animation: 'waterRecede 11s 1.5s ease-in-out infinite reverse' }}/>
          <path d="M0,90 C180,70 540,110 900,85 C1100,72 1320,95 1440,88 L1440,120 L0,120 Z"
            fill="rgba(0,61,143,0.85)" style={{ animation: 'waterRecede 14s 3s ease-in-out infinite' }}/>
        </svg>
      </div>

      <div style={{ background: 'linear-gradient(180deg, #003D8F 0%, #001F60 40%, #010D30 100%)' }}>
        <div className="max-w-6xl mx-auto px-6 py-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
            {/* Brand */}
            <div style={r(0)}>
              <img src="/ChatGPT_Image_Jul_2__2026__02_35_28_AM-removebg-preview.png" alt="Sough Waters"
                style={{ height: 72, width: 'auto', filter: 'brightness(0) invert(1)', opacity: 0.85, marginBottom: 16 }} />
              <p className="text-white/30 text-sm leading-relaxed max-w-[220px] font-light">
                Pure by Nature, Perfected for You.
              </p>
              <div className="flex items-center gap-3 mt-6">
                {socials.map(s => (
                  <a key={s.name} href={s.href} aria-label={s.name} data-hover
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-white/25 hover:text-water hover:bg-water/10 transition-all duration-300"
                    style={{ border: '1px solid rgba(255,255,255,0.08)' }}>
                    {s.icon}
                  </a>
                ))}
              </div>
            </div>

            {/* Links */}
            <div style={r(0.1)}>
              <h4 className="text-[10px] tracking-[0.3em] text-water/40 uppercase font-semibold mb-6">Quick Links</h4>
              <div className="flex flex-col gap-3">
                {links.map(link => (
                  <button key={link} onClick={() => scrollTo(link)}
                    className="text-left text-sm text-white/30 hover:text-white/70 transition-colors duration-300 w-fit animated-underline"
                    data-hover>
                    {link}
                  </button>
                ))}
              </div>
            </div>

            {/* Contact */}
            <div style={r(0.2)}>
              <h4 className="text-[10px] tracking-[0.3em] text-water/40 uppercase font-semibold mb-6">Contact</h4>
              <div className="flex flex-col gap-4">
                {[
                  { l: 'Phone',   v: '+91 93356 68030', href: 'tel:+919335668030' },
                  { l: 'Phone',   v: '+91 80052 40748', href: 'tel:+918005240748' },
                  { l: 'Email',   v: 'soughwaters@gmail.com', href: 'mailto:soughwaters@gmail.com' },
                  { l: 'Company', v: 'Sough Waters', href: null },
                  { l: 'Address', v: 'Kesarwani Bhawan, Saket Nagar, Kanpur – 208014', href: 'https://maps.app.goo.gl/dbhD43ip4YQWovYs7' },
                ].map((c, i) => (
                  <div key={c.l + i}>
                    <p className="text-[10px] text-water/30 tracking-wide mb-0.5">{c.l}</p>
                    {c.href ? (
                      <a href={c.href}
                        target={c.href.startsWith('http') ? '_blank' : undefined}
                        rel={c.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                        className="text-sm text-white/40 font-light hover:text-water transition-colors duration-300">{c.v}</a>
                    ) : (
                      <p className="text-sm text-white/40 font-light">{c.v}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Bottom row */}
          <div style={{ ...r(0.3), borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: 32 }}
            className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-white/15 text-xs">&copy; {new Date().getFullYear()} Sough Waters &mdash; A unit of AA Enterprises. All rights reserved.</p>
            <div className="flex items-center gap-6">
              {['Privacy Policy', 'Terms of Service'].map(l => (
                <button key={l} className="text-white/15 hover:text-white/40 text-xs transition-colors" data-hover>{l}</button>
              ))}
            </div>
          </div>

          {/* Watermark at very bottom */}
          <div className="mt-12 text-center pointer-events-none select-none overflow-hidden" aria-hidden>
            <span className="font-black text-white/[0.03] whitespace-nowrap"
              style={{ fontSize: '12vw', letterSpacing: '-0.04em' }}>
              SOUGH
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
