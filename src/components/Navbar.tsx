import { useEffect, useState } from 'react';

const links = ['Why Sough', 'Purification', 'Products', 'Values', 'Distributors', 'Contact'];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [vis, setVis] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVis(true), 200);
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => { clearTimeout(t); window.removeEventListener('scroll', onScroll); };
  }, []);

  const go = (id: string) => {
    document.getElementById(id.toLowerCase().replace(/\s/g, '-'))?.scrollIntoView({ behavior: 'smooth' });
    setOpen(false);
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-[200]"
        style={{
          opacity: vis ? 1 : 0,
          transform: vis ? 'translateY(0)' : 'translateY(-100%)',
          transition: 'opacity 0.8s ease, transform 0.8s ease',
          ...(scrolled ? {
            background: 'rgba(248,251,255,0.75)',
            backdropFilter: 'blur(32px) saturate(1.8)',
            WebkitBackdropFilter: 'blur(32px) saturate(1.8)',
            borderBottom: '1px solid rgba(31,174,255,0.1)',
            boxShadow: '0 4px 32px rgba(0,35,86,0.06)',
          } : {
            background: 'transparent',
          }),
          padding: scrolled ? '12px 0' : '22px 0',
        }}>
        <div className="max-w-7xl mx-auto px-8 flex items-center justify-between">
          <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} data-hover>
            <img src="/ChatGPT_Image_Jul_2__2026__02_35_28_AM-removebg-preview.png" alt="Sough Waters"
              style={{ height: 52, width: 'auto', objectFit: 'contain', opacity: scrolled ? 1 : 0.95 }} />
          </button>

          <nav className="hidden lg:flex items-center gap-10">
            {links.map((l, i) => (
              <button key={l} onClick={() => go(l)} data-hover
                className="animated-underline text-navy/55 hover:text-navy text-[13px] font-medium tracking-wide transition-colors duration-300"
                style={{ animation: vis ? `navItem 0.5s ${0.1 + i * 0.06}s ease-out both` : 'none' }}>
                {l}
              </button>
            ))}
          </nav>

          <div className="hidden lg:block">
            <button className="btn-primary text-[13px]" onClick={() => go('Distributors')} data-hover>
              <span>Become a Distributor</span>
            </button>
          </div>

          <button className="lg:hidden flex flex-col gap-1.5 p-2" onClick={() => setOpen(v => !v)} data-hover>
            <span className={`block h-px w-6 bg-navy/60 transition-all duration-300 origin-center ${open ? 'rotate-45 translate-y-2' : ''}`} />
            <span className={`block h-px bg-navy/60 transition-all duration-300 ${open ? 'opacity-0 w-0' : 'w-4'}`} />
            <span className={`block h-px w-6 bg-navy/60 transition-all duration-300 origin-center ${open ? '-rotate-45 -translate-y-2' : ''}`} />
          </button>
        </div>
      </header>

      {open && (
        <div className="fixed inset-0 z-[190] flex flex-col items-center justify-center gap-9"
          style={{ background: 'rgba(248,251,255,0.97)', backdropFilter: 'blur(32px)' }}>
          {links.map(l => (
            <button key={l} onClick={() => go(l)} data-hover
              className="text-4xl font-extralight text-navy/50 hover:text-navy transition-colors duration-300">
              {l}
            </button>
          ))}
          <button className="btn-primary mt-4" onClick={() => go('Distributors')} data-hover>
            <span>Become a Distributor</span>
          </button>
        </div>
      )}
    </>
  );
}
