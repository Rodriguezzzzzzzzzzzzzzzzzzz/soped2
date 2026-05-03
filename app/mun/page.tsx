import Layout from '@/components/layout/Layout'
import Link from 'next/link'

const committees = [
  { name: 'Consejo de Seguridad', abbr: 'CSNU', level: 'Avanzado', topics: ['Conflictos internacionales', 'Mantenimiento de la paz'], seats: 15 },
  { name: 'Asamblea General', abbr: 'AGONU', level: 'Intermedio', topics: ['Desarrollo sostenible', 'Derechos humanos'], seats: 40 },
  { name: 'ECOSOC', abbr: 'ECOSOC', level: 'Intermedio', topics: ['Economía global', 'Desarrollo social'], seats: 30 },
  { name: 'Consejo de DDHH', abbr: 'UNHRC', level: 'Básico–Intermedio', topics: ['Derechos fundamentales', 'Justicia global'], seats: 35 },
  { name: 'Comité de Crisis', abbr: 'CRISIS', level: 'Avanzado', topics: ['Situaciones de emergencia', 'Decisiones urgentes'], seats: 20 },
]

export default function MunPage() {
  return (
    <Layout>
      {/* Hero */}
      <section style={{ paddingTop: '140px', paddingBottom: '5rem', background: 'linear-gradient(135deg, #091c36 0%, #05070d 60%, #091c36 100%)', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(255,255,255,0.015) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.015) 1px, transparent 1px)', backgroundSize: '80px 80px' }} />
        <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
            <span className="deco-line" />
            <span style={{ fontFamily: 'var(--font-outfit)', fontSize: '0.65rem', fontWeight: 500, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(184,150,12,0.7)' }}>
              Programa Internacional
            </span>
          </div>
          <h1 style={{ fontFamily: 'var(--font-cormorant)', fontSize: 'clamp(3rem, 7vw, 6rem)', fontWeight: 400, color: '#fff', lineHeight: 1.05, marginBottom: '1.5rem' }}>
            SoPeD MUN
          </h1>
          <p style={{ fontFamily: 'var(--font-outfit)', fontSize: '1.1rem', color: 'rgba(255,255,255,0.45)', maxWidth: '560px', lineHeight: 1.8, marginBottom: '2.5rem' }}>
            Nuestro Modelo de Naciones Unidas reúne a los mejores estudiantes del Perú en una experiencia de debate diplomático de nivel internacional.
          </p>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <Link href="/inscripcion" className="btn-primary">Inscribirse como delegado →</Link>
            <Link href="/eventos" className="btn-secondary">Ver calendario</Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section style={{ padding: '3.5rem 0', background: 'rgba(9,28,54,0.3)', borderTop: '1px solid rgba(255,255,255,0.05)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <div className="max-w-7xl mx-auto px-6 lg:px-12" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '2rem' }}>
          {[
            { num: '5', label: 'Comités activos' },
            { num: '80+', label: 'Delegados por edición' },
            { num: '3', label: 'Días de conferencia' },
            { num: '100%', label: 'Certificación oficial' },
          ].map((s) => (
            <div key={s.label} style={{ textAlign: 'center' }}>
              <p style={{ fontFamily: 'var(--font-cormorant)', fontSize: '3rem', fontWeight: 600, color: '#d4af37', lineHeight: 1 }}>{s.num}</p>
              <p style={{ fontFamily: 'var(--font-outfit)', fontSize: '0.72rem', color: 'rgba(255,255,255,0.35)', letterSpacing: '0.08em', textTransform: 'uppercase', marginTop: '0.5rem' }}>{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Committees */}
      <section style={{ padding: '5rem 0' }}>
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <h2 style={{ fontFamily: 'var(--font-cormorant)', fontSize: '2.5rem', fontWeight: 400, color: '#fff', marginBottom: '2.5rem' }}>
            Comités 2025
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {committees.map((c) => (
              <div key={c.abbr} className="glass glass-hover" style={{ padding: '1.75rem 2rem', display: 'grid', gridTemplateColumns: '80px 1fr 1fr auto', gap: '2rem', alignItems: 'center' }}>
                <span style={{ fontFamily: 'var(--font-cormorant)', fontSize: '1rem', fontWeight: 600, color: '#d4af37', letterSpacing: '0.08em' }}>{c.abbr}</span>
                <div>
                  <p style={{ fontFamily: 'var(--font-outfit)', fontSize: '0.9rem', fontWeight: 500, color: '#fff' }}>{c.name}</p>
                  <p style={{ fontFamily: 'var(--font-outfit)', fontSize: '0.75rem', color: 'rgba(255,255,255,0.35)' }}>{c.topics.join(' · ')}</p>
                </div>
                <span style={{ fontFamily: 'var(--font-outfit)', fontSize: '0.72rem', fontWeight: 500, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(184,150,12,0.65)' }}>{c.level}</span>
                <span style={{ fontFamily: 'var(--font-outfit)', fontSize: '0.8rem', color: 'rgba(255,255,255,0.3)', whiteSpace: 'nowrap' }}>{c.seats} asientos</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: '5rem 0', background: 'var(--darker)' }}>
        <div className="max-w-7xl mx-auto px-6 lg:px-12 text-center">
          <h2 style={{ fontFamily: 'var(--font-cormorant)', fontSize: '3rem', fontWeight: 400, color: '#fff', marginBottom: '1rem' }}>
            ¿Listo para ser delegado?
          </h2>
          <p style={{ fontFamily: 'var(--font-outfit)', fontSize: '0.95rem', color: 'rgba(255,255,255,0.4)', maxWidth: '480px', margin: '0 auto 2rem', lineHeight: 1.8 }}>
            Completa el formulario de inscripción y selecciona tu comité preferido.
          </p>
          <Link href="/inscripcion" className="btn-primary">Inscribirse como delegado MUN →</Link>
        </div>
      </section>
    </Layout>
  )
}
