'use client'

import { useState } from 'react'
import type { EventStatus } from './EventCard'

const filters: { label: string; value: 'all' | EventStatus }[] = [
  { label: 'Todos', value: 'all' },
  { label: 'Abiertos', value: 'abierto' },
  { label: 'Próximos', value: 'proximo' },
  { label: 'Cerrados', value: 'cerrado' },
]

export default function EventFilters({
  onFilter,
}: {
  onFilter: (value: 'all' | EventStatus) => void
}) {
  const [active, setActive] = useState<'all' | EventStatus>('all')

  const handleFilter = (value: 'all' | EventStatus) => {
    setActive(value)
    onFilter(value)
  }

  return (
    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
      {filters.map((f) => (
        <button
          key={f.value}
          onClick={() => handleFilter(f.value)}
          style={{
            fontFamily: 'var(--font-outfit)',
            fontSize: '0.75rem',
            fontWeight: 500,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            padding: '0.5rem 1.25rem',
            background:
              active === f.value
                ? 'rgba(184,150,12,0.12)'
                : 'rgba(255,255,255,0.04)',
            border:
              active === f.value
                ? '1px solid rgba(184,150,12,0.4)'
                : '1px solid rgba(255,255,255,0.08)',
            color:
              active === f.value
                ? '#d4af37'
                : 'rgba(255,255,255,0.45)',
            cursor: 'pointer',
            transition: 'all 0.25s ease',
          }}
        >
          {f.label}
        </button>
      ))}
    </div>
  )
}
