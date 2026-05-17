"use client"

import { useParams } from 'next/navigation'
import Layout from '@/components/layout/Layout'
import Image from 'next/image'

const committees: Record<string, any> = {
  CSNU: {
    name: 'Consejo de Seguridad',
    level: 'Avanzado',
    mode: 'Presencial',
    description:
      'Comité encargado de abordar amenazas a la paz y seguridad internacional mediante diplomacia, resoluciones, negociación estratégica y mecanismos de seguridad colectiva entre los Estados miembros.',
    logo: '/UNSC.svg',
  },

  AGONU: {
    name: 'Asamblea General',
    level: 'Intermedio',
    mode: 'Presencial',
    description:
      'Foro principal de deliberación multilateral de las Naciones Unidas enfocado en cooperación internacional, desarrollo sostenible y construcción de consensos frente a desafíos globales.',
    logo: '/AGONU.svg',
  },

  ECOSOC: {
    name: 'Consejo Económico y Social',
    level: 'Intermedio',
    mode: 'Presencial',
    description:
      'Órgano dedicado al análisis de políticas económicas y sociales internacionales, promoviendo cooperación multilateral, desarrollo sostenible y soluciones frente a desigualdades globales.',
    logo: '/ECOSOC.svg',
  },

  CRISIS: {
    name: 'Comité de Crisis Fantástica',
    level: 'Avanzado',
    mode: 'Presencial',
    description:
      'Comité dinámico de respuesta estratégica inmediata donde las decisiones diplomáticas, militares y políticas alteran constantemente el desarrollo de la simulación internacional.',
    logo: '/CRISIS.svg',
  },

  PCC: {
    name: 'Consejo de Contingencia Planetaria',
    level: 'Avanzado',
    mode: 'Presencial',
    description:
      'Espacio de coordinación internacional frente a amenazas planetarias, crisis globales y escenarios de contingencia extrema que requieren acción rápida y cooperación multilateral.',
    logo: '/PCC.svg',
  },

  ONUMUJERES: {
    name: 'ONU Mujeres',
    level: 'Intermedio',
    mode: 'Presencial',
    description:
      'Comité orientado al diseño de políticas internacionales sobre igualdad de género, inclusión, empoderamiento y protección de derechos fundamentales en distintos contextos globales.',
    logo: '/ONUMUJERES.svg',
  },

  OEA: {
    name: 'Organización de los Estados Americanos',
    level: 'Intermedio',
    mode: 'Presencial',
    description:
      'Foro regional centrado en democracia, derechos humanos y cooperación política entre los Estados americanos frente a desafíos hemisféricos contemporáneos.',
    logo: '/OEA.svg',
  },

  OMS: {
    name: 'Organización Mundial de la Salud',
    level: 'Intermedio',
    mode: 'Presencial',
    description:
      'Comité especializado en salud pública internacional, gestión sanitaria y respuesta coordinada ante emergencias epidemiológicas y desafíos globales de salud.',
    logo: '/OMS.svg',
  },

  DISEC: {
    name: 'Comité de Desarme y Seguridad Internacional',
    level: 'Intermedio–Avanzado',
    mode: 'Presencial',
    description:
      'Órgano enfocado en desarme, amenazas globales, conflictos internacionales y mecanismos multilaterales de seguridad y estabilidad internacional.',
    logo: '/DISEC.svg',
  },

  TPA: {
    name: 'Third Party Actors',
    level: 'Intermedio',
    mode: 'Presencial',
    description:
      'Comité compuesto por actores no estatales, medios y organizaciones con influencia estratégica capaz de alterar el desarrollo de conflictos y dinámicas internacionales.',
    logo: '/TPA.svg',
  },

  'UNHRC ENG': {
    name: 'UNHRC — English Committee',
    level: 'Avanzado',
    mode: 'Presencial',
    description:
      'Human rights committee focused on international legal analysis, diplomatic negotiation, humanitarian protection, and contemporary global human rights challenges.',
    logo: '/UNHRCENGLISH.svg',
  },

  'UNHRC ESP': {
    name: 'UNHRC — Español',
    level: 'Intermedio',
    mode: 'Virtual',
    description:
      'Comité orientado al debate jurídico y diplomático sobre protección internacional de los derechos humanos y mecanismos multilaterales de supervisión internacional.',
    logo: '/UNHRC.svg',
  },
}

export default function CommitteePage() {
  const params = useParams()
  const abbr = params.abbr as string

  const committee = committees[abbr]

  if (!committee) {
    return (
      <Layout>
        <div style={{ padding: '8rem 2rem', textAlign: 'center' }}>
          <h1 style={{ color: '#fff' }}>Comité no encontrado</h1>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <section
        style={{
          padding: '9rem 0 6rem',
          minHeight: '100vh',
          background:
            'radial-gradient(circle at top right, rgba(212,175,55,0.08), transparent 28%)',
        }}
      >
        <div className="max-w-6xl mx-auto px-6 lg:px-12">

          {/* HEADER */}
          <div
            className="glass"
            style={{
              padding: '4rem',
              marginBottom: '2.5rem',
              border: '1px solid rgba(255,255,255,0.06)',
              background: 'linear-gradient(180deg, rgba(255,255,255,0.03), rgba(255,255,255,0.02))',
              backdropFilter: 'blur(14px)',
              WebkitBackdropFilter: 'blur(14px)',
              boxShadow: '0 20px 60px rgba(0,0,0,0.28)',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                position: 'absolute',
                right: '-120px',
                top: '50%',
                transform: 'translateY(-50%)',
                width: '520px',
                height: '520px',
                opacity: 0.035,
                pointerEvents: 'none',
                zIndex: 0,
                overflow: 'hidden',
                display: 'flex',
                justifyContent: 'flex-start',
                alignItems: 'center',
              }}
            >
              <Image
                src="/soped.svg"
                alt="SoPeD"
                width={520}
                height={520}
                unoptimized
                style={{
                  objectFit: 'contain',
                  width: '520px',
                  height: '520px',
                  marginLeft: '-260px',
                }}
              />
            </div>
            <p
              style={{
                color: '#d4af37',
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                fontSize: '0.8rem',
                marginBottom: '1rem',
                position: 'relative',
                zIndex: 2,
              }}
            >
              {abbr}
            </p>

            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                gap: '2rem',
                marginBottom: '2rem',
                flexWrap: 'wrap',
              }}
            >
              <div
                style={{
                  flex: 1,
                  minWidth: '280px',
                  position: 'relative',
                  zIndex: 2,
                }}
              >
                <h1
                  style={{
                    fontFamily: 'var(--font-cormorant)',
                    fontSize: '4.5rem',
                    lineHeight: 1,
                    letterSpacing: '-0.03em',
                    color: '#fff',
                    marginBottom: '0.8rem',
                  }}
                >
                  {committee.name}
                </h1>

                <p
                  style={{
                    color: 'rgba(255,255,255,0.45)',
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    fontSize: '0.78rem',
                  }}
                >
                  SoPeD MUN 2026 Committee
                </p>
                <p
                  style={{
                    color: 'rgba(255,255,255,0.7)',
                    lineHeight: 1.8,
                    maxWidth: '700px',
                    marginTop: '1.2rem',
                    position: 'relative',
                    zIndex: 2,
                    fontSize: '1rem',
                  }}
                >
                  {committee.description}
                </p>
              </div>

              <div
                style={{
                  width: '220px',
                  height: '220px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  opacity: 0.95,
                  position: 'relative',
                  marginLeft: '-1rem',
                  zIndex: 2,
                }}
              >
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    borderRadius: '50%',
                    background: 'rgba(212,175,55,0.06)',
                    filter: 'blur(30px)',
                  }}
                />

                <Image
                  src={committee.logo}
                  alt={committee.name}
                  width={200}
                  height={200}
                  priority
                  unoptimized
                  style={{
                    objectFit: 'contain',
                    width: '200px',
                    height: '200px',
                    position: 'relative',
                    zIndex: 1,
                  }}
                />
              </div>
            </div>

            <div
              style={{
                display: 'flex',
                gap: '1rem',
                marginTop: '2rem',
                flexWrap: 'wrap',
              }}
            >
              <span
                className="glass"
                style={{
                  padding: '0.9rem 1.15rem',
                  borderRadius: '14px',
                  border: '1px solid rgba(255,255,255,0.06)',
                  background: 'rgba(255,255,255,0.03)',
                  color: 'rgba(255,255,255,0.82)',
                  fontSize: '0.92rem',
                  backdropFilter: 'blur(10px)',
                }}
              >
                Nivel: {committee.level}
              </span>

              <span
                className="glass"
                style={{
                  padding: '0.9rem 1.15rem',
                  borderRadius: '14px',
                  border: '1px solid rgba(255,255,255,0.06)',
                  background: 'rgba(255,255,255,0.03)',
                  color: 'rgba(255,255,255,0.82)',
                  fontSize: '0.92rem',
                  backdropFilter: 'blur(10px)',
                }}
              >
                Modalidad: {committee.mode}
              </span>
            </div>
          </div>

          {/* CONTENT GRID */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '1.5rem',
            }}
          >
            {[
              'Guía de estudio',
              'Background Guide',
              'Reglas del comité',
              'Países y representaciones',
              'Position Paper',
              'Criterios de evaluación',
            ].map((item) => (
              <div
                key={item}
                className="glass glass-hover"
                style={{
                  padding: '2rem',
                  minHeight: '180px',
                  cursor: 'pointer',
                }}
              >
                <h3
                  style={{
                    color: '#fff',
                    marginBottom: '1rem',
                    fontSize: '1.1rem',
                  }}
                >
                  {item}
                </h3>

                <p
                  style={{
                    color: 'rgba(255,255,255,0.45)',
                    lineHeight: 1.7,
                    fontSize: '0.9rem',
                  }}
                >
                  Próximamente disponible para este comité.
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  )
}