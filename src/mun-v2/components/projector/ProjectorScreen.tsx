'use client'

import { useState, useEffect, useMemo, useRef } from 'react'
import type { CommitteeState } from '@/src/mun-v2/types/mun.types'
import { subscribeSessionState } from '@/src/mun-v2/services/munService'
import { fmt } from '@/src/mun-v2/constants/mun.constants'

const T = {
  gold:   '#ECE5D6',
  dark:   '#1a1a1a',
  darker: '#141414',
  border: 'rgba(255,255,255,0.08)',
  muted:  'rgba(255,255,255,0.5)',
  dim:    'rgba(255,255,255,0.25)',
  green:  'rgba(34,197,94,0.9)',
  red:    'rgba(239,68,68,0.9)',
  amber:  'rgba(236,229,214,0.9)',
}

function MiniBadge({ label, pass }: { label: string; pass: boolean }) {
  return (
    <div style={{
      display:'inline-flex', alignItems:'center', gap:'0.4rem',
      padding:'0.2rem 0.6rem', borderRadius:'2px',
      background:pass?'rgba(34,197,94,0.1)':'rgba(239,68,68,0.1)',
      border:`1px solid ${pass?'rgba(34,197,94,0.3)':'rgba(239,68,68,0.3)'}`,
      fontFamily:'var(--font-outfit)', fontSize:'0.65rem', color:pass?T.green:T.red,
    }}>
      <span>{pass?'✓':'✗'}</span>
      <span>{label}</span>
    </div>
  )
}

export default function ProjectorScreen({ committeeId }: { committeeId: string }) {
  const [state, setState] = useState<CommitteeState | null>(null)
  const [connected, setConnected] = useState(false)
  const [displayTimeLeft, setDisplayTimeLeft] = useState(0)
  const [caucusDisplayTimeLeft, setCaucusDisplayTimeLeft] = useState(0)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    const unsub = subscribeSessionState(
      committeeId,
      (saved) => {
        setState(saved)
        setConnected(true)
      },
      () => setConnected(false),
    )
    return () => {
      unsub()
      setConnected(false)
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [committeeId])

  useEffect(() => {
    if (timerRef.current) clearInterval(timerRef.current)
    timerRef.current = setInterval(() => {
      setState(prev => {
        if (!prev) return prev
        const now = Date.now()
        let speakerLeft = prev.speakerTimerRemaining ?? 0
        if (prev.speakerTimerStartedAt) {
          speakerLeft = Math.max(0, speakerLeft - Math.floor((now - prev.speakerTimerStartedAt) / 1000))
        }
        let caucusLeft = prev.caucus?.timeLeft ?? 0
        if (prev.caucus?.startedAt && prev.caucus?.active) {
          caucusLeft = Math.max(0, prev.caucus.totalDuration - Math.floor((now - prev.caucus.startedAt) / 1000))
        }
        setDisplayTimeLeft(speakerLeft)
        setCaucusDisplayTimeLeft(caucusLeft)
        return prev
      })
    }, 1000)
    return () => { if (timerRef.current) clearInterval(timerRef.current) }
  }, [])

  const quorum = useMemo(() => {
    if (!state) return { present:0, voting:0, absent:0, total:0, quorumMet:false, quorumRequired:0 }
    const total   = state.delegates.length
    const present = Object.values(state.rollCall).filter(s => s === 'present').length
    const voting  = Object.values(state.rollCall).filter(s => s === 'voting').length
    const absent  = Object.values(state.rollCall).filter(s => s === 'absent').length
    const quorumRequired = Math.floor(total / 2) + 1
    return { present, voting, absent, total, quorumMet: (present+voting) >= quorumRequired, quorumRequired }
  }, [state])

  const currentSpeaker = useMemo(() => {
    if (!state || state.currentSpeakerIndex < 0 || state.currentSpeakerIndex >= state.speakersList.length) return null
    return state.speakersList[state.currentSpeakerIndex]
  }, [state])

  const nextSpeakers = useMemo(() => {
    if (!state) return []
    return state.speakersList.slice(state.currentSpeakerIndex + 1, state.currentSpeakerIndex + 6)
  }, [state])

  const speakerMaxTime = state?.speakerTimeSecs ?? 90
  const speakerPct = speakerMaxTime > 0 ? displayTimeLeft / speakerMaxTime : 0
  const speakerRunning = state?.speakerTimerStartedAt != null

  return (
    <div style={{
      minHeight:'100vh', background:`linear-gradient(135deg, ${T.darker} 0%, ${T.dark} 100%)`,
      fontFamily:'var(--font-outfit)', color:T.gold, overflow:'hidden',
      display:'flex', flexDirection:'column',
    }}>
      {!state ? (
        <div style={{ flex:1, display:'flex', alignItems:'center', justifyContent:'center', flexDirection:'column', gap:'1rem' }}>
          <div style={{ width:'80px', height:'80px', border:'2px solid rgba(236,229,214,0.3)', display:'flex', alignItems:'center', justifyContent:'center' }}>
            <span style={{ fontFamily:'var(--font-cormorant)', fontSize:'2.5rem', fontWeight:600, color:T.gold }}>S</span>
          </div>
          <p style={{ fontFamily:'var(--font-cormorant)', fontSize:'2rem', fontWeight:400, color:T.gold }}>SoPeD MUN</p>
          <p style={{ fontSize:'1.1rem', color:T.muted }}>Waiting for Chair to configure session...</p>
          <p style={{ fontSize:'0.75rem', color:T.dim, fontFamily:'var(--font-outfit)' }}>Session ID: {committeeId}</p>
        </div>
      ) : (
        <>
          {/* ── Header Bar ── */}
          <div style={{
            padding:'1rem 2rem', borderBottom:`1px solid ${T.border}`,
            display:'flex', justifyContent:'space-between', alignItems:'center',
            flexShrink:0,
          }}>
            <div style={{ display:'flex', alignItems:'center', gap:'1rem' }}>
              <div style={{ width:'36px', height:'36px', border:'1px solid rgba(236,229,214,0.4)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                <span style={{ fontFamily:'var(--font-cormorant)', fontSize:'1.1rem', fontWeight:600, color:T.gold }}>S</span>
              </div>
              <div>
                <p style={{ fontFamily:'var(--font-cormorant)', fontSize:'1.3rem', fontWeight:500, margin:0, lineHeight:1.2 }}>{state.config.name || 'Committee'}</p>
                <p style={{ fontSize:'0.85rem', color:T.muted, margin:0, lineHeight:1.3 }}>{state.config.topic || ''}</p>
              </div>
            </div>
            <div style={{ display:'flex', alignItems:'center', gap:'1rem' }}>
              <MiniBadge label={quorum.quorumMet ? 'Quorum' : 'No Quorum'} pass={quorum.quorumMet} />
              <span style={{ fontSize:'0.7rem', color:connected ? T.green : T.red }}>{connected ? '● Live' : '○ Offline'}</span>
              <span style={{ fontSize:'0.85rem', color:state.phase==='suspended'?T.red:T.gold }}>
                {state.phase === 'rollcall' ? '⟳ Roll Call'
                  : state.phase === 'suspended' ? '⏸ Suspended'
                  : state.phase === 'closed' ? '🔒 Closed'
                  : '● In Session'}
              </span>
            </div>
          </div>

          {/* ── Main Grid ── */}
          <div style={{ flex:1, display:'grid', gridTemplateColumns:'1.4fr 1fr', gap:'0', overflow:'hidden' }}>

            {/* ── Left: Speaker + Timer ── */}
            <div style={{
              display:'flex', flexDirection:'column', justifyContent:'center',
              padding:'2rem 3rem', borderRight:`1px solid ${T.border}`,
              position:'relative',
            }}>
              {currentSpeaker ? (
                <>
                  <p style={{ fontSize:'1rem', color:T.muted, letterSpacing:'0.15em', textTransform:'uppercase', marginBottom:'0.5rem' }}>Current Speaker</p>
                  <p style={{ fontFamily:'var(--font-cormorant)', fontSize:'3.5rem', fontWeight:500, margin:'0 0 1rem', lineHeight:1.1 }}>
                    {state.delegates.find(d => d.name === currentSpeaker.countryName)?.flag}{' '}
                    {currentSpeaker.countryName}
                  </p>
                  <div style={{ marginBottom:'1.5rem' }}>
                    <div style={{ height:'6px', background:'rgba(255,255,255,0.06)', borderRadius:'3px', overflow:'hidden', marginBottom:'0.75rem' }}>
                      <div style={{
                        height:'100%', width:`${speakerPct*100}%`, borderRadius:'3px', transition:'width 1s linear',
                        background: speakerPct < 0.1 ? T.red : speakerPct < 0.3 ? T.amber : `linear-gradient(90deg, ${T.gold}, #fff)`,
                      }}/>
                    </div>
                    <p style={{ fontFamily:'var(--font-cormorant)', fontSize:'5rem', fontWeight:600, margin:0, lineHeight:1, letterSpacing:'0.05em' }}>
                      {fmt(displayTimeLeft)}
                    </p>
                  </div>
                  <div style={{ display:'flex', gap:'1rem', flexWrap:'wrap' }}>
                    {speakerRunning
                      ? <span style={{ fontSize:'0.9rem', color:T.green, letterSpacing:'0.1em' }}>● LIVE</span>
                      : <span style={{ fontSize:'0.9rem', color:T.muted }}>⏸ Paused</span>}
                    <span style={{ fontSize:'0.8rem', color:T.dim }}>Time limit: {fmt(speakerMaxTime)}</span>
                  </div>
                </>
              ) : (
                <div style={{ textAlign:'center' }}>
                  <p style={{ fontFamily:'var(--font-cormorant)', fontSize:'3rem', fontWeight:400, color:T.muted, margin:0 }}>No Active Speaker</p>
                  <p style={{ fontSize:'1rem', color:T.dim, marginTop:'0.5rem' }}>Waiting for Chair to start the speakers list</p>
                </div>
              )}
            </div>

            {/* ── Right: Info Panels ── */}
            <div style={{
              display:'flex', flexDirection:'column', gap:'0',
              padding:'1.5rem 2rem', overflow:'auto',
            }}>
              {/* Next Speakers */}
              <div style={{ padding:'1rem 0', borderBottom:`1px solid ${T.border}` }}>
                <p style={{ fontSize:'0.85rem', color:T.muted, letterSpacing:'0.15em', textTransform:'uppercase', marginBottom:'0.75rem' }}>Next Speakers</p>
                {nextSpeakers.length === 0 ? (
                  <p style={{ fontSize:'1rem', color:T.dim }}>No speakers queued</p>
                ) : (
                  <div style={{ display:'flex', flexDirection:'column', gap:'0.35rem' }}>
                    {nextSpeakers.map((s, i) => (
                      <div key={`${s.countryName}-${i}`} style={{
                        display:'flex', alignItems:'center', gap:'0.75rem',
                        padding:'0.4rem 0.75rem', background:'rgba(255,255,255,0.03)',
                        border:`1px solid ${T.border}`, borderRadius:'2px',
                      }}>
                        <span style={{ fontSize:'0.75rem', color:T.dim, minWidth:'1.2rem' }}>{i+1}.</span>
                        <span style={{ fontSize:'1rem' }}>{state.delegates.find(d=>d.name===s.countryName)?.flag}</span>
                        <span style={{ fontSize:'1rem', color:T.gold }}>{s.countryName}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Active Motion */}
              <div style={{ padding:'1rem 0', borderBottom:`1px solid ${T.border}` }}>
                <p style={{ fontSize:'0.85rem', color:T.muted, letterSpacing:'0.15em', textTransform:'uppercase', marginBottom:'0.5rem' }}>Active Motion</p>
                {state.activeMotion ? (
                  <div style={{ display:'flex', flexDirection:'column', gap:'0.25rem' }}>
                    <p style={{ fontSize:'1.6rem', fontFamily:'var(--font-cormorant)', fontWeight:500, margin:0 }}>{state.activeMotion.label}</p>
                    <p style={{ fontSize:'0.85rem', color:T.muted }}>Proposed by {state.activeMotion.proposer || 'Floor'} · {new Date(state.activeMotion.timestamp).toLocaleTimeString()}</p>
                  </div>
                ) : (
                  <p style={{ fontSize:'1rem', color:T.dim }}>No active motion</p>
                )}
              </div>

              {/* Active Caucus */}
              <div style={{ padding:'1rem 0', borderBottom:`1px solid ${T.border}` }}>
                <p style={{ fontSize:'0.85rem', color:T.muted, letterSpacing:'0.15em', textTransform:'uppercase', marginBottom:'0.5rem' }}>Caucus</p>
                {state.caucus?.active ? (
                  <div>
                    <p style={{ fontSize:'1.4rem', fontFamily:'var(--font-cormorant)', fontWeight:500, margin:'0 0 0.5rem' }}>
                      {state.caucus.type === 'moderated' ? 'Moderated Caucus' : 'Unmoderated Caucus'}
                    </p>
                    <p style={{ fontFamily:'var(--font-cormorant)', fontSize:'2.5rem', fontWeight:600, margin:'0 0 0.25rem', color:caucusDisplayTimeLeft < 30 ? T.red : T.gold }}>
                      {fmt(caucusDisplayTimeLeft)}
                    </p>
                    <p style={{ fontSize:'0.8rem', color:T.muted }}>Time per speaker: {fmt(state.caucus.timePerSpeaker)}</p>
                  </div>
                ) : (
                  <p style={{ fontSize:'1rem', color:T.dim }}>No active caucus</p>
                )}
              </div>

              {/* Quorum */}
              <div style={{ padding:'1rem 0' }}>
                <p style={{ fontSize:'0.85rem', color:T.muted, letterSpacing:'0.15em', textTransform:'uppercase', marginBottom:'0.5rem' }}>Quorum Status</p>
                <div style={{ display:'grid', gridTemplateColumns:'repeat(3, 1fr)', gap:'0.5rem', marginBottom:'0.5rem' }}>
                  {([
                    [quorum.present, 'Present', T.green],
                    [quorum.voting, 'Voting', T.amber],
                    [quorum.absent, 'Absent', T.red],
                  ] as [number, string, string][]).map(([n, lb, c]) => (
                    <div key={lb} style={{
                      padding:'0.6rem', textAlign:'center', borderRadius:'2px',
                      background:'rgba(255,255,255,0.03)', border:`1px solid ${T.border}`,
                    }}>
                      <p style={{ fontSize:'2rem', fontWeight:600, color:c, margin:0, lineHeight:1 }}>{n}</p>
                      <p style={{ fontSize:'0.65rem', color:T.dim, margin:'0.25rem 0 0', letterSpacing:'0.08em', textTransform:'uppercase' }}>{lb}</p>
                    </div>
                  ))}
                </div>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'0.4rem 0', borderTop:`1px solid ${T.border}` }}>
                  <span style={{ fontSize:'0.85rem', color:T.muted }}>Required: ≥{quorum.quorumRequired} / {quorum.total}</span>
                  <span style={{ fontSize:'1.2rem', fontWeight:600, color:quorum.quorumMet ? T.green : T.red }}>{quorum.quorumMet ? '✓' : '✗'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* ── Footer ── */}
          <div style={{
            padding:'0.75rem 2rem', borderTop:`1px solid ${T.border}`,
            display:'flex', justifyContent:'space-between', alignItems:'center',
            fontSize:'0.7rem', color:T.dim, flexShrink:0,
          }}>
            <span>SoPeD MUN · Committee Session System</span>
            <span>{state.motionHistory.length} motions · {state.speechHistory.length} speeches · {Object.keys(state.scores).length} scored</span>
          </div>
        </>
      )}
    </div>
  )
}
