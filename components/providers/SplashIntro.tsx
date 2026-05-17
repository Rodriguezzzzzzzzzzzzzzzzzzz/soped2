'use client'

import { useEffect, useState } from 'react'

export default function SplashIntro() {
  const [exit, setExit] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => {
      setExit(true)
    }, 1400)

    return () => clearTimeout(t)
  }, [])

  if (exit) return null

  return (
    <div
      id="splash-lock"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 99999,
        background: '#05070d',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <img
        src="/logo-soped.svg"
        style={{
          width: 140,
        }}
      />
    </div>
  )
}