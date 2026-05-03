'use client'

import { useState } from 'react'
import Layout from '@/components/layout/Layout'
import EventCard, { type Event, type EventStatus } from '@/components/events/EventCard'
import EventFilters from '@/components/events/EventFilters'

const events: Event[] = [
  {
    id: '1',
    title: 'SoPeD MUN 2025',
    type: 'MUN Internacional',
    status: 'abierto',
    date: 'Julio 18–20, 2025',
    location: 'Lima, Perú',
    description: 'La edición 2025 de nuestro Modelo de Naciones Unidas. 5 comités, delegados de todo el Perú y estándares internacionales.',
    href: '/mun',
  },
  {
    id: '2',
    title: 'Torneo Regional de Debate Escolar',
    type: 'Debate Escolar',
    status: 'abierto',
    date: 'Agosto 5–6, 2025',
    location: 'Lima, Perú',
    description: 'Torneo regional para estudiantes de 1ro a 5to de secundaria. Formato parlamentario adaptado.',
    href: '/debate-escolar',
  },
  {
    id: '3',
    title: 'Taller de Argumentación Avanzada',
    type: 'Taller',
    status: 'proximo',
    date: 'Septiembre 2025',
    location: 'Lima, Perú',
    description: 'Taller intensivo de técnicas de argumentación para debatientes con experiencia intermedia y avanzada.',
    href: '/programas',
  },
  {
    id: '4',
    title: 'Workshop: Oratoria & Comunicación',
    type: 'Taller',
    status: 'proximo',
    date: 'Octubre 2025',
    location: 'Lima, Perú',
    description: 'Formación en oratoria pública, control de voz y comunicación persuasiva con instructores especializados.',
    href: '/programas',
  },
  {
    id: '5',
    title: 'SoPeD MUN 2024',
    type: 'MUN Internacional',
    status: 'cerrado',
    date: 'Diciembre 2024',
    location: 'Lima, Perú',
    description: 'Edición anterior de SoPeD MUN. Más de 80 delegados participaron de 4 comités internacionales.',
    href: '/mun',
  },
]

export default function EventosPage() {
  const [filter, setFilter] = useState<'all' | EventStatus>('all')

  const filtered = filter === 'all' ? events : events.filter((e) => e.status === filter)

  return (
    <Layout>
      <section style={{ paddingTop: '140px', paddingBottom: '4rem', background: 'linear-gradient(180deg, #091c36 0%, var(--dark) 100%)' }}>
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
            <span className="deco-line" />
            <span style={{ fontFamily: 'var(--font-outfit)', fontSize: '0.65rem', fontWeight: 500, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(184,150,12,0.7)' }}>
              Catálogo de Eventos
            </span>
          </div>
          <h1 style={{ fontFamily: 'var(--font-cormorant)', fontSize: 'clamp(3rem, 6vw, 5rem)', fontWeight: 400, color: '#fff', lineHeight: 1.08, marginBottom: '2rem' }}>
            Eventos & competencias
          </h1>
          <EventFilters onFilter={setFilter} />
        </div>
      </section>

      <section style={{ padding: '3rem 0 6rem' }}>
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          {filtered.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '4rem 0' }}>
              <p style={{ fontFamily: 'var(--font-outfit)', fontSize: '0.9rem', color: 'rgba(255,255,255,0.3)' }}>
                No hay eventos en esta categoría por el momento.
              </p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '1.5rem' }}>
              {filtered.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          )}
        </div>
      </section>
    </Layout>
  )
}
