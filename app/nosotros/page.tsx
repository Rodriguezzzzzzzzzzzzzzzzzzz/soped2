'use client'

import Layout from '@/components/layout/Layout'
import Link from 'next/link'
import RevealOnScroll from '@/components/nosotros/RevealOnScroll'

const team = [
  {
    name: 'Rodrigo Manuel Rodriguez',
    role: 'Presidente Nacional',
    initial: 'R',
    bio: 'Especialista en debate parlamentario con más de 8 años formando líderes académicos a nivel nacional.',
    area: 'Liderazgo institucional',
  },
  {
    name: 'Lucero Beys Romero',
    role: 'Directora Académica',
    initial: 'L',
    bio: 'Especialista en Derecho Internacional y ODS, representante en foros de Latinoamérica y el Caribe.',
    area: 'Política internacional',
  },
  {
    name: 'Pedro Adrian Villalba',
    role: 'Coordinador MUN',
    initial: 'P',
    bio: 'Estudiante de derecho con participación destacada en 10 conferencias jurídicas internacionales.',
    area: 'Derecho & diplomacia',
  },
  {
    name: 'Mateo Landaveri',
    role: 'Coordinador Escolar',
    initial: 'M',
    bio: 'Educador con enfoque en el desarrollo del pensamiento crítico en adolescentes.',
    area: 'Pedagogía crítica',
  },
]

const values = [
  {
    num: '01',
    title: 'Rigor académico',
    body: 'Cada argumento se construye sobre evidencia sólida. Entrenamos mentes que piensan antes de hablar.',
  },
  {
    num: '02',
    title: 'Respeto intelectual',
    body: 'Debatir es un diálogo, no un combate. Formamos líderes que escuchan con la misma intensidad con que argumentan.',
  },
  {
    num: '03',
    title: 'Excelencia continua',
    body: 'El estándar de calidad no es un límite: es el punto de partida desde donde seguimos mejorando.',
  },
  {
    num: '04',
    title: 'Inclusión activa',
    body: 'El pensamiento crítico no tiene barreras. Trabajamos para que el talento llegue antes que el privilegio.',
  },
]

const methodology = [
  { step: 'I', title: 'Fundamentación', desc: 'Construcción de base argumentativa sólida. Investigación, lógica y evidencia.' },
  { step: 'II', title: 'Práctica guiada', desc: 'Simulaciones reales con feedback inmediato de mentores especializados.' },
  { step: 'III', title: 'Competencia', desc: 'Torneos y conferencias donde el aprendizaje se convierte en resultado.' },
  { step: 'IV', title: 'Liderazgo', desc: 'Transición del participante al mentor. El ciclo que forma instituciones.' },
]

export default function NosotrosPage() {
  return (
    <Layout>

      {/* ═══ HERO ═══ */}
      <section
        style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-end',
          paddingBottom: '6rem',
          paddingTop: '140px',
          position: 'relative',
          overflow: 'hidden',
          background: 'linear-gradient(160deg, #091c36 0%, #05070d 55%, #0a0f1a 100%)',
        }}
      >
        {/* Grid background */}
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(255,255,255,0.016) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.016) 1px, transparent 1px)', backgroundSize: '60px 60px' }} />

        {/* Ambient glow top-right */}
        <div style={{ position: 'absolute', top: '-10%', right: '-5%', width: '700px', height: '700px', background: 'radial-gradient(circle, rgba(9,28,54,0.9) 0%, transparent 65%)', borderRadius: '50%', pointerEvents: 'none' }} />

        {/* Gold ambient bottom-left */}
        <div style={{ position: 'absolute', bottom: '0', left: '-8%', width: '500px', height: '500px', background: 'radial-gradient(circle, rgba(184,150,12,0.05) 0%, transparent 70%)', borderRadius: '50%', pointerEvents: 'none' }} />

        {/* Huge decorative number */}
        <div style={{ position: 'absolute', right: '-20px', top: '50%', transform: 'translateY(-50%)', fontFamily: 'var(--font-cormorant)', fontSize: 'clamp(200px, 30vw, 360px)', fontWeight: 700, color: 'rgba(184,150,12,0.04)', lineHeight: 1, userSelect: 'none', pointerEvents: 'none', letterSpacing: '-0.05em' }}>
          SoPeD
        </div>

        <div className="max-w-7xl mx-auto px-6 lg:px-12 w-full relative z-10">
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem', opacity: 0, animation: 'fadeUp 0.7s ease 200ms forwards' }}>
            <span className="deco-line" />
            <span style={{ fontFamily: 'var(--font-outfit)', fontSize: '0.65rem', fontWeight: 500, letterSpacing: '0.25em', textTransform: 'uppercase', color: 'rgba(184,150,12,0.7)' }}>
              Sociedad Peruana de Debate — Desde 2016
            </span>
          </div>

          <h1 style={{ fontFamily: 'var(--font-cormorant)', fontSize: 'clamp(3.5rem, 8vw, 8rem)', fontWeight: 300, color: '#fff', lineHeight: 0.95, letterSpacing: '-0.02em', opacity: 0, animation: 'fadeUp 0.8s ease 350ms forwards' }}>
            La institución<br />
            <em style={{ fontStyle: 'italic', color: 'rgba(212,175,55,0.9)' }}>detrás del</em><br />
            <span style={{ fontWeight: 600 }}>argumento.</span>
          </h1>

          <div style={{ marginTop: '3rem', display: 'flex', alignItems: 'flex-end', gap: '4rem', flexWrap: 'wrap', opacity: 0, animation: 'fadeUp 0.8s ease 550ms forwards' }}>
            <p style={{ fontFamily: 'var(--font-outfit)', fontSize: '1rem', color: 'rgba(255,255,255,0.45)', lineHeight: 1.85, maxWidth: '420px', fontWeight: 300 }}>
              SoPeD nació de una convicción simple: el debate no es un deporte —
              es la herramienta más poderosa que puede tener una mente joven para transformar su entorno.
            </p>
            <div style={{ display: 'flex', gap: '3rem', flexShrink: 0 }}>
              {[['8+', 'años'], ['200+', 'egresados'], ['12+', 'eventos']].map(([n, l]) => (
                <div key={l}>
                  <p style={{ fontFamily: 'var(--font-cormorant)', fontSize: '3rem', fontWeight: 600, color: '#d4af37', lineHeight: 1 }}>{n}</p>
                  <p style={{ fontFamily: 'var(--font-outfit)', fontSize: '0.68rem', color: 'rgba(255,255,255,0.3)', letterSpacing: '0.12em', textTransform: 'uppercase', marginTop: '4px' }}>{l}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom border line */}
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '1px', background: 'linear-gradient(90deg, transparent, rgba(184,150,12,0.25), transparent)' }} />
      </section>


      {/* ═══ MANIFESTO STRIP ═══ */}
      <section style={{ padding: '5rem 0', background: 'rgba(9,28,54,0.35)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <RevealOnScroll direction="none" threshold={0.3}>
            <p style={{ fontFamily: 'var(--font-cormorant)', fontSize: 'clamp(1.6rem, 3vw, 2.8rem)', fontWeight: 400, color: 'rgba(255,255,255,0.85)', lineHeight: 1.4, maxWidth: '900px', margin: '0 auto', textAlign: 'center', letterSpacing: '0.01em' }}>
              "Formamos estudiantes que no solo saben <em style={{ color: '#d4af37', fontStyle: 'italic' }}>hablar</em> — sino que saben
              {' '}<em style={{ color: '#d4af37', fontStyle: 'italic' }}>pensar</em>, estructurar, investigar y defender ideas con
              {' '}<span style={{ borderBottom: '1px solid rgba(184,150,12,0.5)' }}>evidencia y respeto.</span>"
            </p>
          </RevealOnScroll>
        </div>
      </section>


      {/* ═══ MISIÓN / VISIÓN ═══ */}
      <section style={{ padding: '7rem 0', position: 'relative', overflow: 'hidden' }}>
        <div className="max-w-7xl mx-auto px-6 lg:px-12">

          {/* Label */}
          <RevealOnScroll direction="left">
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '4rem' }}>
              <span className="deco-line" />
              <span style={{ fontFamily: 'var(--font-outfit)', fontSize: '0.65rem', fontWeight: 500, letterSpacing: '0.25em', textTransform: 'uppercase', color: 'rgba(184,150,12,0.7)' }}>
                Propósito institucional
              </span>
            </div>
          </RevealOnScroll>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6rem', alignItems: 'start' }}>

            {/* Left: Large editorial mission text */}
            <RevealOnScroll direction="left" delay={100}>
              <div>
                <div style={{ fontFamily: 'var(--font-cormorant)', fontSize: 'clamp(5rem, 10vw, 9rem)', fontWeight: 700, color: 'rgba(184,150,12,0.07)', lineHeight: 1, marginBottom: '-1.5rem', letterSpacing: '-0.04em' }}>
                  01
                </div>
                <h2 style={{ fontFamily: 'var(--font-cormorant)', fontSize: 'clamp(2rem, 3vw, 2.8rem)', fontWeight: 400, color: '#fff', marginBottom: '1.5rem', lineHeight: 1.2 }}>
                  Misión
                </h2>
                <div style={{ width: '40px', height: '1px', background: 'var(--gold)', marginBottom: '1.5rem' }} />
                <p style={{ fontFamily: 'var(--font-outfit)', fontSize: '0.975rem', color: 'rgba(255,255,255,0.5)', lineHeight: 1.9, marginBottom: '1.25rem' }}>
                  SoPeD es una institución académica dedicada a la formación de líderes intelectuales a través del debate competitivo, el pensamiento crítico y la argumentación rigurosa.
                </p>
                <p style={{ fontFamily: 'var(--font-outfit)', fontSize: '0.975rem', color: 'rgba(255,255,255,0.5)', lineHeight: 1.9 }}>
                  Creemos que el debate es una herramienta de transformación personal y social. Formamos ciudadanos capaces de defender ideas con evidencia, respeto y claridad.
                </p>
              </div>
            </RevealOnScroll>

            {/* Right: Vision card stack */}
            <RevealOnScroll direction="right" delay={200}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

                {/* Vision */}
                <div style={{ position: 'relative', overflow: 'hidden' }}>
                  <div style={{ fontFamily: 'var(--font-cormorant)', fontSize: '5.5rem', fontWeight: 700, color: 'rgba(184,150,12,0.06)', lineHeight: 1, position: 'absolute', right: '-8px', top: '-8px', letterSpacing: '-0.04em' }}>02</div>
                  <div className="glass" style={{ padding: '2rem 2rem 2rem', position: 'relative', borderLeft: '2px solid rgba(184,150,12,0.4)' }}>
                    <p style={{ fontFamily: 'var(--font-outfit)', fontSize: '0.6rem', fontWeight: 600, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(184,150,12,0.65)', marginBottom: '0.75rem' }}>Visión</p>
                    <p style={{ fontFamily: 'var(--font-cormorant)', fontSize: '1.3rem', fontWeight: 500, color: '#fff', lineHeight: 1.4 }}>
                      Ser la institución de referencia en debate académico del Perú y Latinoamérica.
                    </p>
                  </div>
                </div>

                {/* Values preview */}
                <div className="glass" style={{ padding: '2rem', borderLeft: '2px solid rgba(255,255,255,0.08)' }}>
                  <p style={{ fontFamily: 'var(--font-outfit)', fontSize: '0.6rem', fontWeight: 600, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(184,150,12,0.65)', marginBottom: '0.75rem' }}>Valores</p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                    {['Excelencia', 'Rigor', 'Respeto', 'Inclusión', 'Liderazgo'].map((v) => (
                      <span key={v} style={{ fontFamily: 'var(--font-outfit)', fontSize: '0.72rem', color: 'rgba(255,255,255,0.5)', border: '1px solid rgba(255,255,255,0.08)', padding: '0.25rem 0.75rem', letterSpacing: '0.05em' }}>
                        {v}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Impact number */}
                <div className="glass" style={{ padding: '2rem', display: 'flex', alignItems: 'center', gap: '2rem' }}>
                  <p style={{ fontFamily: 'var(--font-cormorant)', fontSize: '3.5rem', fontWeight: 600, color: '#d4af37', lineHeight: 1, flexShrink: 0 }}>100%</p>
                  <p style={{ fontFamily: 'var(--font-outfit)', fontSize: '0.82rem', color: 'rgba(255,255,255,0.4)', lineHeight: 1.6 }}>de nuestros egresados reportan mejoras medibles en comunicación y liderazgo.</p>
                </div>

              </div>
            </RevealOnScroll>
          </div>
        </div>
      </section>


      {/* ═══ VALORES ═══ */}
      <section style={{ padding: '7rem 0', background: 'var(--darker)', position: 'relative', overflow: 'hidden' }}>

        {/* Huge background text */}
        <div style={{ position: 'absolute', left: '-30px', top: '50%', transform: 'translateY(-50%)', fontFamily: 'var(--font-cormorant)', fontSize: 'clamp(180px, 22vw, 300px)', fontWeight: 700, color: 'rgba(255,255,255,0.018)', lineHeight: 1, userSelect: 'none', pointerEvents: 'none', letterSpacing: '-0.05em', whiteSpace: 'nowrap' }}>
          VALORES
        </div>

        <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">

          <RevealOnScroll direction="up">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '4rem', flexWrap: 'wrap', gap: '1.5rem' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                  <span className="deco-line" />
                  <span style={{ fontFamily: 'var(--font-outfit)', fontSize: '0.65rem', fontWeight: 500, letterSpacing: '0.25em', textTransform: 'uppercase', color: 'rgba(184,150,12,0.7)' }}>
                    Principios que nos definen
                  </span>
                </div>
                <h2 style={{ fontFamily: 'var(--font-cormorant)', fontSize: 'clamp(2.2rem, 4vw, 3.5rem)', fontWeight: 400, color: '#fff', lineHeight: 1.1 }}>
                  Lo que nos guía
                </h2>
              </div>
            </div>
          </RevealOnScroll>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.5rem' }}>
            {values.map((v, i) => (
              <RevealOnScroll key={v.num} direction="up" delay={i * 100}>
                <div
                  className="glass glass-hover"
                  style={{
                    padding: '2.5rem',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '1rem',
                    position: 'relative',
                    overflow: 'hidden',
                    cursor: 'default',
                    transition: 'border-color 0.3s ease, box-shadow 0.3s ease',
                  }}
                  onMouseEnter={e => {
                    const el = e.currentTarget
                    el.style.borderColor = 'rgba(184,150,12,0.35)'
                    el.style.boxShadow = '0 0 40px rgba(184,150,12,0.1), 0 8px 32px rgba(0,0,0,0.4)'
                  }}
                  onMouseLeave={e => {
                    const el = e.currentTarget
                    el.style.borderColor = 'rgba(255,255,255,0.08)'
                    el.style.boxShadow = 'none'
                  }}
                >
                  {/* Big number watermark */}
                  <div style={{ position: 'absolute', right: '1.5rem', top: '1.5rem', fontFamily: 'var(--font-cormorant)', fontSize: '5rem', fontWeight: 700, color: 'rgba(184,150,12,0.06)', lineHeight: 1, userSelect: 'none' }}>
                    {v.num}
                  </div>

                  {/* Gold accent line on hover (always subtle) */}
                  <div style={{ width: '28px', height: '2px', background: 'linear-gradient(90deg, #b8960c, #d4af37)', marginBottom: '0.25rem' }} />

                  <h3 style={{ fontFamily: 'var(--font-cormorant)', fontSize: '1.5rem', fontWeight: 500, color: '#fff', lineHeight: 1.2, position: 'relative' }}>
                    {v.title}
                  </h3>
                  <p style={{ fontFamily: 'var(--font-outfit)', fontSize: '0.85rem', color: 'rgba(255,255,255,0.4)', lineHeight: 1.75, position: 'relative' }}>
                    {v.body}
                  </p>
                </div>
              </RevealOnScroll>
            ))}
          </div>
        </div>
      </section>


      {/* ═══ METODOLOGÍA ═══ */}
      <section style={{ padding: '7rem 0', position: 'relative' }}>
        <div className="max-w-7xl mx-auto px-6 lg:px-12">

          <RevealOnScroll direction="up">
            <div style={{ marginBottom: '4rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                <span className="deco-line" />
                <span style={{ fontFamily: 'var(--font-outfit)', fontSize: '0.65rem', fontWeight: 500, letterSpacing: '0.25em', textTransform: 'uppercase', color: 'rgba(184,150,12,0.7)' }}>
                  Cómo trabajamos
                </span>
              </div>
              <h2 style={{ fontFamily: 'var(--font-cormorant)', fontSize: 'clamp(2.2rem, 4vw, 3.5rem)', fontWeight: 400, color: '#fff', lineHeight: 1.1 }}>
                Metodología SoPeD
              </h2>
            </div>
          </RevealOnScroll>

          {/* Steps: connected timeline layout */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0', position: 'relative' }}>
            {/* Connecting line */}
            <div style={{ position: 'absolute', top: '40px', left: '12.5%', right: '12.5%', height: '1px', background: 'linear-gradient(90deg, rgba(184,150,12,0.4), rgba(184,150,12,0.1), rgba(184,150,12,0.4))', zIndex: 0 }} />

            {methodology.map((m, i) => (
              <RevealOnScroll key={m.step} direction="up" delay={i * 120}>
                <div style={{ padding: '0 1.5rem', textAlign: 'center', position: 'relative', zIndex: 1 }}>
                  {/* Step indicator */}
                  <div style={{ width: '80px', height: '80px', margin: '0 auto 1.5rem', border: '1px solid rgba(184,150,12,0.3)', background: 'var(--dark)', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                    <span style={{ fontFamily: 'var(--font-cormorant)', fontSize: '1.4rem', fontWeight: 600, color: '#d4af37', letterSpacing: '0.05em' }}>{m.step}</span>
                    {/* Corner accent */}
                    <div style={{ position: 'absolute', top: '-1px', left: '-1px', width: '8px', height: '8px', borderTop: '2px solid #b8960c', borderLeft: '2px solid #b8960c' }} />
                    <div style={{ position: 'absolute', bottom: '-1px', right: '-1px', width: '8px', height: '8px', borderBottom: '2px solid #b8960c', borderRight: '2px solid #b8960c' }} />
                  </div>

                  <h3 style={{ fontFamily: 'var(--font-cormorant)', fontSize: '1.25rem', fontWeight: 500, color: '#fff', marginBottom: '0.75rem' }}>{m.title}</h3>
                  <p style={{ fontFamily: 'var(--font-outfit)', fontSize: '0.8rem', color: 'rgba(255,255,255,0.38)', lineHeight: 1.7 }}>{m.desc}</p>
                </div>
              </RevealOnScroll>
            ))}
          </div>
        </div>
      </section>


      {/* ═══ EQUIPO ═══ */}
      <section style={{ padding: '7rem 0', background: 'var(--darker)', position: 'relative', overflow: 'hidden' }}>

        <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">

          <RevealOnScroll direction="up">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '4rem', flexWrap: 'wrap', gap: '1.5rem' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                  <span className="deco-line" />
                  <span style={{ fontFamily: 'var(--font-outfit)', fontSize: '0.65rem', fontWeight: 500, letterSpacing: '0.25em', textTransform: 'uppercase', color: 'rgba(184,150,12,0.7)' }}>
                    Las personas detrás
                  </span>
                </div>
                <h2 style={{ fontFamily: 'var(--font-cormorant)', fontSize: 'clamp(2.2rem, 4vw, 3.5rem)', fontWeight: 400, color: '#fff', lineHeight: 1.1 }}>
                  Equipo directivo
                </h2>
              </div>
              <Link href="/inscripcion" className="btn-secondary" style={{ padding: '0.6rem 1.5rem', fontSize: '0.78rem' }}>
                Únete al equipo →
              </Link>
            </div>
          </RevealOnScroll>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
            {team.map((member, i) => (
              <RevealOnScroll key={member.name} direction="up" delay={i * 80}>
                <div
                  className="glass"
                  style={{
                    padding: '0',
                    overflow: 'hidden',
                    height: '100%',
                    transition: 'border-color 0.35s ease, transform 0.35s ease, box-shadow 0.35s ease',
                    cursor: 'default',
                  }}
                  onMouseEnter={e => {
                    const el = e.currentTarget
                    el.style.borderColor = 'rgba(184,150,12,0.3)'
                    el.style.transform = 'translateY(-4px)'
                    el.style.boxShadow = '0 20px 60px rgba(0,0,0,0.4), 0 0 30px rgba(184,150,12,0.08)'
                  }}
                  onMouseLeave={e => {
                    const el = e.currentTarget
                    el.style.borderColor = 'rgba(255,255,255,0.08)'
                    el.style.transform = 'none'
                    el.style.boxShadow = 'none'
                  }}
                >
                  {/* Top color band */}
                  <div style={{ height: '3px', background: 'linear-gradient(90deg, rgba(184,150,12,0.6), rgba(184,150,12,0.1), transparent)' }} />

                  <div style={{ padding: '2rem' }}>
                    {/* Avatar + area */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
                      <div style={{ width: '52px', height: '52px', background: 'rgba(184,150,12,0.08)', border: '1px solid rgba(184,150,12,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <span style={{ fontFamily: 'var(--font-cormorant)', fontSize: '1.6rem', color: '#d4af37', fontWeight: 600 }}>
                          {member.initial}
                        </span>
                      </div>
                      <span style={{ fontFamily: 'var(--font-outfit)', fontSize: '0.6rem', fontWeight: 500, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.2)', border: '1px solid rgba(255,255,255,0.07)', padding: '0.2rem 0.6rem', alignSelf: 'center' }}>
                        {member.area}
                      </span>
                    </div>

                    {/* Name */}
                    <p style={{ fontFamily: 'var(--font-cormorant)', fontSize: '1.35rem', fontWeight: 500, color: '#fff', marginBottom: '0.2rem', lineHeight: 1.2 }}>
                      {member.name}
                    </p>

                    {/* Role */}
                    <p style={{ fontFamily: 'var(--font-outfit)', fontSize: '0.68rem', fontWeight: 500, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(184,150,12,0.65)', marginBottom: '1rem' }}>
                      {member.role}
                    </p>

                    {/* Divider */}
                    <div style={{ height: '1px', background: 'rgba(255,255,255,0.06)', marginBottom: '1rem' }} />

                    {/* Bio */}
                    <p style={{ fontFamily: 'var(--font-outfit)', fontSize: '0.82rem', color: 'rgba(255,255,255,0.38)', lineHeight: 1.7 }}>
                      {member.bio}
                    </p>
                  </div>
                </div>
              </RevealOnScroll>
            ))}
          </div>
        </div>
      </section>


      {/* ═══ CTA FINAL ═══ */}
      <section style={{ padding: '8rem 0', background: 'linear-gradient(160deg, #091c36 0%, #05070d 100%)', position: 'relative', overflow: 'hidden' }}>

        {/* Decorative circle */}
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '800px', height: '800px', border: '1px solid rgba(184,150,12,0.05)', borderRadius: '50%', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '500px', height: '500px', border: '1px solid rgba(184,150,12,0.04)', borderRadius: '50%', pointerEvents: 'none' }} />

        <div className="max-w-7xl mx-auto px-6 lg:px-12 text-center relative z-10">
          <RevealOnScroll direction="up">
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
              <span className="deco-line" style={{ width: '30px' }} />
              <span style={{ fontFamily: 'var(--font-outfit)', fontSize: '0.65rem', fontWeight: 500, letterSpacing: '0.25em', textTransform: 'uppercase', color: 'rgba(184,150,12,0.7)' }}>
                Forma parte de SoPeD
              </span>
              <span className="deco-line" style={{ width: '30px' }} />
            </div>

            <h2 style={{ fontFamily: 'var(--font-cormorant)', fontSize: 'clamp(2.8rem, 5vw, 5rem)', fontWeight: 400, color: '#fff', lineHeight: 1.05, marginBottom: '1.5rem', letterSpacing: '-0.01em' }}>
              El próximo paso<br />
              <em style={{ fontStyle: 'italic', color: '#d4af37' }}>es tuyo.</em>
            </h2>

            <p style={{ fontFamily: 'var(--font-outfit)', fontSize: '1rem', color: 'rgba(255,255,255,0.38)', maxWidth: '440px', margin: '0 auto 3rem', lineHeight: 1.8, fontWeight: 300 }}>
              Inscríbete en nuestros programas y comienza a construir una trayectoria académica que trasciende.
            </p>

            <div style={{ display: 'flex', gap: '1.25rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link href="/inscripcion" className="btn-primary" style={{ padding: '0.875rem 2.5rem' }}>
                Inscribirse ahora →
              </Link>
              <Link href="/eventos" className="btn-secondary" style={{ padding: '0.875rem 2.5rem' }}>
                Ver eventos
              </Link>
            </div>
          </RevealOnScroll>
        </div>
      </section>

    </Layout>
  )
}
