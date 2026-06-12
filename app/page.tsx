'use client'

import { useState, useEffect } from 'react'
import IntroLoader from '@/components/home/IntroLoader'
import HomeContent from '@/components/home/HomeContent'

export default function HomePage() {
  const [ready, setReady] = useState(false)
  const [showIntro, setShowIntro] = useState(true)

  useEffect(() => {
    setReady(true)
  }, [])

  if (!ready) {
    return <div style={{ position: 'fixed', inset: 0, background: '#0F0A0B', zIndex: 99999 }} />
  }

  return (
    <>
      {showIntro && (
        <IntroLoader onComplete={() => setShowIntro(false)} />
      )}

      {/* Content always rendered — fully painted under the overlay */}
      <HomeContent />
    </>
  )
}
