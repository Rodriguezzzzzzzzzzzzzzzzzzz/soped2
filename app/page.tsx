'use client'

import { useState, useEffect } from 'react'
import IntroLoader from '@/components/home/IntroLoader'
import HomeContent from '@/components/home/HomeContent'

export default function HomePage() {
  // Start hidden — reveal only after we know if intro should play
  const [ready, setReady] = useState(false)
  const [showIntro, setShowIntro] = useState(false)
  const [contentVisible, setContentVisible] = useState(false)
  const [pageMounted, setPageMounted] = useState(false)

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
    const mountTimer = setTimeout(() => setPageMounted(true), 50)
    return () => clearTimeout(mountTimer)
  }, [])

  if (!ready) {
    // Solid background while JS loads — prevents flash
    return <div style={{ position: 'fixed', inset: 0, background: '#0F0A0B', zIndex: 9999 }} />
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
          transition: contentVisible ? 'opacity 0.7s ease, transform 0.9s cubic-bezier(0.16,1,0.3,1)' : 'none',
          transform: pageMounted ? 'translateY(0px)' : 'translateY(12px)',
          willChange: 'opacity, transform',
        }}
      >
        <HomeContent />
      </div>
    </>
  )
}
