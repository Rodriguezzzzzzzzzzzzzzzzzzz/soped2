'use client'

import { useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'

export default function SsrCover() {
  const pathname = usePathname()
  const removedRef = useRef(false)

  useEffect(() => {
    if (removedRef.current) return

    if (pathname === '/') {
      const done = () => {
        if (removedRef.current) return
        removedRef.current = true
        const cover = document.getElementById('soped-ssr-cover')
        if (cover) cover.style.display = 'none'
      }
      window.addEventListener('soped-intro-done', done, { once: true })
      return () => window.removeEventListener('soped-intro-done', done)
    } else {
      removedRef.current = true
      const cover = document.getElementById('soped-ssr-cover')
      if (cover) cover.style.display = 'none'
    }
  }, [pathname])

  return null
}
