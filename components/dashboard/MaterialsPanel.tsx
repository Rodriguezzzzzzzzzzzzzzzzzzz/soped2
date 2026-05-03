const materials = [
  { id: '1', title: 'Guía de Debate Parlamentario', type: 'PDF', size: '2.4 MB', category: 'Fundamentos' },
  { id: '2', title: 'Manual del Delegado MUN', type: 'PDF', size: '4.1 MB', category: 'MUN' },
  { id: '3', title: 'Técnicas de Argumentación Avanzada', type: 'PDF', size: '1.8 MB', category: 'Avanzado' },
  { id: '4', title: 'Resoluciones y Documentos Oficiales ONU', type: 'ZIP', size: '8.2 MB', category: 'MUN' },
]

export default function MaterialsPanel() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <h2 style={{ fontFamily: 'var(--font-cormorant)', fontSize: '2rem', fontWeight: 500, color: '#fff' }}>
        Materiales Académicos
      </h2>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
        {materials.map((m) => (
          <div key={m.id} className="glass glass-hover" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontFamily: 'var(--font-outfit)', fontSize: '0.62rem', fontWeight: 500, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(184,150,12,0.7)', border: '1px solid rgba(184,150,12,0.2)', padding: '0.15rem 0.5rem' }}>
                {m.category}
              </span>
              <span style={{ fontFamily: 'var(--font-outfit)', fontSize: '0.7rem', color: 'rgba(255,255,255,0.3)' }}>{m.type}</span>
            </div>
            <p style={{ fontFamily: 'var(--font-outfit)', fontSize: '0.88rem', fontWeight: 500, color: '#fff', lineHeight: 1.4 }}>{m.title}</p>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto' }}>
              <span style={{ fontFamily: 'var(--font-outfit)', fontSize: '0.72rem', color: 'rgba(255,255,255,0.3)' }}>{m.size}</span>
              <button className="btn-text" style={{ fontSize: '0.78rem' }}>Descargar →</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
