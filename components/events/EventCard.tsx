import Link from 'next/link'

export type EventStatus = 'abierto' | 'cerrado' | 'proximo'

export interface Event {
  id: string
  title: string
  type: string
  status: EventStatus
  date: string
  location: string
  description: string
  href: string
}

const statusConfig: Record<EventStatus, { label: string; color: string; bg: string }> = {
  abierto: {
    label: 'Inscripciones abiertas',
    color: 'rgba(34,197,94,0.9)',
    bg: 'rgba(34,197,94,0.08)',
  },
  proximo: {
    label: 'Próximamente',
    color: 'rgba(184,150,12,0.9)',
    bg: 'rgba(184,150,12,0.08)',
  },
  cerrado: {
    label: 'Inscripciones cerradas',
    color: 'rgba(255,255,255,0.35)',
    bg: 'rgba(255,255,255,0.04)',
  },
}

export default function EventCard({ event }: { event: Event }) {
  const status = statusConfig[event.status]

  return (
    <div
      className="glass glass-hover gold-glow-hover"
      style={{
        padding: '1.75rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
        transition: 'all 0.35s ease',
      }}
    >
      {/* Top row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <span
          style={{
            fontFamily: 'var(--font-outfit)',
            fontSize: '0.65rem',
            fontWeight: 500,
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            color: 'rgba(184,150,12,0.7)',
            border: '1px solid rgba(184,150,12,0.2)',
            padding: '0.2rem 0.6rem',
          }}
        >
          {event.type}
        </span>
        <span
          style={{
            fontFamily: 'var(--font-outfit)',
            fontSize: '0.65rem',
            fontWeight: 500,
            letterSpacing: '0.1em',
            color: status.color,
            background: status.bg,
            padding: '0.2rem 0.6rem',
            border: `1px solid ${status.color}`,
            opacity: 0.9,
          }}
        >
          {status.label}
        </span>
      </div>

      {/* Title */}
      <h3
        style={{
          fontFamily: 'var(--font-cormorant)',
          fontSize: '1.6rem',
          fontWeight: 500,
          color: '#fff',
          lineHeight: 1.2,
          letterSpacing: '0.01em',
        }}
      >
        {event.title}
      </h3>

      {/* Meta */}
      <div style={{ display: 'flex', gap: '1.5rem' }}>
        <span style={{ fontFamily: 'var(--font-outfit)', fontSize: '0.78rem', color: 'rgba(255,255,255,0.35)' }}>
          📅 {event.date}
        </span>
        <span style={{ fontFamily: 'var(--font-outfit)', fontSize: '0.78rem', color: 'rgba(255,255,255,0.35)' }}>
          📍 {event.location}
        </span>
      </div>

      {/* Description */}
      <p
        style={{
          fontFamily: 'var(--font-outfit)',
          fontSize: '0.875rem',
          color: 'rgba(255,255,255,0.45)',
          lineHeight: 1.7,
        }}
      >
        {event.description}
      </p>

      {/* Divider */}
      <div className="section-divider" />

      {/* CTA */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Link href={event.href} className="btn-text">
          Ver detalles →
        </Link>
        {event.status === 'abierto' && (
          <Link href="/inscripcion" className="btn-primary" style={{ padding: '0.5rem 1.25rem', fontSize: '0.78rem' }}>
            Inscribirse
          </Link>
        )}
      </div>
    </div>
  )
}
