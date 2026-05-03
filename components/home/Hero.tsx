import Link from 'next/link'

export default function Hero() {
  return (
    <section
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        position: 'relative',
        overflow: 'hidden',
        background: 'linear-gradient(135deg, #05070d 0%, #091c36 50%, #05070d 100%)',
      }}
    >
      {/* Ambient layers */}
      <div style={{ position: 'absolute', inset: 0 }}>
        <div
          style={{
            position: 'absolute',
            top: '20%',
            right: '-10%',
            width: '600px',
            height: '600px',
            background: 'radial-gradient(circle, rgba(9,28,54,0.8) 0%, transparent 70%)',
            borderRadius: '50%',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: '10%',
            left: '-5%',
            width: '400px',
            height: '400px',
            background: 'radial-gradient(circle, rgba(184,150,12,0.04) 0%, transparent 70%)',
            borderRadius: '50%',
          }}
        />
        {/* Grid overlay */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)',
            backgroundSize: '80px 80px',
          }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-12 w-full relative z-10 pt-24 pb-16">
        <div className="max-w-3xl">
          {/* Badge */}
          <div
            className="inline-flex items-center gap-2 mb-8 animate-fade-up"
            style={{
              background: 'rgba(184,150,12,0.08)',
              border: '1px solid rgba(184,150,12,0.2)',
              padding: '0.35rem 1rem',
              animationDelay: '200ms',
              opacity: 0,
            }}
          >
            <span style={{ width: '5px', height: '5px', background: '#b8960c', borderRadius: '50%' }} />
            <span
              style={{
                fontFamily: 'var(--font-outfit)',
                fontSize: '0.7rem',
                fontWeight: 500,
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                color: 'rgba(184,150,12,0.85)',
              }}
            >
              Plataforma Académica Institucional
            </span>
          </div>

          {/* Heading */}
          <h1
            className="animate-fade-up"
            style={{
              fontFamily: 'var(--font-cormorant)',
              fontSize: 'clamp(3rem, 6vw, 5.5rem)',
              fontWeight: 400,
              lineHeight: 1.08,
              color: '#fff',
              letterSpacing: '-0.01em',
              marginBottom: '1.5rem',
              animationDelay: '350ms',
              opacity: 0,
            }}
          >
            Donde el{' '}
            <em
              style={{
                fontStyle: 'italic',
                background: 'linear-gradient(135deg, #d4af37, #b8960c)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              pensamiento
            </em>
            <br />
            se convierte en{' '}
            <span style={{ color: 'rgba(255,255,255,0.7)' }}>liderazgo.</span>
          </h1>

          {/* Subtitle */}
          <p
            className="animate-fade-up"
            style={{
              fontFamily: 'var(--font-outfit)',
              fontSize: 'clamp(0.95rem, 1.5vw, 1.1rem)',
              fontWeight: 300,
              color: 'rgba(255,255,255,0.5)',
              lineHeight: 1.75,
              maxWidth: '520px',
              marginBottom: '2.5rem',
              animationDelay: '500ms',
              opacity: 0,
            }}
          >
            La Sociedad Peruana de Debate forma líderes académicos a través del debate competitivo,
            modelos de naciones unidas y programas de formación de élite.
          </p>

          {/* CTAs */}
          <div
            className="flex flex-wrap gap-4 animate-fade-up"
            style={{ animationDelay: '650ms', opacity: 0 }}
          >
            <Link href="/inscripcion" className="btn-primary">
              Inscribirse ahora
              <span style={{ fontSize: '1rem' }}>→</span>
            </Link>
            <Link href="/programas" className="btn-secondary">
              Ver programas
            </Link>
          </div>

          {/* Stats */}
          <div
            className="flex flex-wrap gap-8 mt-16 animate-fade-up"
            style={{ animationDelay: '800ms', opacity: 0 }}
          >
            {[
              { num: '200+', label: 'Estudiantes formados' },
              { num: '12+', label: 'Competencias realizadas' },
              { num: '8+', label: 'Años de trayectoria' },
            ].map((s) => (
              <div key={s.label}>
                <p
                  style={{
                    fontFamily: 'var(--font-cormorant)',
                    fontSize: '2.2rem',
                    fontWeight: 600,
                    color: '#d4af37',
                    lineHeight: 1,
                    marginBottom: '4px',
                  }}
                >
                  {s.num}
                </p>
                <p
                  style={{
                    fontFamily: 'var(--font-outfit)',
                    fontSize: '0.72rem',
                    fontWeight: 400,
                    color: 'rgba(255,255,255,0.35)',
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                  }}
                >
                  {s.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div
        style={{
          position: 'absolute',
          bottom: '40px',
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '8px',
          opacity: 0.4,
        }}
      >
        <span style={{ fontFamily: 'var(--font-outfit)', fontSize: '0.6rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#fff' }}>
          scroll
        </span>
        <div
          style={{
            width: '1px',
            height: '40px',
            background: 'linear-gradient(to bottom, rgba(255,255,255,0.5), transparent)',
          }}
        />
      </div>
    </section>
  )
}
