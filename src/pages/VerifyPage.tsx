import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useAnimation } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import CustomCursor from '../components/CustomCursor';

/* ── document cards ── */
const DOCS = [
  { title: 'FSSAI Licence',           path: '/documents/FSSAI_Certificate.pdf' },
  { title: 'Water Laboratory Report', path: '/documents/water-lab-report.pdf'  },
  { title: 'Water Test Report',       path: '/documents/tds-report.pdf'        },
];

/* ── product info shown on success ── */
const INFO_ROWS = [
  { label: 'Manufactured & Marketed By', value: 'AA Enterprises' },
  { label: 'Address',                    value: 'Saket Nagar, W1 Block, Kanpur, Uttar Pradesh' },
  { label: 'FSSAI Licence',              value: '22726657000183' },
  { label: 'Manufacturing Unit',         value: 'Kanpur' },
  { label: 'Customer Care',             value: '9335668030 · 8005240748' },
  { label: 'Website',                   value: 'www.soughwaters.in' },
];

/* ── animated checkmark ── */
function AnimatedCheck() {
  return (
    <motion.svg
      width="64" height="64" viewBox="0 0 64 64" fill="none"
      initial="hidden" animate="visible"
    >
      <motion.circle
        cx="32" cy="32" r="30"
        stroke="#10B981" strokeWidth="3" fill="rgba(16,185,129,0.08)"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      />
      <motion.path
        d="M18 32 L28 42 L46 22"
        stroke="#10B981" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" fill="none"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut', delay: 0.5 }}
      />
    </motion.svg>
  );
}

/* ── animated X ── */
function AnimatedX() {
  return (
    <motion.svg
      width="64" height="64" viewBox="0 0 64 64" fill="none"
      initial="hidden" animate="visible"
    >
      <motion.circle
        cx="32" cy="32" r="30"
        stroke="#EF4444" strokeWidth="3" fill="rgba(239,68,68,0.08)"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      />
      <motion.path
        d="M22 22 L42 42 M42 22 L22 42"
        stroke="#EF4444" strokeWidth="3.5" strokeLinecap="round" fill="none"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut', delay: 0.5 }}
      />
    </motion.svg>
  );
}

/* ── ripple ring ── */
function RippleRing({ delay, size }: { delay: number; size: number }) {
  return (
    <motion.div
      style={{
        position: 'absolute',
        width: size,
        height: size,
        borderRadius: '50%',
        border: '1px solid rgba(31,174,255,0.25)',
        top: '50%',
        left: '50%',
        x: '-50%',
        y: '-50%',
        pointerEvents: 'none',
      }}
      animate={{ scale: [1, 2.2], opacity: [0.5, 0] }}
      transition={{ duration: 3.5, delay, repeat: Infinity, ease: 'easeOut' }}
    />
  );
}

/* ── water ripple header ── */
function WaterRippleHeader() {
  return (
    <div style={{
      position: 'relative',
      width: '100%',
      height: 220,
      overflow: 'hidden',
      background: 'linear-gradient(180deg, #001F60 0%, #0B3D91 55%, #1a6bbf 100%)',
      flexShrink: 0,
    }}>
      {/* Animated wave layers */}
      <svg viewBox="0 0 1440 220" preserveAspectRatio="none"
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
        <defs>
          <linearGradient id="hdrGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#001235" stopOpacity="1" />
            <stop offset="100%" stopColor="#0B3D91" stopOpacity="1" />
          </linearGradient>
        </defs>
        <path
          d="M0,160 C360,120 720,190 1080,155 C1260,138 1380,165 1440,160 L1440,220 L0,220 Z"
          fill="rgba(255,255,255,0.06)"
          style={{ animation: 'waveSlide 7s ease-in-out infinite' }}
        />
        <path
          d="M0,175 C240,145 480,185 720,168 C960,151 1200,180 1440,172 L1440,220 L0,220 Z"
          fill="rgba(31,174,255,0.10)"
          style={{ animation: 'waveSlide 5s 1.2s ease-in-out infinite reverse' }}
        />
      </svg>

      {/* Ripple origin point */}
      <div style={{
        position: 'absolute',
        bottom: 0,
        left: '50%',
        transform: 'translateX(-50%)',
        width: 4,
        height: 4,
      }}>
        <RippleRing delay={0}   size={80}  />
        <RippleRing delay={1.1} size={80}  />
        <RippleRing delay={2.2} size={80}  />
      </div>

      {/* Logo + title */}
      <div style={{
        position: 'absolute', inset: 0,
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        gap: 10, paddingBottom: 24,
      }}>
        <motion.img
          src="/ChatGPT_Image_Jul_2__2026__02_35_28_AM-removebg-preview.png"
          alt="Sough Waters"
          style={{ height: 56, width: 'auto', filter: 'brightness(0) invert(1)', opacity: 0.9 }}
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 0.9, y: 0 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
        />
        <motion.h1
          style={{ color: '#fff', fontSize: 13, letterSpacing: '0.35em', fontWeight: 300, textTransform: 'uppercase', margin: 0 }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.75 }}
          transition={{ duration: 0.7, delay: 0.2 }}
        >
          Verify Product Authenticity
        </motion.h1>
      </div>
    </div>
  );
}

/* ── glassmorphism doc card ── */
function DocCard({ doc, available }: { doc: typeof DOCS[0]; available: boolean | undefined }) {
  const icons: Record<string, JSX.Element> = {
    'FSSAI Licence': (
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none" stroke="#1FAEFF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="1" width="16" height="20" rx="2"/>
        <path d="M7 7h8M7 11h8M7 15h4"/>
      </svg>
    ),
    'Water Laboratory Report': (
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none" stroke="#1FAEFF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M8 3v8l-4 6a1 1 0 00.9 1.5h12.2a1 1 0 00.9-1.5L14 11V3"/>
        <path d="M7 3h8"/>
        <circle cx="10" cy="15" r="1" fill="#1FAEFF"/>
      </svg>
    ),
    'Water Test Report': (
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none" stroke="#1FAEFF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M11 2C11 2 4 9 4 14a7 7 0 0014 0C18 9 11 2 11 2z"/>
        <path d="M8 15c0-1.5 1.5-3 3-3"/>
      </svg>
    ),
  };

  return (
    <motion.div
      style={{
        background: 'rgba(255,255,255,0.72)',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
        border: '1px solid rgba(11,61,145,0.1)',
        borderRadius: 20,
        padding: '24px 20px',
        display: 'flex',
        flexDirection: 'column',
        gap: 16,
        boxShadow: '0 4px 24px rgba(11,61,145,0.07)',
      }}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -4, boxShadow: '0 12px 32px rgba(11,61,145,0.13)' }}
      transition={{ duration: 0.4 }}
    >
      <div style={{
        width: 44, height: 44, borderRadius: 14,
        background: 'rgba(31,174,255,0.08)',
        border: '1px solid rgba(31,174,255,0.18)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        {icons[doc.title]}
      </div>

      <div style={{ flex: 1 }}>
        <p style={{ fontSize: 11, letterSpacing: '0.15em', color: '#1FAEFF', fontWeight: 600, textTransform: 'uppercase', marginBottom: 4 }}>
          Document
        </p>
        <p style={{ fontSize: 15, fontWeight: 600, color: '#002356', lineHeight: 1.3 }}>{doc.title}</p>
      </div>

      {available === undefined ? (
        <div style={{ height: 38 }} />
      ) : available ? (
        <motion.a
          href={doc.path}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            padding: '10px 16px',
            background: 'linear-gradient(135deg, #0B3D91, #1FAEFF)',
            color: '#fff',
            borderRadius: 12,
            fontSize: 13,
            fontWeight: 600,
            letterSpacing: '0.05em',
            textDecoration: 'none',
            border: 'none',
          }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M7 1v8M3 6l4 4 4-4"/><path d="M1 11v1a1 1 0 001 1h10a1 1 0 001-1v-1"/>
          </svg>
          View PDF
        </motion.a>
      ) : (
        <p style={{ fontSize: 12, color: '#94a3b8', fontStyle: 'italic', textAlign: 'center', padding: '8px 0' }}>
          Document will be uploaded soon.
        </p>
      )}
    </motion.div>
  );
}

/* ── main page ── */
export default function VerifyPage() {
  const navigate = useNavigate();
  const [input, setInput]     = useState('');
  const [result, setResult]   = useState<'idle' | 'valid' | 'invalid'>('idle');
  const [docAvail, setDocAvail] = useState<Record<string, boolean | undefined>>({});
  const inputRef = useRef<HTMLInputElement>(null);

  /* probe document availability */
  useEffect(() => {
    DOCS.forEach(doc => {
      fetch(doc.path, { method: 'HEAD' })
        .then(r => setDocAvail(prev => ({ ...prev, [doc.path]: r.ok })))
        .catch(() => setDocAvail(prev => ({ ...prev, [doc.path]: false })));
    });
  }, []);

  const handleVerify = () => {
    if (!input) return;
    setResult(input.toUpperCase() === 'SW' ? 'valid' : 'invalid');
  };

  const handleReset = () => {
    setResult('idle');
    setInput('');
    setTimeout(() => inputRef.current?.focus(), 50);
  };

  return (
    <>
      <CustomCursor />
      <motion.div
        style={{ minHeight: '100vh', background: '#F8FBFF', fontFamily: 'Manrope, sans-serif' }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* ── Header ── */}
        <WaterRippleHeader />

        {/* ── Back button ── */}
        <div style={{ maxWidth: 640, margin: '0 auto', padding: '20px 20px 0' }}>
          <motion.button
            onClick={() => navigate('/')}
            style={{
              display: 'flex', alignItems: 'center', gap: 8,
              background: 'rgba(11,61,145,0.06)',
              border: '1px solid rgba(11,61,145,0.12)',
              borderRadius: 50,
              padding: '8px 18px',
              fontSize: 13, fontWeight: 600, color: '#0B3D91',
              cursor: 'pointer',
            }}
            data-hover
            whileHover={{ scale: 1.03, background: 'rgba(11,61,145,0.1)' }}
            whileTap={{ scale: 0.97 }}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 2L4 7l5 5"/>
            </svg>
            Back to Home
          </motion.button>
        </div>

        {/* ── Main content ── */}
        <div style={{ maxWidth: 640, margin: '0 auto', padding: '28px 20px 60px' }}>

          {/* Title block */}
          <motion.div
            style={{ textAlign: 'center', marginBottom: 36 }}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, marginBottom: 14 }}>
              <div style={{ height: 1, width: 40, background: 'rgba(31,174,255,0.4)' }} />
              <span style={{ fontSize: 10, letterSpacing: '0.4em', color: '#1FAEFF', fontWeight: 600, textTransform: 'uppercase' }}>
                Authenticity Check
              </span>
              <div style={{ height: 1, width: 40, background: 'rgba(31,174,255,0.4)' }} />
            </div>
            <h2 style={{ fontSize: 32, fontWeight: 700, color: '#002356', margin: '0 0 12px', lineHeight: 1.15 }}>
              Verify Your <span style={{ background: 'linear-gradient(90deg,#0B3D91,#1FAEFF)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Sough Waters</span>
            </h2>
            <p style={{ fontSize: 14, color: '#64748b', lineHeight: 1.7, margin: 0 }}>
              Enter the first two characters of the Batch Number<br />printed on the bottle neck.
            </p>
          </motion.div>

          {/* ── Input card ── */}
          <motion.div
            style={{
              background: 'rgba(255,255,255,0.85)',
              backdropFilter: 'blur(24px)',
              WebkitBackdropFilter: 'blur(24px)',
              border: '1px solid rgba(11,61,145,0.1)',
              borderRadius: 24,
              padding: '32px 28px',
              boxShadow: '0 8px 40px rgba(11,61,145,0.08)',
              marginBottom: 24,
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <label style={{ display: 'block', fontSize: 11, letterSpacing: '0.2em', color: '#0B3D91', fontWeight: 700, textTransform: 'uppercase', marginBottom: 10 }}>
              Batch Prefix
            </label>
            <div style={{ display: 'flex', gap: 12 }}>
              <div style={{ flex: 1, position: 'relative' }}>
                <input
                  ref={inputRef}
                  type="text"
                  maxLength={2}
                  placeholder="e.g. SW"
                  value={input}
                  onChange={e => {
                    setInput(e.target.value.toUpperCase());
                    if (result !== 'idle') setResult('idle');
                  }}
                  onKeyDown={e => e.key === 'Enter' && handleVerify()}
                  style={{
                    width: '100%',
                    padding: '14px 16px',
                    fontSize: 22,
                    fontWeight: 700,
                    letterSpacing: '0.4em',
                    color: '#002356',
                    background: '#F0F6FF',
                    border: '2px solid rgba(11,61,145,0.15)',
                    borderRadius: 14,
                    outline: 'none',
                    fontFamily: 'Manrope, sans-serif',
                    transition: 'border-color 0.2s',
                    textTransform: 'uppercase',
                    cursor: 'text',
                  }}
                  onFocus={e => (e.target.style.borderColor = '#1FAEFF')}
                  onBlur={e => (e.target.style.borderColor = 'rgba(11,61,145,0.15)')}
                />
              </div>
              <motion.button
                onClick={handleVerify}
                disabled={!input}
                style={{
                  padding: '14px 28px',
                  background: input ? 'linear-gradient(135deg, #0B3D91 0%, #1FAEFF 100%)' : '#e2e8f0',
                  color: input ? '#fff' : '#94a3b8',
                  border: 'none',
                  borderRadius: 14,
                  fontSize: 14,
                  fontWeight: 700,
                  letterSpacing: '0.05em',
                  cursor: input ? 'pointer' : 'not-allowed',
                  transition: 'background 0.3s',
                  whiteSpace: 'nowrap',
                  fontFamily: 'Manrope, sans-serif',
                  boxShadow: input ? '0 4px 16px rgba(11,61,145,0.25)' : 'none',
                }}
                data-hover
                whileHover={input ? { scale: 1.03 } : {}}
                whileTap={input ? { scale: 0.97 } : {}}
              >
                Verify
              </motion.button>
            </div>
          </motion.div>

          {/* ── Result card ── */}
          <AnimatePresence mode="wait">
            {result === 'valid' && (
              <motion.div
                key="valid"
                style={{
                  background: 'rgba(255,255,255,0.9)',
                  backdropFilter: 'blur(24px)',
                  WebkitBackdropFilter: 'blur(24px)',
                  border: '1.5px solid rgba(16,185,129,0.25)',
                  borderRadius: 24,
                  padding: '32px 28px',
                  boxShadow: '0 8px 40px rgba(16,185,129,0.1)',
                  marginBottom: 24,
                }}
                initial={{ opacity: 0, scale: 0.95, y: 12 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -8 }}
                transition={{ duration: 0.45, ease: [0.2, 0, 0, 1] }}
              >
                {/* Success header */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24, paddingBottom: 24, borderBottom: '1px solid rgba(16,185,129,0.12)' }}>
                  <AnimatedCheck />
                  <div>
                    <p style={{ fontSize: 11, letterSpacing: '0.2em', color: '#10B981', fontWeight: 700, textTransform: 'uppercase', marginBottom: 4 }}>
                      Verified
                    </p>
                    <h3 style={{ fontSize: 18, fontWeight: 700, color: '#002356', margin: 0, lineHeight: 1.3 }}>
                      Authentic Sough Waters Product
                    </h3>
                  </div>
                </div>

                {/* Info rows */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  {INFO_ROWS.map(row => (
                    <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16 }}>
                      <span style={{ fontSize: 11, color: '#94a3b8', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase', flexShrink: 0, paddingTop: 2 }}>
                        {row.label}
                      </span>
                      <span style={{ fontSize: 13, color: '#002356', fontWeight: 600, textAlign: 'right', lineHeight: 1.4 }}>
                        {row.value}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Reset */}
                <motion.button
                  onClick={handleReset}
                  style={{
                    marginTop: 24, width: '100%',
                    padding: '11px', background: 'transparent',
                    border: '1px solid rgba(11,61,145,0.15)',
                    borderRadius: 12, fontSize: 13, fontWeight: 600, color: '#0B3D91',
                    cursor: 'pointer', fontFamily: 'Manrope, sans-serif',
                  }}
                  data-hover
                  whileHover={{ background: 'rgba(11,61,145,0.05)' }}
                  whileTap={{ scale: 0.98 }}
                >
                  Verify Another Code
                </motion.button>
              </motion.div>
            )}

            {result === 'invalid' && (
              <motion.div
                key="invalid"
                style={{
                  background: 'rgba(255,255,255,0.9)',
                  backdropFilter: 'blur(24px)',
                  WebkitBackdropFilter: 'blur(24px)',
                  border: '1.5px solid rgba(239,68,68,0.25)',
                  borderRadius: 24,
                  padding: '32px 28px',
                  boxShadow: '0 8px 40px rgba(239,68,68,0.08)',
                  marginBottom: 24,
                  textAlign: 'center',
                }}
                initial={{ opacity: 0, scale: 0.95, y: 12 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -8 }}
                transition={{ duration: 0.45, ease: [0.2, 0, 0, 1] }}
              >
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 16 }}>
                  <AnimatedX />
                </div>
                <h3 style={{ fontSize: 20, fontWeight: 700, color: '#002356', margin: '0 0 10px' }}>
                  Invalid Batch Prefix
                </h3>
                <p style={{ fontSize: 14, color: '#64748b', lineHeight: 1.7, margin: '0 0 20px' }}>
                  Please check the first two characters printed on the bottle neck.
                </p>
                <motion.button
                  onClick={handleReset}
                  style={{
                    padding: '11px 28px', background: 'transparent',
                    border: '1px solid rgba(11,61,145,0.2)',
                    borderRadius: 12, fontSize: 13, fontWeight: 600, color: '#0B3D91',
                    cursor: 'pointer', fontFamily: 'Manrope, sans-serif',
                  }}
                  data-hover
                  whileHover={{ background: 'rgba(11,61,145,0.05)' }}
                  whileTap={{ scale: 0.98 }}
                >
                  Try Again
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ── Documents section ── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            style={{ marginBottom: 36 }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
              <div style={{ height: 1, flex: 1, background: 'rgba(11,61,145,0.08)' }} />
              <span style={{ fontSize: 10, letterSpacing: '0.35em', color: '#0B3D91', fontWeight: 700, textTransform: 'uppercase', whiteSpace: 'nowrap' }}>
                Official Documents
              </span>
              <div style={{ height: 1, flex: 1, background: 'rgba(11,61,145,0.08)' }} />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: 14 }}>
              {DOCS.map((doc, i) => (
                <motion.div
                  key={doc.path}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.1 }}
                >
                  <DocCard doc={doc} available={docAvail[doc.path]} />
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* ── Need Help ── */}
          <motion.div
            style={{
              background: 'linear-gradient(135deg, #0B3D91 0%, #003D8F 50%, #1a6bbf 100%)',
              borderRadius: 24,
              padding: '32px 28px',
              textAlign: 'center',
              boxShadow: '0 8px 40px rgba(11,61,145,0.2)',
            }}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <p style={{ fontSize: 11, letterSpacing: '0.3em', color: 'rgba(255,255,255,0.5)', fontWeight: 600, textTransform: 'uppercase', marginBottom: 8 }}>
              Support
            </p>
            <h3 style={{ fontSize: 22, fontWeight: 700, color: '#fff', margin: '0 0 20px', lineHeight: 1.2 }}>
              Need Help?
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'center', marginBottom: 20 }}>
              <div>
                <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 6 }}>Call Us</p>
                <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center' }}>
                  {['9335668030', '8005240748'].map(num => (
                    <motion.a
                      key={num}
                      href={`tel:+91${num}`}
                      style={{
                        display: 'inline-block',
                        padding: '8px 18px',
                        background: 'rgba(255,255,255,0.12)',
                        border: '1px solid rgba(255,255,255,0.18)',
                        borderRadius: 50,
                        fontSize: 14,
                        fontWeight: 700,
                        color: '#fff',
                        textDecoration: 'none',
                        letterSpacing: '0.06em',
                      }}
                      data-hover
                      whileHover={{ background: 'rgba(255,255,255,0.2)', scale: 1.04 }}
                      whileTap={{ scale: 0.97 }}
                    >
                      {num}
                    </motion.a>
                  ))}
                </div>
              </div>

              <div>
                <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 6 }}>Visit Website</p>
                <motion.a
                  href="https://www.soughwaters.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'inline-block',
                    padding: '8px 22px',
                    background: 'rgba(31,174,255,0.2)',
                    border: '1px solid rgba(31,174,255,0.35)',
                    borderRadius: 50,
                    fontSize: 13,
                    fontWeight: 600,
                    color: '#BEEFFF',
                    textDecoration: 'none',
                  }}
                  data-hover
                  whileHover={{ background: 'rgba(31,174,255,0.3)', scale: 1.04 }}
                  whileTap={{ scale: 0.97 }}
                >
                  www.soughwaters.in
                </motion.a>
              </div>
            </div>

            {/* Divider */}
            <div style={{ height: 1, background: 'rgba(255,255,255,0.08)', margin: '0 0 20px' }} />

            {/* Bottom back button */}
            <motion.button
              onClick={() => navigate('/')}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                padding: '10px 24px',
                background: 'rgba(255,255,255,0.1)',
                border: '1px solid rgba(255,255,255,0.2)',
                borderRadius: 50,
                fontSize: 13, fontWeight: 600, color: 'rgba(255,255,255,0.7)',
                cursor: 'pointer', fontFamily: 'Manrope, sans-serif',
              }}
              data-hover
              whileHover={{ background: 'rgba(255,255,255,0.18)', scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 2L4 7l5 5"/>
              </svg>
              Back to Home
            </motion.button>
          </motion.div>

        </div>
      </motion.div>
    </>
  );
}
