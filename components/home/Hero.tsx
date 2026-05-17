'use client'

import Link from 'next/link'

function VideoBackground() {
  return (
    <div style={{
      position: 'absolute',
      inset: 0,
      zIndex: 0,
      overflow: 'hidden'
    }}>
      <video
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        poster="/mun-bg.jpg"
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          objectPosition: 'center',
          filter: 'brightness(0.45) contrast(1.2) saturate(1.05)'
        }}
      >
        <source src="/mun-bg.mp4" type="video/mp4" />
      </video>

      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'rgba(0,0,0,0.55)'
      }} />
    </div>
  )
}

function HeroContent() {
  return (
    <div className="max-w-5xl mx-auto px-6" style={{ position: 'relative', zIndex: 1 }}>
      <h1 style={{
        fontFamily: 'var(--font-cormorant)',
        fontSize: 'clamp(2.5rem,5vw,4rem)',
        color: 'var(--text-primary)',
        fontWeight: 400
      }}>
        Donde el pensamiento<br />se convierte en liderazgo.
      </h1>

      <p style={{
        marginTop: '1.5rem',
        color: 'var(--text-muted)',
        lineHeight: 1.8
      }}>
        La Sociedad Peruana de Debate forma líderes académicos a través del debate competitivo, modelos de naciones unidas y programas de formación de élite.
      </p>

      <div style={{
        marginTop: '2.5rem',
        display: 'flex',
        gap: '1rem',
        justifyContent: 'center',
        flexWrap: 'wrap'
      }}>
        <Link
          href="/inscripcion"
          style={{
            background: 'var(--primary)',
            color: 'var(--surface-0)',
            padding: '14px 22px',
            borderRadius: '10px',
            fontWeight: 600,
            textDecoration: 'none'
          }}
        >
          Inscribirse ahora →
        </Link>

        <Link
          href="/programas"
          style={{
            border: '1px solid var(--border-medium)',
            color: 'var(--text-primary)',
            padding: '14px 22px',
            borderRadius: '10px',
            textDecoration: 'none'
          }}
        >
          Ver programas
        </Link>
      </div>

      <div style={{
        marginTop: '4rem',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit,minmax(120px,1fr))',
        gap: '2rem',
        color: 'var(--text-secondary)'
      }}>
        <div>
          <h3 style={{ color: 'var(--text-primary)', fontSize: '1.5rem' }}>200+</h3>
          <p>Estudiantes formados</p>
        </div>
        <div>
          <h3 style={{ color: 'var(--text-primary)', fontSize: '1.5rem' }}>12+</h3>
          <p>Competencias realizadas</p>
        </div>
        <div>
          <h3 style={{ color: 'var(--text-primary)', fontSize: '1.5rem' }}>8+</h3>
          <p>Años de trayectoria</p>
        </div>
      </div>
    </div>
  )
}

function ProgramsSection() {
  return (
    <section style={{ padding: '6rem 0', background: 'var(--surface-0)' }}>
      <div className="max-w-7xl mx-auto px-6">
        <h2 style={{ color: 'var(--text-primary)', marginBottom: '2rem' }}>
          Nuestros Programas
        </h2>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))',
          gap: '1.5rem'
        }}>
          <div style={{ padding: '2rem', border: '1px solid var(--border-soft)' }}>
            <h3 style={{ color: 'var(--text-primary)' }}>SoPeD MUN</h3>
            <p style={{ color: 'var(--text-muted)' }}>
              Modelo de Naciones Unidas de nivel internacional.
            </p>
            <Link href="/mun">Explorar programa →</Link>
          </div>

          <div style={{ padding: '2rem', border: '1px solid var(--border-soft)' }}>
            <h3 style={{ color: 'var(--text-primary)' }}>Debate Escolar</h3>
            <p style={{ color: 'var(--text-muted)' }}>
              Programa integral de debate para estudiantes.
            </p>
            <Link href="/debate-escolar">Explorar programa →</Link>
          </div>

          <div style={{ padding: '2rem', border: '1px solid var(--border-soft)' }}>
            <h3 style={{ color: 'var(--text-primary)' }}>Talleres & Formación</h3>
            <p style={{ color: 'var(--text-muted)' }}>
              Talleres de oratoria, liderazgo e investigación.
            </p>
            <Link href="/programas">Explorar programa →</Link>
          </div>
        </div>
      </div>
    </section>
  )
}

function WhySection() {
  return (
    <section style={{ padding: '6rem 0' }}>
      <div className="max-w-6xl mx-auto px-6">
        <h2 style={{ color: 'var(--text-primary)' }}>
          Por qué SoPeD
        </h2>

        <p style={{
          color: 'var(--text-muted)',
          marginTop: '1rem',
          maxWidth: '700px'
        }}>
          SoPeD es la plataforma académica líder en debate competitivo del Perú.
        </p>
      </div>
    </section>
  )
}

export default function Hero() {
  return (
    <>
      {/* HERO INTRO */}
      <section style={{
        padding: '8rem 0 6rem',
        textAlign: 'center',
        background: 'var(--surface-1)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <VideoBackground />
        <HeroContent />
      </section>

      <ProgramsSection />
      <WhySection />
    </>
  )
}
