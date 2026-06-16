"use client"

import Link from "next/link"
import { useReveal } from "@/components/ui/pw-reveal"
import { pwStyles } from "@/components/ui/pw-styles"

const badges = [
  { n: "3", l: "Grupos", icon: "M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" },
  { n: "20", l: "Vacantes", icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.288-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.288.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" },
  { n: "Presencial", l: "Modalidad", icon: "M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" },
  { n: "Certificación", l: "SoPeD", icon: "M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" },
]

const skills = [
  { title: "Construcción Argumentativa", desc: "Aprende a estructurar argumentos sólidos con premisas, evidencia y conclusión. La base de todo discurso persuasivo.", icon: "M4 5h16M4 12h16m-7 7h7" },
  { title: "Falacias", desc: "Identifica y contrarresta los errores lógicos más comunes en el debate. Desarma malos argumentos con precisión.", icon: "M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" },
  { title: "Persuasión", desc: "Domina las técnicas de persuasión ética: ethos, pathos y logos aplicados a contextos formales y competitivos.", icon: "M7 8h10M7 12h8m-4 4h-2" },
  { title: "Retórica", desc: "Desarrolla dominio de las figuras retóricas, el lenguaje figurado y la elegancia verbal para causar impacto.", icon: "M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" },
  { title: "Pensamiento Crítico", desc: "Entrena tu capacidad de análisis, cuestionamiento y síntesis. Evalúa argumentos con rigor y objetividad.", icon: "M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" },
]

const steps = [
  { n: "01", title: "Fundamentos Teóricos", desc: "Introducción a la teoría de la argumentación: estructura lógica, tipos de razonamiento y principios de la retórica clásica." },
  { n: "02", title: "Ejercicios Guiados", desc: "Práctica dirigida de construcción de argumentos, identificación de falacias y aplicación de técnicas persuasivas en ejercicios controlados." },
  { n: "03", title: "Debates Controlados", desc: "Enfrentamientos argumentativos estructurados donde aplicas lo aprendido en un entorno competitivo supervisado." },
  { n: "04", title: "Feedback Estructurado", desc: "Análisis detallado de tu desempeño argumentativo con retroalimentación personalizada de instructores especializados." },
  { n: "05", title: "Evaluación y Certificación", desc: "Cierre con evaluación integral de habilidades argumentativas y certificación oficial de SoPeD." },
]

const profiles = [
  { title: "Escolares", desc: "Estudiantes que desean desarrollar pensamiento crítico y表达能力 argumentativa desde etapas tempranas." },
  { title: "Universitarios", desc: "Alumnos de pregrado que buscan herramientas de persuasión para su vida académica y profesional." },
  { title: "Profesionales", desc: "Ejecutivos, abogados, comunicadores y líderes que necesitan argumentar con solidez en su ámbito laboral." },
  { title: "Comunicadores", desc: "Periodistas, creadores de contenido y voceros que requieren dominar la argumentación pública." },
  { title: "Líderes", desc: "Dirigentes estudiantiles, políticos y sociales que deben defender ideas con claridad y convicción." },
]

const benefits = [
  { icon: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z", title: "Certificación SoPeD", desc: "Diploma oficial que acredita tu formación en argumentación y pensamiento crítico." },
  { icon: "M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4", title: "Metodología Activa", desc: "Aprendizaje basado en la práctica argumentativa, no en teoría pasiva. Cada sesión incluye ejercicios aplicados." },
  { icon: "M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z M15 11a3 3 0 11-6 0 3 3 0 016 0z", title: "Sesiones Presenciales", desc: "Formación en sede institucional con debates en vivo y retroalimentación inmediata de instructores." },
  { icon: "M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253", title: "Material Exclusivo", desc: "Guías de argumentación, repertorio de falacias, casos de estudio y ejercicios diseñados por instructores." },
]

export default function ArgumentacionPage() {
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
                Programa de Oratoria Estratégica
              </div>
              <h1 className="pw-hero-title">
                Argumentación &amp;<br /><em>Persuasión</em>
              </h1>
              <p className="pw-hero-sub">
                Un programa diseñado para desarrollar pensamiento crítico,
                dominio de la retórica y la capacidad de persuadir con
                argumentos sólidos en cualquier contexto.
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
            <h2 className="pw-h2">¿Qué es el Taller de<br /><em>Argumentación y Persuasión</em>?</h2>
            <p className="pw-body" style={{ maxWidth: 640 }}>
              Es un programa intensivo que forma a los participantes en las técnicas
              fundamentales de la argumentación formal y la persuasión estratégica.
              Trabajamos desde las bases de la lógica aristotélica hasta las estrategias
              de persuasión más sofisticadas, siempre con un enfoque práctico y aplicado.
            </p>
            <p className="pw-body" style={{ maxWidth: 640, marginTop: "1rem" }}>
              Cada sesión combina teoría con ejercicios de debate controlado donde
              los participantes ponen a prueba su capacidad de construir, defender
              y refutar argumentos en tiempo real.
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
              Desarrolla el poder de<br />
              <em>argumentar</em> con claridad<br />
              y persuadir con integridad
            </h2>
            <div className="pw-cta-rule" />
            <p className="pw-cta-desc">
              Vacantes limitadas por edición. Incluye certificación oficial
              SoPeD y material de trabajo exclusivo.
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
