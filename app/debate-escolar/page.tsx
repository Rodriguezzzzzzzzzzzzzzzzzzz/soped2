"use client";

import { useEffect, useRef, useState } from "react";
import "./debate-escolar.css";

export default function DebateEscolarPage() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch(() => {});
    }
  }, []);

  useEffect(() => {
    function reveal() {
      const els = document.querySelectorAll(".reveal");
      els.forEach((el) => {
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight - 80) {
          el.classList.add("visible");
        }
      });
    }

    window.addEventListener("scroll", reveal, { passive: true });
    reveal();

    return () => {
      window.removeEventListener("scroll", reveal);
    };
  }, []);

  return (
    <>

      <nav className="nav">
        <a href="/" className="nav-logo">SoPeD <span>Debate</span></a>
        <ul className="nav-links">
          <li><a href="/">Inicio</a></li>
          <li><a href="/mun">MUN</a></li>
          <li><a href="/debate-escolar">SoPeDebate</a></li>
          <li><a href="/comunidad">Comunidad</a></li>
        </ul>
        <a href="inscripcion" className="nav-cta">Inscribirse</a>
      </nav>

      <section className="hero">
        <video
          ref={videoRef}
          className="hero-video"
          autoPlay
          muted
          loop
          playsInline
          src="/DEBATEFONDOVIDEO.mp4"
        />
        <div className="hero-overlay" />
        <div className="hero-fade" />

        <div className="hero-content">
          <div className="hero-eyebrow">
            Sociedad Peruana de Debate · Edición Anual
          </div>
          <h1 className="hero-title">
            SoPe<em>Debate</em>
          </h1>
          <span className="hero-title-accent">
            Concurso de Debate Académico
          </span>
          <p className="hero-desc">
            El evento competitivo central de la Sociedad Peruana de Debate. Cada año,
            las instituciones educativas más destacadas del país envían a sus mejores
            debatientes a disputar rondas de argumentación formal, oratoria y análisis
            crítico ante un panel de jueces especializados.
          </p>
          <div className="hero-actions">
            <a href="inscripcion" className="btn-primary">Inscribirse al Concurso</a>
            <a href="#ediciones" className="btn-secondary">Ver Ediciones Anteriores</a>
          </div>
        </div>
      </section>

      <div className="stats-strip">
        {[
          { n: "12+", l: "Ediciones Nacionales" },
          { n: "200+", l: "Instituciones Participantes" },
          { n: "1,500+", l: "Debatientes por Año" },
          { n: "3", l: "Niveles de Competencia" },
        ].map((s) => (
          <div key={s.l} className="stat-item">
            <span className="stat-number">{s.n}</span>
            <span className="stat-label">{s.l}</span>
          </div>
        ))}
      </div>

      <section>
        <div className="section-inner">
          <div className="section-label">Sobre el Concurso</div>
          <div className="what-grid">
            <div>
              <h2 className="section-title">
                Una competencia<br /><em>de alcance nacional</em>
              </h2>
              <p className="section-body">
                SoPeDebate es el concurso anual oficial de debate académico organizado
                por la Sociedad Peruana de Debate. Concebido bajo los más altos
                estándares de la competencia internacional, el torneo convoca a
                estudiantes de nivel secundario de todo el territorio peruano para
                disputar en un formato estructurado de argumentación parlamentaria.
              </p>
              <p className="section-body" style={{ marginTop: "1rem" }}>
                A diferencia de los programas de formación, SoPeDebate es una plataforma
                competitiva donde la preparación técnica, la capacidad analítica y la
                solidez argumentativa determinan el avance de cada equipo. El concurso
                es evaluado por un panel de jueces con trayectoria en debate
                nacional e internacional.
              </p>
            </div>
            <div className="what-pillars">
              {[
                {
                  icon: "I",
                  title: "Competencia Formal",
                  desc: "Estructura basada en reglamentos internacionales de debate parlamentario adaptados al contexto académico peruano.",
                },
                {
                  icon: "II",
                  title: "Panel de Jueces Certificados",
                  desc: "Cada ronda es evaluada por jueces con formación en debate universitario, asegurando criterios objetivos y profesionales.",
                },
                {
                  icon: "III",
                  title: "Representación Institucional",
                  desc: "Los equipos compiten bajo el nombre de su institución educativa, construyendo un legado académico a lo largo de las ediciones.",
                },
                {
                  icon: "IV",
                  title: "Reconocimiento",
                  desc: "Los ganadores reciben certificación oficial de SoPeD y son registrados en el historial competitivo de la sociedad.",
                },
              ].map((p) => (
                <div key={p.title} className="pillar reveal">
                  <div className="pillar-icon">{p.icon}</div>
                  <div>
                    <div className="pillar-title">{p.title}</div>
                    <div className="pillar-desc">{p.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="categories-bg">
        <div className="section-inner">
          <div className="section-label">Niveles de Competencia</div>
          <h2 className="section-title">
            Categorías del<br /><em>Torneo</em>
          </h2>
          <p className="section-body">
            SoPeDebate opera bajo un sistema de tres categorías que distinguen
            el nivel de desarrollo técnico de los participantes. Cada categoría
            establece sus propios estándares de evaluación y complejidad argumentativa.
          </p>
          <div className="categories-grid">
            {[
              {
                badge: "Categoría A",
                level: "Nivel Iniciación",
                sub: "1.° — 2.° de Secundaria",
                desc: "Diseñado para debatientes en su primera experiencia competitiva formal. El énfasis se sitúa en la construcción coherente de argumentos, el uso de evidencia básica y la presentación oral estructurada.",
                skills: [
                  "Construcción de argumento central",
                  "Manejo del tiempo y turno de palabra",
                  "Refutación directa básica",
                  "Expresión oral y dicción formal",
                ],
              },
              {
                badge: "Categoría B",
                level: "Nivel Intermedio",
                sub: "3.° — 4.° de Secundaria",
                desc: "Para debatientes con experiencia previa en competencias formales. Se exigen argumentos estructurados, uso de evidencia calificada, refutaciones elaboradas y manejo efectivo de la réplica.",
                skills: [
                  "Argumentación multi-punto",
                  "Análisis de evidencia y fuentes",
                  "Estrategia de bloque y réplica",
                  "Síntesis de debate y cierre",
                ],
              },
              {
                badge: "Categoría C",
                level: "Nivel Avanzado",
                sub: "5.° de Secundaria",
                desc: "La categoría de mayor exigencia técnica. Los equipos deben dominar el formato parlamentario completo, desarrollar estrategias de debate sofisticadas y demostrar pensamiento crítico de orden superior bajo presión competitiva.",
                skills: [
                  "Formato parlamentario completo",
                  "Análisis de caso y contra-caso",
                  "Interrogatorio cruzado formal",
                  "Argumentación filosófica y política",
                ],
              },
            ].map((cat, i) => (
              <div key={cat.level} className={`category-card reveal reveal-delay-${i + 1}`}>
                <div className="category-badge">{cat.badge}</div>
                <div className="category-level">{cat.level}</div>
                <div className="category-sub">{cat.sub}</div>
                <div className="category-divider" />
                <p className="category-desc">{cat.desc}</p>
                <ul className="skills-list">
                  {cat.skills.map((s) => <li key={s}>{s}</li>)}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section>
        <div className="section-inner">
          <div className="section-label">Reglamento Competitivo</div>
          <h2 className="section-title">
            Formato del<br /><em>Torneo</em>
          </h2>
          <div className="format-grid">
            <div>
              <p className="section-body" style={{ marginBottom: "2.5rem" }}>
                El torneo sigue un sistema de eliminación progresiva con rondas
                clasificatorias y eliminatorias directas. Cada ronda enfrenta a
                dos equipos en posiciones afirmativa y negativa ante un panel de
                jueces acreditados por SoPeD.
              </p>
              <div className="rounds-list">
                {[
                  { n: "01", title: "Rondas Clasificatorias", desc: "Cuatro rondas de liga donde cada equipo debate tanto en posición afirmativa como negativa. Los resultados determinan la clasificación inicial del torneo." },
                  { n: "02", title: "Cuartos de Final", desc: "Los ocho equipos mejor clasificados de cada categoría ingresan a la fase de eliminación directa. Un solo match decide la continuidad." },
                  { n: "03", title: "Semifinales", desc: "Los cuatro equipos restantes disputan las semifinales bajo formato extendido, con mayor tiempo de elaboración y réplica." },
                  { n: "04", title: "Gran Final", desc: "Los dos finalistas debaten ante el pleno del panel de jueces y la comunidad académica convocada. El evento culminante del torneo anual." },
                ].map((r) => (
                  <div key={r.n} className="round-item">
                    <div className="round-number">{r.n}</div>
                    <div className="round-content">
                      <div className="round-title">{r.title}</div>
                      <div className="round-desc">{r.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <p className="section-body" style={{ marginBottom: "2.5rem" }}>
                La evaluación de cada ronda descansa en cuatro criterios objetivos
                ponderados que determinan el puntaje del equipo. Los jueces utilizan
                rúbricas estandarizadas por SoPeD, asegurando coherencia y objetividad
                en toda la competencia.
              </p>
              <div className="criteria-grid">
                {[
                  { pct: "35%", name: "Argumentación", detail: "Solidez lógica, estructura del argumento, uso y calidad de evidencia, y consistencia a lo largo del debate." },
                  { pct: "25%", name: "Refutación", detail: "Capacidad de identificar falacias, contradecir evidencia del oponente y sostener la posición propia bajo presión." },
                  { pct: "25%", name: "Oratoria", detail: "Dicción, manejo del tiempo, lenguaje formal, contacto visual y comunicación no verbal en el contexto competitivo." },
                  { pct: "15%", name: "Estrategia", detail: "Cohesión del equipo, división del caso, adaptación táctica durante el debate y manejo del interrogatorio cruzado." },
                ].map((c) => (
                  <div key={c.name} className="criteria-card">
                    <span className="criteria-pct">{c.pct}</span>
                    <div className="criteria-name">{c.name}</div>
                    <div className="criteria-detail">{c.detail}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="proceso-bg">
        <div className="section-inner">
          <div className="section-label">Proceso de Participación</div>
          <h2 className="section-title">
            Cómo <em>postular</em>
          </h2>
          <div className="process-steps">
            {[
              { n: "I", title: "Registro Institucional", desc: "La institución educativa acredita su participación oficial a través del formulario de postulación de SoPeD." },
              { n: "II", title: "Inscripción de Equipos", desc: "Cada institución registra sus equipos por categoría. Cada equipo está conformado por tres a cuatro debatientes." },
              { n: "III", title: "Verificación y Convocatoria", desc: "SoPeD revisa los registros y emite la convocatoria oficial con la asignación de grupos y el calendario de rondas." },
              { n: "IV", title: "Jornada de Competencia", desc: "Los equipos participan en las jornadas presenciales del torneo, acompañados de su representante institucional." },
              { n: "V", title: "Premiación Oficial", desc: "La ceremonia de premiación reconoce a los ganadores de cada categoría con diplomas, trofeos y certificación SoPeD." },
            ].map((step) => (
              <div key={step.n} className="process-step reveal">
                <div className="step-dot">{step.n}</div>
                <div className="step-title">{step.title}</div>
                <div className="step-desc">{step.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="inscripcion" className="cta-section">
        <div className="cta-bg-pattern" />
        <div className="cta-inner">
          <div className="section-label" style={{ justifyContent: "center" }}>
            SoPeDebate · Edición Anual
          </div>
          <h2 className="cta-title">
            Representa a tu institución<br />
            en el <em>escenario nacional</em><br />
            del debate académico
          </h2>
          <div className="cta-rule" />
          <p className="cta-desc">
            Las postulaciones para la próxima edición de SoPeDebate están abiertas.
            Las instituciones interesadas deben completar el proceso de registro
            antes de la fecha límite de convocatoria oficial.
          </p>
          <div className="hero-actions">
            <a href="#" className="btn-primary">Postular al Concurso</a>
            <a href="#" className="btn-secondary">Descargar Reglamento</a>
          </div>
        </div>
      </section>

    </>
  );
}