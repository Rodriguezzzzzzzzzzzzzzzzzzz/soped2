'use client'

// hooks/useMunSession.ts
// FIX: nanoid removed — uses uid() from constants (no external deps)

import { useReducer, useCallback, useMemo, useEffect, useState, useRef } from 'react'
import { munReducer, createInitialState } from '@/mun-v2/state/munReducer'
import { uid } from '@/mun-v2/constants/mun.constants'
import { saveSessionState, loadSessionState, subscribeSessionState } from '@/mun-v2/services/munService'
import type {
  CommitteeState,
  Motion,
  RankingEntry,
  QuorumStats,
  DelegateStatus,
  Country,
  ScoreSummary,
  AgendaItem,
  SpeechRecord,
  CaucusState,
} from '@/mun-v2/types/mun.types'

const SCORE_MOTION_PROPOSED = 0.5
const SCORE_MOTION_APPROVED = 0.5
const SCORE_RESOLUTION      = 8.0

const STORAGE_KEY = (id?: string) => `mun-v2-session-${id ?? 'default'}`

export function useMunSession(committeeId?: string, initial?: Partial<CommitteeState>) {
  const [state, dispatch] = useReducer(
    munReducer,
    { ...createInitialState(), ...initial }
  )
  const [loading, setLoading] = useState(!!committeeId)
  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'reconnecting' | 'offline'>('connected')
  const hydratedRef = useRef(false)
  const initialRef = useRef(initial)
  const stateRef = useRef(state)
  stateRef.current = state
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // ── Hydrate from Firestore (fallback: sessionStorage) on mount ────────────
  useEffect(() => {
    if (!committeeId) { setLoading(false); return }
    if (hydratedRef.current) { setLoading(false); return }

    loadSessionState(committeeId)
      .then(saved => {
        if (saved) {
          dispatch({ type: 'HYDRATE', state: saved })
        } else {
          try {
            const raw = sessionStorage.getItem(STORAGE_KEY(committeeId))
            if (raw) {
              const parsed = JSON.parse(raw) as CommitteeState
              dispatch({ type: 'HYDRATE', state: parsed })
            }
          } catch { /* ignore */ }
        }
      })
      .catch(() => {
        try {
          const raw = sessionStorage.getItem(STORAGE_KEY(committeeId))
          if (raw) {
            const parsed = JSON.parse(raw) as CommitteeState
            dispatch({ type: 'HYDRATE', state: parsed })
          }
        } catch { /* ignore */ }
      })
      .finally(() => {
        hydratedRef.current = true
        setLoading(false)
      })
  }, [committeeId])

  // ── Firestore snapshot listener (remote updates) ─────────────────────────
  useEffect(() => {
    if (!committeeId) return

    const unsub = subscribeSessionState(
      committeeId,
      (remote) => {
        setConnectionStatus('connected')
        // Conflict prevention: ignore snapshot older than current state
        const current = stateRef.current
        if (remote.updatedAt && current.updatedAt && remote.updatedAt <= current.updatedAt) return
        if (remote.updatedAt && current.updatedAt && remote.updatedBy === 'chair-' + committeeId) return
        // Only apply if we didn't write this ourselves
        if (remote.updatedBy !== 'chair-' + committeeId) {
          dispatch({ type: 'HYDRATE', state: remote })
        }
      },
      () => {
        setConnectionStatus('offline')
      },
    )

    return () => {
      unsub()
      setConnectionStatus('offline')
    }
  }, [committeeId])

  // ── Persist to Firestore (debounced, skip if only timer tick changed) ────
  useEffect(() => {
    if (!committeeId || loading) return
    if (!hydratedRef.current) return
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current)

    saveTimerRef.current = setTimeout(() => {
      const withMeta: CommitteeState = {
        ...stateRef.current,
        updatedAt: new Date().toISOString(),
        updatedBy: 'chair-' + committeeId,
      }
      saveSessionState(committeeId, withMeta)
        .then(() => { setConnectionStatus('connected') })
        .catch(() => {
          setConnectionStatus('offline')
          try {
            sessionStorage.setItem(STORAGE_KEY(committeeId), JSON.stringify(stateRef.current))
          } catch { /* ignore */ }
        })
    }, 500)
  }, [state, committeeId, loading])

  // ── Speaker Timer Sync ────────────────────────────────────────────────────
  const setSpeakerTimer = useCallback((startedAt: number | null, remaining: number) => {
    dispatch({ type: 'SET_SPEAKER_TIMER', startedAt, remaining })
  }, [])

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

  const setAllDelegatesStatus = useCallback((status: DelegateStatus) => {
    dispatch({ type: 'SET_ALL_DELEGATES_STATUS', status })
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

  // ── Speaker Reorder ────────────────────────────────────────────────────────
  const moveSpeakerUp = useCallback((index: number) => {
    dispatch({ type: 'MOVE_SPEAKER_UP', index })
  }, [])

  const moveSpeakerDown = useCallback((index: number) => {
    dispatch({ type: 'MOVE_SPEAKER_DOWN', index })
  }, [])

  // ── Motions ───────────────────────────────────────────────────────────────
  const proposeMotion = useCallback((draft: Omit<Motion, 'id' | 'status' | 'timestamp'>) => {
    const motion: Motion = {
      ...draft,
      id: uid(),
      status: 'pending',
      timestamp: new Date().toLocaleTimeString(),
    }
    if (draft.proposer) {
      addScore(draft.proposer, SCORE_MOTION_PROPOSED, `Motion proposed: ${draft.label}`)
    }
    dispatch({ type: 'PROPOSE_MOTION', motion })
    log(`Motion: ${draft.label} — by ${draft.proposer || 'Floor'}`)
  }, [addScore, log])

  const resolveMotion = useCallback((approved: boolean) => {
    const m = state.activeMotion
    if (!m) return
    if (approved) {
      if (m.proposer) {
        addScore(m.proposer, SCORE_MOTION_APPROVED, `Motion approved: ${m.label}`)
      }

      log(`✓ ${m.label} approved`, 'success')

      if (m.typeId === 'voting') {
        if (m.proposer) {
          addScore(m.proposer, SCORE_RESOLUTION, 'Resolution approved')
        }

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

  // ── Agenda ─────────────────────────────────────────────────────────────────
  const addAgendaItem = useCallback((title: string) => {
    const item: AgendaItem = { id: uid(), title, isActive: false }
    dispatch({ type: 'ADD_AGENDA_ITEM', item })
    log(`Agenda item added: ${title}`)
  }, [log])

  const removeAgendaItem = useCallback((id: string) => {
    dispatch({ type: 'REMOVE_AGENDA_ITEM', id })
  }, [])

  const updateAgendaItem = useCallback((id: string, title: string) => {
    dispatch({ type: 'UPDATE_AGENDA_ITEM', id, title })
  }, [])

  const setActiveAgenda = useCallback((id: string | null) => {
    dispatch({ type: 'SET_ACTIVE_AGENDA', id })
  }, [])

  // ── Reset ──────────────────────────────────────────────────────────────────
  const resetSession = useCallback(() => {
    dispatch({ type: 'RESET_SESSION' })
    log('Session reset — delegates & roll call preserved')
  }, [log])

  // ── Roll Call Lock ─────────────────────────────────────────────────────────
  const setRollCallLocked = useCallback((locked: boolean) => {
    dispatch({ type: 'SET_ROLLCALL_LOCKED', locked })
  }, [])

  // ── Speech Records ─────────────────────────────────────────────────────────
  const addSpeechRecord = useCallback((record: Omit<SpeechRecord, 'id'>) => {
    dispatch({
      type: 'ADD_SPEECH_RECORD',
      record: { ...record, id: uid() },
    })
  }, [])

  // ── Caucus ─────────────────────────────────────────────────────────────────
  const setCaucus = useCallback((caucus: CaucusState | null) => {
    dispatch({ type: 'SET_CAUCUS', caucus })
  }, [])



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
    const quorumRequired = Math.floor(total / 2) + 1
    const presentVoting = present + voting
    return {
      total, present, voting, absent,
      simpleQuorum:   presentVoting >= Math.ceil(total / 2),
      compoundQuorum: voting >= Math.ceil(total * 0.6),
      quorumRequired,
      quorumMet: presentVoting >= quorumRequired,
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
    (Object.entries(state.scores) as [string, ScoreSummary][])
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
    state, loading, connectionStatus, quorum, currentSpeaker, ranking, eligibleSpeakers,
    setPhase, setConfig, setDelegates,
    setDelegateStatus, setAllDelegatesStatus, completeRollCall,
    addSpeaker, removeSpeaker, moveSpeakerUp, moveSpeakerDown, advanceSpeaker, setSpeakerTime,
    proposeMotion, resolveMotion, setSuspendCode, resumeSession, closeSession,
    publishRanking, revokeRanking,
    addAgendaItem, removeAgendaItem, updateAgendaItem, setActiveAgenda,
    resetSession, setRollCallLocked, addSpeechRecord, setCaucus, setSpeakerTimer,
    log,
  }
}

export type MunSessionReturn = ReturnType<typeof useMunSession>
