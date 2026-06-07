"use client"
import { useEffect, useRef } from 'react'
import Layout from '@/components/layout/Layout'
import Link from 'next/link'

const committees = [
  { name: 'Consejo de Seguridad', abbr: 'CSNU', slug: 'CSNU', level: 'Avanzado', topics: ['Conflictos internacionales', 'Mantenimiento de la paz'], seats: 15 },
  { name: 'Asamblea General', abbr: 'AGONU', slug: 'AGONU', level: 'Intermedio', topics: ['Desarrollo sostenible', 'Derechos humanos'], seats: 40 },
  { name: 'ECOSOC', abbr: 'ECOSOC', slug: 'ECOSOC', level: 'Intermedio', topics: ['Economía global', 'Desarrollo social'], seats: 30 },
  { name: 'Comité de Crisis Fantastica', abbr: 'CRISIS', slug: 'CRISIS', level: 'Intermedio', topics: ['Situaciones de emergencia', 'Decisiones urgentes'], seats: 20 },
  { name: 'Consejo de Contingencia Planetaria', abbr: 'PCC', slug: 'PCC', level: 'Avanzado', topics: ['Emergencias globales', 'Supervivencia internacional'], seats: 15 },
  { name: 'ONU Mujeres', abbr: 'ONU Mujeres', slug: 'ONUMUJERES', level: 'Intermedio', topics: ['Igualdad de género', 'Derechos humanos'], seats: 15 },
  { name: 'Organización de los Estados Americanos', abbr: 'OEA', slug: 'OEA', level: 'Intermedio', topics: ['Diplomacia regional', 'Democracia en América'], seats: 20 },
  { name: 'Organización Mundial de la Salud', abbr: 'OMS', slug: 'OMS', level: 'Intermedio', topics: ['Salud global', 'Respuesta sanitaria internacional'], seats: 20 },
  { name: 'Comité de Desarme y Seguridad Internacional', abbr: 'DISEC', slug: 'DISEC', level: 'Intermedio–Avanzado', topics: ['Desarme nuclear', 'Seguridad internacional'], seats: 25 },
  { name: 'Third Party Actors (TPA)', abbr: 'TPA', slug: 'TPA', level: 'Básico–Intermedio', topics: ['Actores internacionales', 'Operaciones estratégicas'], seats: 20 },
  { name: 'Consejo de Derechos Humanos — Inglés', abbr: 'UNHRC ENG', slug: 'UNHRCENG', level: 'Avanzado', topics: ['Human rights', 'International justice'], seats: 15 },
  { name: 'Consejo de Derechos Humanos — Español', abbr: 'UNHRC ESP', slug: 'UNHRCESP', level: 'Intermedio', topics: ['Derechos fundamentales', 'Justicia global'], seats: 15 },
]

function getCommitteeLogo(abbr: string): string | null {
  switch (abbr) {
    case 'CSNU': return '/unsc.svg'
    case 'AGONU': return '/agun.svg'
    case 'ECOSOC': return '/ecosoc.svg'
    case 'CRISIS': return '/CRISIS.svg'
    case 'UNHRC ESP': return '/unhrc.svg'
    case 'UNHRC ENG': return '/unhrcenglish.svg'
    case 'PCC': return '/pcc.svg'
    case 'ONU Mujeres': return '/onumujeres.svg'
    case 'OEA': return '/oea.svg'
    case 'OMS': return '/oms.svg'
    case 'DISEC': return '/DISEC.svg'
    case 'TPA': return '/tpa.svg'
    default: return null
  }
}

export default function MunPage() {
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch(() => {})
    }
  }, [])

  useEffect(() => {
    function reveal() {
      const els = document.querySelectorAll('.mun-reveal')
      els.forEach((el) => {
        const rect = el.getBoundingClientRect()
        if (rect.top < window.innerHeight - 80) {
          el.classList.add('mun-visible')
        }
      })
    }
    window.addEventListener('scroll', reveal, { passive: true })
    reveal()
    return () => window.removeEventListener('scroll', reveal)
  }, [])

  return (
    <Layout>
      <style jsx global>{`
        /* ── TOKENS ─────────────────────────────────────────── */
        :root {
          --mun-gold:      #ECE5D6;
          --mun-gold-dim:  rgba(236,229,214,0.18);
          --mun-gold-mid:  rgba(236,229,214,0.55);
          --mun-dark:      #0F0A0B;
          --mun-darker:    #1A0A0D;
          --mun-glass:     rgba(255,255,255,0.04);
          --mun-glass-b:   rgba(255,255,255,0.08);
          --mun-text:      rgba(255,255,255,0.82);
          --mun-muted:     rgba(255,255,255,0.38);
          --mun-border:    rgba(255,255,255,0.07);
        }

        /* ── REVEAL ANIMATION ───────────────────────────────── */
        @keyframes munFloat {
          0%,100% { transform: translate3d(0,0,0); }
          50% { transform: translate3d(0,-12px,0); }
        }

        @keyframes munGlow {
          0%,100% { opacity: .35; }
          50% { opacity: .8; }
        }

        @keyframes munHeroRise {
          from {
            opacity: 0;
            transform: translateY(40px);
            filter: blur(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
            filter: blur(0);
          }
        }
        .mun-reveal {
          opacity: 0;
          transform: translateY(28px);
          transition: opacity 0.65s ease, transform 0.65s ease;
        }
        .mun-reveal.mun-visible {
          opacity: 1;
          transform: translateY(0);
        }
        .mun-delay-1 { transition-delay: 0.1s; }
        .mun-delay-2 { transition-delay: 0.2s; }
        .mun-delay-3 { transition-delay: 0.3s; }
        .mun-delay-4 { transition-delay: 0.4s; }
        .mun-delay-5 { transition-delay: 0.5s; }

        /* ── HERO ───────────────────────────────────────────── */
        .mun-hero {
          position: relative;
          min-height: 100vh;
          display: flex;
          align-items: center;
          overflow: hidden;
          background: radial-gradient(circle at top, rgba(236,229,214,0.08), transparent 45%);
        }
        .mun-hero-video {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center;
          filter: brightness(0.72) contrast(1.08);
          transform: translateZ(0);
          will-change: transform;
          pointer-events: none;
        }
        .mun-hero-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(160deg, rgba(15,10,11,0.45) 0%, rgba(15,10,11,0.82) 100%);
          z-index: 1;
        }
        .mun-hero-fade {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 220px;
          background: linear-gradient(to bottom, transparent, var(--mun-dark));
          z-index: 2;
          pointer-events: none;
        }
        .mun-hero-content {
          position: relative;
          z-index: 3;
          max-width: 860px;
          padding: 0 2.5rem;
          margin: 0 auto;
          text-align: center;
          animation: munHeroRise 1s ease-out;
        }
        .mun-hero-eyebrow {
          display: inline-block;
          letter-spacing: 0.38em;
          font-size: 0.68rem;
          color: var(--mun-gold);
          text-transform: uppercase;
          margin-bottom: 2rem;
          font-family: var(--font-outfit, sans-serif);
          animation: munHeroRise 0.8s ease-out;
        }
        .mun-hero-title {
          font-family: var(--font-cormorant, Georgia, serif);
          font-size: clamp(3.8rem, 8vw, 7rem);
          font-weight: 400;
          color: #fff;
          line-height: 1.02;
          margin: 0 0 0.3rem;
          letter-spacing: -0.01em;
          animation: munHeroRise 1s ease-out;
        }
        .mun-hero-title em {
          font-style: italic;
          color: var(--mun-gold);
        }
        .mun-hero-title-accent {
          display: block;
          font-family: var(--font-outfit, sans-serif);
          font-size: clamp(0.85rem, 1.8vw, 1.1rem);
          letter-spacing: 0.22em;
          color: var(--mun-muted);
          text-transform: uppercase;
          margin-bottom: 1.6rem;
        }
        .mun-hero-desc {
          font-family: var(--font-outfit, sans-serif);
          font-size: 1.05rem;
          color: rgba(255,255,255,0.58);
          line-height: 1.9;
          max-width: 660px;
          margin: 0 auto 2.6rem;
          animation: munHeroRise 1.2s ease-out;
        }
        .mun-hero-actions {
          display: flex;
          gap: 1rem;
          justify-content: center;
          flex-wrap: wrap;
          animation: munHeroRise 1.4s ease-out;
        }

        /* ── BUTTONS ────────────────────────────────────────── */
        .mun-btn-primary {
          display: inline-block;
          padding: 0.85rem 2.2rem;
          background: var(--mun-gold);
          color: #0F0A0B;
          font-family: var(--font-outfit, sans-serif);
          font-size: 0.82rem;
          font-weight: 600;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          text-decoration: none;
          transition: background 0.22s ease, transform 0.18s ease, box-shadow 0.22s ease;
          cursor: pointer;
        }
        .mun-btn-primary:hover {
          background: #ECE5D6;
          transform: translateY(-2px);
          box-shadow: 0 8px 28px rgba(236,229,214,0.35);
        }
        .mun-btn-secondary {
          display: inline-block;
          padding: 0.85rem 2.2rem;
          border: 1px solid rgba(236,229,214,0.4);
          color: rgba(255,255,255,0.75);
          font-family: var(--font-outfit, sans-serif);
          font-size: 0.82rem;
          font-weight: 500;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          text-decoration: none;
          transition: border-color 0.22s ease, color 0.22s ease, background 0.22s ease, transform 0.18s ease;
        }
        .mun-btn-secondary:hover {
          border-color: var(--mun-gold);
          color: var(--mun-gold);
          background: var(--mun-gold-dim);
          transform: translateY(-2px);
        }

        /* ── STATS STRIP ────────────────────────────────────── */
        .mun-stats-strip {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          background: rgba(15,10,11,0.6);
          backdrop-filter: blur(12px);
        }
        .mun-stat-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 2.5rem 1rem;
          border-right: 1px solid var(--mun-border);
          text-align: center;
          transition: transform .25s ease, background .25s ease;
        }
        .mun-stat-item:last-child { border-right: none; }
        .mun-stat-item:hover {
          transform: translateY(-6px);
          background: rgba(236,229,214,0.06);
        }
        .mun-stat-number {
          font-family: var(--font-cormorant, Georgia, serif);
          font-size: 2.8rem;
          font-weight: 600;
          color: var(--mun-gold);
          line-height: 1;
          animation: munFloat 4s ease-in-out infinite;
        }
        .mun-stat-label {
          font-family: var(--font-outfit, sans-serif);
          font-size: 0.68rem;
          color: var(--mun-muted);
          letter-spacing: 0.1em;
          text-transform: uppercase;
          margin-top: 0.5rem;
        }

        /* ── SECTION COMMON ─────────────────────────────────── */
        .mun-section-inner {
          max-width: 1200px;
          margin: 0 auto;
          padding: 5.5rem 2.5rem;
        }
        .mun-section-label {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          font-family: var(--font-outfit, sans-serif);
          font-size: 0.68rem;
          letter-spacing: 0.28em;
          text-transform: uppercase;
          color: var(--mun-gold);
          margin-bottom: 1.2rem;
        }
        .mun-section-label::before {
          content: '';
          display: block;
          width: 28px;
          height: 1px;
          background: var(--mun-gold);
          flex-shrink: 0;
        }
        .mun-section-title {
          font-family: var(--font-cormorant, Georgia, serif);
          font-size: clamp(2.2rem, 4.5vw, 3.4rem);
          font-weight: 400;
          color: #fff;
          line-height: 1.12;
          margin: 0 0 1.4rem;
        }
        .mun-section-title em {
          font-style: italic;
          color: var(--mun-gold);
        }
        .mun-section-body {
          font-family: var(--font-outfit, sans-serif);
          font-size: 0.97rem;
          color: var(--mun-muted);
          line-height: 1.85;
        }

        /* ── ABOUT / PILLARS ────────────────────────────────── */
        .mun-what-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 4rem;
          align-items: start;
        }
        .mun-pillars { display: flex; flex-direction: column; gap: 1.1rem; }
        .mun-pillar {
          display: flex;
          gap: 1.2rem;
          align-items: flex-start;
          padding: 1.4rem 1.6rem;
          background: var(--mun-glass);
          border: 1px solid var(--mun-border);
          transition: background 0.22s ease, border-color 0.22s ease, transform 0.22s ease;
        }
        .mun-pillar:hover {
          background: var(--mun-glass-b);
          border-color: var(--mun-gold-dim);
          transform: translateX(4px);
        }
        .mun-pillar-icon {
          font-family: var(--font-cormorant, Georgia, serif);
          font-size: 1rem;
          color: var(--mun-gold);
          font-style: italic;
          min-width: 2rem;
          padding-top: 0.1rem;
        }
        .mun-pillar-title {
          font-family: var(--font-outfit, sans-serif);
          font-size: 0.87rem;
          font-weight: 600;
          color: #fff;
          margin-bottom: 0.3rem;
          letter-spacing: 0.04em;
        }
        .mun-pillar-desc {
          font-family: var(--font-outfit, sans-serif);
          font-size: 0.82rem;
          color: var(--mun-muted);
          line-height: 1.7;
        }

        /* ── COMMITTEES ─────────────────────────────────────── */
        .mun-committees-bg {
        }
        .mun-committees-list {
          display: flex;
          flex-direction: column;
          gap: 0.7rem;
        }
        .mun-committee-row {
          display: grid;
          grid-template-columns: 90px 1fr auto auto;
          gap: 2rem;
          align-items: center;
          padding: 1.5rem 1.8rem;
          background: var(--mun-glass);
          border: 1px solid var(--mun-border);
          text-decoration: none;
          transition: background 0.22s ease, border-color 0.22s ease, transform 0.2s ease, box-shadow 0.25s ease;
          cursor: pointer;
        }
        .mun-committee-row:hover {
          background: rgba(236,229,214,0.06);
          border-color: var(--mun-gold-dim);
          transform: translateX(5px);
          box-shadow: 0 18px 40px rgba(0,0,0,.28);
        }
        .mun-committee-logo {
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .mun-committee-logo img {
          width: 72px;
          height: 72px;
          object-fit: contain;
          filter: drop-shadow(0 0 8px rgba(236,229,214,0.15));
          transition: filter 0.22s ease;
        }
        .mun-committee-row:hover .mun-committee-logo img {
          filter: drop-shadow(0 0 12px rgba(236,229,214,0.35));
        }
        .mun-committee-abbr-text {
          font-family: var(--font-cormorant, Georgia, serif);
          font-size: 1.1rem;
          font-weight: 600;
          color: var(--mun-gold);
          letter-spacing: 0.08em;
          font-style: italic;
        }
        .mun-committee-name {
          font-family: var(--font-outfit, sans-serif);
          font-size: 0.9rem;
          font-weight: 500;
          color: #fff;
          margin-bottom: 0.25rem;
        }
        .mun-committee-topics {
          font-family: var(--font-outfit, sans-serif);
          font-size: 0.75rem;
          color: var(--mun-muted);
        }
        .mun-committee-level {
          font-family: var(--font-outfit, sans-serif);
          font-size: 0.68rem;
          font-weight: 500;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: var(--mun-gold-mid);
          white-space: nowrap;
        }
        .mun-committee-seats {
          font-family: var(--font-outfit, sans-serif);
          font-size: 0.8rem;
          color: rgba(255,255,255,0.25);
          white-space: nowrap;
        }

        /* ── PROCESS STEPS ──────────────────────────────────── */
        .mun-proceso-bg {
        }
        .mun-process-steps {
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          gap: 1.5rem;
          margin-top: 3rem;
        }
        .mun-process-step {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          padding: 2rem 1.2rem;
          background: var(--mun-glass);
          border: 1px solid var(--mun-border);
          transition: background 0.22s ease, border-color 0.22s ease, transform 0.22s ease, box-shadow 0.22s ease;
        }
        .mun-process-step:hover {
          background: var(--mun-glass-b);
          border-color: var(--mun-gold-dim);
          transform: translateY(-4px);
          box-shadow: 0 14px 30px rgba(0,0,0,.25);
        }
        .mun-step-dot {
          font-family: var(--font-cormorant, Georgia, serif);
          font-size: 1.6rem;
          font-weight: 600;
          color: var(--mun-gold);
          font-style: italic;
          width: 52px;
          height: 52px;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1px solid var(--mun-gold-dim);
          border-radius: 50%;
          margin: 0 auto 1.2rem;
          flex-shrink: 0;
          animation: munGlow 3s ease-in-out infinite;
        }
        .mun-step-title {
          font-family: var(--font-outfit, sans-serif);
          font-size: 0.85rem;
          font-weight: 600;
          color: #fff;
          margin-bottom: 0.55rem;
          letter-spacing: 0.03em;
        }
        .mun-step-desc {
          font-family: var(--font-outfit, sans-serif);
          font-size: 0.78rem;
          color: var(--mun-muted);
          line-height: 1.7;
        }

        /* ── CTA ────────────────────────────────────────────── */
        .mun-cta-section {
          position: relative;
          overflow: hidden;
          background: var(--mun-darker);
          border-top: 1px solid var(--mun-border);
        }
        .mun-cta-bg-pattern {
          position: absolute;
          inset: 0;
          background-image:
            repeating-linear-gradient(
              0deg,
              transparent,
              transparent 79px,
              rgba(236,229,214,0.04) 80px
            ),
            repeating-linear-gradient(
              90deg,
              transparent,
              transparent 79px,
              rgba(236,229,214,0.04) 80px
            );
          pointer-events: none;
        }
        .mun-cta-inner {
          position: relative;
          z-index: 1;
          max-width: 820px;
          margin: 0 auto;
          padding: 6.5rem 2.5rem;
          text-align: center;
        }
        .mun-cta-title {
          font-family: var(--font-cormorant, Georgia, serif);
          font-size: clamp(2.4rem, 5vw, 4rem);
          font-weight: 400;
          color: #fff;
          line-height: 1.1;
          margin: 1.2rem 0 0;
        }
        .mun-cta-title em {
          font-style: italic;
          color: var(--mun-gold);
        }
        .mun-cta-rule {
          width: 60px;
          height: 1px;
          background: var(--mun-gold);
          margin: 2rem auto;
          opacity: 0.5;
        }
        .mun-cta-desc {
          font-family: var(--font-outfit, sans-serif);
          font-size: 0.97rem;
          color: var(--mun-muted);
          max-width: 480px;
          margin: 0 auto 2.5rem;
          line-height: 1.85;
        }

        /* ── RESPONSIVE ─────────────────────────────────────── */
        @media (max-width: 900px) {
          .mun-stats-strip { grid-template-columns: repeat(2, 1fr); }
          .mun-stat-item:nth-child(2) { border-right: none; }
          .mun-what-grid { grid-template-columns: 1fr; gap: 2.5rem; }
          .mun-process-steps { grid-template-columns: repeat(2, 1fr); }
          .mun-committee-row { grid-template-columns: 60px 1fr; }
          .mun-committee-level, .mun-committee-seats { display: none; }
        }
        @media (max-width: 600px) {
          .mun-stats-strip { grid-template-columns: 1fr 1fr; }
          .mun-process-steps { grid-template-columns: 1fr; }
          .mun-hero-content { padding: 0 1.2rem; }
          .mun-section-inner { padding: 3.5rem 1.2rem; }
        }
      `}</style>

      {/* ── HERO ────────────────────────────────────────────── */}
      <section className="mun-hero">
        <video
          ref={videoRef}
          className="mun-hero-video"
          autoPlay
          muted
          loop
          playsInline
          src="/heromunpage.mp4"
        />
        <div className="mun-hero-overlay" />
        <div className="mun-hero-fade" />

        <div className="mun-hero-content">
          <div className="mun-hero-eyebrow">
            Sociedad Peruana de Debate · Programa Internacional
          </div>
          <h1 className="mun-hero-title">
            SoPeD <em>MUN</em>
          </h1>
          <span className="mun-hero-title-accent">
            Modelo de Naciones Unidas
          </span>
          <p className="mun-hero-desc">
            Debate diplomático, resoluciones y formación en política global en un entorno
            competitivo de alto nivel. El programa internacional de la Sociedad Peruana de Debate.
          </p>
          <div className="mun-hero-actions">
            <a href="/inscripcion?program=mun" className="mun-btn-primary">Inscribirse como delegado →</a>
            <a href="/eventos" className="mun-btn-secondary">Ver calendario</a>
          </div>
        </div>
      </section>

      {/* ── STATS STRIP ─────────────────────────────────────── */}
      {/* ── SOBRE EL PROGRAMA ───────────────────────────────── */}
      <section>
        <div className="mun-section-inner">
          <div className="mun-section-label">Sobre el Programa</div>
          <div className="mun-what-grid">
            <div>
              <h2 className="mun-section-title">
                Un modelo de<br /><em>alcance internacional</em>
              </h2>
              <p className="mun-section-body">
                SoPeD MUN es el programa oficial de Modelo de Naciones Unidas organizado
                por la Sociedad Peruana de Debate. Concebido bajo los más altos estándares
                de la conferencia internacional, el programa convoca a estudiantes de todo
                el país para representar naciones y debatir los asuntos más urgentes de la agenda global.
              </p>
              <p className="mun-section-body" style={{ marginTop: '1rem' }}>
                A diferencia de los programas de formación, SoPeD MUN es una plataforma
                competitiva donde la preparación técnica, la capacidad analítica y la
                solidez diplomática determinan el desempeño de cada delegado. La conferencia
                es evaluada por un panel de directores con trayectoria en debate nacional
                e internacional.
              </p>
            </div>
            <div className="mun-pillars">
              {[
                {
                  icon: 'I',
                  title: 'Competencia Diplomática Formal',
                  desc: 'Estructura basada en el reglamento parlamentario de Naciones Unidas, adaptada al contexto académico peruano.',
                },
                {
                  icon: 'II',
                  title: 'Panel de Directores Certificados',
                  desc: 'Cada comité es dirigido por directores con formación en debate universitario y MUN internacional.',
                },
                {
                  icon: 'III',
                  title: 'Representación de Naciones',
                  desc: 'Los delegados representan países asignados, construyendo posiciones diplomáticas fundamentadas en política exterior real.',
                },
                {
                  icon: 'IV',
                  title: 'Reconocimiento Oficial',
                  desc: 'Los mejores delegados reciben distinción oficial de SoPeD y son registrados en el historial competitivo de la sociedad.',
                },
              ].map((p) => (
                <div key={p.title} className="mun-pillar mun-reveal">
                  <div className="mun-pillar-icon">{p.icon}</div>
                  <div>
                    <div className="mun-pillar-title">{p.title}</div>
                    <div className="mun-pillar-desc">{p.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── COMITÉS 2026 ────────────────────────────────────── */}
      <section className="mun-committees-bg">
        <div className="mun-section-inner">
          <div className="mun-section-label">Conferencia 2026</div>
          <h2 className="mun-section-title">
            Comités del<br /><em>Torneo</em>
          </h2>
          <p className="mun-section-body" style={{ marginBottom: '2.5rem' }}>
            SoPeD MUN 2026 opera bajo un sistema de doce comités que abarcan desde
            organismos clásicos de Naciones Unidas hasta comités de crisis de alta exigencia.
            Cada comité establece sus propios estándares de evaluación y complejidad diplomática.
          </p>
          <div className="mun-committees-list">
            {committees.map((c, i) => {
              const logo = getCommitteeLogo(c.abbr)
              return (
                <Link
                  key={c.abbr}
                  href={`/mun/comite/${c.slug}`}
                  style={{ textDecoration: 'none' }}
                >
                  <div className={`mun-committee-row mun-reveal mun-delay-${Math.min(i % 5 + 1, 5)}`}>
                    <div className="mun-committee-logo">
                      {logo ? (
                        <img
                          src={logo}
                          alt={c.abbr}
                          onError={(e) => {
                            const img = e.currentTarget as HTMLImageElement
                            img.style.display = 'none'
                            const parent = img.parentElement
                            if (parent && !parent.querySelector('.mun-committee-abbr-text')) {
                              const span = document.createElement('span')
                              span.className = 'mun-committee-abbr-text'
                              span.textContent = c.abbr
                              parent.appendChild(span)
                            }
                          }}
                        />
                      ) : (
                        <span className="mun-committee-abbr-text">{c.abbr}</span>
                      )}
                    </div>
                    <div>
                      <div className="mun-committee-name">{c.name}</div>
                      <div className="mun-committee-topics">{c.topics.join(' · ')}</div>
                    </div>
                    <span className="mun-committee-level">{c.level}</span>
                    <span className="mun-committee-seats">{c.seats} asientos</span>
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      {/* ── PROCESO DE PARTICIPACIÓN ────────────────────────── */}
      <section className="mun-proceso-bg">
        <div className="mun-section-inner">
          <div className="mun-section-label">Proceso de Participación</div>
          <h2 className="mun-section-title">
            Cómo <em>postular</em>
          </h2>
          <div className="mun-process-steps">
            {[
              { n: 'I',   title: 'Registro de Delegado',      desc: 'El estudiante completa el formulario oficial de postulación de SoPeD MUN indicando su preferencia de comité.' },
              { n: 'II',  title: 'Asignación de Comité',      desc: 'SoPeD asigna el comité y el país a representar, enviando la confirmación oficial al delegado.' },
              { n: 'III', title: 'Preparación Académica',     desc: 'El delegado investiga su país asignado y elabora la Position Paper antes de la conferencia.' },
              { n: 'IV',  title: 'Jornada de Conferencia',    desc: 'Los delegados participan en las sesiones presenciales del MUN durante los tres días de conferencia.' },
              { n: 'V',   title: 'Premiación Oficial',        desc: 'La ceremonia de clausura reconoce a los mejores delegados con diplomas y certificación SoPeD.' },
            ].map((step, i) => (
              <div key={step.n} className={`mun-process-step mun-reveal mun-delay-${i + 1}`}>
                <div className="mun-step-dot">{step.n}</div>
                <div className="mun-step-title">{step.title}</div>
                <div className="mun-step-desc">{step.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

    </Layout>
  )
}