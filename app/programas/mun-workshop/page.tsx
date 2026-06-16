"use client"

import Link from "next/link"
import { useReveal } from "@/components/ui/pw-reveal"
import { pwStyles } from "@/components/ui/pw-styles"

const badges = [
  { n: "3", l: "Grupos", icon: "M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" },
  { n: "20", l: "Vacantes", icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.288-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.288.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" },
  { n: "Presencial", l: "Modalidad", icon: "M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" },
  { n: "Certificación", l: "Académica", icon: "M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" },
]

const skills = [
  { title: "Reglas de Procedimiento", desc: "Domina el flujo de una sesión MUN: mociones, puntos, votaciones y protocolo diplomático.", icon: "M13 10V3L4 14h7v7l9-11h-7z" },
  { title: "Redacción Diplomática", desc: "Aprende a redactar documentos oficiales, resoluciones, enmiendas y notas de posición con lenguaje diplomático.", icon: "M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" },
  { title: "Negociación", desc: "Desarrolla estrategias de negociación bilateral y multilateral para construir consensos y alianzas en comité.", icon: "M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" },
  { title: "Resolución de Conflictos", desc: "Aplica técnicas de mediación y resolución para gestionar crisis, diferencias y bloqueos dentro del comité.", icon: "M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" },
  { title: "Estrategia en Comité", desc: "Planifica tu participación: posicionamiento, alianzas, timing de intervenciones y liderazgo dentro del comité.", icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" },
]

const steps = [
  { n: "01", title: "Fundamentos", desc: "Introducción al sistema MUN: estructura de comités, roles, reglamento y documentación básica." },
  { n: "02", title: "Práctica Guiada", desc: "Sesiones dirigidas donde aplicas los conceptos en ejercicios controlados con retroalimentación inmediata." },
  { n: "03", title: "Simulación", desc: "Comité simulado completo con delegaciones asignadas, tópico real y crisis controlada." },
  { n: "04", title: "Retroalimentación", desc: "Análisis detallado de desempeño por parte de instructores con experiencia competitiva nacional." },
  { n: "05", title: "Evaluación", desc: "Cierre con evaluación individualizada y certificación académica que acredita tu formación." },
]

const profiles = [
  { title: "Escolares", desc: "Estudiantes de secundaria que buscan iniciar su formación en debate y diplomacia." },
  { title: "Universitarios", desc: "Alumnos de pregrado interesados en relaciones internacionales y política pública." },
  { title: "Líderes Estudiantiles", desc: "Dirigentes que desean fortalecer su capacidad de negociación y oratoria formal." },
  { title: "Futuros Delegados", desc: "Jóvenes que planean representar a su institución en conferencias MUN nacionales." },
  { title: "Interesados en Política Pública", desc: "Personas que buscan comprender los mecanismos de la diplomacia multilateral." },
]

const benefits = [
  { icon: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z", title: "Certificación Oficial", desc: "Diploma a nombre de SoPeD que acredita tu formación en diplomacia." },
  { icon: "M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4", title: "Metodología Activa", desc: "Aprendizaje basado en simulación y práctica, no en clases teóricas tradicionales." },
  { icon: "M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z M15 11a3 3 0 11-6 0 3 3 0 016 0z", title: "Sesiones Presenciales", desc: "Clases en sede institucional con formación en vivo y networking entre participantes." },
  { icon: "M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253", title: "Material Exclusivo", desc: "Guías, plantillas y recursos diseñados por instructores con experiencia internacional." },
]

export default function MUNWorkshopPage() {
  const ready = useReveal()

  return (
    <div className="pw-page">
      {/* ── HERO ── */}
      <section className="pw-hero">
        <div className="pw-hero-bg" />
        <div className="pw-container">
          <div className="pw-hero-inner">
            <div className="pw-hero-left pw-reveal">
              <div className="pw-eyebrow">
                <span className="pw-eyebrow-line" />
                Programa de Formación Diplomática
              </div>
              <h1 className="pw-hero-title">
                MUN <em>Workshop</em>
              </h1>
              <p className="pw-hero-sub">
                Un programa intensivo diseñado para formar delegados completos:
                domina las reglas de procedimiento, la redacción diplomática,
                la negociación multilateral y la estrategia en comité.
              </p>
              <div className="pw-hero-actions">
                <Link href="/inscripcion" className="btn-primary">
                  Inscribirme ahora
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
                </Link>
                <Link href="/programas" className="btn-secondary">
                  Ver todos los programas
                </Link>
              </div>
            </div>
            <div className="pw-hero-right pw-reveal">
              <div className="pw-badge-grid">
                {badges.map((b) => (
                  <div key={b.n} className="pw-badge-card glass glass-hover">
                    <svg className="pw-badge-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d={b.icon} /></svg>
                    <span className="pw-badge-n">{b.n}</span>
                    <span className="pw-badge-l">{b.l}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── WHAT ── */}
      <section className="pw-section">
        <div className="pw-container">
          <div className="pw-reveal">
            <div className="pw-eyebrow"><span className="pw-eyebrow-line" />Sobre el Programa</div>
            <h2 className="pw-h2">¿Qué es el<br /><em>MUN Workshop</em>?</h2>
            <p className="pw-body" style={{ maxWidth: 640 }}>
              Es un programa de formación intensiva donde los participantes aprenden
              el sistema completo de Modelos de Naciones Unidas desde cero. No se trata
              de teoría abstracta: cada sesión está diseñada para simular las condiciones
              reales de un comité, con delegaciones, resoluciones, crisis y negociaciones
              multilaterales.
            </p>
            <p className="pw-body" style={{ maxWidth: 640, marginTop: "1rem" }}>
              Al finalizar, los participantes no solo conocen las reglas: han negociado,
              redactado documentos diplomáticos, enfrentado crisis y recibido
              retroalimentación individualizada de instructores con experiencia
              competitiva nacional.
            </p>
          </div>
        </div>
      </section>

      {/* ── SKILLS ── */}
      <section className="pw-section pw-section-dark">
        <div className="pw-container">
          <div className="pw-reveal">
            <div className="pw-eyebrow"><span className="pw-eyebrow-line" />Habilidades</div>
            <h2 className="pw-h2">¿Qué <em>aprenderás</em>?</h2>
          </div>
          <div className="pw-skills-grid">
            {skills.map((s, i) => (
              <div key={s.title} className={`pw-skill-card glass glass-hover pw-reveal`} style={{ animationDelay: `${i * 0.08}s` }}>
                <div className="pw-skill-icon-wrap">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d={s.icon} /></svg>
                </div>
                <h3 className="pw-skill-title">{s.title}</h3>
                <p className="pw-skill-desc">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── EXPERIENCE ── */}
      <section className="pw-section">
        <div className="pw-container">
          <div className="pw-reveal">
            <div className="pw-eyebrow"><span className="pw-eyebrow-line" />Experiencia Formativa</div>
            <h2 className="pw-h2">Cómo se <em>desarrolla</em></h2>
          </div>
          <div className="pw-timeline">
            {steps.map((s, i) => (
              <div key={s.n} className={`pw-step pw-reveal`}>
                <div className="pw-step-dot-wrap">
                  <div className="pw-step-dot">{s.n}</div>
                  {i < steps.length - 1 && <div className="pw-step-line" />}
                </div>
                <div className="pw-step-content">
                  <h3 className="pw-step-title">{s.title}</h3>
                  <p className="pw-step-desc">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PROFILE ── */}
      <section className="pw-section pw-section-dark">
        <div className="pw-container">
          <div className="pw-reveal">
            <div className="pw-eyebrow"><span className="pw-eyebrow-line" />Perfil del Participante</div>
            <h2 className="pw-h2">Ideal <em>para</em></h2>
          </div>
          <div className="pw-profile-grid">
            {profiles.map((p, i) => (
              <div key={p.title} className={`pw-profile-card glass glass-hover pw-reveal`}>
                <div className="pw-profile-index">0{i + 1}</div>
                <h3 className="pw-profile-title">{p.title}</h3>
                <p className="pw-profile-desc">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── BENEFITS ── */}
      <section className="pw-section">
        <div className="pw-container">
          <div className="pw-reveal">
            <div className="pw-eyebrow"><span className="pw-eyebrow-line" />Beneficios</div>
            <h2 className="pw-h2">¿Por qué <em>participar</em>?</h2>
          </div>
          <div className="pw-benefits-grid">
            {benefits.map((b, i) => (
              <div key={b.title} className={`pw-benefit-card pw-reveal`}>
                <div className="pw-benefit-icon-wrap">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d={b.icon} /></svg>
                </div>
                <h3 className="pw-benefit-title">{b.title}</h3>
                <p className="pw-benefit-desc">{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="pw-cta-section">
        <div className="pw-cta-glow" />
        <div className="pw-container" style={{ position: "relative", zIndex: 1 }}>
          <div className="pw-cta-inner pw-reveal">
            <h2 className="pw-cta-title">
              Forma parte de la<br />
              próxima generación de<br />
              <em>delegados</em>
            </h2>
            <div className="pw-cta-rule" />
            <p className="pw-cta-desc">
              Vacantes limitadas por edición. La formación incluye certificación
              oficial SoPeD y material de trabajo exclusivo.
            </p>
            <Link href="/inscripcion" className="btn-primary" style={{ fontSize: "0.8rem" }}>
              Inscribirme al programa
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
            </Link>
          </div>
        </div>
      </section>

      <style jsx>{pwStyles}</style>
    </div>
  )
}
