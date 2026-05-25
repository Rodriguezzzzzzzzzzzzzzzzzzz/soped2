'use client'

import { useState, useEffect } from 'react'
import IntroLoader from '@/components/home/IntroLoader'
import HomeContent from '@/components/home/HomeContent'

export default function HomePage() {
  // Start hidden — reveal only after we know if intro should play
  const [ready, setReady] = useState(false)
  const [showIntro, setShowIntro] = useState(false)
  const [contentVisible, setContentVisible] = useState(false)

  useEffect(() => {
    const already = sessionStorage.getItem('soped_intro_shown')
    if (already) {
      // Skip intro — show content immediately
      setContentVisible(true)
      setReady(true)
    } else {
      // Show intro
      setShowIntro(true)
      setReady(true)
    }
  }, [])

  if (!ready) {
    // Solid background while JS loads — prevents flash
    return <div style={{ position: 'fixed', inset: 0, background: '#05070d', zIndex: 9999 }} />
  }

  return (
    <>
      {showIntro && (
        <IntroLoader
          onExit={() => setContentVisible(true)}
          onComplete={() => setShowIntro(false)}
        />
      )}

      <div
        style={{
          opacity: contentVisible ? 1 : 0,
          visibility: contentVisible ? 'visible' : 'hidden',
          transition: contentVisible ? 'opacity 0.7s ease' : 'none',
        }}
      >
        <HomeContent />
      </div>
    </>
  )
}
