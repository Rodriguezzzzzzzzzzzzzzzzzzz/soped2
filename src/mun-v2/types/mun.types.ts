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

export type AgendaItem = {
  id: string
  title: string
  isActive: boolean
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
  category?: MotionCategory
  timerSeconds?: number
  resolvedAt?: string
}

export type SpeechRecord = {
  id: string
  countryName: string
  startTime: string
  endTime: string
  timeUsed: number
  yield?: 'chair' | 'questions' | 'delegate' | null
}

export type CaucusState = {
  type: 'moderated' | 'unmoderated'
  totalDuration: number
  timeLeft: number
  active: boolean
  timePerSpeaker: number
  startedAt: number | null
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
  quorumRequired: number
  quorumMet: boolean
}

export type MotionCategory = 'debate' | 'resolution' | 'procedural'

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
  delegates: Country[]
  rollCall: Record<string, DelegateStatus>
  speakersList: SpeakerEntry[]
  currentSpeakerIndex: number
  speakerTimeSecs: number
  activeMotion: Motion | null
  motionHistory: Motion[]
  scores: Record<string, ScoreSummary>
  rankingPublished: boolean
  suspendCode: string | null
  logs: LogEntry[]
  agenda: AgendaItem[]
  rollCallLocked: boolean
  speechHistory: SpeechRecord[]
  caucus: CaucusState | null
  speakerTimerStartedAt: number | null
  speakerTimerRemaining: number
  updatedAt: string
  updatedBy: string
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
  logs: [],
  agenda: [],
  rollCallLocked: false,
  speechHistory: [],
  caucus: null,
  speakerTimerStartedAt: null,
  speakerTimerRemaining: 0,
  updatedAt: '',
  updatedBy: '',
})