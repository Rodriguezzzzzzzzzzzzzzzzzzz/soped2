import Layout from '@/components/layout/Layout'
import Link from 'next/link'

const programs = [
  {
    title: 'SoPeD MUN',
    tag: 'Competitivo Internacional',
    description: 'Nuestro Modelo de Naciones Unidas es la experiencia más completa en formación diplomática y debate internacional. Los delegados representan países, debaten resoluciones y desarrollan habilidades de negociación al más alto nivel.',
    features: ['Comités especializados', 'Resoluciones oficiales', 'Formación de delegados', 'Certificación internacional'],
    href: '/mun',
  },
  {
    title: 'Debate Escolar SoPeD',
    tag: 'Educativo — Secundaria',
    description: 'Programa diseñado especialmente para estudiantes de secundaria. Trabajamos el debate parlamentario, la argumentación estructurada y el pensamiento crítico desde cero, adaptado a cada nivel.',
    features: ['Niveles básico e intermedio', 'Metodología adaptada', 'Torneos internos', 'Certificación SoPeD'],
    href: '/debate-escolar',
  },
  {
    title: 'Talleres Especializados',
    tag: 'Desarrollo Académico',
    description: 'Serie de talleres intensivos en habilidades específicas: oratoria avanzada, argumentación filosófica, investigación académica, liderazgo y comunicación estratégica.',
    features: ['Talleres intensivos', 'Instructores expertos', 'Material exclusivo', 'Flexibilidad horaria'],
    href: '/inscripcion',
  },
  {
    title: 'Membresía SoPeD',
    tag: 'Institucional',
    description: 'Forma parte del equipo interno de SoPeD. Los miembros acceden a formación exclusiva, participan en la organización de eventos y construyen una red académica de alto nivel.',
    features: ['Formación interna', 'Red de miembros', 'Participación en eventos', 'Liderazgo institucional'],
    href: '/inscripcion',
  },
]

export default function ProgramasPage() {
  return (
    <Layout>
      <section style={{ paddingTop: '140px', paddingBottom: '5rem', background: 'linear-gradient(180deg, #091c36 0%, var(--dark) 100%)' }}>
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
            <span className="deco-line" />
            <span style={{ fontFamily: 'var(--font-outfit)', fontSize: '0.65rem', fontWeight: 500, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(184,150,12,0.7)' }}>
              Oferta Académica
            </span>
          </div>
          <h1 style={{ fontFamily: 'var(--font-cormorant)', fontSize: 'clamp(3rem, 6vw, 5rem)', fontWeight: 400, color: '#fff', lineHeight: 1.08, maxWidth: '700px', marginBottom: '1rem' }}>
            Programas & formación
          </h1>
          <p style={{ fontFamily: 'var(--font-outfit)', fontSize: '1rem', color: 'rgba(255,255,255,0.4)', maxWidth: '560px', lineHeight: 1.8 }}>
            Cada programa de SoPeD está diseñado para desarrollar habilidades específicas y construir una trayectoria académica sólida.
          </p>
        </div>
      </section>

      <section style={{ padding: '5rem 0' }}>
        <div className="max-w-7xl mx-auto px-6 lg:px-12" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {programs.map((p, i) => (
            <div key={i} className="glass glass-hover" style={{ padding: '2.5rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem', alignItems: 'center' }}>
              <div>
                <span style={{ fontFamily: 'var(--font-outfit)', fontSize: '0.62rem', fontWeight: 500, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(184,150,12,0.7)', border: '1px solid rgba(184,150,12,0.2)', padding: '0.2rem 0.6rem' }}>
                  {p.tag}
                </span>
                <h2 style={{ fontFamily: 'var(--font-cormorant)', fontSize: '2.2rem', fontWeight: 400, color: '#fff', margin: '0.75rem 0 1rem' }}>
                  {p.title}
                </h2>
                <p style={{ fontFamily: 'var(--font-outfit)', fontSize: '0.9rem', color: 'rgba(255,255,255,0.45)', lineHeight: 1.8, marginBottom: '1.5rem' }}>
                  {p.description}
                </p>
                <Link href={p.href} className="btn-primary">Más información →</Link>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {p.features.map((f) => (
                  <div key={f} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <span style={{ color: '#b8960c', fontSize: '0.6rem', flexShrink: 0 }}>✦</span>
                    <span style={{ fontFamily: 'var(--font-outfit)', fontSize: '0.875rem', color: 'rgba(255,255,255,0.5)' }}>{f}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </Layout>
  )
}
