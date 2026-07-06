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

const contacts = [
  { icon: 'phone',    title: 'Phone',     value: '+91 93356 68030', sub: 'Mon – Sat, 9 am – 6 pm',     href: 'tel:+919335668030' },
  { icon: 'phone',    title: 'Phone',     value: '+91 80052 40748', sub: 'Mon – Sat, 9 am – 6 pm',     href: 'tel:+918005240748' },
  { icon: 'email',    title: 'Email',     value: 'soughwaters@gmail.com',        sub: 'We reply within 24 hours',   href: 'mailto:soughwaters@gmail.com' },
  { icon: 'company',  title: 'Company',   value: 'Sough Waters',                        sub: 'A unit of AA Enterprises',   href: '#' },
  { icon: 'pin',      title: 'Address',   value: 'Kesarwani Bhawan',                   sub: 'Saket Nagar, Kanpur – 208014', href: 'https://maps.app.goo.gl/dbhD43ip4YQWovYs7' },
];

function CardIcon({ type }: { type: string }) {
  const c = '#1FAEFF';
  const m: Record<string, JSX.Element> = {
    phone: <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke={c} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 3L6.5 8L4 10C4 10 5 13 9.5 15L12 12.5L17 15L15.5 18.5C15.5 18.5 1 15 1 4L4 3Z"/></svg>,
    email: <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke={c} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="4" width="18" height="13" rx="2"/><polyline points="1,4 10,12 19,4"/></svg>,
    company: <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke={c} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="16" height="11" rx="1.5"/><path d="M6 7V5C6 3.9 6.9 3 8 3H12C13.1 3 14 3.9 14 5V7"/><line x1="10" y1="11" x2="10" y2="13"/></svg>,
    pin: <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke={c} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M10 1C7 1 4.5 3.5 4.5 7C4.5 11.5 10 19 10 19C10 19 15.5 11.5 15.5 7C15.5 3.5 13 1 10 1Z"/><circle cx="10" cy="7" r="2"/></svg>,
  };
  return m[type] ?? null;
}

export default function Contact() {
  const { ref, inView } = useInView();
  const r = (d: number) => ({
    opacity: inView ? 1 : 0,
    transform: inView ? 'translateY(0)' : 'translateY(30px)',
    transition: `opacity 0.6s ease ${d}s, transform 0.6s ease ${d}s`,
  });

  return (
    <section ref={ref} id="contact" className="relative py-32 px-6 overflow-hidden"
      style={{ background: '#F8FBFF' }}>

      <div className="caustics-spot" style={{ width: '35vw', height: '35vw', left: '-5%', top: '30%' }} />

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <div style={r(0)} className="flex items-center justify-center gap-3 mb-5">
            <div className="w-8 h-px bg-water/40" />
            <span className="text-[11px] tracking-[0.4em] text-water/70 uppercase font-medium">Get in Touch</span>
            <div className="w-8 h-px bg-water/40" />
          </div>
          <h2 style={r(0.1)} className="text-5xl md:text-6xl font-extralight text-navy tracking-tight">
            Contact <span className="text-gradient font-semibold">Us</span>
          </h2>
        </div>

        {/* Contact list — no cards, just rows */}
        <div className="max-w-2xl mx-auto">
          {contacts.map((c, i) => (
            <a key={c.title} href={c.href}
              target={c.href.startsWith('http') ? '_blank' : undefined}
              rel={c.href.startsWith('http') ? 'noopener noreferrer' : undefined}
              style={{
                ...r(0.15 + i * 0.1),
                borderBottom: '1px solid rgba(31,174,255,0.07)',
              }}
              className="group flex items-center gap-6 py-6 no-underline transition-colors duration-300"
              data-hover>
              <div className="flex-shrink-0 w-10 h-10 rounded-2xl flex items-center justify-center transition-all duration-300"
                style={{
                  background: 'rgba(31,174,255,0.06)',
                  border: '1px solid rgba(31,174,255,0.12)',
                }}>
                <CardIcon type={c.icon} />
              </div>
              <div className="flex-1">
                <p className="text-[10px] text-water/60 font-semibold tracking-widest uppercase mb-0.5">{c.title}</p>
                <p className="text-sm font-medium text-navy/70">{c.value}</p>
                <p className="text-xs text-navy/30 font-light">{c.sub}</p>
              </div>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none"
                className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <path d="M3 8H13M9 4L13 8L9 12" stroke="#1FAEFF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
