'use client'

import Link from 'next/link'

// ─── DATA ────────────────────────────────────────────────────────────────────

const programs = [
  {
    index: '01',
    title: 'SoPeD MUN',
    tag: 'Competitivo Internacional',
    description: 'Modelo de Naciones Unidas de nivel internacional. Debate diplomático, resoluciones y formación en política global.',
    href: '/mun',
  },
  {
    index: '02',
    title: 'SoPeDebate',
    tag: 'Programa Educativo',
    description: 'Programa integral de debate para estudiantes de secundaria. Oratoria, argumentación y pensamiento crítico.',
    href: '/debate-escolar',
  },
  {
    index: '03',
    title: 'Talleres & Formación',
    tag: 'Desarrollo Académico',
    description: 'Talleres especializados en argumentación, oratoria, investigación y liderazgo académico.',
    href: '/programas',
  },
]

const pillars = [
  {
    title: 'Metodología probada',
    desc: 'Técnicas de debate parlamentario y diplomático adaptadas al contexto latinoamericano.',
  },
  {
    title: 'Mentores especializados',
    desc: 'Formadores con experiencia en competencias nacionales e internacionales.',
  },
  {
    title: 'Red académica',
    desc: 'Comunidad de egresados activos en universidades de élite del Perú y el mundo.',
  },
  {
    title: 'Reconocimiento oficial',
    desc: 'Certificaciones válidas y reconocidas por instituciones educativas.',
  },
]

// ─── SECTIONS ────────────────────────────────────────────────────────────────

function Hero() {
  return (
    <section className="soped-hero">
      {/* Video background */}
      <div className="soped-hero__bg">
        <video
          autoPlay muted loop playsInline preload="auto" aria-hidden="true"
          className="soped-hero__video"
        >
          <source src="/mun-bg.mp4" type="video/mp4" />
        </video>
        <div className="soped-hero__overlay" />
      </div>

      {/* Content */}
      <div className="soped-hero__content">
        <div className="soped-hero__institutional-badge">
        </div>
        <div className="soped-eyebrow">
        </div>

        <h1 className="soped-hero__h1">
          Donde el pensamiento<br />
          <em>se transforma en liderazgo.</em>
        </h1>

        <p className="soped-hero__sub">
          La plataforma académica líder en debate competitivo del Perú.<br />
          Formamos líderes, diplomáticos y oradores mediante estándares internacionales de excelencia.
        </p>

        <div className="soped-hero__actions">
          <Link href="/inscripcion" className="soped-btn soped-btn--primary">
            Inscribirse ahora
          </Link>
          <Link href="/programas" className="soped-btn soped-btn--ghost">
            Ver programas
          </Link>
        </div>
      </div>

      {/* Scroll cue */}
      <div className="soped-hero__scroll">
        <div className="soped-hero__scroll-line" />
        <span>Scroll</span>
      </div>
    </section>
  )
}

function ProgramsSection() {
  return (
    <section className="soped-section soped-section--dark">
      <div className="soped-container">
        <header className="soped-section__header">
          <div className="soped-eyebrow">
            <span className="soped-eyebrow__line" />
            <span>Nuestros Programas</span>
          </div>
          <h2 className="soped-section__h2">
            Formación académica<br />de élite
          </h2>
        </header>

        <div className="soped-programs">
          {programs.map((p) => (
            <Link href={p.href} key={p.index} className="soped-program-card">
              <span className="soped-program-card__index">{p.index}</span>
              <div className="soped-program-card__body">
                <span className="soped-tag">{p.tag}</span>
                <h3 className="soped-program-card__title">{p.title}</h3>
                <p className="soped-program-card__desc">{p.description}</p>
              </div>
              <span className="soped-program-card__arrow">→</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

function WhySection() {
  return (
    <section className="soped-section">
      <div className="soped-container">
        <div className="soped-why">
          {/* Left column */}
          <div className="soped-why__left">
            <div className="soped-eyebrow">
              <span className="soped-eyebrow__line" />
              <span>Por qué SoPeD</span>
            </div>
            <h2 className="soped-section__h2">
              Más que debate.<br />
              <em className="soped-gold-italic">Una formación completa.</em>
            </h2>
            <p className="soped-why__body">
              SoPeD es la plataforma académica líder en debate competitivo del
              Perú. Formamos estudiantes con pensamiento crítico avanzado,
              capacidad argumentativa y liderazgo intelectual.
            </p>
            <Link href="/nosotros" className="soped-btn soped-btn--ghost">
              Conocer la institución
            </Link>
          </div>

          {/* Right column — pillars */}
          <div className="soped-why__right">
            {pillars.map((item, i) => (
              <div key={i} className="soped-pillar">
                <span className="soped-pillar__dot" />
                <div>
                  <p className="soped-pillar__title">{item.title}</p>
                  <p className="soped-pillar__desc">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

function CTASection() {
  return (
    <section className="soped-section soped-section--dark soped-cta">
      <div className="soped-container soped-cta__inner">
        <div className="soped-eyebrow soped-eyebrow--center">
          <span className="soped-eyebrow__line" />
          <span>Únete a SoPeD</span>
          <span className="soped-eyebrow__line" />
        </div>
        <h2 className="soped-cta__h2">
          Tu formación como líder<br />comienza aquí.
        </h2>
        <p className="soped-cta__sub">
          Inscripciones abiertas para el próximo ciclo académico.
        </p>
        <div className="soped-hero__actions" style={{ justifyContent: 'center' }}>
          <Link href="/inscripcion" className="soped-btn soped-btn--primary">
            Inscribirse ahora
          </Link>
          <Link href="/nosotros" className="soped-btn soped-btn--ghost">
            Conocer más
          </Link>
        </div>
      </div>
    </section>
  )
}

// ─── EXPORT ───────────────────────────────────────────────────────────────────

export default function HomeContent() {
  return (
    <>
      <Hero />
      <ProgramsSection />
      <WhySection />
      <CTASection />
    </>
  )
}
