"use client"

import Link from "next/link"
import { useReveal } from "@/components/ui/pw-reveal"
import { pwStyles } from "@/components/ui/pw-styles"

const badges = [
  { n: "3", l: "Grupos", icon: "M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" },
  { n: "20", l: "Vacantes", icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.288-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.288.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" },
  { n: "Presencial", l: "Modalidad", icon: "M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" },
  { n: "Certificación", l: "Oficial", icon: "M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" },
]

const skills = [
  { title: "Voz", desc: "Técnicas de proyección, modulación, ritmo y pausa. Aprende a usar tu voz como instrumento de persuasión.", icon: "M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" },
  { title: "Presencia Escénica", desc: "Domina el escenario: postura, gestualidad, mirada y movimiento. Construye autoridad desde tu presencia física.", icon: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" },
  { title: "Comunicación Verbal", desc: "Estructura tu discurso: apertura, desarrollo, cierre. Aprende a organizar ideas con claridad y fluidez.", icon: "M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" },
  { title: "Comunicación No Verbal", desc: "Alinea tu cuerpo con tu mensaje: gestos, expresiones faciales y lenguaje corporal que refuercen tu discurso.", icon: "M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" },
  { title: "Manejo del Público", desc: "Conecta con tu audiencia: lectura del ambiente, manejo de preguntas, improvisación y control del espacio.", icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.288-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.288.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" },
]

const steps = [
  { n: "01", title: "Diagnóstico", desc: "Evaluación inicial de habilidades oratorias para identificar fortalezas, áreas de mejora y establecer una línea de base personal." },
  { n: "02", title: "Técnicas", desc: "Sesiones enfocadas en técnica vocal, lenguaje corporal, estructura del discurso y manejo escénico con ejercicios especializados." },
  { n: "03", title: "Práctica Escénica", desc: "Presentaciones frente al grupo con retroalimentación inmediata. Cada participante desarrolla su propio estilo oratorio." },
  { n: "04", title: "Feedback", desc: "Retroalimentación detallada y personalizada sobre cada aspecto de la presentación, con métricas concretas de mejora." },
  { n: "05", title: "Evaluación", desc: "Presentación final evaluada por instructores, con certificación oficial SoPeD que acredita tu nivel de competencia oratoria." },
]

const profiles = [
  { title: "Escolares", desc: "Estudiantes que desean perder el miedo escénico y comunicar sus ideas con claridad y confianza." },
  { title: "Universitarios", desc: "Alumnos que necesitan exponer con solidez en sustentaciones, presentaciones y actividades académicas." },
  { title: "Profesionales", desc: "Ejecutivos, emprendedores y líderes que deben comunicar con impacto en presentaciones de alto nivel." },
  { title: "Líderes", desc: "Personas que dirigen equipos y necesitan inspirar, motivar y transmitir visión a través de la palabra." },
  { title: "Jóvenes", desc: "Jóvenes interesados en desarrollar una habilidad diferenciadora para su futuro académico y profesional." },
]

const benefits = [
  { icon: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z", title: "Certificación Oficial SoPeD", desc: "Diploma que acredita tu formación en oratoria y comunicación de alto impacto." },
  { icon: "M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4", title: "Metodología Activa", desc: "Aprendizaje centrado en la práctica escénica con ejercicios, presentaciones y simulaciones de alto nivel." },
  { icon: "M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z M15 11a3 3 0 11-6 0 3 3 0 016 0z", title: "Sesiones Presenciales", desc: "Formación en vivo con instructores expertos y práctica frente a audiencia real en sede institucional." },
  { icon: "M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253", title: "Material Exclusivo", desc: "Guías de oratoria, ejercicios vocales, estructuras de discurso y recursos para práctica autónoma." },
]

export default function OratoriaPage() {
  useReveal()

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
                Elite Speaking Program
              </div>
              <h1 className="pw-hero-title">
                Oratoria <em>Workshop</em>
              </h1>
              <p className="pw-hero-sub">
                Un programa intensivo diseñado para formar speakers de alto impacto.
                Domina el escenario, persuade con autoridad y comunica tus ideas
                con seguridad en cualquier entorno.
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
            <h2 className="pw-h2">¿Qué es el<br /><em>Oratoria Workshop</em>?</h2>
            <p className="pw-body" style={{ maxWidth: 640 }}>
              Es un programa de formación intensiva en comunicación oral diseñado
              para transformar la manera en que te presentas frente a una audiencia.
              Trabajamos desde la técnica vocal hasta la presencia escénica, pasando
              por la estructura del discurso y el manejo del lenguaje no verbal.
            </p>
            <p className="pw-body" style={{ maxWidth: 640, marginTop: "1rem" }}>
              No se trata solo de hablar bien: se trata de comunicar con propósito,
              conectar con tu audiencia y generar impacto real en cada intervención.
              Cada sesión incluye práctica frente a grupo con retroalimentación
              inmediata y personalizada.
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
              <div key={s.title} className={`pw-skill-card glass glass-hover pw-reveal`}>
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
              Transforma tu manera de<br />
              <em>comunicar</em> y domina<br />
              el arte de la palabra
            </h2>
            <div className="pw-cta-rule" />
            <p className="pw-cta-desc">
              Vacantes limitadas por edición. Incluye certificación oficial
              SoPeD y material de práctica exclusivo.
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
