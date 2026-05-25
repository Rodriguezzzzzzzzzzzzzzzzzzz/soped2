'use client'

import React from 'react'
import { useState } from 'react'
import Layout from '@/components/layout/Layout'
import DebateForm from '@/components/forms/DebateForm'
import MembershipForm from '@/components/forms/MembershipForm'
import ContactForm from '@/components/forms/ContactForm'

// ─── TYPES ────────────────────────────────────────────────────────────────────
type ProgramId =
  | 'mun'
  | 'sopedebate'
  | 'sopedtalks'
  | 'membresia'
  | 'equipo'

type MunModalidad =
  | 'individual'
  | 'delegacion-pequena'
  | 'delegacion-grande'
  | 'faculty'
  | 'staff'
  | 'institucional'

type ViewState =
  | { screen: 'hub' }
  | { screen: 'mun-modalidades' }
  | { screen: 'mun-form'; modalidad: MunModalidad }
  | { screen: 'other-form'; program: Exclude<ProgramId, 'mun'> }

// ─── DATA ─────────────────────────────────────────────────────────────────────

interface Program {
  id: ProgramId
  label: string
  sublabel: string
  badge: string
  description: string
  detail: string
  status: string
  statusActive: boolean
}

const PROGRAMS: Program[] = [
  {
    id: 'mun',
    label: 'SoPeD MUN 2026',
    sublabel: 'Modelo de Naciones Unidas',
    badge: 'Internacional',
    description:
      'El modelo de Naciones Unidas más exigente del Perú. Debate diplomático avanzado, política global y formación de líderes internacionales.',
    detail: '6 modalidades de inscripción disponibles',
    status: 'Inscripciones abiertas',
    statusActive: true,
  },
  {
    id: 'sopedebate',
    label: 'SoPeDebate',
    sublabel: 'Debate escolar',
    badge: 'Secundaria',
    description:
      'Programa de debate parlamentario para estudiantes de secundaria. Oratoria, argumentación formal y pensamiento crítico.',
    detail: 'Ciclo académico 2026',
    status: 'Ciclo vigente',
    statusActive: true,
  },
  {
    id: 'sopedtalks',
    label: 'SoPeD Talks',
    sublabel: 'Ciclo de conferencias',
    badge: 'Abierto',
    description:
      'Ciclo de conferencias académicas sobre política internacional, diplomacia y debate. Abierto a todos los niveles.',
    detail: 'Registro de asistencia',
    status: 'Próxima edición',
    statusActive: false,
  },
  {
    id: 'membresia',
    label: 'Membresía SoPeD',
    sublabel: 'Comunidad institucional',
    badge: 'Comunidad',
    description:
      'Accede a la red de egresados, recursos exclusivos y beneficios de ser parte de la comunidad oficial SoPeD.',
    detail: 'Membresía anual',
    status: 'Registro abierto',
    statusActive: true,
  },
  {
    id: 'equipo',
    label: 'Equipo SoPeD',
    sublabel: 'Postulación interna',
    badge: 'Convocatoria',
    description:
      'Postula para formar parte del equipo organizador de SoPeD. Coordinación, dirección, comunicaciones y logística.',
    detail: 'Convocatoria 2026',
    status: 'Postulaciones abiertas',
    statusActive: true,
  },
]

interface Modalidad {
  id: MunModalidad
  label: string
  perfil: string
  descripcion: string
  capacidad: string
  paraQuien: string
  featured: boolean
  url: string
}

const MUN_MODALIDADES: Modalidad[] = [
  {
    id: 'institucional',
    label: 'Representación Institucional Oficial',
    perfil: 'Institución',
    descripcion:
      'Modalidad de máximo nivel para colegios, universidades y organizaciones que representan oficialmente a sus delegaciones. Incluye acreditación institucional, atención prioritaria y protocolo completo.',
    capacidad: 'Registro exclusivo',
    paraQuien: 'Instituciones educativas acreditadas',
    featured: true,
    url: 'https://forms.google.com',
  },
  {
    id: 'delegacion-grande',
    label: 'Delegación Grande',
    perfil: 'Institución',
    descripcion:
      'Inscripción para instituciones que presentan 10 o más delegados. Incluye coordinación dedicada y proceso de onboarding.',
    capacidad: '10+ delegados',
    paraQuien: 'Colegios con delegación amplia',
    featured: false,
    url: 'https://forms.google.com',
  },
  {
    id: 'delegacion-pequena',
    label: 'Delegación Pequeña',
    perfil: 'Institución',
    descripcion:
      'Para instituciones que inscriben entre 2 y 9 delegados en distintos comités del modelo.',
    capacidad: '2 – 9 delegados',
    paraQuien: 'Colegios e institutos',
    featured: false,
    url: 'https://forms.google.com',
  },
  {
    id: 'individual',
    label: 'Inscripción Individual',
    perfil: 'Delegado',
    descripcion:
      'Participa como delegado independiente representando a un país asignado en un comité específico.',
    capacidad: 'Cupos disponibles',
    paraQuien: 'Estudiantes independientes',
    featured: false,
    url: 'https://forms.google.com',
  },
  {
    id: 'faculty',
    label: 'Faculty Advisor',
    perfil: 'Docente',
    descripcion:
      'Registro para docentes y asesores académicos que acompañan y orientan a sus delegaciones durante el evento.',
    capacidad: 'Registro abierto',
    paraQuien: 'Docentes y asesores',
    featured: false,
    url: 'https://forms.google.com',
  },
  {
    id: 'staff',
    label: 'Staff & Voluntariado',
    perfil: 'Equipo',
    descripcion:
      'Forma parte del equipo organizador del MUN. Logística, protocolo, prensa, tecnología y soporte operacional.',
    capacidad: 'Cupos limitados',
    paraQuien: 'Universitarios y egresados',
    featured: false,
    url: 'https://forms.google.com',
  },
]

// ─── SHARED ATOMS ─────────────────────────────────────────────────────────────

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <div className="ip-eyebrow">
      <span className="ip-eyebrow__line" />
      <span>{children}</span>
    </div>
  )
}

function BackBtn({ onClick, label = 'Volver' }: { onClick: () => void; label?: string }) {
  return (
    <button className="ip-back" onClick={onClick}>
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
        <path d="M9 2.5L4.5 7 9 11.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      {label}
    </button>
  )
}

// ─── SCREEN 1 — HUB ──────────────────────────────────────────────────────────

function HubScreen({ onSelect }: { onSelect: (p: ProgramId) => void }) {
  const main = PROGRAMS.filter(p => p.id !== 'equipo')
  const team = PROGRAMS.find(p => p.id === 'equipo')!

  return (
    <div className="ip-screen ip-screen--hub">
      {/* Page header */}
      <header className="ip-hub-header">
        <Eyebrow>Centro de Inscripciones</Eyebrow>
        <h1 className="ip-hub-header__h1">
          ¿En qué evento<br />deseas participar?
        </h1>
        <p className="ip-hub-header__sub">
          Selecciona el programa para comenzar tu proceso de inscripción.
          Cada experiencia ha sido diseñada para ser directa y clara.
        </p>
      </header>

      {/* Main grid — 2×2 */}
      <div className="ip-hub-grid">
        {main.map((p, i) => (
          <button
            key={p.id}
            className={`ip-prog-card ${p.id === 'mun' ? 'ip-prog-card--mun' : ''}`}
            onClick={() => onSelect(p.id)}
            style={{ animationDelay: `${i * 70}ms` }}
          >
            <div className="ip-prog-card__head">
              <span className="ip-badge">{p.badge}</span>
              <span className={`ip-status ${p.statusActive ? 'ip-status--active' : ''}`}>
                <span className="ip-status__dot" />
                {p.status}
              </span>
            </div>
            <div className="ip-prog-card__body">
              <p className="ip-prog-card__sublabel">{p.sublabel}</p>
              <h2 className="ip-prog-card__title">{p.label}</h2>
              <p className="ip-prog-card__desc">{p.description}</p>
            </div>
            <div className="ip-prog-card__foot">
              <span className="ip-prog-card__detail">{p.detail}</span>
              <span className="ip-prog-card__arrow">
                <svg width="15" height="15" viewBox="0 0 15 15" fill="none" aria-hidden="true">
                  <path d="M3 7.5h9M8.5 3.5l4 4-4 4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
            </div>
          </button>
        ))}
      </div>

      {/* Team card — full width featured bottom */}
      <button
        className="ip-team-card"
        onClick={() => onSelect(team.id)}
        style={{ animationDelay: '280ms' }}
      >
        <div className="ip-team-card__left">
          <Eyebrow>Convocatoria interna</Eyebrow>
          <h2 className="ip-team-card__title">{team.label}</h2>
          <p className="ip-team-card__desc">{team.description}</p>
        </div>
        <div className="ip-team-card__right">
          <span className={`ip-status ${team.statusActive ? 'ip-status--active' : ''}`}>
            <span className="ip-status__dot" />{team.status}
          </span>
          <span className="ip-team-card__cta">
            Postular ahora
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
              <path d="M2.5 7h9M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
        </div>
      </button>
    </div>
  )
}

// ─── SCREEN 2 — MUN MODALIDADES ───────────────────────────────────────────────

function MunModalidadesScreen({
  onSelect,
  onBack,
}: {
  onSelect: (m: MunModalidad) => void
  onBack: () => void
}) {
  const featured = MUN_MODALIDADES.find(m => m.featured)!
  const rest = MUN_MODALIDADES.filter(m => !m.featured)

  return (
    <div className="ip-screen ip-screen--mun">
      <BackBtn onClick={onBack} label="Volver a programas" />

      <header className="ip-hub-header ip-hub-header--compact">
        <Eyebrow>SoPeD MUN 2026</Eyebrow>
        <h1 className="ip-hub-header__h1">Elige tu modalidad</h1>
        <p className="ip-hub-header__sub">
          Selecciona el tipo de participación que corresponde a tu perfil o institución.
        </p>
      </header>

      {/* Featured — Representación Institucional */}
      <button className="ip-featured-card" onClick={() => onSelect(featured.id)}>
        <div className="ip-featured-card__badge-row">
          <span className="ip-badge ip-badge--gold">Modalidad destacada</span>
          <span className="ip-featured-card__cap">{featured.capacidad}</span>
        </div>
        <div className="ip-featured-card__body">
          <div className="ip-featured-card__left">
            <p className="ip-featured-card__perfil">{featured.perfil}</p>
            <h2 className="ip-featured-card__title">{featured.label}</h2>
            <p className="ip-featured-card__desc">{featured.descripcion}</p>
            <span className="ip-featured-card__para">{featured.paraQuien}</span>
          </div>
          <div className="ip-featured-card__right">
            <span className="ip-featured-card__cta">
              Registrar institución
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                <path d="M2.5 7h9M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
          </div>
        </div>
      </button>

      {/* Other modalidades — editorial row list */}
      <div className="ip-modal-list">
        {rest.map((m, i) => (
          <button
            key={m.id}
            className="ip-modal-row"
            onClick={() => onSelect(m.id)}
            style={{ animationDelay: `${i * 55}ms` }}
          >
            <div className="ip-modal-row__left">
              <span className="ip-modal-row__perfil">{m.perfil}</span>
              <h3 className="ip-modal-row__title">{m.label}</h3>
            </div>
            <div className="ip-modal-row__center">
              <p className="ip-modal-row__desc">{m.descripcion}</p>
              <span className="ip-modal-row__para">{m.paraQuien}</span>
            </div>
            <div className="ip-modal-row__right">
              <span className="ip-modal-row__cap">{m.capacidad}</span>
              <span className="ip-modal-row__arrow" aria-hidden="true">
                <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
                  <path d="M3 7.5h9M8.5 3.5l4 4-4 4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}

// ─── SCREEN 3 — FORM EMBED ────────────────────────────────────────────────────

function MunFormScreen({
  modalidad,
  onBack,
}: {
  modalidad: MunModalidad
  onBack: () => void
}) {
  const m = MUN_MODALIDADES.find(x => x.id === modalidad)!
  return (
    <div className="ip-screen ip-screen--form">
      <BackBtn onClick={onBack} label="Volver a modalidades" />
      <header className="ip-hub-header ip-hub-header--compact">
        <Eyebrow>SoPeD MUN 2026 · {m.perfil}</Eyebrow>
        <h1 className="ip-hub-header__h1">{m.label}</h1>
        <p className="ip-hub-header__sub">{m.descripcion}</p>
      </header>
      <div className="ip-embed">
        <iframe
          src={m.url}
          title={`Formulario — ${m.label}`}
          className="ip-embed__frame"
          frameBorder="0"
        >
          Cargando formulario…
        </iframe>
      </div>
    </div>
  )
}

function OtherFormScreen({
  program,
  onBack,
}: {
  program: Exclude<ProgramId, 'mun'>
  onBack: () => void
}) {
  const p = PROGRAMS.find(x => x.id === program)!

  // Insert renderForm inside the component scope
  const renderForm = () => {
    switch (program) {
      case 'sopedebate':
        return <DebateForm />
      case 'membresia':
        return <MembershipForm />
      case 'sopedtalks':
      case 'equipo':
        return <ContactForm />
      default:
        return null
    }
  }

  return (
    <div className="ip-screen ip-screen--form">
      <BackBtn onClick={onBack} label="Volver a programas" />
      <header className="ip-hub-header ip-hub-header--compact">
        <Eyebrow>{p.sublabel}</Eyebrow>
        <h1 className="ip-hub-header__h1">{p.label}</h1>
        <p className="ip-hub-header__sub">{p.description}</p>
      </header>
      <div className="ip-form-wrap">
        {renderForm()}
      </div>
    </div>
  )
}

// ─── PAGE ROOT ────────────────────────────────────────────────────────────────

export default function InscripcionPage() {
  const [view, setView] = useState<ViewState>({ screen: 'hub' })

  const handleProgram = (p: ProgramId) => {
    if (p === 'mun') setView({ screen: 'mun-modalidades' })
    else setView({ screen: 'other-form', program: p as Exclude<ProgramId, 'mun'> })
  }

  return (
    <Layout>
      <div className="ip-page">
        <div className="ip-page__inner">
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
