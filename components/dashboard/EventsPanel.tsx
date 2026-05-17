const events = []

export default function EventsPanel() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <h2 style={{ fontFamily: 'var(--font-cormorant)', fontSize: '2rem', fontWeight: 500, color: '#fff' }}>
        Mis Eventos
      </h2>

      {events.map((ev) => (
        <div key={ev.id} className="glass glass-hover" style={{ padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <p style={{ fontFamily: 'var(--font-cormorant)', fontSize: '1.3rem', fontWeight: 500, color: '#fff', marginBottom: '0.25rem' }}>{ev.title}</p>
            <p style={{ fontFamily: 'var(--font-outfit)', fontSize: '0.8rem', color: 'rgba(255,255,255,0.4)' }}>{ev.role} · {ev.date}</p>
          </div>
          <span
            style={{
              fontFamily: 'var(--font-outfit)',
              fontSize: '0.65rem',
              fontWeight: 500,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              padding: '0.25rem 0.75rem',
              border: ev.status === 'confirmado' ? '1px solid rgba(34,197,94,0.4)' : '1px solid rgba(184,150,12,0.3)',
              color: ev.status === 'confirmado' ? 'rgba(34,197,94,0.85)' : 'rgba(184,150,12,0.8)',
              background: ev.status === 'confirmado' ? 'rgba(34,197,94,0.06)' : 'rgba(184,150,12,0.06)',
            }}
          >
            {ev.status}
          </span>
        </div>
      ))}
    </div>
  )
}
