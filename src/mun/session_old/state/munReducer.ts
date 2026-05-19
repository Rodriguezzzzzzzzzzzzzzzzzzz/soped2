// state/munReducer.ts

import type {
  CommitteeState,
  DelegateStatus,
  Motion,
  LogEntry,
  Country,
  ScoreEntry,
} from '@/types/mun.types'

export type MunAction =
  | { type: 'SET_PHASE';            phase: CommitteeState['phase'] }
  | { type: 'SET_CONFIG';           key: string; value: string }
  | { type: 'SET_DELEGATES';        delegates: Country[] }
  | { type: 'SET_ROLLCALL_STATUS';  country: string; status: DelegateStatus }
  | { type: 'COMPLETE_ROLLCALL' }
  | { type: 'ADD_SPEAKER';          country: string }
  | { type: 'REMOVE_SPEAKER';       country: string }
  | { type: 'ADVANCE_SPEAKER' }
  | { type: 'SET_SPEAKER_TIME';     seconds: number }
  | { type: 'PROPOSE_MOTION';       motion: Motion }
  | { type: 'RESOLVE_MOTION';       approved: boolean }
  | { type: 'SET_SUSPEND_CODE';     code: string }
  | { type: 'RESUME_SESSION' }
  | { type: 'CLOSE_SESSION' }
  | { type: 'ADD_SCORE';            entry: ScoreEntry }
  | { type: 'PUBLISH_RANKING' }
  | { type: 'REVOKE_RANKING' }
  | { type: 'ADD_LOG';              entry: LogEntry }
  | { type: 'CLEAR_LOGS' }

export function createInitialState(id = 'committee-1'): CommitteeState {
  return {
    id,
    config: { name: '', topic: '', type: 'General' },
    phase: 'role_select',
    delegates: [],
    rollCall: {},
    speakersList: [],
    currentSpeakerIndex: -1,
    speakerTimeSecs: 90,
    activeMotion: null,
    motionHistory: [],
    scores: {},
    rankingPublished: false,
    suspendCode: null,
    logs: [],
  }
}

export function munReducer(state: CommitteeState, action: MunAction): CommitteeState {
  switch (action.type) {

    case 'SET_PHASE':
      return { ...state, phase: action.phase }

    case 'SET_CONFIG':
      return { ...state, config: { ...state.config, [action.key]: action.value } }

    case 'SET_DELEGATES':
      return { ...state, delegates: action.delegates }

    case 'SET_ROLLCALL_STATUS':
      return { ...state, rollCall: { ...state.rollCall, [action.country]: action.status } }

    case 'COMPLETE_ROLLCALL': {
      const completed = { ...state.rollCall }
      state.delegates.forEach(d => { if (!completed[d.name]) completed[d.name] = 'absent' })
      return { ...state, rollCall: completed, phase: 'session' }
    }

    case 'ADD_SPEAKER': {
      if (state.speakersList.some(s => s.countryName === action.country)) return state
      return {
        ...state,
        speakersList: [...state.speakersList, { countryName: action.country, addedAt: new Date().toISOString() }],
      }
    }

    case 'REMOVE_SPEAKER': {
      const removedIdx = state.speakersList.findIndex(s => s.countryName === action.country)
      const newList = state.speakersList.filter(s => s.countryName !== action.country)
      let newIdx = state.currentSpeakerIndex
      if (removedIdx >= 0 && removedIdx < state.currentSpeakerIndex) newIdx -= 1
      if (removedIdx === state.currentSpeakerIndex) newIdx = -1
      if (newIdx >= newList.length) newIdx = newList.length - 1
      return { ...state, speakersList: newList, currentSpeakerIndex: newIdx }
    }

    case 'ADVANCE_SPEAKER': {
      const next = state.currentSpeakerIndex + 1
      return { ...state, currentSpeakerIndex: next < state.speakersList.length ? next : -1 }
    }

    case 'SET_SPEAKER_TIME':
      return { ...state, speakerTimeSecs: Math.max(15, action.seconds) }

    case 'PROPOSE_MOTION':
      return { ...state, activeMotion: action.motion }

    case 'RESOLVE_MOTION': {
      if (!state.activeMotion) return state
      const resolved: Motion = { ...state.activeMotion, status: action.approved ? 'approved' : 'rejected' }
      let nextPhase = state.phase
      if (action.approved) {
        if (state.activeMotion.typeId === 'close')   nextPhase = 'closed'
        if (state.activeMotion.typeId === 'suspend') nextPhase = 'suspended'
      }
      return {
        ...state,
        activeMotion: null,
        motionHistory: [resolved, ...state.motionHistory],
        phase: nextPhase,
        suspendCode:
          action.approved && state.activeMotion.typeId === 'suspend'
            ? state.suspendCode
            : state.phase === 'suspended' ? null : state.suspendCode,
      }
    }

    case 'SET_SUSPEND_CODE':
      return { ...state, suspendCode: action.code }

    case 'RESUME_SESSION':
      return { ...state, phase: 'session', suspendCode: null }

    case 'CLOSE_SESSION':
      return { ...state, phase: 'closed', activeMotion: null }

    case 'ADD_SCORE': {
      const { countryName, points, reason, timestamp } = action.entry
      const existing = state.scores[countryName] ?? { countryName, total: 0, breakdown: [] }
      return {
        ...state,
        scores: {
          ...state.scores,
          [countryName]: {
            ...existing,
            total: existing.total + points,
            breakdown: [action.entry, ...existing.breakdown],
          },
        },
      }
    }

    case 'PUBLISH_RANKING': return { ...state, rankingPublished: true  }
    case 'REVOKE_RANKING':  return { ...state, rankingPublished: false }

    case 'ADD_LOG':
      return { ...state, logs: [action.entry, ...state.logs].slice(0, 120) }

    case 'CLEAR_LOGS':
      return { ...state, logs: [] }

    default:
      return state
  }
}
