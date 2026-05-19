'use client'

import { create } from 'zustand'

import type {
  Delegate,
  CommitteeState,
  DelegateStatus,
} from '@/src/mun-v2/types/mun.types'

interface CommitteeStore {
  state: CommitteeState

  // CONFIG
  setConfig: (key: keyof CommitteeState['config'], value: string) => void
  setDelegates: (delegates: Delegate[]) => void

  // PHASES
  setPhase: (phase: CommitteeState['phase']) => void

  // ROLL CALL
  setDelegateStatus: (countryName: string, status: DelegateStatus) => void

  // LOGS
  log: (
    message: string,
    type?: 'info' | 'success' | 'warning' | 'error'
  ) => void
}

export const useCommitteeStore = create<CommitteeStore>((set, get) => ({
  state: {
    id: '',
    phase: 'role_select',

    config: {
      name: '',
      topic: '',
      type: 'General Assembly',
    },

    delegates: [] as Delegate[],

    rollCall: {},
    speakerTimeSecs: 0,

    speakersList: [],
    currentSpeakerIndex: -1,

    activeMotion: null,
    motionHistory: [],
    scores: {},

    logs: [],

    suspendCode: null,

    rankingPublished: false,
  },

  // ─────────────────────────────────────
  // CONFIG
  // ─────────────────────────────────────

  setConfig: (key, value) =>
    set((store) => ({
      state: {
        ...store.state,
        config: {
          ...store.state.config,
          [key]: value,
        },
      },
    })),

  setDelegates: (delegates) =>
    set((store) => ({
      state: {
        ...store.state,
        delegates,
      },
    })),

  // ─────────────────────────────────────
  // PHASE
  // ─────────────────────────────────────

  setPhase: (phase) =>
    set((store) => ({
      state: {
        ...store.state,
        phase,
      },
    })),

  // ─────────────────────────────────────
  // ROLL CALL
  // ─────────────────────────────────────

  setDelegateStatus: (countryName: string, status: DelegateStatus) =>
    set((store) => ({
      state: {
        ...store.state,
        rollCall: {
          ...store.state.rollCall,
          [countryName]: status,
        },
      },
    })),

  // ─────────────────────────────────────
  // LOGS
  // ─────────────────────────────────────

  log: (
    message: string,
    type: 'info' | 'success' | 'warning' | 'error' = 'info'
  ) =>
    set((store) => ({
      state: {
        ...store.state,
        logs: [
          {
            id: typeof crypto !== 'undefined' ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`,
            timestamp: new Date().toISOString(),
            message,
            type,
          },
          ...store.state.logs,
        ],
      },
    })),
}))