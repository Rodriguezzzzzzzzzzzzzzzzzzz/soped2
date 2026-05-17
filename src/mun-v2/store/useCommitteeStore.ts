'use client'

import { create } from 'zustand'

import type {
  Country,
  CommitteeState,
  DelegateStatus,
  MotionCategory,
} from '@/src/mun/session/types/mun.types'

interface CommitteeStore {
  state: CommitteeState

  // CONFIG
  setConfig: (key: string, value: string) => void
  setDelegates: (delegates: Country[]) => void

  // PHASES
  setPhase: (phase: CommitteeState['phase']) => void

  // ROLL CALL
  setDelegateStatus: (
    countryName: string,
    status: DelegateStatus
  ) => void

  // LOGS
  log: (
    message: string,
    type?: 'info' | 'success' | 'warning' | 'error'
  ) => void
}

export const useCommitteeStore = create<CommitteeStore>((set) => ({
  state: {
    id: '',
    phase: 'role_select',

    config: {
      name: '',
      topic: '',
      type: 'General Assembly',
    },

    delegates: [],

    rollCall: {},

    speakersList: [],
    currentSpeakerIndex: -1,

    activeMotion: null,
    motionHistory: [],

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

  setDelegateStatus: (countryName, status) =>
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

  log: (message, type = 'info') =>
    set((store) => ({
      state: {
        ...store.state,
        logs: [
          {
            id: crypto.randomUUID(),
            timestamp: new Date().toISOString(),
            message,
            type,
          },
          ...store.state.logs,
        ],
      },
    })),
}))