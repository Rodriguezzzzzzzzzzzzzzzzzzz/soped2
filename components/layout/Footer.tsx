import Link from 'next/link'

const socialLinks = [
  {
    label: 'Instagram',
    href: 'https://www.instagram.com/sociedadperuanadedebate/',
    path: 'M7.8 2h8.4C19.4 2 22 4.6 22 7.8v8.4a5.8 5.8 0 0 1-5.8 5.8H7.8C4.6 22 2 19.4 2 16.2V7.8A5.8 5.8 0 0 1 7.8 2m-.2 2A3.6 3.6 0 0 0 4 7.6v8.8C4 18.39 5.61 20 7.6 20h8.8a3.6 3.6 0 0 0 3.6-3.6V7.6C20 5.61 18.39 4 16.4 4H7.6m9.65 1.5a1.25 1.25 0 0 1 0 2.5 1.25 1.25 0 0 1 0-2.5M12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10m0 2a3 3 0 1 0 0 6 3 3 0 0 0 0-6z',
  },
  {
    label: 'Facebook',
    href: 'https://www.facebook.com/people/Sociedad-Peruana-de-Debate-SOPED/61560722257887/',
    path: 'M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z',
  },
  {
    label: 'LinkedIn',
    href: 'https://www.linkedin.com/company/sociedad-peruana-de-debate/',
    path: 'M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2zM4 6a2 2 0 1 1 0-4 2 2 0 0 1 0 4z',
  },
  {
    label: 'TikTok',
    href: 'https://www.tiktok.com/@sociedadperuanadedebate',
    path: 'M9 12a4 4 0 1 0 4 4V2h4a6 6 0 0 0 6 6v4a10 10 0 0 1-10-4',
  },
  {
    label: 'YouTube',
    href: 'https://youtube.com/@sopedperu',
    path: 'M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58 2.78 2.78 0 0 0 1.94 2C5.12 20 12 20 12 20s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58zM9.75 15.02V8.98L15.5 12z',
  },
  {
    label: 'X',
    href: 'https://x.com/SOPEDMUN',
    path: 'M4 4l6.2 8.9L4 20h1.4l5.5-6.6L15.6 20H21l-6.6-9.4L20.3 4H19l-5 6-4.6-6z',
  },
]

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="soped-footer">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-16 soped-footer__inner">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-x-14 gap-y-10 footer-grid">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-4 mb-5">
              <img
                src="/soped.svg"
                alt="SoPeD Logo"
                style={{
                  width: '85px',
                  height: '85px',
                  objectFit: 'contain',
                  flexShrink: 0,
                }}
              />
              <span className="soped-footer__brand-name">SoPeD</span>
            </div>
            <p className="soped-footer__brand-desc">
              Sociedad Peruana de Debate.<br />
              Formando líderes académicos<br />
              desde el pensamiento crítico.
            </p>
            <div className="soped-footer__brand-social">
              {socialLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-icon"
                  aria-label={link.label}
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d={link.path} />
                  </svg>
                </a>
              ))}
            </div>
          </div>

          {/* Platform */}
          <div>
            <p style={{ fontFamily: 'var(--font-outfit)', fontSize: '0.65rem', fontWeight: 600, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(236,229,214,0.7)', marginBottom: '1rem' }}>
              Plataforma
            </p>
            <div className="flex flex-col gap-3">
              {[
                { label: 'Programas', href: '/programas' },
                { label: 'Eventos', href: '/eventos' },
                { label: 'SoPeD MUN', href: '/mun' },
                { label: 'Debate Escolar', href: '/debate-escolar' },
                { label: 'Verificar certificado', href: '/verificar-certificado' },
              ].map((l) => (
                <Link key={l.href} href={l.href} className="btn-text" style={{ fontSize: '0.82rem' }}>
                  {l.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Institución */}
          <div>
            <p style={{ fontFamily: 'var(--font-outfit)', fontSize: '0.65rem', fontWeight: 600, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(236,229,214,0.7)', marginBottom: '1rem' }}>
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
            <p style={{ fontFamily: 'var(--font-outfit)', fontSize: '0.65rem', fontWeight: 600, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(236,229,214,0.7)', marginBottom: '1rem' }}>
              Contacto
            </p>
            <p style={{ fontFamily: 'var(--font-outfit)', fontSize: '0.82rem', color: 'rgba(255,255,255,0.4)', lineHeight: 1.7 }}>
              presidencia@soped.pe
            </p>
            <p style={{ fontFamily: 'var(--font-outfit)', fontSize: '0.82rem', color: 'rgba(255,255,255,0.4)', lineHeight: 1.7 }}>
              Cusco, Perú
            </p>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="section-divider" />
        <div className="soped-footer__bottom">
          <p className="soped-footer__copyright">
            © {currentYear} SoPeD — Sociedad Peruana de Debate. Todos los derechos reservados.
          </p>
          <div className="soped-footer__sig">
            <span className="soped-footer__sig-line" />
            <span className="soped-footer__sig-star">✦</span>
            <span className="soped-footer__sig-line" />
          </div>
        </div>
      </div>
    </footer>
  )
}
