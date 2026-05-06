'use client'

import { useEffect, useRef, ReactNode } from 'react'

interface RevealOnScrollProps {
  children: ReactNode
  delay?: number
  direction?: 'up' | 'left' | 'right' | 'none'
  className?: string
  style?: React.CSSProperties
  threshold?: number
}

export default function RevealOnScroll({
  children,
  delay = 0,
  direction = 'up',
  className = '',
  style = {},
  threshold = 0.15,
}: RevealOnScrollProps) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const translateMap = {
      up: 'translateY(36px)',
      left: 'translateX(-36px)',
      right: 'translateX(36px)',
      none: 'none',
    }

    el.style.opacity = '0'
    el.style.transform = translateMap[direction]
    el.style.transition = `opacity 0.8s cubic-bezier(0.16,1,0.3,1) ${delay}ms, transform 0.8s cubic-bezier(0.16,1,0.3,1) ${delay}ms`

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.style.opacity = '1'
          el.style.transform = 'none'
          observer.disconnect()
        }
      },
      { threshold }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [delay, direction, threshold])

  return (
    <div ref={ref} className={className} style={style}>
      {children}
    </div>
  )
}
