import Layout from '@/components/layout/Layout'
import Link from 'next/link'

const levels = [
  { title: 'Nivel Iniciación', target: '1ro–2do Secundaria', desc: 'Introducción al debate, argumentación básica y oratoria fundamental.', skills: ['Argumentación básica', 'Oratoria inicial', 'Escucha activa'] },
  { title: 'Nivel Intermedio', target: '3ro–4to Secundaria', desc: 'Debate parlamentario estructurado, técnicas de refutación y evidencia.', skills: ['Debate parlamentario', 'Refutación', 'Uso de evidencia'] },
  { title: 'Nivel Avanzado', target: '5to Secundaria', desc: 'Debate competitivo, preparación para torneos y MUN.', skills: ['Debate competitivo', 'Estrategia', 'Preparación MUN'] },
]

export default function DebateEscolarPage() {
  return (
    <Layout>
      <section style={{ paddingTop: '140px', paddingBottom: '5rem', background: 'linear-gradient(180deg, #091c36 0%, var(--dark) 100%)' }}>
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
            <span className="deco-line" />
            <span style={{ fontFamily: 'var(--font-outfit)', fontSize: '0.65rem', fontWeight: 500, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(184,150,12,0.7)' }}>
              Programa Escolar
            </span>
          </div>
          <h1 style={{ fontFamily: 'var(--font-cormorant)', fontSize: 'clamp(3rem, 6vw, 5rem)', fontWeight: 400, color: '#fff', lineHeight: 1.08, marginBottom: '1.5rem' }}>
            Debate Escolar SoPeD
          </h1>
          <p style={{ fontFamily: 'var(--font-outfit)', fontSize: '1rem', color: 'rgba(255,255,255,0.45)', maxWidth: '560px', lineHeight: 1.8, marginBottom: '2.5rem' }}>
            Programa integral de debate para estudiantes de secundaria. Desarrollamos pensamiento crítico, oratoria y argumentación desde el primer nivel.
          </p>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <Link href="/inscripcion" className="btn-primary">Inscribirse al programa →</Link>
            <Link href="/eventos" className="btn-secondary">Ver próximos torneos</Link>
          </div>
        </div>
      </section>

      {/* Levels */}
      <section style={{ padding: '5rem 0' }}>
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <h2 style={{ fontFamily: 'var(--font-cormorant)', fontSize: '2.5rem', fontWeight: 400, color: '#fff', marginBottom: '2.5rem' }}>
            Niveles del programa
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
            {levels.map((l, i) => (
              <div key={i} className="glass glass-hover" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem', position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', fontFamily: 'var(--font-cormorant)', fontSize: '4rem', fontWeight: 700, color: 'rgba(184,150,12,0.05)', lineHeight: 1 }}>{i + 1}</div>
                <span style={{ fontFamily: 'var(--font-outfit)', fontSize: '0.65rem', fontWeight: 500, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(184,150,12,0.65)', border: '1px solid rgba(184,150,12,0.2)', padding: '0.2rem 0.6rem', alignSelf: 'flex-start' }}>
                  {l.target}
                </span>
                <h3 style={{ fontFamily: 'var(--font-cormorant)', fontSize: '1.5rem', fontWeight: 500, color: '#fff' }}>{l.title}</h3>
                <p style={{ fontFamily: 'var(--font-outfit)', fontSize: '0.875rem', color: 'rgba(255,255,255,0.4)', lineHeight: 1.7 }}>{l.desc}</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: 'auto' }}>
                  {l.skills.map((s) => (
                    <div key={s} style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                      <span style={{ color: '#b8960c', fontSize: '0.55rem' }}>✦</span>
                      <span style={{ fontFamily: 'var(--font-outfit)', fontSize: '0.8rem', color: 'rgba(255,255,255,0.45)' }}>{s}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: '5rem 0', background: 'var(--darker)' }}>
        <div className="max-w-7xl mx-auto px-6 lg:px-12 text-center">
          <h2 style={{ fontFamily: 'var(--font-cormorant)', fontSize: '2.5rem', fontWeight: 400, color: '#fff', marginBottom: '1rem' }}>
            Empieza tu camino en el debate
          </h2>
          <p style={{ fontFamily: 'var(--font-outfit)', fontSize: '0.95rem', color: 'rgba(255,255,255,0.4)', maxWidth: '440px', margin: '0 auto 2rem', lineHeight: 1.8 }}>
            No necesitas experiencia previa. Te formamos desde cero.
          </p>
          <Link href="/inscripcion" className="btn-primary">Inscribirse al Debate Escolar →</Link>
        </div>
      </section>
    </Layout>
  )
}
