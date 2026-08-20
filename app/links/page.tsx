import type { Metadata } from 'next'
import './links.css'

export const metadata: Metadata = {
  title: 'SOPEDMUN 2026',
  description:
    'Accesos oficiales de SOPEDMUN 2026 — Inscripciones, postulaciones, información de comités y más. Sociedad Peruana de Debate.',
}

/* ── Link data ────────────────────────────────────────────── */

const LINKS = [
  {
    title: 'SOPEDMUN 2026',
    desc: 'Comités · Guías de estudio · Información del evento',
    href: '/mun',
    icon: 'globe',
  },
  {
    title: 'Inscripción de Delegados SoPeDMUN 2026',
    desc: 'Formulario oficial de postulación de delegados',
    href: '/inscripcion?program=mun',
    icon: 'pen',
    badge: 'Próximamente',
  },
  {
    title: 'Postulación de Directores Adjuntos',
    desc: 'Próximamente se aperturarán las postulaciones',
    href: '#',
    icon: 'users',
    badge: 'Próximamente',
  },
  {
    title: 'Postulación al Dpto. de Staff y Voluntariado',
    desc: 'Formulario de postulación',
    href: '/links/staff-voluntariado',
    icon: 'hand',
  },
  {
    title: 'Postulación al Dpto. de Comunicaciones',
    desc: 'Formulario de postulación',
    href: '/links/comunicaciones',
    icon: 'megaphone',
  },
  {
    title: 'QUIERO SER EMBAJADOR',
    desc: 'Programa de Embajadores SOPEDMUN 2026',
    href: '/links/embajadores',
    icon: 'ambassador',
    featured: true,
  },
]

/* ── Social data (reused from Footer.tsx) ─────────────────── */

const SOCIAL = [
  {
    label: 'Instagram',
    href: 'https://www.instagram.com/sopedmun/',
    path: 'M7.8 2h8.4C19.4 2 22 4.6 22 7.8v8.4a5.8 5.8 0 0 1-5.8 5.8H7.8C4.6 22 2 19.4 2 16.2V7.8A5.8 5.8 0 0 1 7.8 2m-.2 2A3.6 3.6 0 0 0 4 7.6v8.8C4 18.39 5.61 20 7.6 20h8.8a3.6 3.6 0 0 0 3.6-3.6V7.6C20 5.61 18.39 4 16.4 4H7.6m9.65 1.5a1.25 1.25 0 0 1 0 2.5 1.25 1.25 0 0 1 0-2.5M12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10m0 2a3 3 0 1 0 0 6 3 3 0 0 0 0-6z',
  },
  {
    label: 'Facebook',
    href: 'https://www.facebook.com/people/Sociedad-Peruana-de-Debate-SOPED/61560722257887/',
    path: 'M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z',
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
    label: 'LinkedIn',
    href: 'https://www.linkedin.com/company/sociedad-peruana-de-debate/',
    path: 'M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2zM4 6a2 2 0 1 1 0-4 2 2 0 0 1 0 4z',
  },
  {
    label: 'WhatsApp',
    href: 'https://wa.me/51926553131',
    ariaLabel: 'Contactar a SoPeD por WhatsApp',
    path: 'M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z',
  },
]

/* ── Icon SVGs (stroke-based, matching lucide style) ──────── */

function LinkIcon({ type }: { type: string }) {
  switch (type) {
    case 'globe':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <line x1="2" y1="12" x2="22" y2="12" />
          <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
        </svg>
      )
    case 'pen':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M17 3a2.83 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" />
          <line x1="15" y1="5" x2="19" y2="9" />
        </svg>
      )
    case 'users':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      )
    case 'hand':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M11 14h4a2 2 0 0 0 0-4h-1" />
          <path d="M7 14v4a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2v-4" />
          <path d="M7 14H5a2 2 0 0 1-2-2v-1a2 2 0 0 1 2-2h1" />
          <path d="M18 10V6a2 2 0 0 0-2-2h-1a2 2 0 0 0-2 2v1" />
          <path d="M9 10V6" />
          <path d="M13 10V6" />
        </svg>
      )
    case 'megaphone':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 11l18-5v12L3 13v-2z" />
          <path d="M11.6 16.8a3 3 0 1 1-5.8-1.6" />
        </svg>
      )
    case 'ambassador':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <line x1="2" y1="12" x2="22" y2="12" />
          <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
          <path d="M8 12h8" />
          <path d="M12 8v8" />
        </svg>
      )
    default:
      return null
  }
}

/* ── Page ─────────────────────────────────────────────────── */

export default function LinksPage() {
  return (
    <div className="links-page">
      {/* ── HEADER ─────────────────────────────────────── */}
      <header className="links-header">
        <img
          src="/soped.svg"
          alt="SoPeD"
          className="links-logo"
          width={72}
          height={72}
        />
        <span className="links-org">Sociedad Peruana de Debate</span>
        <div className="links-divider" aria-hidden="true" />
        <h1 className="links-title">SOPEDMUN 2026</h1>
        <p className="links-desc">
          Accesos oficiales de la Conferencia Modelo de Naciones Unidas 2026.
        </p>
      </header>

      {/* ── LINK CARDS ─────────────────────────────────── */}
      <nav className="links-list" aria-label="Accesos principales">
        {LINKS.map((link, i) => (
          <a
            key={link.title}
            href={link.href}
            className={`links-card${link.featured ? ' links-card--featured' : ''}${link.badge ? ' links-card--badge' : ''}`}
            style={{ animationDelay: `${0.1 + i * 0.07}s` }}
            aria-label={link.title}
          >
            {link.badge && (
              <span className="links-card-ribbon" aria-label={link.badge}>
                {link.badge}
              </span>
            )}
            <span className="links-card-icon" aria-hidden="true">
              <LinkIcon type={link.icon} />
            </span>
            <span className="links-card-body">
              <span className="links-card-title">{link.title}</span>
              <span className="links-card-desc">{link.desc}</span>
            </span>
            <span className="links-card-arrow" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </span>
          </a>
        ))}
      </nav>

      {/* ── SOCIAL ICONS ───────────────────────────────── */}
      <div className="links-social" role="group" aria-label="Redes sociales">
        {SOCIAL.map((s) => (
          <a
            key={s.label}
            href={s.href}
            className="links-social-link"
            target="_blank"
            rel="noopener noreferrer"
            aria-label={s.ariaLabel || s.label}
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d={s.path} />
            </svg>
          </a>
        ))}
      </div>

      {/* ── FOOTER ─────────────────────────────────────── */}
      <footer className="links-footer">
        <div className="links-footer-name">Sociedad Peruana de Debate</div>
        <div className="links-footer-sub">SOPEDMUN 2026 · Cusco, Perú</div>
      </footer>
    </div>
  )
}
