'use client'

import { useState } from 'react'
import IntroLoader from '@/components/home/IntroLoader'
import Layout from '@/components/layout/Layout'
import Hero from '@/components/home/Hero'
import Link from 'next/link'

const programs = [
  {
    title: 'SoPeD MUN',
    tag: 'Competitivo Internacional',
    description: 'Modelo de Naciones Unidas de nivel internacional. Debate diplomático, resoluciones y formación en política global.',
    href: '/mun',
  },
  {
    title: 'Debate Escolar',
    tag: 'Programa Educativo',
    description: 'Programa integral de debate para estudiantes de secundaria. Oratoria, argumentación y pensamiento crítico.',
    href: '/debate-escolar',
  },
  {
    title: 'Talleres & Formación',
    tag: 'Desarrollo Académico',
    description: 'Talleres especializados en argumentación, oratoria, investigación y liderazgo académico.',
    href: '/programas',
  },
]

export default function HomePage() {
  const [introComplete, setIntroComplete] = useState(false)

  if (!introComplete) {
    return <IntroLoader onComplete={() => setIntroComplete(true)} />
  }

  return (
    <Layout>
      <Hero />

      {/* Programs Section */}
      <section style={{ padding: '6rem 0', background: 'var(--darker)' }}>
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div style={{ marginBottom: '3.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
              <span className="deco-line" />
              <span style={{ fontFamily: 'var(--font-outfit)', fontSize: '0.65rem', fontWeight: 500, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(184,150,12,0.7)' }}>
                Nuestros Programas
              </span>
            </div>
            <h2 style={{ fontFamily: 'var(--font-cormorant)', fontSize: 'clamp(2rem, 4vw, 3.2rem)', fontWeight: 400, color: '#fff', maxWidth: '500px', lineHeight: 1.15 }}>
              Formación académica de élite
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
            {programs.map((p, i) => (
              <div key={i} className="glass glass-hover" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <span style={{ fontFamily: 'var(--font-outfit)', fontSize: '0.62rem', fontWeight: 500, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(184,150,12,0.7)', border: '1px solid rgba(184,150,12,0.2)', padding: '0.2rem 0.6rem', alignSelf: 'flex-start' }}>
                  {p.tag}
                </span>
                <h3 style={{ fontFamily: 'var(--font-cormorant)', fontSize: '1.6rem', fontWeight: 500, color: '#fff' }}>{p.title}</h3>
                <p style={{ fontFamily: 'var(--font-outfit)', fontSize: '0.875rem', color: 'rgba(255,255,255,0.45)', lineHeight: 1.7, flex: 1 }}>{p.description}</p>
                <Link href={p.href} className="btn-text">Explorar programa →</Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why SoPeD */}
      <section style={{ padding: '6rem 0' }}>
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '5rem', alignItems: 'center' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                <span className="deco-line" />
                <span style={{ fontFamily: 'var(--font-outfit)', fontSize: '0.65rem', fontWeight: 500, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(184,150,12,0.7)' }}>
                  Por qué SoPeD
                </span>
              </div>
              <h2 style={{ fontFamily: 'var(--font-cormorant)', fontSize: 'clamp(2rem, 3.5vw, 3rem)', fontWeight: 400, color: '#fff', lineHeight: 1.15, marginBottom: '1.5rem' }}>
                Más que debate.<br />
                <em style={{ fontStyle: 'italic', color: 'rgba(184,150,12,0.8)' }}>Una formación completa.</em>
              </h2>
              <p style={{ fontFamily: 'var(--font-outfit)', fontSize: '0.95rem', color: 'rgba(255,255,255,0.45)', lineHeight: 1.8, marginBottom: '2rem' }}>
                SoPeD es la plataforma académica líder en debate competitivo del Perú. Formamos estudiantes con pensamiento crítico avanzado, capacidad argumentativa y liderazgo intelectual.
              </p>
              <Link href="/nosotros" className="btn-secondary">Conocer la institución</Link>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {[
                { title: 'Metodología probada', desc: 'Técnicas de debate parlamentario y diplomático adaptadas al contexto latinoamericano.' },
                { title: 'Mentores especializados', desc: 'Formadores con experiencia en competencias nacionales e internacionales.' },
                { title: 'Red académica', desc: 'Comunidad de exalumnos activos en universidades de élite del Perú y el mundo.' },
                { title: 'Reconocimientos oficiales', desc: 'Certificaciones válidas y reconocidas por instituciones educativas.' },
              ].map((item, i) => (
                <div key={i} className="glass" style={{ padding: '1.25rem 1.5rem', display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                  <span style={{ color: '#b8960c', fontSize: '0.7rem', marginTop: '3px', flexShrink: 0 }}>✦</span>
                  <div>
                    <p style={{ fontFamily: 'var(--font-outfit)', fontSize: '0.88rem', fontWeight: 500, color: '#fff', marginBottom: '0.25rem' }}>{item.title}</p>
                    <p style={{ fontFamily: 'var(--font-outfit)', fontSize: '0.8rem', color: 'rgba(255,255,255,0.35)', lineHeight: 1.6 }}>{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section style={{ padding: '5rem 0', background: 'linear-gradient(135deg, rgba(9,28,54,0.8), rgba(5,7,13,0.9))' }}>
        <div className="max-w-7xl mx-auto px-6 lg:px-12 text-center">
          <p style={{ fontFamily: 'var(--font-outfit)', fontSize: '0.65rem', fontWeight: 500, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(184,150,12,0.7)', marginBottom: '1rem' }}>
            Únete a SoPeD
          </p>
          <h2 style={{ fontFamily: 'var(--font-cormorant)', fontSize: 'clamp(2.5rem, 4vw, 3.5rem)', fontWeight: 400, color: '#fff', marginBottom: '1.5rem', lineHeight: 1.1 }}>
            El debate que transforma.
          </h2>
          <p style={{ fontFamily: 'var(--font-outfit)', fontSize: '1rem', color: 'rgba(255,255,255,0.4)', maxWidth: '480px', margin: '0 auto 2.5rem', lineHeight: 1.75 }}>
            Inscríbete en nuestros programas y comienza tu formación académica de élite.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/inscripcion" className="btn-primary">Inscribirse ahora →</Link>
            <Link href="/eventos" className="btn-secondary">Ver eventos</Link>
          </div>
        </div>
      </section>
    </Layout>
  )
}
