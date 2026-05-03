const certs = [
  { id: '1', title: 'Certificado de Participación — SoPeD MUN 2024', date: 'Diciembre 2024', available: true },
  { id: '2', title: 'Certificado de Excelencia — Debate Escolar 2024', date: 'Noviembre 2024', available: true },
  { id: '3', title: 'Certificado — Taller de Argumentación', date: 'Octubre 2024', available: false },
]

export default function CertificatesPanel() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <h2 style={{ fontFamily: 'var(--font-cormorant)', fontSize: '2rem', fontWeight: 500, color: '#fff' }}>
        Certificados
      </h2>

      {certs.map((c) => (
        <div key={c.id} className="glass" style={{ padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <p style={{ fontFamily: 'var(--font-outfit)', fontSize: '0.9rem', color: '#fff', marginBottom: '0.25rem' }}>{c.title}</p>
            <p style={{ fontFamily: 'var(--font-outfit)', fontSize: '0.75rem', color: 'rgba(255,255,255,0.35)' }}>{c.date}</p>
          </div>
          {c.available ? (
            <button className="btn-primary" style={{ padding: '0.4rem 1rem', fontSize: '0.75rem' }}>
              Descargar PDF
            </button>
          ) : (
            <span style={{ fontFamily: 'var(--font-outfit)', fontSize: '0.72rem', color: 'rgba(255,255,255,0.25)' }}>
              No disponible aún
            </span>
          )}
        </div>
      ))}
    </div>
  )
}
