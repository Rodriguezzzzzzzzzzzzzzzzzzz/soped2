import Link from 'next/link'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer
      style={{
        background: 'rgba(9,28,54,0.6)',
        backdropFilter: 'blur(16px)',
        borderTop: '1px solid rgba(255,255,255,0.06)',
      }}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <img
                  src="/public-logosoped.svg"
                  alt="SoPeD Logo"
                  style={{
                    width: '60px',
                    height: '60px',
                    objectFit: 'contain',
                  }}
                />
              </div>
              <span style={{ fontFamily: 'var(--font-cormorant)', fontSize: '1.2rem', fontWeight: 600, color: '#fff' }}>SoPeD</span>
            </div>
            <p style={{ fontFamily: 'var(--font-outfit)', fontSize: '0.8rem', color: 'rgba(255,255,255,0.35)', lineHeight: 1.7, letterSpacing: '0.02em' }}>
              Sociedad Peruana de Debate.<br />
              Formando líderes académicos<br />
              desde el pensamiento crítico.
            </p>
          </div>

          {/* Platform */}
          <div>
            <p style={{ fontFamily: 'var(--font-outfit)', fontSize: '0.65rem', fontWeight: 600, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(184,150,12,0.7)', marginBottom: '1rem' }}>
              Plataforma
            </p>
            <div className="flex flex-col gap-3">
              {[
                { label: 'Programas', href: '/programas' },
                { label: 'Eventos', href: '/eventos' },
                { label: 'SoPeD MUN', href: '/mun' },
                { label: 'Debate Escolar', href: '/debate-escolar' },
              ].map((l) => (
                <Link key={l.href} href={l.href} className="btn-text" style={{ fontSize: '0.82rem' }}>
                  {l.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Institución */}
          <div>
            <p style={{ fontFamily: 'var(--font-outfit)', fontSize: '0.65rem', fontWeight: 600, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(184,150,12,0.7)', marginBottom: '1rem' }}>
              Institución
            </p>
            <div className="flex flex-col gap-3">
              {[
                { label: 'Nosotros', href: '/nosotros' },
                { label: 'Inscripción', href: '/inscripcion' },
                { label: 'Ingresar', href: '/login' },
              ].map((l) => (
                <Link key={l.href} href={l.href} className="btn-text" style={{ fontSize: '0.82rem' }}>
                  {l.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Contacto */}
          <div>
            <p style={{ fontFamily: 'var(--font-outfit)', fontSize: '0.65rem', fontWeight: 600, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(184,150,12,0.7)', marginBottom: '1rem' }}>
              Contacto
            </p>
            <p style={{ fontFamily: 'var(--font-outfit)', fontSize: '0.82rem', color: 'rgba(255,255,255,0.4)', lineHeight: 1.7 }}>
              contacto@soped.pe
            </p>
            <p style={{ fontFamily: 'var(--font-outfit)', fontSize: '0.82rem', color: 'rgba(255,255,255,0.4)', lineHeight: 1.7 }}>
              Cusco, Perú
            </p>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="section-divider mt-12 mb-6" />
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <p style={{ fontFamily: 'var(--font-outfit)', fontSize: '0.72rem', color: 'rgba(255,255,255,0.22)', letterSpacing: '0.08em' }}>
            © {currentYear} SoPeD — Sociedad Peruana de Debate. Todos los derechos reservados.
          </p>
          <div className="flex items-center gap-1">
            <span className="deco-line" style={{ width: '20px' }} />
            <span style={{ fontFamily: 'var(--font-cormorant)', fontSize: '0.9rem', color: 'rgba(184,150,12,0.4)', margin: '0 8px' }}>✦</span>
            <span className="deco-line" style={{ width: '20px' }} />
          </div>
        </div>
      </div>
    </footer>
  )
}
