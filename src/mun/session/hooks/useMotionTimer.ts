'use client'

// hooks/useMotionTimer.ts

import { useState, useEffect, useCallback } from 'react'

export function useMotionTimer() {
  const [seconds, setSeconds] = useState(0)
  const [initial, setInitial] = useState(0)
  const [running, setRunning] = useState(false)

  useEffect(() => {
    if (!running) return
    if (seconds <= 0) { setRunning(false); return }
    const id = setInterval(() => {
      setSeconds(t => { if (t <= 1) { setRunning(false); return 0 } return t - 1 })
    }, 1000)
    return () => clearInterval(id)
  }, [running]) // eslint-disable-line react-hooks/exhaustive-deps

  const pct       = initial > 0 ? seconds / initial : 0
  const isExpired = seconds === 0 && initial > 0
  const isUrgent  = seconds > 0 && seconds < 30

  const startWith = useCallback((s: number) => {
    const v = Math.max(0, s)
    setInitial(v); setSeconds(v); setRunning(v > 0)
  }, [])

  const pause   = useCallback(() => setRunning(false), [])
  const resume  = useCallback(() => { if (seconds > 0) setRunning(true) }, [seconds])
  const stop    = useCallback(() => { setRunning(false); setSeconds(0); setInitial(0) }, [])
  const addTime = useCallback((extra: number) => setSeconds(t => Math.max(0, t + extra)), [])

  return { seconds, running, isExpired, isUrgent, pct, startWith, pause, resume, stop, addTime }
}
