import Layout from '@/components/layout/Layout'

const team = [
  { name: 'Rodrigo Manuel Rodriguez Molleda', role: 'Directora General', bio: 'Especialista en debate parlamentario con más de 8 años de experiencia formando líderes académicos.' },
  { name: 'Lucero Beys', role: 'Directora Académico', bio: 'Exdelegado en múltiples conferencias MUN internacionales. Docente universitario.' },
  { name: 'Pedro Villalba', role: 'Coordinador MUN', bio: 'Especialista en política internacional y diplomacia. Fundadora del programa MUN de SoPeD.' },
  { name: 'Rodrigo Salas', role: 'Coordinador Escolar', bio: 'Educador con enfoque en el desarrollo del pensamiento crítico en adolescentes.' },
]

export default function NosotrosPage() {
  return (
    <Layout>
      {/* Hero */}
      <section style={{ paddingTop: '140px', paddingBottom: '5rem', background: 'linear-gradient(180deg, #091c36 0%, var(--dark) 100%)' }}>
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
            <span className="deco-line" />
            <span style={{ fontFamily: 'var(--font-outfit)', fontSize: '0.65rem', fontWeight: 500, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(184,150,12,0.7)' }}>
              Sociedad Peruana de Debate
            </span>
          </div>
          <h1 style={{ fontFamily: 'var(--font-cormorant)', fontSize: 'clamp(3rem, 6vw, 5rem)', fontWeight: 400, color: '#fff', lineHeight: 1.08, maxWidth: '700px' }}>
            Quiénes somos
          </h1>
        </div>
      </section>

      {/* Mission */}
      <section style={{ padding: '5rem 0' }}>
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'start' }}>
            <div>
              <h2 style={{ fontFamily: 'var(--font-cormorant)', fontSize: '2.5rem', fontWeight: 400, color: '#fff', marginBottom: '1.5rem', lineHeight: 1.15 }}>
                Misión institucional
              </h2>
              <p style={{ fontFamily: 'var(--font-outfit)', fontSize: '1rem', color: 'rgba(255,255,255,0.5)', lineHeight: 1.85, marginBottom: '1.25rem' }}>
                La Sociedad Peruana de Debate es una institución académica dedicada a la formación de líderes intelectuales a través del debate competitivo, el pensamiento crítico y la argumentación rigurosa.
              </p>
              <p style={{ fontFamily: 'var(--font-outfit)', fontSize: '1rem', color: 'rgba(255,255,255,0.5)', lineHeight: 1.85 }}>
                Creemos que el debate no es solo una habilidad comunicativa, sino una herramienta de transformación personal y social. Formamos ciudadanos capaces de defender ideas con evidencia, respeto y claridad.
              </p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {[
                { label: 'Visión', text: 'Ser la institución de referencia en debate académico del Perú y Latinoamérica.' },
                { label: 'Misión', text: 'Formar líderes con pensamiento crítico, capacidad argumentativa y valores éticos.' },
                { label: 'Valores', text: 'Excelencia académica, respeto intelectual, rigor argumentativo e inclusión.' },
              ].map((v) => (
                <div key={v.label} className="glass" style={{ padding: '1.5rem' }}>
                  <p style={{ fontFamily: 'var(--font-outfit)', fontSize: '0.65rem', fontWeight: 600, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(184,150,12,0.7)', marginBottom: '0.5rem' }}>{v.label}</p>
                  <p style={{ fontFamily: 'var(--font-outfit)', fontSize: '0.875rem', color: 'rgba(255,255,255,0.5)', lineHeight: 1.7 }}>{v.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Team */}
      <section style={{ padding: '5rem 0', background: 'var(--darker)' }}>
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div style={{ marginBottom: '3rem' }}>
            <h2 style={{ fontFamily: 'var(--font-cormorant)', fontSize: '2.5rem', fontWeight: 400, color: '#fff' }}>Equipo directivo</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.5rem' }}>
            {team.map((member) => (
              <div key={member.name} className="glass glass-hover" style={{ padding: '2rem' }}>
                <div style={{ width: '48px', height: '48px', background: 'rgba(184,150,12,0.1)', border: '1px solid rgba(184,150,12,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
                  <span style={{ fontFamily: 'var(--font-cormorant)', fontSize: '1.4rem', color: '#d4af37', fontWeight: 600 }}>
                    {member.name.charAt(0)}
                  </span>
                </div>
                <p style={{ fontFamily: 'var(--font-cormorant)', fontSize: '1.3rem', fontWeight: 500, color: '#fff', marginBottom: '0.25rem' }}>{member.name}</p>
                <p style={{ fontFamily: 'var(--font-outfit)', fontSize: '0.72rem', fontWeight: 500, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(184,150,12,0.65)', marginBottom: '0.75rem' }}>{member.role}</p>
                <p style={{ fontFamily: 'var(--font-outfit)', fontSize: '0.82rem', color: 'rgba(255,255,255,0.4)', lineHeight: 1.7 }}>{member.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  )
}
