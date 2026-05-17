// types/mun.types.ts

export type Role = 'director' | 'adjunct' | 'delegate'
export type DelegateStatus = 'present' | 'voting' | 'absent'
export type MotionCategory = 'debate' | 'resolution' | 'procedural'
export type MotionStatus = 'pending' | 'approved' | 'rejected'
export type SessionPhase =
  | 'role_select' | 'setup' | 'rollcall'
  | 'session' | 'suspended' | 'closed'
export type LogType = 'info' | 'success' | 'warning' | 'error'

export interface Country { name: string; flag: string; iso?: string }
export interface Delegate { id: string; country: Country; userId?: string; status: DelegateStatus }
export interface SpeakerEntry { countryName: string; addedAt: string }

export interface Motion {
  id: string
  category: MotionCategory
  typeId: string
  label: string
  proposer: string
  timerSeconds: number
  status: MotionStatus
  timestamp: string
}

export interface MotionDefinition {
  id: string
  label: string
  defaultTime: number
  hasTimer: boolean
}

export interface ScoreEntry {
  countryName: string
  points: number
  reason: string
  timestamp: string
}

export interface DelegateScore {
  countryName: string
  total: number
  breakdown: ScoreEntry[]
}

export interface RankingEntry {
  rank: number
  countryName: string
  flag: string
  total: number
  breakdown: ScoreEntry[]
}

export interface LogEntry {
  id: string
  message: string
  type: LogType
  timestamp: string
}

export interface CommitteeConfig { name: string; topic: string; type: string }

export interface CommitteeState {
  id: string
  config: CommitteeConfig
  phase: SessionPhase
  delegates: Country[]
  rollCall: Record<string, DelegateStatus>
  speakersList: SpeakerEntry[]
  currentSpeakerIndex: number
  speakerTimeSecs: number
  activeMotion: Motion | null
  motionHistory: Motion[]
  scores: Record<string, DelegateScore>  // ← NEVER expose to delegates
  rankingPublished: boolean
  suspendCode: string | null
  logs: LogEntry[]
}

export interface MunSession { id: string; eventId: string; name: string; committeeIds: string[]; startedAt: string }
export interface MunEvent   { id: string; name: string; edition: number; sessions: MunSession[]; createdAt: string }

export interface QuorumStats {
  total: number; present: number; voting: number; absent: number
  simpleQuorum: boolean; compoundQuorum: boolean
}

export interface SessionContext {
  role: Role
  delegateCountry: Country | null
  canControl: boolean
  canSeeRanking: boolean
  canRequestSpeaker: boolean
}
