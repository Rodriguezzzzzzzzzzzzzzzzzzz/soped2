'use client'

import { useEffect, useState, useRef } from 'react'

interface Props {
  onComplete: () => void
}

export default function IntroLoader({ onComplete }: Props) {
  const [phase, setPhase] = useState<'idle' | 'enter' | 'pulse' | 'exit'>('idle')
  const calledRef = useRef(false)

  useEffect(() => {
    const t0 = setTimeout(() => setPhase('enter'), 50)
    const t1 = setTimeout(() => setPhase('pulse'), 700)
    const t2 = setTimeout(() => setPhase('exit'), 2600)
    const t3 = setTimeout(() => {
      if (!calledRef.current) {
        calledRef.current = true
        window.dispatchEvent(new CustomEvent('soped-intro-done'))
        onComplete()
      }
    }, 3400)

    return () => {
      clearTimeout(t0)
      clearTimeout(t1)
      clearTimeout(t2)
      clearTimeout(t3)
    }
  }, [onComplete])

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
          zIndex: 99999,
          background: '#1C0408',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          opacity: phase === 'exit' ? 0 : 1,
          transition: phase === 'exit'
            ? 'opacity 0.7s cubic-bezier(0.4,0,0.2,1)'
            : 'none',
          pointerEvents: 'none',
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
              width: 220,
              height: 220,
              objectFit: 'contain',
              display: 'block',
              margin: '0 auto',
            }}
          />
        </div>
      </div>

      <link rel="prefetch" href="/mun-bg.mp4" as="video" />
      <link rel="preload" href="/mun-bg.mp4" as="video" />
    </>
  )
}
