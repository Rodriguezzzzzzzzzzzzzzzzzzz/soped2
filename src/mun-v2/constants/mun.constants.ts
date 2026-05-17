// constants/mun.constants.ts

import type { Country, MotionDefinition } from '@/mun-v2/types/mun.types'

export const ALL_COUNTRIES: Country[] = [
  { name: 'Algeria',      flag: '🇩🇿', iso: 'DZ' },
  { name: 'Argentina',    flag: '🇦🇷', iso: 'AR' },
  { name: 'Australia',    flag: '🇦🇺', iso: 'AU' },
  { name: 'Brazil',       flag: '🇧🇷', iso: 'BR' },
  { name: 'Canada',       flag: '🇨🇦', iso: 'CA' },
  { name: 'Chile',        flag: '🇨🇱', iso: 'CL' },
  { name: 'China',        flag: '🇨🇳', iso: 'CN' },
  { name: 'Colombia',     flag: '🇨🇴', iso: 'CO' },
  { name: 'Cuba',         flag: '🇨🇺', iso: 'CU' },
  { name: 'Ecuador',      flag: '🇪🇨', iso: 'EC' },
  { name: 'Egypt',        flag: '🇪🇬', iso: 'EG' },
  { name: 'France',       flag: '🇫🇷', iso: 'FR' },
  { name: 'Germany',      flag: '🇩🇪', iso: 'DE' },
  { name: 'India',        flag: '🇮🇳', iso: 'IN' },
  { name: 'Indonesia',    flag: '🇮🇩', iso: 'ID' },
  { name: 'Iran',         flag: '🇮🇷', iso: 'IR' },
  { name: 'Italy',        flag: '🇮🇹', iso: 'IT' },
  { name: 'Japan',        flag: '🇯🇵', iso: 'JP' },
  { name: 'Kenya',        flag: '🇰🇪', iso: 'KE' },
  { name: 'Mexico',       flag: '🇲🇽', iso: 'MX' },
  { name: 'Morocco',      flag: '🇲🇦', iso: 'MA' },
  { name: 'Nigeria',      flag: '🇳🇬', iso: 'NG' },
  { name: 'Pakistan',     flag: '🇵🇰', iso: 'PK' },
  { name: 'Peru',         flag: '🇵🇪', iso: 'PE' },
  { name: 'Russia',       flag: '🇷🇺', iso: 'RU' },
  { name: 'Saudi Arabia', flag: '🇸🇦', iso: 'SA' },
  { name: 'South Africa', flag: '🇿🇦', iso: 'ZA' },
  { name: 'South Korea',  flag: '🇰🇷', iso: 'KR' },
  { name: 'Spain',        flag: '🇪🇸', iso: 'ES' },
  { name: 'Turkey',       flag: '🇹🇷', iso: 'TR' },
  { name: 'UK',           flag: '🇬🇧', iso: 'GB' },
  { name: 'USA',          flag: '🇺🇸', iso: 'US' },
  { name: 'Venezuela',    flag: '🇻🇪', iso: 'VE' },
  { name: 'Zimbabwe',     flag: '🇿🇼', iso: 'ZW' },
]

export const MOTION_DEFINITIONS: Record<string, MotionDefinition[]> = {
  debate: [
    { id: 'moderated',    label: 'Moderated Caucus',          defaultTime: 60,  hasTimer: true  },
    { id: 'unmoderated',  label: 'Unmoderated Caucus',        defaultTime: 300, hasTimer: true  },
    { id: 'open_debate',  label: 'Open Debate',               defaultTime: 0,   hasTimer: false },
    { id: 'consultation', label: 'Consultation of the Whole', defaultTime: 120, hasTimer: true  },
  ],
  resolution: [
    { id: 'draft',        label: 'Draft Submission',          defaultTime: 0,   hasTimer: false },
    { id: 'presentation', label: 'Resolution Presentation',   defaultTime: 120, hasTimer: true  },
    { id: 'amendment',   label: 'Amendments',                defaultTime: 0,   hasTimer: false },
    { id: 'voting',      label: 'Voting Procedure',          defaultTime: 0,   hasTimer: false },
  ],
  procedural: [
    { id: 'suspend', label: 'Suspend Session', defaultTime: 600, hasTimer: true  },
    { id: 'close',   label: 'Close Debate',    defaultTime: 0,   hasTimer: false },
  ],
}

export const MOTION_CATEGORIES = ['debate', 'resolution', 'procedural'] as const

export const COMMITTEE_TYPES = [
  'CSNU', 'AGONU', 'ECOSOC', 'UNHRC', 'Comité de Crisis', 'General',
] as const

export const SCORING = {
  MOTION_PROPOSED: 0.5,
  MOTION_APPROVED: 0.5,
  RESOLUTION:      8.0,
} as const

// ── Utilities ─────────────────────────────────────────────────────────────────

/** Format seconds → MM:SS */
export const fmt = (s: number): string =>
  `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`

/** Generate 4-char suspend unlock code — no external deps */
export const generateSuspendCode = (): string =>
  Math.random().toString(36).slice(2, 6).toUpperCase()

/** Lightweight ID — replaces nanoid, no external deps */
export const uid = (): string =>
  `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 9)}`
