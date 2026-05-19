export type Role = 'director' | 'adjunct' | 'delegate'

export type DelegateStatus = 'present' | 'voting' | 'absent'

export type RollCallStatus = DelegateStatus | 'abstain'

export type MotionStatus = 'pending' | 'approved' | 'rejected'

export type Country = {
  name: string
  flag: string
  iso: string
}
  
export type Delegate = {
  id: string
  country: Country
  status: DelegateStatus
  userId?: string
}

export type SpeakerEntry = {
  countryName: string
  addedAt: string
}

export type ScoreEntry = {
  countryName: string
  points: number
  reason: string
  timestamp: string
}

export type MotionDefinition = {
  id: string
  label: string
  defaultTime: number
  hasTimer: boolean
  description?: string
}

export type Motion = {
  id: string
  status: MotionStatus
  timestamp: string
  label: string
  typeId?: string
  proposer?: string
}

export type ScoreSummary = {
  total: number
  breakdown: ScoreEntry[]
}

export type RankingEntry = {
  rank: number
  countryName: string
  flag: string
  total: number
  breakdown: ScoreEntry[]
}

export type QuorumStats = {
  present: number
  voting: number
  absent: number
  total: number
  simpleQuorum: boolean
  compoundQuorum: boolean
}

export type SessionPhase =
  | 'role_select'
  | 'setup'
  | 'rollcall'
  | 'session'
  | 'suspended'
  | 'closed'

export type LogEntry = {
  id: string
  message: string
  type: string
  timestamp: string
}

export type CommitteeConfig = {
  name: string
  topic: string
  type: string
}

export type CommitteeState = {
  id: string
  config: CommitteeConfig
  phase: SessionPhase
  delegates: Delegate[]
  rollCall: Record<string, RollCallStatus>
  speakersList: SpeakerEntry[]
  currentSpeakerIndex: number
  speakerTimeSecs: number
  activeMotion: Motion | null
  motionHistory: Motion[]
  scores: Record<string, ScoreSummary>
  rankingPublished: boolean
  suspendCode: string | null
  logs: LogEntry[]
}

export const createInitialState = (): CommitteeState => ({
  id: '',
  config: { name: '', topic: '', type: '' },
  phase: 'role_select',
  delegates: [],
  rollCall: {},
  speakersList: [],
  currentSpeakerIndex: -1,
  speakerTimeSecs: 0,
  activeMotion: null,
  motionHistory: [],
  scores: {},
  rankingPublished: false,
  suspendCode: null,
  logs: []
})