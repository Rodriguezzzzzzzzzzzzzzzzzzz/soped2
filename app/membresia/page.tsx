'use client';

import { useEffect, useState } from 'react';

export default function MembresiaPage() {

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <>
      {/*
        Show blank screen until mounted, to avoid hydration mismatch
      */}
      {(() => {
        if (!mounted) {
          return (
            <div style={{
              background: '#080b12',
              height: '100vh',
              width: '100%',
            }} />
          );
        }
      })()}
      <style jsx global>{`

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        :root {
          --surface-0: #080b12;
          --surface-1: #0e1420;
          --surface-2: #141b2e;
          --surface-3: #1a2238;
          --primary: #c9a96e;
          --primary-dim: rgba(201, 169, 110, 0.15);
          --primary-border: rgba(201, 169, 110, 0.25);
          --text-primary: #f0ece4;
          --text-secondary: rgba(240, 236, 228, 0.6);
          --text-tertiary: rgba(240, 236, 228, 0.35);
          --glass-bg: rgba(14, 20, 32, 0.55);
          --glass-border: rgba(255, 255, 255, 0.07);
          --glass-hover: rgba(20, 27, 46, 0.75);
          --shadow-deep: 0 32px 80px rgba(0, 0, 0, 0.6);
          --shadow-card: 0 8px 32px rgba(0, 0, 0, 0.4);
          --font-display: "Cormorant Garamond", Georgia, serif;
          --font-body: "DM Sans", system-ui, sans-serif;
          --transition: cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }

        html { scroll-behavior: smooth; }

        body {
          background: var(--surface-0);
          color: var(--text-primary);
          font-family: var(--font-body);
          font-weight: 300;
          line-height: 1.6;
          -webkit-font-smoothing: antialiased;
          overflow-x: hidden;
        }

        /* ── PAGE LOAD ANIMATION ── */
        .page-wrapper {
          opacity: 0;
          animation: pageFadeIn 0.6s ease forwards;
        }

        .page-wrapper.visible {
          opacity: 1;
        }

        @keyframes pageFadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        /* ── HERO ── */
        .hero {
          position: relative;
          min-height: 100svh;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
        }

        .hero-video {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          z-index: 0;
          opacity: 0.55;
        }

        .hero-overlay {
          position: absolute;
          inset: 0;
          z-index: 1;
          background:
            radial-gradient(ellipse 80% 60% at 50% 100%, rgba(8, 11, 18, 0.85) 0%, transparent 70%),
            radial-gradient(ellipse 60% 80% at 50% 0%, rgba(8, 11, 18, 0.5) 0%, transparent 60%),
            linear-gradient(180deg, rgba(8,11,18,0.3) 0%, rgba(8,11,18,0.1) 40%, rgba(8,11,18,0.7) 100%);
        }

        .hero-content {
          position: relative;
          z-index: 2;
          text-align: center;
          max-width: 860px;
          padding: 0 2rem;
          animation: heroReveal 1.2s var(--transition) both;
        }

        @keyframes heroReveal {
          from { opacity: 0; transform: translateY(28px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .hero-eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 0.6rem;
          font-family: var(--font-body);
          font-size: 0.72rem;
          font-weight: 500;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: var(--primary);
          margin-bottom: 1.5rem;
          border: 1px solid var(--primary-border);
          padding: 0.4rem 1rem;
          border-radius: 100px;
          backdrop-filter: blur(12px);
          background: var(--primary-dim);
        }

        .hero-eyebrow::before {
          content: '';
          width: 5px;
          height: 5px;
          background: var(--primary);
          border-radius: 50%;
          flex-shrink: 0;
        }

        .hero-title {
          font-family: var(--font-display);
          font-size: clamp(3.2rem, 8vw, 6.5rem);
          font-weight: 300;
          line-height: 1.04;
          letter-spacing: -0.01em;
          margin-bottom: 1.5rem;
          color: var(--text-primary);
        }

        .hero-title em {
          font-style: italic;
          color: var(--primary);
        }

        .hero-subtitle {
          font-size: clamp(1rem, 2vw, 1.18rem);
          font-weight: 300;
          color: var(--text-secondary);
          max-width: 560px;
          margin: 0 auto 2.8rem;
          line-height: 1.75;
        }

        .hero-actions {
          display: flex;
          gap: 1rem;
          justify-content: center;
          flex-wrap: wrap;
        }

        .btn-primary {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          background: var(--primary);
          color: #0a0c12;
          font-family: var(--font-body);
          font-size: 0.88rem;
          font-weight: 500;
          letter-spacing: 0.06em;
          padding: 0.85rem 2rem;
          border-radius: 4px;
          border: none;
          cursor: pointer;
          text-decoration: none;
          transition: all 0.25s var(--transition);
          position: relative;
          overflow: hidden;
        }

        .btn-primary::after {
          content: '';
          position: absolute;
          inset: 0;
          background: rgba(255,255,255,0.12);
          opacity: 0;
          transition: opacity 0.2s;
        }

        .btn-primary:hover::after { opacity: 1; }
        .btn-primary:hover { transform: translateY(-1px); box-shadow: 0 8px 28px rgba(201, 169, 110, 0.35); }

        .btn-ghost {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          background: var(--glass-bg);
          color: var(--text-primary);
          font-family: var(--font-body);
          font-size: 0.88rem;
          font-weight: 400;
          letter-spacing: 0.04em;
          padding: 0.85rem 2rem;
          border-radius: 4px;
          border: 1px solid var(--glass-border);
          cursor: pointer;
          text-decoration: none;
          backdrop-filter: blur(16px);
          transition: all 0.25s var(--transition);
        }

        .btn-ghost:hover {
          border-color: rgba(255,255,255,0.14);
          background: var(--glass-hover);
          transform: translateY(-1px);
        }

        .hero-scroll {
          position: absolute;
          bottom: 2.5rem;
          left: 50%;
          transform: translateX(-50%);
          z-index: 2;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.5rem;
          opacity: 0.45;
          animation: scrollBob 2s ease-in-out infinite;
        }

        .hero-scroll span {
          font-size: 0.68rem;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: var(--text-secondary);
        }

        @keyframes scrollBob {
          0%, 100% { transform: translateX(-50%) translateY(0); }
          50%       { transform: translateX(-50%) translateY(6px); }
        }

        /* ── SECTION SHARED ── */
        .section {
          padding: 7rem 2rem;
          max-width: 1200px;
          margin: 0 auto;
        }

        .section-full {
          padding: 7rem 2rem;
        }

        .section-label {
          font-size: 0.7rem;
          font-weight: 500;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: var(--primary);
          margin-bottom: 1rem;
        }

        .section-title {
          font-family: var(--font-display);
          font-size: clamp(2.2rem, 4.5vw, 3.8rem);
          font-weight: 300;
          line-height: 1.1;
          color: var(--text-primary);
          margin-bottom: 1.2rem;
        }

        .section-subtitle {
          font-size: 1rem;
          color: var(--text-secondary);
          max-width: 520px;
          line-height: 1.75;
        }

        .section-header {
          margin-bottom: 4rem;
        }

        /* ── DIVIDER LINE ── */
        .divider {
          width: 100%;
          height: 1px;
          background: linear-gradient(90deg, transparent, var(--glass-border) 30%, var(--glass-border) 70%, transparent);
        }

        /* ── BENEFITS GRID ── */
        .benefits-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 1.5px;
          background: var(--glass-border);
          border: 1px solid var(--glass-border);
          border-radius: 12px;
          overflow: hidden;
        }

        .benefit-card {
          background: var(--surface-1);
          padding: 2.2rem;
          transition: background 0.3s var(--transition);
          position: relative;
          overflow: hidden;
        }

        .benefit-card::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 1px;
          background: linear-gradient(90deg, transparent, var(--primary-border), transparent);
          opacity: 0;
          transition: opacity 0.3s;
        }

        .benefit-card:hover { background: var(--surface-2); }
        .benefit-card:hover::before { opacity: 1; }

        .benefit-icon {
          width: 40px;
          height: 40px;
          border: 1px solid var(--primary-border);
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 1.5rem;
          background: var(--primary-dim);
          flex-shrink: 0;
        }

        .benefit-icon svg {
          width: 18px;
          height: 18px;
          stroke: var(--primary);
          fill: none;
          stroke-width: 1.5;
        }

        .benefit-title {
          font-family: var(--font-display);
          font-size: 1.35rem;
          font-weight: 400;
          color: var(--text-primary);
          margin-bottom: 0.6rem;
          line-height: 1.3;
        }

        .benefit-desc {
          font-size: 0.88rem;
          color: var(--text-secondary);
          line-height: 1.7;
        }

        /* ── MEMBERSHIP TYPES ── */
        .membership-section {
          background: var(--surface-1);
        }

        .membership-grid {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 2rem;
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
          gap: 1.5rem;
        }

        .membership-card {
          background: var(--surface-0);
          border: 1px solid var(--glass-border);
          border-radius: 12px;
          padding: 2.8rem 2.4rem;
          display: flex;
          flex-direction: column;
          gap: 1.8rem;
          transition: all 0.35s var(--transition);
          position: relative;
          overflow: hidden;
        }

        .membership-card::after {
          content: '';
          position: absolute;
          inset: 0;
          border-radius: 12px;
          background: radial-gradient(ellipse 80% 60% at 50% 0%, rgba(201, 169, 110, 0.06) 0%, transparent 70%);
          opacity: 0;
          transition: opacity 0.4s;
        }

        .membership-card:hover {
          border-color: var(--primary-border);
          transform: translateY(-4px);
          box-shadow: var(--shadow-deep);
        }
        .membership-card:hover::after { opacity: 1; }

        .membership-card.featured {
          border-color: var(--primary-border);
          background: linear-gradient(160deg, var(--surface-2) 0%, var(--surface-0) 100%);
        }

        .membership-badge {
          position: absolute;
          top: 1.4rem;
          right: 1.4rem;
          font-size: 0.62rem;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: var(--primary);
          border: 1px solid var(--primary-border);
          padding: 0.25rem 0.7rem;
          border-radius: 100px;
          background: var(--primary-dim);
        }

        .membership-icon-wrap {
          width: 52px;
          height: 52px;
          border: 1px solid var(--glass-border);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--surface-2);
        }

        .membership-icon-wrap svg {
          width: 22px;
          height: 22px;
          stroke: var(--primary);
          fill: none;
          stroke-width: 1.5;
        }

        .membership-type-label {
          font-size: 0.68rem;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: var(--primary);
          margin-bottom: 0.4rem;
        }

        .membership-name {
          font-family: var(--font-display);
          font-size: 2rem;
          font-weight: 400;
          line-height: 1.1;
          color: var(--text-primary);
        }

        .membership-desc {
          font-size: 0.9rem;
          color: var(--text-secondary);
          line-height: 1.75;
        }

        .membership-features {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          flex: 1;
        }

        .membership-features li {
          display: flex;
          align-items: flex-start;
          gap: 0.7rem;
          font-size: 0.875rem;
          color: var(--text-secondary);
          line-height: 1.5;
        }

        .check-icon {
          width: 16px;
          height: 16px;
          flex-shrink: 0;
          margin-top: 1px;
          stroke: var(--primary);
          fill: none;
          stroke-width: 2;
        }

        .btn-membership {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          width: 100%;
          padding: 0.9rem 1.5rem;
          border-radius: 6px;
          font-family: var(--font-body);
          font-size: 0.85rem;
          font-weight: 500;
          letter-spacing: 0.08em;
          cursor: pointer;
          text-decoration: none;
          transition: all 0.25s var(--transition);
        }

        .btn-membership-outline {
          background: transparent;
          color: var(--text-primary);
          border: 1px solid var(--glass-border);
        }

        .btn-membership-outline:hover {
          border-color: var(--primary-border);
          color: var(--primary);
          background: var(--primary-dim);
        }

        .btn-membership-fill {
          background: var(--primary);
          color: #0a0c12;
          border: 1px solid var(--primary);
        }

        .btn-membership-fill:hover {
          background: #d9bc85;
          box-shadow: 0 6px 24px rgba(201, 169, 110, 0.3);
          transform: translateY(-1px);
        }

        /* ── STATS STRIP ── */
        .stats-strip {
          border-top: 1px solid var(--glass-border);
          border-bottom: 1px solid var(--glass-border);
          background: var(--surface-1);
          padding: 3rem 2rem;
        }

        .stats-inner {
          max-width: 1000px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
          gap: 2rem;
          text-align: center;
        }

        .stat-item {}

        .stat-number {
          font-family: var(--font-display);
          font-size: 3rem;
          font-weight: 300;
          color: var(--primary);
          line-height: 1;
          margin-bottom: 0.4rem;
        }

        .stat-label {
          font-size: 0.78rem;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: var(--text-tertiary);
        }

        /* ── CTA FINAL ── */
        .cta-section {
          background:
            radial-gradient(ellipse 70% 50% at 50% 50%, rgba(201, 169, 110, 0.06) 0%, transparent 70%),
            var(--surface-1);
          border-top: 1px solid var(--glass-border);
        }

        .cta-inner {
          max-width: 680px;
          margin: 0 auto;
          text-align: center;
          padding: 8rem 2rem;
        }

        .cta-title {
          font-family: var(--font-display);
          font-size: clamp(2.5rem, 5vw, 4.2rem);
          font-weight: 300;
          line-height: 1.08;
          color: var(--text-primary);
          margin-bottom: 1.2rem;
        }

        .cta-title em {
          font-style: italic;
          color: var(--primary);
        }

        .cta-text {
          font-size: 1rem;
          color: var(--text-secondary);
          margin-bottom: 2.8rem;
          line-height: 1.75;
        }

        .cta-note {
          margin-top: 1.5rem;
          font-size: 0.78rem;
          color: var(--text-tertiary);
          letter-spacing: 0.04em;
        }

        /* ── FOOTER STRIP ── */
        .footer-strip {
          border-top: 1px solid var(--glass-border);
          padding: 2rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          max-width: 1200px;
          margin: 0 auto;
          flex-wrap: wrap;
          gap: 1rem;
        }

        .footer-logo {
          font-family: var(--font-display);
          font-size: 1.1rem;
          font-weight: 400;
          letter-spacing: 0.06em;
          color: var(--text-primary);
        }

        .footer-logo span { color: var(--primary); }

        .footer-copy {
          font-size: 0.75rem;
          color: var(--text-tertiary);
          letter-spacing: 0.04em;
        }

        /* ── RESPONSIVE ── */
        @media (max-width: 768px) {
          .hero-actions { flex-direction: column; align-items: center; }
          .hero-actions a, .hero-actions button { width: 100%; max-width: 320px; justify-content: center; }
          .benefits-grid { grid-template-columns: 1fr; }
          .membership-grid { grid-template-columns: 1fr; }
          .stats-inner { grid-template-columns: repeat(2, 1fr); }
        }

        /* ── SCROLL ANIMATIONS ── */
        .fade-up {
          opacity: 0;
          transform: translateY(24px);
          transition: opacity 0.7s var(--transition), transform 0.7s var(--transition);
        }
        .fade-up.in-view {
          opacity: 1;
          transform: translateY(0);
        }
      `}</style>

      <div className={`page-wrapper${mounted ? ' visible' : ''}`}>

        {/* ══════════ HERO ══════════ */}
        <section className="hero">
          <video
            className="hero-video"
            autoPlay
            poster="/heromunpage.jpg"
            muted
            loop
            playsInline
            src="/heromunpage.mp4"
          />
          <div className="hero-overlay" />

          <div className="hero-content">

            <h1 className="hero-title">
              Membresía<br /><em>SoPeD</em>
            </h1>
            <p className="hero-subtitle">
              Accede a programas académicos, competencias internacionales,
              certificaciones y una comunidad de debate de alto nivel.
            </p>
            <div className="hero-actions">
              <a href="#membresia" className="btn-primary">
                Convertirse en miembro
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </a>
              <a href="#beneficios" className="btn-ghost">
                Explorar beneficios
              </a>
            </div>
          </div>

          <div className="hero-scroll">
            <svg width="16" height="22" viewBox="0 0 16 22" fill="none" stroke="currentColor" strokeWidth="1.2">
              <rect x="1" y="1" width="14" height="20" rx="7"/>
              <line x1="8" y1="5" x2="8" y2="9"/>
            </svg>
            <span>Scroll</span>
          </div>
        </section>

        {/* ══════════ STATS ══════════ */}
        <div className="stats-strip">
          <div className="stats-inner">
            {[
              { n: '12+', l: 'Años de trayectoria' },
              { n: '800+', l: 'Miembros activos' },
              { n: '40+', l: 'Instituciones afiliadas' },
              { n: '6', l: 'Programas oficiales' },
            ].map((s) => (
              <div className="stat-item" key={s.l}>
                <div className="stat-number">{s.n}</div>
                <div className="stat-label">{s.l}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ══════════ BENEFICIOS ══════════ */}
        <section id="beneficios" className="section">
          <div className="section-header">
            <div className="section-label">Beneficios</div>
            <h2 className="section-title">Todo lo que obtienes<br />como miembro</h2>
            <p className="section-subtitle">
              La membresía SoPeD te integra a un ecosistema académico de primer nivel,
              con acceso exclusivo a programas, redes y oportunidades de crecimiento.
            </p>
          </div>

          <div className="benefits-grid">
            {[
              {
                title: 'Direccion de proyectos',
                desc: 'Articula proyectos académicos y de impacto con el acompañamiento, recursos y soporte institucional de SoPeD.',
                icon: (
                  <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
                ),
              },
              {
                title: 'Certificaciones Oficiales',
                desc: 'Recibirás un carnet físico de miembro oficial de la Sociedad Peruana de Debate y un certificado que acredita tu condicion de miembro oficial de la Sociedad Peruana de Debate',
                icon: (
                  <svg viewBox="0 0 24 24"><path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z"/></svg>
                ),
              },
              {
                title: 'Eventos Académicos',
                desc: 'Acceso prioritario a talleres, seminarios, conferencias y competencias nacionales e internacionales durante todo el año.',
                icon: (
                  <svg viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                ),
              },
              {
                title: 'Red Institucional',
                desc: 'Conecta con estudiantes, docentes y líderes de diversas instituciones de todo el Perú que forman parte de la comunidad SoPeD.',
                icon: (
                  <svg viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                ),
              },
              {
                title: 'Staff y Liderazgo',
                desc: 'Accede a posiciones de staff organizador, coordinación de comités y roles de liderazgo en los programas institucionales.',
                icon: (
                  <svg viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                ),
              },
              {
                title: 'Debate Competitivo',
                desc: 'Formación intensiva en técnicas de argumentación, oratoria y debate formal bajo metodologías reconocidas internacionalmente.',
                icon: (
                  <svg viewBox="0 0 24 24"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                ),
              },
            ].map((b) => (
              <div className="benefit-card" key={b.title}>
                <div className="benefit-icon">{b.icon}</div>
                <h3 className="benefit-title">{b.title}</h3>
                <p className="benefit-desc">{b.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <div className="divider" />

        {/* ══════════ TIPOS DE MEMBRESÍA ══════════ */}
        <section id="membresia" className="section-full membership-section">
          <div className="section" style={{ paddingTop: 0, paddingBottom: '3.5rem' }}>
            <div className="section-label">Tipos de membresía</div>
            <h2 className="section-title">Elige tu forma<br />de participar</h2>
            <p className="section-subtitle">
              Cada modalidad está diseñada para responder a las necesidades de
              diferentes actores dentro del ecosistema SoPeD.
            </p>
          </div>

          <div className="membership-grid">
            {/* Estudiante */}
            <div className="membership-card">
              <div className="membership-icon-wrap">
                <svg viewBox="0 0 24 24"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
              </div>
              <div>
                <div className="membership-type-label">Membresía</div>
                <div className="membership-name">Estudiante</div>
              </div>
              <p className="membership-desc">
                Para estudiantes de secundaria y educación superior que buscan
                desarrollarse en debate, diplomacia y pensamiento crítico.
              </p>
              <ul className="membership-features">
                {[
                  'Acceso a programas académicos SoPeD',
                  'Participación en MUN y debate escolar',
                  'Certificaciones por programa completado',
                  'Acceso a la red estudiantil nacional',
                  'Descuentos en eventos oficiales',
                ].map((f) => (
                  <li key={f}>
                    <svg className="check-icon" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>
                    {f}
                  </li>
                ))}
              </ul>
              <a href="#" className="btn-membership btn-membership-outline">
                Continuar
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </a>
            </div>

            {/* Institución */}
            <div className="membership-card featured">
              <div className="membership-badge">Más popular</div>
              <div className="membership-icon-wrap">
                <svg viewBox="0 0 24 24"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
              </div>
              <div>
                <div className="membership-type-label">Membresía</div>
                <div className="membership-name">Institución</div>
              </div>
              <p className="membership-desc">
                Para colegios y universidades que desean participar como delegaciones
                oficiales y representar a su institución en programas SoPeD.
              </p>
              <ul className="membership-features">
                {[
                  'Representación oficial de tu institución',
                  'Delegaciones completas en MUN',
                  'Gestión centralizada de miembros',
                  'Convenios académicos institucionales',
                  'Acceso prioritario a todos los eventos',
                  'Soporte directo del equipo SoPeD',
                ].map((f) => (
                  <li key={f}>
                    <svg className="check-icon" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>
                    {f}
                  </li>
                ))}
              </ul>
              <a href="#" className="btn-membership btn-membership-fill">
                Continuar
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </a>
            </div>

            {/* Staff */}
            <div className="membership-card">
              <div className="membership-icon-wrap">
                <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14M4.93 4.93a10 10 0 0 0 0 14.14"/></svg>
              </div>
              <div>
                <div className="membership-type-label">Membresía</div>
                <div className="membership-name">Staff &amp; Voluntariado</div>
              </div>
              <p className="membership-desc">
                Para quienes desean contribuir activamente en la organización de
                eventos y programas desde adentro de la institución.
              </p>
              <ul className="membership-features">
                {[
                  'Rol activo en organización de eventos',
                  'Acceso a formación interna SoPeD',
                  'Experiencia institucional verificable',
                  'Carta de reconocimiento oficial',
                  'Red exclusiva de organizadores',
                ].map((f) => (
                  <li key={f}>
                    <svg className="check-icon" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>
                    {f}
                  </li>
                ))}
              </ul>
              <a href="#" className="btn-membership btn-membership-outline">
                Continuar
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </a>
            </div>
          </div>
        </section>

        {/* ══════════ CTA FINAL ══════════ */}
        <section className="cta-section">
          <div className="cta-inner">
            <div className="section-label" style={{ marginBottom: '1.2rem' }}>Únete hoy</div>
            <h2 className="cta-title">
              Forma parte de<br /><em>SoPeD</em> hoy
            </h2>
            <p className="cta-text">
              Miles de estudiantes y organizaciones ya son parte de la comunidad
              académica más activa del debate peruano. El siguiente paso es tuyo.
            </p>
            <a href="#membresia" className="btn-primary" style={{ fontSize: '0.92rem', padding: '1rem 2.4rem' }}>
              Iniciar proceso de membresía
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </a>
            <p className="cta-note">Proceso 100% en línea</p>
          </div>
        </section>

        

      </div>

      
    </>
  );
}

