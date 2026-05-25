'use client'

import { useEffect, useState } from 'react'

interface Props {
  onExit: () => void
  onComplete: () => void
}

export default function IntroLoader({ onExit, onComplete }: Props) {
  const [phase, setPhase] = useState<'idle' | 'enter' | 'pulse' | 'exit' | 'skip'>('idle')

  useEffect(() => {
    const already = sessionStorage.getItem('soped_intro_shown')
    if (already) {
      setPhase('skip')
      onExit()
      onComplete()
      return
    }

    sessionStorage.setItem('soped_intro_shown', '1')

    const t0 = setTimeout(() => setPhase('enter'), 50)
    const t1 = setTimeout(() => setPhase('pulse'), 700)   // logo visible, inicia pulso
    const t2 = setTimeout(() => {
      setPhase('exit')
      onExit()
    }, 2500)
    const t3 = setTimeout(() => onComplete(), 3200)

    return () => {
      clearTimeout(t0)
      clearTimeout(t1)
      clearTimeout(t2)
      clearTimeout(t3)
    }
  }, [onExit, onComplete])

  if (phase === 'skip') return null

  return (
    <>
      <style>{`
        @keyframes soped-heartbeat {
          0%   { transform: scale(1);     }
          14%  { transform: scale(1.04);  }
          28%  { transform: scale(1);     }
          42%  { transform: scale(1.025); }
          56%  { transform: scale(1);     }
          100% { transform: scale(1);     }
        }
      `}</style>

      <div
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 9999,
          background: '#050a10',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          opacity: phase === 'exit' ? 0 : 1,
          transition: phase === 'exit' ? 'opacity 0.65s cubic-bezier(0.4,0,0.2,1)' : 'none',
          pointerEvents: phase === 'exit' ? 'none' : 'all',
        }}
      >
        <div
          style={{
            opacity: phase === 'idle' || phase === 'enter' ? 0 : 1,
            transform: phase === 'idle' || phase === 'enter' ? 'scale(0.94)' : 'scale(1)',
            transition: 'opacity 0.6s ease, transform 0.8s cubic-bezier(0.25,0.46,0.45,0.94)',
            animation: phase === 'pulse'
              ? 'soped-heartbeat 1.8s cubic-bezier(0.4,0,0.2,1) infinite'
              : 'none',
          }}
        >
          <img
            src="/soped.svg"
            alt="SoPeD"
            style={{
              width: 160,
              height: 160,
              objectFit: 'contain',
              display: 'block',
              margin: '0 auto',
            }}
          />
        </div>
      </div>
    </>
  )
}
