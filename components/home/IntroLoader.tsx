'use client'

import { useEffect, useState } from 'react'

export default function IntroLoader({ onComplete }: { onComplete: () => void }) {
  const [phase, setPhase] = useState<'enter' | 'zoom' | 'glow' | 'exit'>('enter')

  useEffect(() => {
    const t1 = setTimeout(() => setPhase('zoom'), 600)
    const t2 = setTimeout(() => setPhase('glow'), 1200)
    const t3 = setTimeout(() => setPhase('exit'), 2400)
    const t4 = setTimeout(() => onComplete(), 3100)

    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
      clearTimeout(t3)
      clearTimeout(t4)
    }
  }, [onComplete])

  const logoStyle: React.CSSProperties = {
    opacity: phase === 'enter' ? 0 : phase === 'exit' ? 0 : 1,
    transform:
      phase === 'enter'
        ? 'scale(0.94)'
        : phase === 'zoom'
        ? 'scale(1.05)'
        : phase === 'glow'
        ? 'scale(1.0)'
        : 'scale(1.08)',
    filter: 'none',
    transition:
      phase === 'enter'
        ? 'opacity 0.6s ease, transform 0.8s ease'
        : phase === 'zoom'
        ? 'opacity 0.5s ease, transform 0.6s cubic-bezier(0.25,0.46,0.45,0.94)'
        : phase === 'glow'
        ? 'filter 0.6s ease, transform 0.6s ease'
        : 'opacity 0.5s ease, transform 0.5s ease',
  }

  const containerStyle: React.CSSProperties = {
    position: 'fixed',
    inset: 0,
    zIndex: 9999,
    background: '#192942',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    opacity: phase === 'exit' ? 0 : 1,
    transition: phase === 'exit' ? 'opacity 0.6s ease' : 'none',
  }

  return (
    <div style={containerStyle}>
      {/* Logo mark */}
      <div style={logoStyle}>
        <div style={{ textAlign: 'center' }}>
          <img
            src="/logo-soped.svg"
            alt="SoPeD Logo"
            style={{
              width: '80px',
              height: '80px',
              objectFit: 'contain',
              display: 'block',
              margin: '0 auto 24px',
            }}
          />
        </div>
      </div>
    </div>
  )
}
