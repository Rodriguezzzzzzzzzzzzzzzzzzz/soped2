'use client'

import { useState } from 'react'
import type { CommitteeState } from '@/src/mun-v2/types/mun.types'

const glass = 'rgba(255,255,255,0.04)'
const border = 'rgba(255,255,255,0.08)'
const text = 'rgba(255,255,255,0.9)'
const muted = 'rgba(255,255,255,0.45)'
const dim = 'rgba(255,255,255,0.22)'
const goldL = '#ECE5D6'

const inputStyle: React.CSSProperties = {
  width: '100%', background: 'rgba(255,255,255,0.04)',
  border: `1px solid ${border}`, color: text,
  padding: '0.65rem 1rem', fontSize: '0.88rem',
  fontFamily: 'var(--font-outfit)', outline: 'none',
  boxSizing: 'border-box', borderRadius: '2px',
}

const g = (e: React.CSSProperties = {}): React.CSSProperties =>
  ({ background: glass, border: `1px solid ${border}`, borderRadius: '3px', ...e })

const serif = (sz = '1rem', e: React.CSSProperties = {}): React.CSSProperties =>
  ({ fontFamily: 'var(--font-cormorant)', fontSize: sz, color: text, ...e })

interface AgendaPanelProps {
  state: CommitteeState
  addAgendaItem: (title: string) => void
  removeAgendaItem: (id: string) => void
  updateAgendaItem: (id: string, title: string) => void
  setActiveAgenda: (id: string | null) => void
  ctl: boolean
}

export function AgendaPanel({ state, addAgendaItem, removeAgendaItem, updateAgendaItem, setActiveAgenda, ctl }: AgendaPanelProps) {
  const [newTitle, setNewTitle] = useState('')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editTitle, setEditTitle] = useState('')

  const handleAdd = () => {
    const t = newTitle.trim()
    if (!t) return
    addAgendaItem(t)
    setNewTitle('')
  }

  const handleStartEdit = (id: string, title: string) => { setEditingId(id); setEditTitle(title) }
  const handleSaveEdit = (id: string) => { const t = editTitle.trim(); if (t) updateAgendaItem(id, t); setEditingId(null) }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <h2 style={{ ...serif('1.8rem'), fontWeight: 400, margin: 0 }}>Agenda</h2>
      {ctl && (
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <input placeholder="Add agenda item..." value={newTitle} onChange={e => setNewTitle(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleAdd()}
            style={{ flex: 1, ...inputStyle }} />
          <button onClick={handleAdd} disabled={!newTitle.trim()} style={{
            background: 'rgba(236,229,214,0.12)', border: '1px solid rgba(236,229,214,0.4)', color: goldL,
            fontFamily: 'var(--font-outfit)', fontSize: '0.72rem', fontWeight: 500,
            letterSpacing: '0.08em', textTransform: 'uppercase', padding: '0.4rem 0.9rem',
            cursor: newTitle.trim() ? 'pointer' : 'not-allowed', borderRadius: '2px',
            opacity: newTitle.trim() ? 1 : 0.4,
          }}>Add</button>
        </div>
      )}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
        {state.agenda.length === 0 && <p style={{ fontFamily: 'var(--font-outfit)', fontSize: '0.8rem', color: dim, padding: '2rem 0', textAlign: 'center' }}>No agenda items yet</p>}
        {state.agenda.map((item, i) => (
          <div key={item.id} style={{ ...g({ padding: '0.65rem 0.875rem', display: 'flex', alignItems: 'center', gap: '0.75rem',
            borderLeft: item.isActive ? '3px solid ' + goldL : '3px solid transparent' }) }}>
            <span style={{ fontFamily: 'var(--font-outfit)', fontSize: '0.65rem', color: dim, minWidth: '16px' }}>{i + 1}</span>
            {editingId === item.id ? (
              <input value={editTitle} onChange={e => setEditTitle(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSaveEdit(item.id)}
                onBlur={() => handleSaveEdit(item.id)}
                autoFocus style={{ flex: 1, ...inputStyle }} />
            ) : (
              <span style={{ fontFamily: 'var(--font-outfit)', fontSize: '0.82rem', color: item.isActive ? goldL : text, flex: 1, cursor: ctl ? 'pointer' : 'default' }}
                onClick={() => ctl && setActiveAgenda(item.isActive ? null : item.id)}>
                {item.title}
              </span>
            )}
            {item.isActive && <span style={{ fontFamily: 'var(--font-outfit)', fontSize: '0.55rem', color: goldL, letterSpacing: '0.1em', textTransform: 'uppercase' }}>Active</span>}
            {ctl && editingId !== item.id && (
              <button onClick={() => handleStartEdit(item.id, item.title)} style={{ background: 'none', border: 'none', color: dim, cursor: 'pointer', fontSize: '0.75rem', padding: '0 2px' }}>✎</button>
            )}
            {ctl && (
              <button onClick={() => removeAgendaItem(item.id)} style={{ background: 'none', border: 'none', color: dim, cursor: 'pointer', fontSize: '1rem', padding: '0 2px' }}>×</button>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
