'use client'

// hooks/useMunSession.ts
// FIX: nanoid removed — uses uid() from constants (no external deps)

import { useReducer, useCallback, useMemo } from 'react'
import { munReducer, createInitialState } from '@/src/mun-v2/state/munReducer'
import { uid } from '@/src/mun-v2/constants/mun.constants'
import type {
  CommitteeState,
  Country,
  DelegateStatus,
  Motion,
  RankingEntry,
  QuorumStats,
} from '@/src/mun-v2/types/mun.types'

const SCORE_MOTION_PROPOSED = 0.5
const SCORE_MOTION_APPROVED = 0.5
const SCORE_RESOLUTION      = 8.0

export function useMunSession(initial?: Partial<CommitteeState>) {
  const [state, dispatch] = useReducer(
    munReducer,
    { ...createInitialState(), ...initial }
  )

  // ── Logging ──────────────────────────────────────────────────────────────
  const log = useCallback((
    message: string,
    type: 'info' | 'success' | 'warning' | 'error' = 'info'
  ) => {
    dispatch({ type: 'ADD_LOG', entry: { id: uid(), message, type, timestamp: new Date().toISOString() } })
  }, [])

  // ── Internal scoring ──────────────────────────────────────────────────────
  const addScore = useCallback((countryName: string, points: number, reason: string) => {
    if (!countryName || countryName === 'Floor' || !countryName.trim()) return
    dispatch({ type: 'ADD_SCORE', entry: { countryName, points, reason, timestamp: new Date().toISOString() } })
  }, [])

  // ── Phase ─────────────────────────────────────────────────────────────────
  const setPhase = useCallback((phase: CommitteeState['phase']) => {
    dispatch({ type: 'SET_PHASE', phase })
  }, [])

  // ── Setup ─────────────────────────────────────────────────────────────────
  const setConfig = useCallback((key: string, value: string) => {
    dispatch({ type: 'SET_CONFIG', key, value })
  }, [])

  const setDelegates = useCallback((delegates: Country[]) => {
    dispatch({ type: 'SET_DELEGATES', delegates })
  }, [])

  // ── Roll Call ─────────────────────────────────────────────────────────────
  const setDelegateStatus = useCallback((country: string, status: DelegateStatus) => {
    dispatch({ type: 'SET_ROLLCALL_STATUS', country, status })
  }, [])

  const completeRollCall = useCallback(() => {
    dispatch({ type: 'COMPLETE_ROLLCALL' })
    log('Roll call completed — session open', 'success')
  }, [log])

  // ── Speakers ──────────────────────────────────────────────────────────────
  const addSpeaker = useCallback((country: string) => {
    if (state.speakersList.some(s => s.countryName === country)) return
    dispatch({ type: 'ADD_SPEAKER', country })
    log(`${country} added to speakers list`)
  }, [state.speakersList, log])

  const removeSpeaker = useCallback((country: string) => {
    dispatch({ type: 'REMOVE_SPEAKER', country })
  }, [])

  const advanceSpeaker = useCallback(() => {
    const next = state.currentSpeakerIndex + 1
    if (next < state.speakersList.length) {
      log(`${state.speakersList[next]?.countryName} has the floor`)
    } else {
      log('Speakers list exhausted', 'warning')
    }
    dispatch({ type: 'ADVANCE_SPEAKER' })
  }, [state.currentSpeakerIndex, state.speakersList, log])

  const setSpeakerTime = useCallback((seconds: number) => {
    dispatch({ type: 'SET_SPEAKER_TIME', seconds })
  }, [])

  // ── Motions ───────────────────────────────────────────────────────────────
  const proposeMotion = useCallback((draft: Omit<Motion, 'id' | 'status' | 'timestamp'>) => {
    const motion: Motion = {
      ...draft,
      id: uid(),
      status: 'pending',
      timestamp: new Date().toLocaleTimeString(),
    }
    addScore(draft.proposer, SCORE_MOTION_PROPOSED, `Motion proposed: ${draft.label}`)
    dispatch({ type: 'PROPOSE_MOTION', motion })
    log(`Motion: ${draft.label} — by ${draft.proposer || 'Floor'}`)
  }, [addScore, log])

  const resolveMotion = useCallback((approved: boolean) => {
    const m = state.activeMotion
    if (!m) return
    if (approved) {
      addScore(m.proposer, SCORE_MOTION_APPROVED, `Motion approved: ${m.label}`)
      log(`✓ ${m.label} approved`, 'success')
      if (m.typeId === 'voting') {
        addScore(m.proposer, SCORE_RESOLUTION, 'Resolution approved')
        log('Resolution approved — +8 pts', 'success')
      }
      if (m.typeId === 'close')   log('Session closed', 'warning')
      if (m.typeId === 'suspend') log(`Session suspended · Code: ${state.suspendCode}`, 'warning')
    } else {
      log(`✗ ${m.label} rejected`, 'error')
    }
    dispatch({ type: 'RESOLVE_MOTION', approved })
  }, [state.activeMotion, state.suspendCode, addScore, log])

  const setSuspendCode = useCallback((code: string) => {
    dispatch({ type: 'SET_SUSPEND_CODE', code })
  }, [])

  const resumeSession = useCallback(() => {
    dispatch({ type: 'RESUME_SESSION' })
    log('Session resumed', 'success')
  }, [log])

  const closeSession = useCallback(() => {
    dispatch({ type: 'CLOSE_SESSION' })
    log('Session closed by director', 'warning')
  }, [log])

  // ── Ranking ───────────────────────────────────────────────────────────────
  const publishRanking = useCallback(() => {
    dispatch({ type: 'PUBLISH_RANKING' })
    log('Ranking published', 'success')
  }, [log])

  const revokeRanking = useCallback(() => {
    dispatch({ type: 'REVOKE_RANKING' })
    log('Ranking revoked', 'warning')
  }, [log])

  // ── Derived: Quorum ───────────────────────────────────────────────────────
  const quorum = useMemo((): QuorumStats => {
    const total   = state.delegates.length
    const present = Object.values(state.rollCall).filter(s => s === 'present').length
    const voting  = Object.values(state.rollCall).filter(s => s === 'voting').length
    const absent  = Object.values(state.rollCall).filter(s => s === 'absent').length
    return {
      total, present, voting, absent,
      simpleQuorum:   (present + voting) >= Math.ceil(total / 2),
      compoundQuorum: voting >= Math.ceil(total * 0.6),
    }
  }, [state.delegates.length, state.rollCall])

  // ── Derived: Current Speaker ──────────────────────────────────────────────
  const currentSpeaker = useMemo(() => {
    const { currentSpeakerIndex, speakersList } = state
    if (currentSpeakerIndex < 0 || currentSpeakerIndex >= speakersList.length) return null
    return speakersList[currentSpeakerIndex]
  }, [state.speakersList, state.currentSpeakerIndex])

  // ── Derived: Ranking ─────────────────────────────────────────────────────
  const ranking = useMemo((): RankingEntry[] =>
    Object.entries(state.scores)
      .sort(([, a], [, b]) => b.total - a.total)
      .map(([countryName, score], i) => {
        const country = state.delegates.find(d => d.name === countryName)
        return { rank: i + 1, countryName, flag: country?.flag ?? '🏳', total: score.total, breakdown: score.breakdown }
      }),
    [state.scores, state.delegates]
  )

  // ── Derived: Eligible speakers ────────────────────────────────────────────
  const eligibleSpeakers = useMemo(() =>
    state.delegates.filter(d => {
      const s = state.rollCall[d.name]
      return s === 'present' || s === 'voting'
    }),
    [state.delegates, state.rollCall]
  )

  return {
    state, quorum, currentSpeaker, ranking, eligibleSpeakers,
    setPhase, setConfig, setDelegates,
    setDelegateStatus, completeRollCall,
    addSpeaker, removeSpeaker, advanceSpeaker, setSpeakerTime,
    proposeMotion, resolveMotion, setSuspendCode, resumeSession, closeSession,
    publishRanking, revokeRanking,
    log,
  }
}

export type MunSessionReturn = ReturnType<typeof useMunSession>
