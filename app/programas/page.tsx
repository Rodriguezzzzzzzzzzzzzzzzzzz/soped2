import Layout from '@/components/layout/Layout'
import Link from 'next/link'

const programs = [
  {
    title: 'MUN Workshop',
    tag: 'Diplomacia & Negociación',
    description: 'Programa intensivo enfocado en negociación internacional, simulaciones diplomáticas y formación integral para Modelos de Naciones Unidas.',
    features: ['Duración: 4 semanas', 'Simulaciones diplomáticas', 'Training de delegados', 'Certificación académica'],
    href: '/programas/mun-workshop',
  },
  {
    title: 'Argumentación & Persuasión',
    tag: 'Oratoria Estratégica',
    description: 'Programa orientado al desarrollo de pensamiento crítico, construcción argumentativa, persuasión y comunicación de alto impacto.',
    features: ['Argumentación estratégica', 'Persuasión avanzada', 'Oratoria aplicada', 'Certificación SoPeD'],
    href: '/programas/argumentacion-y-persuasion',
  },
  {
    title: 'Oratoria Workshop',
    tag: 'Elite Speaking Program',
    description: 'Un programa diseñado para formar speakers de alto impacto. Aprende a dominar el escenario, persuadir con autoridad y comunicar ideas con seguridad, presencia y estrategia en cualquier entorno académico, profesional o competitivo.',
    features: ['Public speaking intensivo', 'Dominio escénico & presencia', 'Persuasión de alto nivel', 'Certificación oficial SoPeD'],
    href: '/programas/oratoria-workshop',
  },
]

export default function ProgramasPage() {
  return (
    <Layout>
      <section style={{ paddingTop: '140px', paddingBottom: '5rem' }}>
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
            <span className="deco-line" />
            <span style={{ fontFamily: 'var(--font-outfit)', fontSize: '0.65rem', fontWeight: 500, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(236,229,214,0.7)' }}>
              Oferta Académica
            </span>
          </div>
          <h1 style={{ fontFamily: 'var(--font-cormorant)', fontSize: 'clamp(3rem, 6vw, 5rem)', fontWeight: 400, color: '#fff', lineHeight: 1.08, maxWidth: '700px', marginBottom: '1rem' }}>
            Programas de élite
          </h1>
          <p style={{ fontFamily: 'var(--font-outfit)', fontSize: '1rem', color: 'rgba(255,255,255,0.4)', maxWidth: '560px', lineHeight: 1.8 }}>
            Experiencias académicas diseñadas para desarrollar liderazgo, comunicación estratégica, pensamiento crítico y habilidades de alto rendimiento.
          </p>
        </div>
      </section>

      <section style={{ padding: '5rem 0' }}>
        <div className="max-w-7xl mx-auto px-6 lg:px-12" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {programs.map((p, i) => (
            <div key={i} className="glass glass-hover programa-card" style={{ padding: '2.5rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem', alignItems: 'center' }}>
              <div>
                <span style={{ fontFamily: 'var(--font-outfit)', fontSize: '0.62rem', fontWeight: 500, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(236,229,214,0.7)', border: '1px solid rgba(236,229,214,0.2)', padding: '0.2rem 0.6rem' }}>
                  {p.tag}
                </span>
                <h2 style={{ fontFamily: 'var(--font-cormorant)', fontSize: '2.2rem', fontWeight: 400, color: '#fff', margin: '0.75rem 0 1rem' }}>
                  {p.title}
                </h2>
                <p style={{ fontFamily: 'var(--font-outfit)', fontSize: '0.9rem', color: 'rgba(255,255,255,0.45)', lineHeight: 1.8, marginBottom: '1.5rem' }}>
                  {p.description}
                </p>
                <Link href={p.href} className="btn-primary">Postular ahora →</Link>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {p.features.map((f) => (
                  <div key={f} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <span style={{ color: '#ECE5D6', fontSize: '0.6rem', flexShrink: 0 }}>✦</span>
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
