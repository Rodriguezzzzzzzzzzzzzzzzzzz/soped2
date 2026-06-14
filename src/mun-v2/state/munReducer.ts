// state/munReducer.ts

import type {
  CommitteeState,
  Motion,
  LogEntry,
  Country,
  DelegateStatus,
  ScoreSummary,
  AgendaItem,
  SpeechRecord,
  CaucusState,
} from '@/src/mun-v2/types/mun.types'

export type MunAction =
  | { type: 'SET_PHASE';            phase: CommitteeState['phase'] }
  | { type: 'SET_CONFIG';           key: string; value: string }
  | { type: 'SET_DELEGATES';        delegates: Country[] }
  | { type: 'SET_ROLLCALL_STATUS';  country: string; status: DelegateStatus }
  | { type: 'SET_ALL_DELEGATES_STATUS'; status: DelegateStatus }
  | { type: 'COMPLETE_ROLLCALL' }
  | { type: 'ADD_SPEAKER';          country: string }
  | { type: 'REMOVE_SPEAKER';       country: string }
  | { type: 'MOVE_SPEAKER_UP';      index: number }
  | { type: 'MOVE_SPEAKER_DOWN';    index: number }
  | { type: 'ADVANCE_SPEAKER' }
  | { type: 'SET_SPEAKER_TIME';     seconds: number }
  | { type: 'PROPOSE_MOTION';       motion: Motion }
  | { type: 'RESOLVE_MOTION';       approved: boolean }
  | { type: 'SET_SUSPEND_CODE';     code: string }
  | { type: 'RESUME_SESSION' }
  | { type: 'CLOSE_SESSION' }
  | { type: 'ADD_SCORE';            entry: {
      countryName: string;
      points: number;
      reason: string;
      timestamp: string;
    } }
  | { type: 'PUBLISH_RANKING' }
  | { type: 'REVOKE_RANKING' }
  | { type: 'ADD_LOG';              entry: LogEntry }
  | { type: 'CLEAR_LOGS' }
  | { type: 'ADD_AGENDA_ITEM';      item: AgendaItem }
  | { type: 'REMOVE_AGENDA_ITEM';   id: string }
  | { type: 'UPDATE_AGENDA_ITEM';   id: string; title: string }
  | { type: 'SET_ACTIVE_AGENDA';    id: string | null }
  | { type: 'HYDRATE';             state: CommitteeState }
  | { type: 'RESET_SESSION' }
  | { type: 'SET_ROLLCALL_LOCKED';  locked: boolean }
  | { type: 'ADD_SPEECH_RECORD';   record: SpeechRecord }
  | { type: 'SET_CAUCUS';          caucus: CaucusState | null }
  | { type: 'SET_SPEAKER_TIMER';  startedAt: number | null; remaining: number }

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
    agenda: [],
    rollCallLocked: false,
    speechHistory: [],
    caucus: null,
    speakerTimerStartedAt: null,
    speakerTimerRemaining: 0,
    updatedAt: '',
    updatedBy: '',
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

    case 'SET_ALL_DELEGATES_STATUS': {
      const all: Record<string, DelegateStatus> = {}
      state.delegates.forEach(d => { all[d.name] = action.status })
      return { ...state, rollCall: all }
    }

    case 'COMPLETE_ROLLCALL': {
      const completed = { ...state.rollCall }
      state.delegates.forEach(d => {
        const key = d.name
        if (!completed[key]) {
          completed[key] = 'absent'
        }
      })
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

    case 'MOVE_SPEAKER_UP': {
      const { index } = action
      if (index <= 0) return state
      const list = [...state.speakersList];
      [list[index - 1], list[index]] = [list[index], list[index - 1]]
      let newIdx = state.currentSpeakerIndex
      if (state.currentSpeakerIndex === index) newIdx = index - 1
      else if (state.currentSpeakerIndex === index - 1) newIdx = index
      return { ...state, speakersList: list, currentSpeakerIndex: newIdx }
    }

    case 'MOVE_SPEAKER_DOWN': {
      const { index } = action
      if (index >= state.speakersList.length - 1) return state
      const list = [...state.speakersList];
      [list[index], list[index + 1]] = [list[index + 1], list[index]]
      let newIdx = state.currentSpeakerIndex
      if (state.currentSpeakerIndex === index) newIdx = index + 1
      else if (state.currentSpeakerIndex === index + 1) newIdx = index
      return { ...state, speakersList: list, currentSpeakerIndex: newIdx }
    }

    case 'SET_SPEAKER_TIME':
      return { ...state, speakerTimeSecs: Math.max(15, action.seconds) }

    case 'PROPOSE_MOTION':
      return { ...state, activeMotion: action.motion }

    case 'RESOLVE_MOTION': {
      if (!state.activeMotion) return state
      const resolved: Motion = {
        ...state.activeMotion,
        status: action.approved ? 'approved' : 'rejected',
        resolvedAt: new Date().toISOString(),
      }
      let nextPhase = state.phase
      if (action.approved) {
        if (state.activeMotion?.typeId === 'close') nextPhase = 'closed'
        if (state.activeMotion?.typeId === 'suspend') nextPhase = 'suspended'
      }
      return {
        ...state,
        activeMotion: null,
        motionHistory: [resolved, ...state.motionHistory],
        phase: nextPhase,
        suspendCode:
          action.approved && state.activeMotion?.typeId === 'suspend'
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
      const { countryName, points } = action.entry
      const existing = (state.scores[countryName] as ScoreSummary | undefined) ?? { total: 0, breakdown: [] }
      return {
        ...state,
        scores: {
          ...state.scores,
          [countryName]: {
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

    case 'ADD_AGENDA_ITEM':
      return { ...state, agenda: [...state.agenda, action.item] }

    case 'REMOVE_AGENDA_ITEM': {
      const remaining = state.agenda.filter(a => a.id !== action.id)
      const activeStillExists = remaining.some(a => a.isActive)
      return {
        ...state,
        agenda: activeStillExists ? remaining : remaining.map((a, i) => i === 0 ? { ...a, isActive: true } : a),
      }
    }

    case 'UPDATE_AGENDA_ITEM':
      return {
        ...state,
        agenda: state.agenda.map(a => a.id === action.id ? { ...a, title: action.title } : a),
      }

    case 'SET_ACTIVE_AGENDA':
      return {
        ...state,
        agenda: state.agenda.map(a => ({ ...a, isActive: a.id === action.id })),
      }

    case 'HYDRATE':
      return { ...action.state }

    case 'RESET_SESSION': {
      const { delegates, rollCall } = state
      return {
        ...createInitialState(state.id),
        delegates,
        rollCall,
        phase: 'rollcall',
      }
    }

    case 'SET_ROLLCALL_LOCKED':
      return { ...state, rollCallLocked: action.locked }

    case 'ADD_SPEECH_RECORD':
      return { ...state, speechHistory: [action.record, ...state.speechHistory].slice(0, 200) }

    case 'SET_CAUCUS':
      return { ...state, caucus: action.caucus }

    case 'SET_SPEAKER_TIMER':
      return {
        ...state,
        speakerTimerStartedAt: action.startedAt,
        speakerTimerRemaining: action.remaining,
      }

    default:
      return state
  }
}
