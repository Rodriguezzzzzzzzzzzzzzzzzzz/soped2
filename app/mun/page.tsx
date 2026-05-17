"use client"
import Layout from '@/components/layout/Layout'
import Link from 'next/link'

const committees = [
  { name: 'Consejo de Seguridad', abbr: 'CSNU', slug: 'CSNU', level: 'Avanzado', topics: ['Conflictos internacionales', 'Mantenimiento de la paz'], seats: 15 },
  { name: 'Asamblea General', abbr: 'AGONU', slug: 'AGONU', level: 'Intermedio', topics: ['Desarrollo sostenible', 'Derechos humanos'], seats: 40 },
  { name: 'ECOSOC', abbr: 'ECOSOC', slug: 'ECOSOC', level: 'Intermedio', topics: ['Economía global', 'Desarrollo social'], seats: 30 },
  { name: 'Comité de Crisis Fantastica', abbr: 'CRISIS', slug: 'CRISIS', level: 'Intermedio', topics: ['Situaciones de emergencia', 'Decisiones urgentes'], seats: 20 },
  {
    name: 'Consejo de Contingencia Planetaria',
    abbr: 'PCC',
    slug: 'PCC',
    level: 'Avanzado',
    topics: ['Emergencias globales', 'Supervivencia internacional'],
    seats: 15,
  },
  {
    name: 'ONU Mujeres',
    abbr: 'ONU Mujeres',
    slug: 'ONUMUJERES',
    level: 'Intermedio',
    topics: ['Igualdad de género', 'Derechos humanos'],
    seats: 15,
  },
  {
    name: 'Organización de los Estados Americanos',
    abbr: 'OEA',
    slug: 'OEA',
    level: 'Intermedio',
    topics: ['Diplomacia regional', 'Democracia en América'],
    seats: 20,
  },
  {
    name: 'Organización Mundial de la Salud',
    abbr: 'OMS',
    slug: 'OMS',
    level: 'Intermedio',
    topics: ['Salud global', 'Respuesta sanitaria internacional'],
    seats: 20,
  },
  {
    name: 'Comité de Desarme y Seguridad Internacional',
    abbr: 'DISEC',
    slug: 'DISEC',
    level: 'Intermedio–Avanzado',
    topics: ['Desarme nuclear', 'Seguridad internacional'],
    seats: 25,
  },
  {
    name: 'Third Party Actors (TPA)',
    abbr: 'TPA',
    slug: 'TPA',
    level: 'Básico–Intermedio',
    topics: ['Actores internacionales', 'Operaciones estratégicas'],
    seats: 20,
  },
  {
    name: 'Consejo de Derechos Humanos — Inglés',
    abbr: 'UNHRC ENG',
    slug: 'UNHRCENG',
    level: 'Avanzado',
    topics: ['Human rights', 'International justice'],
    seats: 15,
  },
  {
    name: 'Consejo de Derechos Humanos — Español',
    abbr: 'UNHRC ESP',
    slug: 'UNHRCESP',
    level: 'Intermedio',
    topics: ['Derechos fundamentales', 'Justicia global'],
    seats: 15,
  },
]

export default function MunPage() {
  return (
    <Layout>
      {/* Hero */}
      <section style={{
        position: 'relative',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden'
      }}>

        {/* LOCAL VIDEO BACKGROUND */}
        <div style={{
          position: 'absolute',
          inset: 0,
          zIndex: 0,
          overflow: 'hidden',
        }}>
          <video
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            poster="/mun-bg.jpg"
            aria-hidden="true"
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              objectPosition: 'center',
              pointerEvents: 'none',
              transform: 'translateZ(0)',
              willChange: 'transform',
              filter: 'grayscale(1) brightness(0.55) contrast(1.4)',
            }}
          >
            <source src="/mun-bg.mp4?v=1" type="video/mp4" />
            <source src="/mun-bg.webm?v=1" type="video/webm" />
          </video>
        </div>

        {/* DARK OVERLAY */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to bottom, rgba(0,0,0,0.4), rgba(0,0,0,0.75))',
            zIndex: 1,
          }}
        />

        {/* CONTENT */}
        <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10" style={{ textAlign: 'center' }}>
          
          <div style={{ maxWidth: '900px', margin: '0 auto' }}>

            <p style={{
              letterSpacing: '0.42em',
              fontSize: '0.7rem',
              color: 'rgba(255,255,255,0.6)',
              marginBottom: '2.5rem',
              textTransform: 'uppercase'
            }}>
              Programa Internacional
            </p>

            <h1 style={{
              fontFamily: 'var(--font-cormorant)',
              fontSize: 'clamp(3.5rem, 7vw, 6.5rem)',
              fontWeight: 400,
              color: '#fff',
              lineHeight: 1.05,
              marginBottom: '2rem'
            }}>
              SoPeD MUN
            </h1>

            <p style={{
              fontFamily: 'var(--font-outfit)',
              fontSize: '1.2rem',
              color: 'rgba(255,255,255,0.7)',
              marginBottom: '1.2rem'
            }}>
              Modelo de Naciones Unidas de nivel internacional
            </p>

            <p style={{
              fontFamily: 'var(--font-outfit)',
              fontSize: '1rem',
              color: 'rgba(255,255,255,0.45)',
              maxWidth: '700px',
              margin: '0 auto 2.8rem',
              lineHeight: 1.9
            }}>
              Debate diplomático, resoluciones y formación en política global en un entorno competitivo de alto nivel.
            </p>

            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <a href="#inscripcion" className="btn-primary">
                Inscribirse como delegado →
              </a>
              <a href="/eventos" className="btn-secondary">
                Ver calendario
              </a>
            </div>

          </div>

        </div>

      </section>

      {/* Stats */}
      <section style={{ padding: '3.5rem 0', background: 'rgba(9,28,54,0.3)', borderTop: '1px solid rgba(255,255,255,0.05)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <div className="max-w-7xl mx-auto px-6 lg:px-12" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '2rem' }}>
          {[
            { num: '12', label: 'Comités activos' },
            { num: '120+', label: 'Delegados por edición' },
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
            Comités 2026
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {committees.map((c) => (
              <Link
                key={c.abbr}
                href={`/mun/comite/${c.slug}`}
                style={{ textDecoration: 'none' }}
              >
                <div
                  className="glass glass-hover"
                  style={{
                    padding: '1.75rem 2rem',
                    display: 'grid',
                    gridTemplateColumns: '80px 1fr 1fr auto',
                    gap: '2rem',
                    alignItems: 'center',
                    cursor: 'pointer'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {(() => {
                      const getCommitteeLogo = (abbr: string) => {
                        switch (abbr) {
                          case 'CSNU':
                            return '/unsc.svg'

                          case 'AGONU':
                            return '/agun.svg'

                          case 'ECOSOC':
                            return '/ecosoc.svg'

                          case 'UNHRC':
                          case 'UNHRC ESP':
                            return '/unhrc.svg'

                          case 'UNHRC ENG':
                            return '/unhrcenglish.svg'

                          case 'PCC':
                            return '/pcc.svg'

                          case 'ONU Mujeres':
                            return '/onumujeres.svg'

                          case 'OEA':
                            return '/oea.svg'

                          case 'OMS':
                            return '/oms.svg'

                          case 'DISEC':
                            return '/DISEC.svg'

                          case 'TPA':
                            return '/tpa.svg'

                          default:
                            return null
                        }
                      }

                      const logo = getCommitteeLogo(c.abbr)

                      return logo ? (
                        <img
                          src={logo}
                          alt={c.abbr}
                          style={{
                            width: '102px',
                            height: '102px',
                            objectFit: 'contain',
                          }}
                        />
                      ) : (
                        <span
                          style={{
                            fontFamily: 'var(--font-cormorant)',
                            fontSize: '1rem',
                            fontWeight: 600,
                            color: '#d4af37',
                            letterSpacing: '0.08em',
                          }}
                        >
                          {c.abbr}
                        </span>
                      )
                    })()}
                  </div>
                  <div>
                    <p style={{ fontFamily: 'var(--font-outfit)', fontSize: '0.9rem', fontWeight: 500, color: '#fff' }}>{c.name}</p>
                    <p style={{ fontFamily: 'var(--font-outfit)', fontSize: '0.75rem', color: 'rgba(255,255,255,0.35)' }}>{c.topics.join(' · ')}</p>
                  </div>
                  <span style={{ fontFamily: 'var(--font-outfit)', fontSize: '0.72rem', fontWeight: 500, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(184,150,12,0.65)' }}>{c.level}</span>
                  <span style={{ fontFamily: 'var(--font-outfit)', fontSize: '0.8rem', color: 'rgba(255,255,255,0.3)', whiteSpace: 'nowrap' }}>{c.seats} asientos</span>
                </div>
              </Link>
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
          <Link href="/mun#inscripcion" className="btn-primary">Inscribirse como delegado MUN →</Link>
        </div>
      </section>
    </Layout>
  )
}
