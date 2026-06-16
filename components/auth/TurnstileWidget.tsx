'use client'

import { useEffect, useRef } from 'react'
import { AUTH_CONFIG } from '@/lib/auth/config'

interface TurnstileWidgetProps {
  onVerify: (token: string) => void
  onExpire?: () => void
}

declare global {
  interface Window {
    turnstile?: {
      render: (container: string | HTMLElement, options: Record<string, unknown>) => string
      reset: (widgetId: string) => void
      remove: (widgetId: string) => void
    }
  }
}

export default function TurnstileWidget({ onVerify, onExpire }: TurnstileWidgetProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const widgetIdRef = useRef<string | null>(null)
  const loadedRef = useRef(false)

  const siteKey = AUTH_CONFIG.turnstile.siteKey

  useEffect(() => {
    if (!siteKey || !containerRef.current || loadedRef.current) return

    loadedRef.current = true

    const script = document.createElement('script')
    script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js'
    script.async = true
    script.defer = true

    script.onload = () => {
      if (window.turnstile && containerRef.current) {
        widgetIdRef.current = window.turnstile.render(containerRef.current, {
          sitekey: siteKey,
          theme: 'light',
          callback: (token: string) => onVerify(token),
          'expired-callback': () => onExpire?.(),
        })
      }
    }

    document.head.appendChild(script)

    return () => {
      if (widgetIdRef.current && window.turnstile) {
        window.turnstile.remove(widgetIdRef.current)
      }
    }
  }, [siteKey, onVerify, onExpire])

  if (!siteKey) return null

  return (
    <div
      ref={containerRef}
      style={{
        display: 'flex',
        justifyContent: 'center',
        minHeight: 65,
      }}
    />
  )
}
