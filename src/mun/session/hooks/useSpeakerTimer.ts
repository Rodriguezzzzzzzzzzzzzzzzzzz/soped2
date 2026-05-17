'use client'

// hooks/useSpeakerTimer.ts

import { useState, useEffect, useCallback } from 'react'

export function useSpeakerTimer(defaultSeconds = 90) {
  const [maxTime,   setMaxTimeState] = useState(defaultSeconds)
  const [timeLeft,  setTimeLeft]     = useState(defaultSeconds)
  const [running,   setRunning]      = useState(false)

  useEffect(() => {
    if (!running) return
    if (timeLeft <= 0) { setRunning(false); return }
    const id = setInterval(() => {
      setTimeLeft(t => { if (t <= 1) { setRunning(false); return 0 } return t - 1 })
    }, 1000)
    return () => clearInterval(id)
  }, [running]) // eslint-disable-line react-hooks/exhaustive-deps

  const pct       = maxTime > 0 ? timeLeft / maxTime : 0
  const isExpired = timeLeft === 0
  const isUrgent  = pct > 0 && pct < 0.2

  const setMaxTime = useCallback((seconds: number) => {
    const v = Math.max(15, seconds)
    setMaxTimeState(v)
    setTimeLeft(v)
    setRunning(false)
  }, [])

  const start         = useCallback(() => { if (timeLeft > 0) setRunning(true) }, [timeLeft])
  const pause         = useCallback(() => setRunning(false), [])
  const reset         = useCallback(() => { setRunning(false); setTimeLeft(maxTime) }, [maxTime])
  const resetAndStart = useCallback(() => { setTimeLeft(maxTime); setRunning(true)  }, [maxTime])
  const forceSet      = useCallback((s: number) => setTimeLeft(Math.max(0, s)), [])

  return { maxTime, timeLeft, running, pct, isExpired, isUrgent, setMaxTime, start, pause, reset, resetAndStart, forceSet }
}
