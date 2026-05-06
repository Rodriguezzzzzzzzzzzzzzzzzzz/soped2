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
    filter:
      phase === 'glow'
        ? 'drop-shadow(0 0 32px rgba(184,150,12,0.6)) drop-shadow(0 0 64px rgba(184,150,12,0.25))'
        : 'drop-shadow(0 0 8px rgba(184,150,12,0.2))',
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
    background: '#091c36',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    opacity: phase === 'exit' ? 0 : 1,
    transition: phase === 'exit' ? 'opacity 0.6s ease' : 'none',
  }

  return (
    <div style={containerStyle}>
      {/* Background geometric */}
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            width: '500px',
            height: '500px',
            transform: 'translate(-50%, -50%)',
            border: '1px solid rgba(184,150,12,0.06)',
            borderRadius: '50%',
          }}
        />
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            width: '300px',
            height: '300px',
            transform: 'translate(-50%, -50%)',
            border: '1px solid rgba(184,150,12,0.04)',
            borderRadius: '50%',
          }}
        />
      </div>

      {/* Logo mark */}
      <div style={logoStyle}>
        <div style={{ textAlign: 'center' }}>
        {/* Emblem */}
<div style={{ margin: '0 auto 24px', width: '80px', height: '80px' }}>
  <img
    src="/logo-soped.svg"
    alt="SoPeD"
    style={{ width: '100%', height: '100%', objectFit: 'contain' }}
  />
</div>

          {/* Name */}
          <p
            style={{
              fontFamily: 'var(--font-cormorant)',
              fontSize: '2rem',
              fontWeight: 600,
              color: '#fff',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              marginBottom: '6px',
            }}
          >
            SoPeD
          </p>

          {/* Tagline */}
          <p
            style={{
              fontFamily: 'var(--font-outfit)',
              fontSize: '0.65rem',
              fontWeight: 300,
              color: 'rgba(255,255,255,0.35)',
              letterSpacing: '0.25em',
              textTransform: 'uppercase',
            }}
          >
            Sociedad Peruana de Debate
          </p>

          {/* Gold line */}
          <div
            style={{
              width: '40px',
              height: '1px',
              background: 'rgba(184,150,12,0.5)',
              margin: '20px auto 0',
              transition: 'width 0.8s ease',
            }}
          />
        </div>
      </div>
    </div>
  )
}
