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

const indiaStates = [
  { id: 'LA',  name: 'Ladakh',           x: 238, y:  12, w: 64, h: 46 },
  { id: 'JK',  name: 'J & K',            x: 118, y:  18, w: 62, h: 46 },
  { id: 'HP',  name: 'Himachal Pradesh', x: 178, y:  62, w: 54, h: 44 },
  { id: 'PB',  name: 'Punjab',           x: 112, y:  62, w: 54, h: 44 },
  { id: 'UK',  name: 'Uttarakhand',      x: 230, y:  62, w: 50, h: 44 },
  { id: 'CH',  name: 'Chandigarh',       x: 110, y: 104, w: 28, h: 22 },
  { id: 'HR',  name: 'Haryana',          x: 134, y: 104, w: 56, h: 44 },
  { id: 'DL',  name: 'Delhi',            x: 188, y: 104, w: 28, h: 24 },
  { id: 'UP',  name: 'Uttar Pradesh',    x: 214, y: 104, w: 96, h: 68 },
  { id: 'BR',  name: 'Bihar',            x: 308, y: 104, w: 62, h: 52 },
  { id: 'SK',  name: 'Sikkim',           x: 368, y: 104, w: 30, h: 24 },
  { id: 'AR',  name: 'Arunachal',        x: 396, y:  94, w: 60, h: 46 },
  { id: 'AS',  name: 'Assam',            x: 396, y: 138, w: 60, h: 38 },
  { id: 'NL',  name: 'Nagaland',         x: 454, y: 138, w: 0,  h: 0  },
  { id: 'MN',  name: 'Manipur',          x: 430, y: 174, w: 38, h: 36 },
  { id: 'ML',  name: 'Meghalaya',        x: 370, y: 154, w: 46, h: 30 },
  { id: 'TR',  name: 'Tripura',          x: 396, y: 174, w: 32, h: 30 },
  { id: 'MZ',  name: 'Mizoram',          x: 400, y: 202, w: 36, h: 36 },
  { id: 'RJ',  name: 'Rajasthan',        x: 108, y: 146, w: 98, h: 80 },
  { id: 'GJ',  name: 'Gujarat',          x: 100, y: 220, w: 78, h: 68 },
  { id: 'DN',  name: 'Dadra & NH',       x: 108, y: 286, w: 28, h: 22 },
  { id: 'MP',  name: 'Madhya Pradesh',   x: 204, y: 170, w: 98, h: 70 },
  { id: 'CG',  name: 'Chhattisgarh',     x: 300, y: 170, w: 56, h: 66 },
  { id: 'JH',  name: 'Jharkhand',        x: 354, y: 154, w: 52, h: 52 },
  { id: 'WB',  name: 'West Bengal',      x: 354, y: 184, w: 50, h: 78 },
  { id: 'OR',  name: 'Odisha',           x: 302, y: 234, w: 62, h: 62 },
  { id: 'MH',  name: 'Maharashtra',      x: 150, y: 240, w: 86, h: 72 },
  { id: 'TS',  name: 'Telangana',        x: 234, y: 240, w: 64, h: 56 },
  { id: 'AP',  name: 'Andhra Pradesh',   x: 234, y: 294, w: 78, h: 72 },
  { id: 'KA',  name: 'Karnataka',        x: 148, y: 310, w: 78, h: 68 },
  { id: 'GA',  name: 'Goa',              x: 136, y: 308, w: 30, h: 26 },
  { id: 'KL',  name: 'Kerala',           x: 150, y: 376, w: 44, h: 74 },
  { id: 'TN',  name: 'Tamil Nadu',       x: 192, y: 374, w: 68, h: 68 },
  { id: 'PY',  name: 'Puducherry',       x: 258, y: 398, w: 28, h: 24 },
];

function SuccessScreen({ stateName, onReset }: { stateName: string; onReset: () => void }) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 50);
    return () => clearTimeout(t);
  }, []);

  return (
    <div
      className="p-10 rounded-3xl text-center relative overflow-hidden"
      style={{
        background: 'rgba(255,255,255,0.9)',
        border: '1px solid rgba(31,174,255,0.2)',
        boxShadow: '0 20px 60px rgba(0,61,143,0.1)',
        backdropFilter: 'blur(12px)',
        opacity: visible ? 1 : 0,
        transform: visible ? 'scale(1) translateY(0)' : 'scale(0.96) translateY(8px)',
        transition: 'opacity 0.5s ease, transform 0.5s ease',
      }}
    >
      {/* Ripple rings */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none" aria-hidden>
        {[0, 1, 2].map(i => (
          <div key={i} className="absolute rounded-full"
            style={{
              width: 80 + i * 60, height: 80 + i * 60,
              border: '1px solid rgba(31,174,255,0.15)',
              animation: `ping 2.4s ease-out ${i * 0.4}s infinite`,
              opacity: visible ? 1 : 0,
              transition: `opacity 0.5s ease ${0.3 + i * 0.1}s`,
            }} />
        ))}
      </div>

      {/* Animated checkmark */}
      <div className="relative z-10 flex items-center justify-center mx-auto mb-6"
        style={{ width: 72, height: 72 }}>
        <div className="absolute inset-0 rounded-full"
          style={{ background: 'linear-gradient(135deg, rgba(31,174,255,0.15), rgba(0,61,143,0.08))' }} />
        <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
          <path d="M6 16L13 23L26 9" stroke="#1FAEFF" strokeWidth="2.5"
            strokeLinecap="round" strokeLinejoin="round"
            style={{
              strokeDasharray: 40,
              strokeDashoffset: visible ? 0 : 40,
              transition: 'stroke-dashoffset 0.6s cubic-bezier(0.4, 0, 0.2, 1) 0.2s',
            }} />
        </svg>
      </div>

      <div className="relative z-10">
        <p className="text-[10px] text-water/50 tracking-[0.3em] uppercase font-semibold mb-3"
          style={{ opacity: visible ? 1 : 0, transition: 'opacity 0.5s ease 0.4s' }}>
          Enquiry Received
        </p>
        <h3 className="text-2xl font-light text-navy mb-3 leading-snug"
          style={{ opacity: visible ? 1 : 0, transition: 'opacity 0.5s ease 0.5s' }}>
          Thank you for your enquiry.
        </h3>
        <p className="text-navy/45 text-sm leading-relaxed max-w-xs mx-auto font-light"
          style={{ opacity: visible ? 1 : 0, transition: 'opacity 0.5s ease 0.6s' }}>
          Our team has received your request for{' '}
          <span className="text-water font-medium">{stateName}</span> and will contact
          you within <span className="font-medium text-navy/60">24 hours.</span>
        </p>

        <div className="mt-7 flex items-center justify-center gap-2"
          style={{ opacity: visible ? 1 : 0, transition: 'opacity 0.5s ease 0.7s' }}>
          <div className="w-1.5 h-1.5 rounded-full bg-water/40" />
          <div className="w-1.5 h-1.5 rounded-full bg-water/25" />
          <div className="w-1.5 h-1.5 rounded-full bg-water/15" />
        </div>

        <button onClick={onReset}
          className="mt-6 text-xs text-navy/30 hover:text-water transition-colors duration-300 tracking-wide"
          style={{ opacity: visible ? 1 : 0, transition: 'opacity 0.5s ease 0.8s' }}
          data-hover>
          Submit another enquiry
        </button>
      </div>

      <style>{`
        @keyframes ping {
          0% { transform: scale(0.8); opacity: 0.6; }
          100% { transform: scale(2.2); opacity: 0; }
        }
      `}</style>
    </div>
  );
}

export default function Distributor() {
  const { ref, inView } = useInView();
  const [selected, setSelected] = useState<typeof indiaStates[0] | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [form, setForm] = useState({ name: '', phone: '', email: '', city: '' });

  const r = (d: number) => ({
    opacity: inView ? 1 : 0,
    transform: inView ? 'translateY(0)' : 'translateY(30px)',
    transition: `opacity 0.7s ease ${d}s, transform 0.7s ease ${d}s`,
  });

  const handleReset = () => {
    setSubmitted(false);
    setSelected(null);
    setForm({ name: '', phone: '', email: '', city: '' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmitError('');
    try {
      const res = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/send-enquiry`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          },
          body: JSON.stringify({
            name: form.name,
            phone: form.phone,
            email: form.email,
            city: form.city,
            state: selected?.name,
          }),
        }
      );
      if (!res.ok) throw new Error('Submission failed');
      setSubmitted(true);
    } catch {
      setSubmitError('Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section ref={ref} id="distributors" className="relative py-32 px-6 overflow-hidden"
      style={{ background: 'linear-gradient(180deg,#F8FBFF 0%,#EEF7FF 60%,#F8FBFF 100%)' }}>

      <div className="caustics-spot" style={{ width: '40vw', height: '40vw', right: '-5%', bottom: '10%' }} />

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <div style={r(0)} className="flex items-center justify-center gap-3 mb-5">
            <div className="w-8 h-px bg-water/40" />
            <span className="text-[11px] tracking-[0.4em] text-water/70 uppercase font-medium">Distribution Network</span>
            <div className="w-8 h-px bg-water/40" />
          </div>
          <h2 style={r(0.1)} className="text-5xl md:text-6xl font-extralight text-navy tracking-tight">
            Become a <span className="text-gradient font-semibold">Distributor</span>
          </h2>
          <p style={r(0.2)} className="mt-4 text-navy/35 text-sm max-w-xs mx-auto font-light">
            Select your state on the map to start your partnership with Sough Waters.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row items-start justify-center gap-10">
          {/* Map */}
          <div style={{ ...r(0.2), flexShrink: 0 }}>
            <div className="relative rounded-3xl overflow-hidden" style={{
              width: 480, maxWidth: '100%',
              background: 'rgba(255,255,255,0.7)',
              border: '1px solid rgba(31,174,255,0.12)',
              boxShadow: '0 20px 60px rgba(0,61,143,0.08)',
              backdropFilter: 'blur(8px)',
            }}>
              <svg viewBox="90 5 390 465" width="100%" style={{ display: 'block', padding: '12px 0' }}>
                {indiaStates.filter(s => s.w > 0).map(state => (
                  <g key={state.id} onClick={() => { if (!submitting) setSelected(state); }} style={{ cursor: 'none' }}>
                    <rect x={state.x} y={state.y} width={state.w} height={state.h} rx="7"
                      style={{
                        fill: selected?.id === state.id ? 'rgba(31,174,255,0.85)' : 'rgba(31,174,255,0.07)',
                        stroke: selected?.id === state.id ? '#1FAEFF' : 'rgba(31,174,255,0.22)',
                        strokeWidth: 1,
                        transition: 'fill 0.25s ease, stroke 0.25s ease',
                      }} />
                    {state.w >= 28 && (
                      <text x={state.x + state.w / 2} y={state.y + state.h / 2 + 3.5}
                        textAnchor="middle" fontSize={state.w >= 55 ? 8 : 7}
                        fontFamily="Manrope,sans-serif" fontWeight="700" letterSpacing="0.5"
                        style={{ fill: selected?.id === state.id ? '#fff' : 'rgba(0,61,143,0.55)', pointerEvents: 'none' }}>
                        {state.id}
                      </text>
                    )}
                  </g>
                ))}
              </svg>
              <p className="text-center text-[9px] text-navy/25 py-3 tracking-widest uppercase">Select a state to enquire</p>
            </div>
          </div>

          {/* Form / states */}
          <div style={{ ...r(0.3), flex: 1 }} className="max-w-md w-full">
            {!selected ? (
              <div className="flex flex-col items-center justify-center text-center gap-5 py-20">
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center"
                  style={{ background: 'rgba(31,174,255,0.06)', border: '1px solid rgba(31,174,255,0.15)' }}>
                  <svg width="28" height="28" viewBox="0 0 28 28" fill="none" stroke="#1FAEFF" strokeWidth="1.5" strokeLinecap="round">
                    <path d="M14 3C14 3 6 11 6 17C6 21.42 9.58 25 14 25C18.42 25 22 21.42 22 17C22 11 14 3 14 3Z"/>
                    <circle cx="14" cy="17" r="3" fill="rgba(31,174,255,0.2)"/>
                  </svg>
                </div>
                <div>
                  <p className="text-navy/40 text-sm font-light">Click any state on the map</p>
                  <p className="text-navy/25 text-xs mt-1">to begin your distributor application</p>
                </div>
              </div>
            ) : submitted ? (
              <SuccessScreen stateName={selected.name} onReset={handleReset} />
            ) : (
              <div className="p-8 rounded-3xl"
                style={{ background: 'rgba(255,255,255,0.8)', border: '1px solid rgba(31,174,255,0.12)', boxShadow: '0 8px 32px rgba(0,61,143,0.06)', backdropFilter: 'blur(8px)' }}>
                <div className="flex items-center justify-between mb-7">
                  <div>
                    <p className="text-[10px] text-water/60 tracking-widest uppercase font-semibold mb-1">Selected Region</p>
                    <h3 className="text-2xl font-light text-navy">{selected.name}</h3>
                  </div>
                  <button onClick={() => setSelected(null)} disabled={submitting}
                    className="text-navy/25 hover:text-navy/50 transition-colors p-1 disabled:opacity-40" data-hover>
                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                      <path d="M13 5L5 13M5 5L13 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                    </svg>
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                  {[
                    { k: 'name',  label: 'Full Name',     type: 'text',  ph: 'Your full name' },
                    { k: 'phone', label: 'Phone Number',  type: 'tel',   ph: '+91 98765 43210' },
                    { k: 'email', label: 'Email Address', type: 'email', ph: 'you@example.com' },
                    { k: 'city',  label: 'City',          type: 'text',  ph: 'Your city' },
                  ].map(f => (
                    <div key={f.k}>
                      <label className="block text-[11px] text-navy/40 mb-2 tracking-wide font-medium">{f.label}</label>
                      <input type={f.type} placeholder={f.ph} required disabled={submitting}
                        value={form[f.k as keyof typeof form]}
                        onChange={e => setForm(p => ({ ...p, [f.k]: e.target.value }))}
                        className="w-full px-4 py-3 rounded-xl text-navy text-sm outline-none transition-all duration-300 disabled:opacity-60"
                        style={{
                          background: 'rgba(31,174,255,0.03)',
                          border: '1px solid rgba(31,174,255,0.15)',
                          color: '#002356',
                        }}
                        onFocus={e => { e.target.style.borderColor = 'rgba(31,174,255,0.5)'; e.target.style.background = 'rgba(31,174,255,0.06)'; }}
                        onBlur={e => { e.target.style.borderColor = 'rgba(31,174,255,0.15)'; e.target.style.background = 'rgba(31,174,255,0.03)'; }}
                      />
                    </div>
                  ))}

                  {submitError && (
                    <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl"
                      style={{ background: 'rgba(239,68,68,0.05)', border: '1px solid rgba(239,68,68,0.15)' }}>
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                        <circle cx="7" cy="7" r="6" stroke="#EF4444" strokeWidth="1.2"/>
                        <path d="M7 4V7.5M7 9.5V10" stroke="#EF4444" strokeWidth="1.2" strokeLinecap="round"/>
                      </svg>
                      <p className="text-xs text-red-400">{submitError}</p>
                    </div>
                  )}

                  <button type="submit" disabled={submitting}
                    className="btn-primary mt-2 w-full text-sm flex items-center justify-center gap-2.5 disabled:opacity-70"
                    data-hover>
                    {submitting && (
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none"
                        style={{ animation: 'spin 0.8s linear infinite' }}>
                        <circle cx="8" cy="8" r="6" stroke="rgba(255,255,255,0.3)" strokeWidth="2"/>
                        <path d="M8 2A6 6 0 0 1 14 8" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                      </svg>
                    )}
                    <span>{submitting ? 'Submitting...' : 'Submit Enquiry'}</span>
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </section>
  );
}
