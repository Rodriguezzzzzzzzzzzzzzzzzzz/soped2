'use client'

import { useState } from 'react'
import Link from 'next/link'

const navItems = [
  { id: 'overview', label: 'Resumen', icon: '◈' },
  { id: 'events', label: 'Mis Eventos', icon: '◆' },
  { id: 'certificates', label: 'Certificados', icon: '◇' },
  { id: 'materials', label: 'Materiales', icon: '▣' },
]

export default function DashboardLayout({
  children,
  activePanel,
  onNavigate,
  user,
}: {
  children: React.ReactNode
  activePanel: string
  onNavigate: (panel: string) => void
  user: { name?: string; role?: string; email?: string }
}) {
  const displayName = user?.name || user?.email || 'Usuario'

  return (
    <div style={{ display: 'flex', minHeight: '100vh', paddingTop: '80px' }}>
      {/* Sidebar */}
      <aside
        className="glass"
        style={{
          width: '260px',
          minHeight: 'calc(100vh - 80px)',
          padding: '2rem 1.5rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '2rem',
          position: 'sticky',
          top: '80px',
          borderRight: '1px solid rgba(255,255,255,0.06)',
          borderTop: 'none',
          borderLeft: 'none',
          borderBottom: 'none',
          flexShrink: 0,
        }}
      >
        {/* Profile */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <div
            style={{
              width: '44px',
              height: '44px',
              background: 'rgba(184,150,12,0.12)',
              border: '1px solid rgba(184,150,12,0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <span style={{ fontFamily: 'var(--font-cormorant)', fontSize: '1.3rem', color: '#d4af37', fontWeight: 600 }}>
              {displayName.charAt(0).toUpperCase()}
            </span>
          </div>
          <div>
            <p style={{ fontFamily: 'var(--font-outfit)', fontSize: '0.9rem', fontWeight: 500, color: '#fff' }}>{displayName}</p>
            <p style={{ fontFamily: 'var(--font-outfit)', fontSize: '0.72rem', color: 'rgba(255,255,255,0.35)', letterSpacing: '0.05em' }}>{user?.email || ''}</p>
            <span style={{ display: 'inline-block', marginTop: '0.25rem', fontFamily: 'var(--font-outfit)', fontSize: '0.62rem', fontWeight: 500, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(184,150,12,0.7)', border: '1px solid rgba(184,150,12,0.2)', padding: '0.15rem 0.5rem' }}>
              {user?.role || 'user'}
            </span>
          </div>
        </div>

        <div className="section-divider" />

        {/* Nav */}
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '0.7rem 1rem',
                background: activePanel === item.id ? 'rgba(184,150,12,0.08)' : 'transparent',
                border: activePanel === item.id ? '1px solid rgba(184,150,12,0.2)' : '1px solid transparent',
                color: activePanel === item.id ? '#d4af37' : 'rgba(255,255,255,0.45)',
                cursor: 'pointer',
                fontFamily: 'var(--font-outfit)',
                fontSize: '0.85rem',
                fontWeight: activePanel === item.id ? 500 : 400,
                letterSpacing: '0.03em',
                transition: 'all 0.25s ease',
                textAlign: 'left',
                width: '100%',
              }}
            >
              <span style={{ fontSize: '0.7rem', opacity: 0.8 }}>{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>

        <div style={{ marginTop: 'auto' }}>
          <div className="section-divider" style={{ marginBottom: '1rem' }} />
          <Link href="/" className="btn-text" style={{ fontSize: '0.8rem' }}>
            ← Volver al sitio
          </Link>
        </div>
      </aside>

      {/* Main content */}
      <main style={{ flex: 1, padding: '2.5rem', minWidth: 0 }}>
        {children}
      </main>
    </div>
  )
}
