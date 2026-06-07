'use client'

import React, { useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Layout from '@/components/layout/Layout'

// ── Types ─────────────────────────────────────────────────────────────────────

type ProgramId = 'mun' | 'sopedebate' | 'sopedtalks' | 'membresia' | 'equipo'
type MunModalidadId = 'individual' | 'small' | 'large' | 'institutional' | 'faculty' | 'staff'

type ViewState =
  | { screen: 'hub' }
  | { screen: 'mun-modalidades' }
  | { screen: 'mun-form'; modalidad: MunModalidadId }
  | { screen: 'other-form'; program: Exclude<ProgramId, 'mun'> }

// ── Data ──────────────────────────────────────────────────────────────────────

const PROGRAMS = [
  {
    id: 'mun' as const,
    index: '01',
    title: 'SoPeD MUN 2026',
    subtitle: 'Modelo de Naciones Unidas',
    category: 'Internacional',
    status: 'Inscripciones abiertas',
    active: true,
    detail: '12 comités · 6 modalidades · Presencial',
    featured: true,
  },
  {
    id: 'sopedebate' as const,
    index: '02',
    title: 'SoPeDebate',
    subtitle: 'Competencia de Debate Escolar',
    category: 'Secundaria',
    status: 'Ciclo 2026 activo',
    active: true,
    detail: 'Categorías A, B y C · Nacional',
    featured: false,
  },
  {
    id: 'sopedtalks' as const,
    index: '03',
    title: 'SoPeD Talks',
    subtitle: 'Ciclo de Conferencias',
    category: 'Abierto',
    status: 'Próxima edición',
    active: false,
    detail: 'Oradores internacionales · Registro libre',
    featured: false,
  },
  {
    id: 'membresia' as const,
    index: '04',
    title: 'Membresía SoPeD',
    subtitle: 'Comunidad Institucional',
    category: 'Comunidad',
    status: 'Registro abierto',
    active: true,
    detail: 'Estudiante · Institución · Staff',
    featured: false,
  },
  {
    id: 'equipo' as const,
    index: '05',
    title: 'Equipo SoPeD',
    subtitle: 'Convocatoria Interna 2026',
    category: 'Convocatoria',
    status: 'Postulaciones abiertas',
    active: true,
    detail: 'Coordinación · Dirección · Logística',
    featured: false,
  },
]

const MUN_MODALIDADES = [
  {
    id: 'institutional' as const,
    cat: 'Oficial',
    title: 'Delegación Institucional',
    sub: 'Representación oficial completa',
    desc: 'Modalidad de máximo rango para instituciones educativas con delegación completa. Incluye acreditación oficial, reconocimiento institucional pleno y protocolo de representación en todos los actos de la conferencia.',
    cap: 'Registro exclusivo',
    featured: true,
  },
  {
    id: 'large' as const,
    cat: 'Delegación',
    title: 'Delegación Grande',
    sub: '10 o más delegados',
    desc: 'Para instituciones que presentan delegaciones amplias. Incluye coordinación dedicada y proceso de incorporación prioritaria.',
    cap: '10+ delegados',
    featured: false,
  },
  {
    id: 'small' as const,
    cat: 'Delegación',
    title: 'Delegación Pequeña',
    sub: '2 a 9 delegados',
    desc: 'Para instituciones que inscriben entre 2 y 9 delegados en distintos comités del modelo.',
    cap: '2–9 delegados',
    featured: false,
  },
  {
    id: 'individual' as const,
    cat: 'Delegado',
    title: 'Delegado Individual',
    sub: 'Participación independiente',
    desc: 'Participación como delegado independiente representando a un país asignado en un comité específico de la conferencia.',
    cap: 'Cupos disponibles',
    featured: false,
  },
  {
    id: 'faculty' as const,
    cat: 'Asesoría',
    title: 'Faculty Advisor',
    sub: 'Asesor académico oficial',
    desc: 'Para docentes y asesores que acompañan y orientan a sus delegaciones durante la conferencia.',
    cap: 'Registro abierto',
    featured: false,
  },
  {
    id: 'staff' as const,
    cat: 'Equipo',
    title: 'Staff & Voluntariado',
    sub: 'Equipo organizador',
    desc: 'Participa activamente en la organización del MUN: logística, protocolo, prensa y soporte operacional.',
    cap: 'Cupos limitados',
    featured: false,
  },
]

// ── Sub-components ────────────────────────────────────────────────────────────

function BackBtn({ onClick, label }: { onClick: () => void; label: string }) {
  return (
    <button onClick={onClick} className="insc-back">
      <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden>
        <path d="M8 2L4 6L8 10" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
      {label}
    </button>
  )
}

// ── Screen: HUB ───────────────────────────────────────────────────────────────

function HubScreen({ onSelect }: { onSelect: (id: ProgramId) => void }) {
  return (
    <div className="insc-screen">

      {/* ── Opening statement ── */}
      <div className="insc-hero">
        <div className="insc-hero__eyebrow">
          <span className="insc-dot" />
          SoPeD · Centro de Inscripciones · 2026
        </div>

        <div className="insc-hero__grid">
          <h1 className="insc-hero__h1">
            La puerta a una<br />
            <em>formación académica</em><br />
            de élite.
          </h1>
          <p className="insc-hero__sub">
            Selecciona el programa al que deseas postular.
            Cada convocatoria está diseñada para desarrollar líderes
            con rigor intelectual, visión global y capacidad
            argumentativa de primer nivel.
          </p>
        </div>
      </div>

      {/* ── Rule ── */}
      <div className="insc-rule" />

      {/* ── Program directory ── */}
      <div className="insc-dir">
        <div className="insc-dir__head">
          <span className="insc-dir__label">Programas disponibles</span>
          <span className="insc-dir__count">{PROGRAMS.length} convocatorias</span>
        </div>

        <div className="insc-dir__list">
          {PROGRAMS.map((p) => (
            <button
              key={p.id}
              className={`insc-prog${p.featured ? ' insc-prog--featured' : ''}`}
              onClick={() => onSelect(p.id)}
            >
              <span className="insc-prog__idx">{p.index}</span>

              <span className="insc-prog__main">
                <span className="insc-prog__title">{p.title}</span>
                <span className="insc-prog__sub">{p.subtitle}</span>
              </span>

              <span className="insc-prog__detail">{p.detail}</span>

              <span className="insc-prog__meta">
                <span className={`insc-status${p.active ? ' insc-status--on' : ''}`}>
                  <span className="insc-status__dot" />
                  {p.status}
                </span>
                <span className="insc-prog__cat">{p.category}</span>
              </span>

              <span className="insc-prog__arrow" aria-hidden>
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M3 7h8M8 4l3 3-3 3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </span>
            </button>
          ))}
        </div>
      </div>

    </div>
  )
}

// ── Screen: MUN MODALIDADES ───────────────────────────────────────────────────

function MunModalidadesScreen({
  onSelect,
  onBack,
}: {
  onSelect: (id: MunModalidadId) => void
  onBack: () => void
}) {
  const featured = MUN_MODALIDADES.find(m => m.featured)!
  const others = MUN_MODALIDADES.filter(m => !m.featured)

  return (
    <div className="insc-screen">
      <BackBtn onClick={onBack} label="Volver a programas" />

      {/* Header */}
      <div className="insc-mun-head">
        <div className="insc-mun-head__eye">
          <span className="insc-dot" />
          SoPeD MUN 2026 · Acreditación de Delegados
        </div>
        <h2 className="insc-mun-head__h2">
          Selecciona tu<br /><em>modalidad de participación.</em>
        </h2>
        <p className="insc-mun-head__sub">
          Elige la categoría que corresponde a tu perfil. Cada modalidad tiene
          requisitos, capacidades y beneficios específicos dentro de la conferencia.
        </p>
      </div>

      {/* Featured — Institucional */}
      <button className="insc-inst" onClick={() => onSelect(featured.id)}>
        <div className="insc-inst__top">
          <span className="insc-inst__badge">Representación Oficial</span>
          <span className="insc-inst__priority">Prioridad máxima</span>
        </div>
        <div className="insc-inst__body">
          <div className="insc-inst__left">
            <div className="insc-inst__cat">{featured.cat}</div>
            <h3 className="insc-inst__title">{featured.title}</h3>
            <p className="insc-inst__desc">{featured.desc}</p>
          </div>
          <div className="insc-inst__right">
            <span className="insc-inst__cta">
              Registrar institución
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M3 7h8M8 4l3 3-3 3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </span>
          </div>
        </div>
      </button>

      {/* Other modalidades */}
      <div className="insc-mods">
        {others.map((m) => (
          <button
            key={m.id}
            className="insc-mod"
            onClick={() => onSelect(m.id)}
          >
            <div className="insc-mod__left">
              <div className="insc-mod__cat">{m.cat}</div>
              <div className="insc-mod__title">{m.title}</div>
            </div>
            <div className="insc-mod__center">
              <div className="insc-mod__desc">{m.desc}</div>
              <div className="insc-mod__sub">{m.sub}</div>
            </div>
            <div className="insc-mod__right">
              <span className="insc-mod__cap">{m.cap}</span>
              <svg className="insc-mod__arrow" width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M3 7h8M8 4l3 3-3 3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </button>
        ))}
      </div>

      {/* Process timeline */}
      <div className="insc-process">
        <div className="insc-process__label">Proceso de inscripción</div>
        <div className="insc-process__steps">
          {['Selecciona modalidad', 'Completa formulario', 'Verifica tu correo', 'Aguarda confirmación'].map((s, i) => (
            <div key={s} className="insc-step">
              <div className="insc-step__n">{['I', 'II', 'III', 'IV'][i]}</div>
              <div className="insc-step__l">{s}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ── Screen: MUN FORM ──────────────────────────────────────────────────────────

function MunFormScreen({ modalidad, onBack }: { modalidad: MunModalidadId; onBack: () => void }) {
  const m = MUN_MODALIDADES.find(x => x.id === modalidad)!
  return (
    <div className="insc-screen">
      <BackBtn onClick={onBack} label="Volver a modalidades" />
      <div className="insc-fhead">
        <div className="insc-fhead__tag">{m.cat}</div>
        <h2 className="insc-fhead__title">{m.title}</h2>
        <p className="insc-fhead__sub">{m.desc}</p>
      </div>
      <div className="insc-fbody">
        <div className="insc-form-embed">
          <iframe
            src="https://docs.google.com/forms/d/e/REEMPLAZAR_FORM_ID/viewform?embedded=true"
            width="100%"
            height="1200"
            frameBorder="0"
            marginHeight={0}
            marginWidth={0}
            title="Formulario SoPeD MUN"
          >
            Cargando formulario...
          </iframe>
        </div>
      </div>
    </div>
  )
}

// ── Screen: OTHER FORM ────────────────────────────────────────────────────────

function OtherFormScreen({
  program,
  onBack,
}: {
  program: Exclude<ProgramId, 'mun'>
  onBack: () => void
}) {
  const p = PROGRAMS.find(x => x.id === program)!

  return (
    <div className="insc-screen">
      <BackBtn onClick={onBack} label="Volver a programas" />
      <div className="insc-fhead">
        <div className="insc-fhead__tag">{p.category}</div>
        <h2 className="insc-fhead__title">{p.title}</h2>
        <p className="insc-fhead__sub">{p.subtitle}</p>
      </div>
      <div className="insc-fbody">
        <div className="insc-form-embed">
          <iframe
            src="https://docs.google.com/forms/d/e/REEMPLAZAR_FORM_ID/viewform?embedded=true"
            width="100%"
            height="1200"
            frameBorder="0"
            marginHeight={0}
            marginWidth={0}
            title="Formulario SoPeD"
          >
            Cargando formulario...
          </iframe>
        </div>
      </div>
    </div>
  )
}

// ── Page Root ─────────────────────────────────────────────────────────────────

export default function InscripcionPage() {
  // Wrapped with Suspense per Next.js 14 requirement for useSearchParams
  return (
    <Suspense fallback={null}>
      <InscripcionPageInner />
    </Suspense>
  )
}

function InscripcionPageInner() {
  const searchParams = useSearchParams()
  const program = searchParams.get('program')
  const [view, setView] = useState<ViewState>(() =>
    program === 'mun'
      ? { screen: 'mun-modalidades' }
      : { screen: 'hub' }
  )

  const handleProgram = (id: ProgramId) => {
    if (id === 'mun') setView({ screen: 'mun-modalidades' })
    else setView({ screen: 'other-form', program: id as Exclude<ProgramId, 'mun'> })
  }

  return (
    <Layout>
      <style jsx global>{`

        /* ═══════════════════════════════════════════════════
           INSCRIPCION 2026 — Editorial Premium Redesign
           ═══════════════════════════════════════════════════ */

        /* ── Page shell ── */

        .insc-page {
          position: relative;
          min-height: 100vh;
          background: var(--dark);
          padding: 8rem 0 9rem;
          isolation: isolate;
        }
        .insc-page::before {
          content: '';
          position: absolute;
          top: -10%;
          right: -20%;
          width: 60vw;
          height: 60vw;
          background: radial-gradient(circle, rgba(124,1,26,0.12) 0%, transparent 65%);
          pointer-events: none;
          z-index: 0;
        }
        .insc-page::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: -15%;
          width: 50vw;
          height: 50vw;
          background: radial-gradient(circle, rgba(236,229,214,0.035) 0%, transparent 60%);
          pointer-events: none;
          z-index: 0;
        }

        .insc-wrap {
          position: relative;
          z-index: 1;
          max-width: 1100px;
          margin: 0 auto;
          padding: 0 2rem;
        }
        @media (min-width: 768px)  { .insc-wrap { padding: 0 3rem; } }
        @media (min-width: 1280px) { .insc-wrap { padding: 0 2.5rem; } }

        /* ── Screen transition ── */

        .insc-screen {
          animation: inscIn 0.5s cubic-bezier(0.22, 1, 0.36, 1) both;
        }
        @keyframes inscIn {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        /* ── Staggered card animations ── */

        .insc-prog,
        .insc-mod,
        .insc-step {
          opacity: 0;
          animation: inscCardIn 0.55s cubic-bezier(0.22, 1, 0.36, 1) forwards;
        }

        @keyframes inscCardIn {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .insc-dir__list > .insc-prog:nth-child(1) { animation-delay: 0.05s; }
        .insc-dir__list > .insc-prog:nth-child(2) { animation-delay: 0.10s; }
        .insc-dir__list > .insc-prog:nth-child(3) { animation-delay: 0.15s; }
        .insc-dir__list > .insc-prog:nth-child(4) { animation-delay: 0.20s; }
        .insc-dir__list > .insc-prog:nth-child(5) { animation-delay: 0.25s; }

        .insc-mods > .insc-mod:nth-child(1) { animation-delay: 0.08s; }
        .insc-mods > .insc-mod:nth-child(2) { animation-delay: 0.14s; }
        .insc-mods > .insc-mod:nth-child(3) { animation-delay: 0.20s; }
        .insc-mods > .insc-mod:nth-child(4) { animation-delay: 0.26s; }
        .insc-mods > .insc-mod:nth-child(5) { animation-delay: 0.32s; }

        .insc-process__steps > .insc-step:nth-child(1) { animation-delay: 0.10s; }
        .insc-process__steps > .insc-step:nth-child(2) { animation-delay: 0.18s; }
        .insc-process__steps > .insc-step:nth-child(3) { animation-delay: 0.26s; }
        .insc-process__steps > .insc-step:nth-child(4) { animation-delay: 0.34s; }

        /* ── Utilities ── */

        .insc-dot {
          display: inline-block;
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background: rgba(236, 229, 214, 0.65);
          flex-shrink: 0;
        }

        .insc-rule {
          height: 1px;
          background: linear-gradient(90deg, rgba(236,229,214,0.12), rgba(236,229,214,0.04), transparent);
          margin: 3.5rem 0;
        }

        /* ── Back button ── */

        .insc-back {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          font-family: var(--font-outfit);
          font-size: 0.72rem;
          color: rgba(255, 255, 255, 0.2);
          background: none;
          border: none;
          cursor: pointer;
          padding: 0;
          margin-bottom: 2.5rem;
          letter-spacing: 0.02em;
          transition: color 150ms ease;
        }
        .insc-back:focus-visible {
          outline: 2px solid rgba(236,229,214,0.5);
          outline-offset: 4px;
          border-radius: 2px;
        }
        .insc-back:hover { color: rgba(236, 229, 214, 0.7); }
        .insc-back svg { flex-shrink: 0; transition: transform 150ms ease; }
        .insc-back:hover svg { transform: translateX(-2px); }

        /* ── Status badges ── */

        .insc-status {
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
          font-family: var(--font-outfit);
          font-size: 0.63rem;
          color: rgba(255, 255, 255, 0.18);
          letter-spacing: 0.02em;
        }
        .insc-status__dot {
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.16);
          flex-shrink: 0;
        }
        .insc-status--on .insc-status__dot {
          background: #4ade80;
          box-shadow: 0 0 7px rgba(74, 222, 128, 0.55);
        }
        .insc-status--on { color: rgba(255, 255, 255, 0.3); }

        /* ════════════════════════════════════════
           HUB SCREEN  —  Hero
           ════════════════════════════════════════ */

        .insc-hero {
          position: relative;
          margin-bottom: 0;
        }
        .insc-hero::after {
          content: 'SoPeD';
          position: absolute;
          top: -0.5rem;
          right: -1rem;
          font-family: var(--font-cormorant);
          font-size: clamp(8rem, 18vw, 16rem);
          font-weight: 300;
          font-style: italic;
          color: rgba(236,229,214,0.025);
          line-height: 1;
          pointer-events: none;
          user-select: none;
          letter-spacing: -0.04em;
        }

        .insc-hero__eyebrow {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          font-family: var(--font-outfit);
          font-size: 0.6rem;
          font-weight: 600;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: rgba(236, 229, 214, 0.6);
          margin-bottom: 2rem;
        }

        .insc-hero__grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 4rem;
          align-items: start;
          margin-bottom: 3rem;
        }
        @media (max-width: 860px) {
          .insc-hero__grid { grid-template-columns: 1fr; gap: 2rem; }
        }

        .insc-hero__h1 {
          font-family: var(--font-cormorant);
          font-size: clamp(2.8rem, 5vw, 5.2rem);
          font-weight: 300;
          color: #fff;
          line-height: 1.04;
          letter-spacing: -0.02em;
        }
        .insc-hero__h1 em {
          font-style: italic;
          color: rgba(236, 229, 214, 0.88);
        }

        .insc-hero__sub {
          font-family: var(--font-outfit);
          font-size: 0.875rem;
          color: rgba(255, 255, 255, 0.32);
          line-height: 1.9;
          align-self: center;
        }

        /* ── Metrics ── */

        .insc-hero__metrics {
          display: flex;
          gap: 2.5rem;
          padding-top: 2.5rem;
          border-top: 1px solid rgba(255, 255, 255, 0.06);
          flex-wrap: wrap;
        }
        .insc-metric {
          display: flex;
          flex-direction: column;
          gap: 0.15rem;
        }
        .insc-metric__n {
          display: block;
          font-family: var(--font-cormorant);
          font-size: 2.8rem;
          font-weight: 300;
          color: rgba(236, 229, 214, 0.82);
          line-height: 1;
          letter-spacing: -0.02em;
        }
        .insc-metric__l {
          display: block;
          font-family: var(--font-outfit);
          font-size: 0.6rem;
          color: rgba(255, 255, 255, 0.18);
          letter-spacing: 0.06em;
          text-transform: uppercase;
        }

        /* ════════════════════════════════════════
           HUB SCREEN  —  Program directory
           ════════════════════════════════════════ */

        .insc-dir {}

        .insc-dir__head {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
        }
        .insc-dir__label {
          font-family: var(--font-outfit);
          font-size: 0.6rem;
          font-weight: 700;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: rgba(255, 255, 255, 0.18);
        }
        .insc-dir__count {
          font-family: var(--font-outfit);
          font-size: 0.6rem;
          color: rgba(255, 255, 255, 0.12);
          letter-spacing: 0.04em;
        }

        .insc-dir__list {
          display: flex;
          flex-direction: column;
          border-top: 1px solid rgba(255, 255, 255, 0.06);
        }

        /* ── Program row (premium card) ── */

        .insc-prog {
          display: grid;
          grid-template-columns: 2.5rem 1fr 1fr 200px 1.5rem;
          align-items: center;
          gap: 1.5rem;
          padding: 1.4rem 1.5rem;
          background: transparent;
          border: none;
          border-bottom: 1px solid rgba(255, 255, 255, 0.04);
          cursor: pointer;
          text-align: left;
          position: relative;
          transition:
            background 0.25s ease,
            border-color 0.25s ease,
            padding 0.2s ease;
          border-radius: 6px;
          margin: 0 -1.5rem;
          width: calc(100% + 3rem);
        }
        .insc-prog::before {
          content: '';
          position: absolute;
          inset: 0;
          background: rgba(255,255,255,0);
          border-radius: 6px;
          transition: background 0.25s ease;
          z-index: 0;
        }
        .insc-prog:hover {
          background: rgba(255,255,255,0.015);
          border-bottom-color: rgba(255,255,255,0.08);
        }
        .insc-prog:hover::before {
          background: rgba(255,255,255,0.015);
        }
        .insc-prog:focus-visible {
          outline: 2px solid rgba(236,229,214,0.4);
          outline-offset: -2px;
        }
        .insc-prog > * {
          position: relative;
          z-index: 1;
        }
        .insc-prog:hover .insc-prog__title { color: #fff; }
        .insc-prog:hover .insc-prog__idx { color: rgba(236,229,214,0.25); }
        .insc-prog:hover .insc-prog__arrow {
          color: rgba(236,229,214,0.7);
          transform: translateX(4px);
        }

        .insc-prog--featured {
          background: rgba(124,1,26,0.08);
          border-bottom-color: rgba(236,229,214,0.08);
        }
        .insc-prog--featured .insc-prog__title {
          color: rgba(236, 229, 214, 0.92);
        }
        .insc-prog--featured .insc-prog__idx {
          color: rgba(236, 229, 214, 0.25);
        }

        @media (max-width: 900px) {
          .insc-prog {
            grid-template-columns: 2rem 1fr auto 1.5rem;
            padding: 1.2rem 1rem;
            margin: 0 -1rem;
            width: calc(100% + 2rem);
          }
          .insc-prog__detail { display: none; }
          .insc-prog__cat    { display: none; }
        }
        @media (max-width: 560px) {
          .insc-prog {
            grid-template-columns: 2rem 1fr auto;
            gap: 0.75rem;
            padding: 1rem 0.75rem;
            margin: 0 -0.75rem;
            width: calc(100% + 1.5rem);
          }
          .insc-prog__arrow { display: none; }
        }

        .insc-prog__idx {
          font-family: var(--font-cormorant);
          font-size: 0.9rem;
          font-weight: 400;
          color: rgba(255, 255, 255, 0.07);
          letter-spacing: 0.04em;
          flex-shrink: 0;
          transition: color 0.25s ease;
        }

        .insc-prog__main {
          display: flex;
          flex-direction: column;
          gap: 0.2rem;
        }
        .insc-prog__title {
          font-family: var(--font-cormorant);
          font-size: 1.5rem;
          font-weight: 400;
          color: rgba(255, 255, 255, 0.85);
          line-height: 1;
          letter-spacing: -0.01em;
          transition: color 0.25s ease;
        }
        .insc-prog__sub {
          font-family: var(--font-outfit);
          font-size: 0.7rem;
          color: rgba(255, 255, 255, 0.18);
          letter-spacing: 0.02em;
        }

        .insc-prog__detail {
          font-family: var(--font-outfit);
          font-size: 0.7rem;
          color: rgba(255, 255, 255, 0.16);
        }

        .insc-prog__meta {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 0.4rem;
        }
        .insc-prog__cat {
          font-family: var(--font-outfit);
          font-size: 0.58rem;
          font-weight: 600;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: rgba(236, 229, 214, 0.42);
          border: 1px solid rgba(236, 229, 214, 0.14);
          padding: 0.15rem 0.5rem;
          border-radius: 2px;
        }

        .insc-prog__arrow {
          color: rgba(255, 255, 255, 0.1);
          display: flex;
          align-items: center;
          flex-shrink: 0;
          transition: color 0.25s ease, transform 0.25s ease;
        }

        /* ════════════════════════════════════════
           MUN SCREEN  —  Modalidades
           ════════════════════════════════════════ */

        .insc-mun-head {
          position: relative;
          margin-bottom: 2.5rem;
        }
        .insc-mun-head__eye {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          font-family: var(--font-outfit);
          font-size: 0.6rem;
          font-weight: 600;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: rgba(236, 229, 214, 0.6);
          margin-bottom: 1.5rem;
        }
        .insc-mun-head__h2 {
          font-family: var(--font-cormorant);
          font-size: clamp(3.5rem, 7vw, 6rem);
          font-weight: 300;
          color: #fff;
          line-height: 1.07;
          letter-spacing: -0.02em;
          margin-bottom: 1rem;
        }
        .insc-mun-head__h2 em {
          font-style: italic;
          color: rgba(236, 229, 214, 0.85);
        }
        .insc-mun-head__sub {
          font-family: var(--font-outfit);
          font-size: 1.15rem;
          color: rgba(255, 255, 255, 0.45);
          line-height: 1.9;
          max-width: 820px;
        }

        /* ── Institutional card ── */

        .insc-inst {
          width: 100%;
          background: linear-gradient(160deg, rgba(124,1,26,0.35) 0%, rgba(124,1,26,0.15) 100%);
          border: 1px solid rgba(236, 229, 214, 0.18);
          border-radius: 12px;
          padding: 2rem 2.25rem;
          cursor: pointer;
          text-align: left;
          margin-bottom: 1.5rem;
          position: relative;
          overflow: hidden;
          transition:
            border-color 0.25s ease,
            background 0.25s ease,
            box-shadow 0.3s ease;
          isolation: isolate;
        }
        .insc-inst::before {
          content: '';
          position: absolute;
          inset: 0;
          background: radial-gradient(ellipse 70% 80% at 85% 50%, rgba(236,229,214,0.08) 0%, transparent 65%);
          pointer-events: none;
          z-index: 0;
        }
        .insc-inst::after {
          content: '';
          position: absolute;
          top: -50%;
          left: -30%;
          width: 60%;
          height: 200%;
          background: linear-gradient(90deg, transparent, rgba(236,229,214,0.03), transparent);
          transform: rotate(25deg);
          pointer-events: none;
          transition: transform 0.6s ease;
          z-index: 0;
        }
        .insc-inst:hover {
          border-color: rgba(236, 229, 214, 0.35);
          background: linear-gradient(160deg, rgba(124,1,26,0.5) 0%, rgba(124,1,26,0.2) 100%);
          box-shadow:
            0 20px 56px rgba(0,0,0,0.45),
            0 0 0 1px rgba(236,229,214,0.06);
          transform: translateY(-2px);
        }
        .insc-inst:hover::after {
          transform: rotate(25deg) translateX(20%);
        }
        .insc-inst:hover .insc-inst__cta {
          color: rgba(236,229,214,0.9);
        }
        .insc-inst:hover .insc-inst__cta svg {
          transform: translateX(4px);
        }
        .insc-inst:focus-visible {
          outline: 2px solid rgba(236,229,214,0.4);
          outline-offset: 2px;
        }
        .insc-inst > * {
          position: relative;
          z-index: 1;
        }

        .insc-inst__top {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
        }
        .insc-inst__badge {
          font-family: var(--font-outfit);
          font-size: 0.58rem;
          font-weight: 700;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: rgba(236, 229, 214, 0.82);
          background: rgba(236, 229, 214, 0.07);
          border: 1px solid rgba(236, 229, 214, 0.25);
          padding: 0.22rem 0.65rem;
          border-radius: 2px;
        }
        .insc-inst__priority {
          font-family: var(--font-outfit);
          font-size: 0.58rem;
          color: rgba(255, 255, 255, 0.15);
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }
        .insc-inst__body {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          gap: 2rem;
        }
        @media (max-width: 640px) {
          .insc-inst__body { flex-direction: column; align-items: flex-start; }
        }
        .insc-inst__left {
          display: flex;
          flex-direction: column;
          gap: 0.6rem;
        }
        .insc-inst__cat {
          font-family: var(--font-outfit);
          font-size: 0.58rem;
          font-weight: 700;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: rgba(236, 229, 214, 0.5);
        }
        .insc-inst__title {
          font-family: var(--font-cormorant);
          font-size: clamp(1.6rem, 2.5vw, 2.3rem);
          font-weight: 400;
          color: rgba(236, 229, 214, 0.9);
          line-height: 1.05;
        }
        .insc-inst__desc {
          font-family: var(--font-outfit);
          font-size: 0.8rem;
          color: rgba(255, 255, 255, 0.3);
          line-height: 1.72;
          max-width: 560px;
        }
        .insc-inst__right {
          flex-shrink: 0;
        }
        .insc-inst__cta {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          font-family: var(--font-outfit);
          font-size: 0.8rem;
          font-weight: 500;
          color: rgba(236, 229, 214, 0.6);
          transition: color 0.25s ease;
          white-space: nowrap;
        }
        .insc-inst__cta svg {
          transition: transform 0.25s ease;
        }

        /* ── Modalidades grid ── */

        .insc-mods {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
          gap: 1.25rem;
          margin-bottom: 4rem;
        }

        .insc-mod {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 1rem;
          padding: 2rem;
          background: rgba(255,255,255,0.02);
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 12px;
          cursor: pointer;
          text-align: left;
          width: 100%;
          min-height: 260px;
          transition:
            transform 0.3s ease,
            border-color 0.3s ease,
            box-shadow 0.3s ease,
            background 0.3s ease;
        }
        .insc-mod:hover {
          transform: translateY(-4px);
          border-color: rgba(236,229,214,0.25);
          background: rgba(255,255,255,0.03);
          box-shadow: 0 18px 44px rgba(0,0,0,0.35);
        }
        .insc-mod:focus-visible {
          outline: 2px solid rgba(236,229,214,0.4);
          outline-offset: 2px;
        }
        .insc-mod:hover .insc-mod__arrow {
          color: rgba(236,229,214,0.7);
          transform: translateX(3px);
        }

        @media (max-width: 768px) {
          .insc-mod {
            min-height: auto;
            padding: 1.5rem;
          }
          .insc-mod__right {
            display: flex;
            flex-direction: row;
            justify-content: space-between;
            align-items: center;
            width: 100%;
          }
        }

        .insc-mod__left {
          display: flex;
          flex-direction: column;
          gap: 0.28rem;
        }
        .insc-mod__cat {
          font-family: var(--font-outfit);
          font-size: 0.56rem;
          font-weight: 700;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: rgba(236, 229, 214, 0.42);
        }
        .insc-mod__title {
          font-family: var(--font-cormorant);
          font-size: 1.35rem;
          font-weight: 400;
          color: rgba(255, 255, 255, 0.88);
          line-height: 1.1;
        }

        .insc-mod__center {
          display: flex;
          flex-direction: column;
          gap: 0.28rem;
        }
        .insc-mod__desc {
          font-family: var(--font-outfit);
          font-size: 0.76rem;
          color: rgba(255, 255, 255, 0.27);
          line-height: 1.65;
        }
        .insc-mod__sub {
          font-family: var(--font-outfit);
          font-size: 0.62rem;
          color: rgba(255, 255, 255, 0.14);
        }

        .insc-mod__right {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 0.5rem;
          margin-top: auto;
        }
        .insc-mod__cap {
          font-family: var(--font-outfit);
          font-size: 0.58rem;
          font-weight: 600;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: rgba(236, 229, 214, 0.4);
          border: 1px solid rgba(236, 229, 214, 0.14);
          padding: 0.17rem 0.5rem;
          border-radius: 2px;
          white-space: nowrap;
        }
        .insc-mod__arrow {
          color: rgba(255, 255, 255, 0.1);
          display: flex;
          align-items: center;
          flex-shrink: 0;
          transition: color 0.25s ease, transform 0.25s ease;
        }

        /* ── Process timeline ── */

        .insc-process {
          border-top: 1px solid rgba(255, 255, 255, 0.06);
          padding-top: 2.5rem;
        }
        .insc-process__label {
          font-family: var(--font-outfit);
          font-size: 0.6rem;
          font-weight: 700;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: rgba(255, 255, 255, 0.14);
          margin-bottom: 1.5rem;
        }
        .insc-process__steps {
          display: flex;
          position: relative;
        }
        .insc-process__steps::before {
          content: '';
          position: absolute;
          top: 1.25rem;
          left: 1.5rem;
          right: 1.5rem;
          height: 1px;
          background: linear-gradient(90deg, rgba(236,229,214,0.25), rgba(236,229,214,0.05), transparent);
        }

        .insc-step {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.75rem;
          position: relative;
          z-index: 1;
        }
        .insc-step__n {
          width: 2.5rem;
          height: 2.5rem;
          border: 1px solid rgba(236, 229, 214, 0.18);
          border-radius: 50%;
          background: var(--dark);
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: var(--font-cormorant);
          font-size: 0.85rem;
          color: rgba(236, 229, 214, 0.55);
          transition: border-color 0.25s ease, background 0.25s ease;
        }
        .insc-step:hover .insc-step__n {
          border-color: rgba(236, 229, 214, 0.4);
          background: rgba(236,229,214,0.04);
        }
        .insc-step__l {
          font-family: var(--font-outfit);
          font-size: 0.62rem;
          color: rgba(255, 255, 255, 0.18);
          text-align: center;
          line-height: 1.45;
          max-width: 80px;
        }

        @media (max-width: 560px) {
          .insc-process__steps {
            flex-direction: column;
            gap: 0.5rem;
          }
          .insc-process__steps::before { display: none; }
          .insc-step {
            flex-direction: row;
            align-items: center;
            gap: 0.75rem;
          }
          .insc-step__l {
            text-align: left;
            max-width: none;
          }
        }

        /* ════════════════════════════════════════
           FORM SCREENS
           ════════════════════════════════════════ */

        .insc-fhead {
          position: relative;
          margin-bottom: 2.5rem;
          padding-bottom: 2rem;
          border-bottom: 1px solid rgba(255, 255, 255, 0.06);
        }
        .insc-fhead__tag {
          font-family: var(--font-outfit);
          font-size: 0.6rem;
          font-weight: 700;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: rgba(236, 229, 214, 0.55);
          margin-bottom: 0.75rem;
        }
        .insc-fhead__title {
          font-family: var(--font-cormorant);
          font-size: clamp(2rem, 3.5vw, 3.2rem);
          font-weight: 300;
          color: #fff;
          line-height: 1.1;
          margin-bottom: 0.75rem;
        }
        .insc-fhead__sub {
          font-family: var(--font-outfit);
          font-size: 0.85rem;
          color: rgba(255, 255, 255, 0.28);
          line-height: 1.8;
          max-width: 580px;
        }

        .insc-fbody {
          width: 100%;
        }

        .insc-form-embed {
          position: relative;
          width: 100%;
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 12px;
          overflow: hidden;
          background: rgba(255,255,255,0.02);
        }
        .insc-form-embed::before {
          content: '';
          position: absolute;
          top: -20%;
          right: -10%;
          width: 40%;
          height: 80%;
          background: radial-gradient(circle, rgba(124,1,26,0.15) 0%, transparent 60%);
          pointer-events: none;
          z-index: 0;
        }

        .insc-form-embed iframe {
          display: block;
          position: relative;
          z-index: 1;
          width: 100%;
          min-height: 1200px;
          background: #fff;
        }

      `}</style>

      <div className="insc-page">
        <div className="insc-wrap">

          {view.screen === 'hub' && (
            <HubScreen onSelect={handleProgram} />
          )}

          {view.screen === 'mun-modalidades' && (
            <MunModalidadesScreen
              onSelect={(m) => setView({ screen: 'mun-form', modalidad: m })}
              onBack={() => setView({ screen: 'hub' })}
            />
          )}

          {view.screen === 'mun-form' && (
            <MunFormScreen
              modalidad={view.modalidad}
              onBack={() => setView({ screen: 'mun-modalidades' })}
            />
          )}

          {view.screen === 'other-form' && (
            <OtherFormScreen
              program={view.program}
              onBack={() => setView({ screen: 'hub' })}
            />
          )}

        </div>
      </div>
    </Layout>
  )
}