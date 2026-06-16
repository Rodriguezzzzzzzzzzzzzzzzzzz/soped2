'use client'

import { useReducer, useState, useEffect, useRef, useCallback } from 'react'

// ── Types ────────────────────────────────────────────────────────────────────

type Phase = 'setup' | 'rollcall' | 'gsl' | 'motions' | 'mod' | 'unmod' | 'singleSpeaker' | 'voting' | 'summary'
type PowerStatus = 'Delegate' | 'VetoPower' | 'Observer'
type VoteValue = 'yes' | 'no' | 'abstain' | 'pass' | 'rights'
type MotionType = 'mod' | 'unmod' | 'custom'

interface Delegate { name: string; flag: string; powerStatus?: PowerStatus; isCustom?: boolean }
interface Motion {
  id: string; label: string; proposer: string; status: 'pending' | 'approved' | 'rejected'
  type?: MotionType; topic?: string; caucusTime?: number; speakingTime?: number
}
interface VoteEntry { country: string; vote: VoteValue }

interface TimerState {
  running: boolean; timeLeft: number; maxTime: number; startedAt: number | null
}

interface State {
  phase: Phase
  committeeName: string
  committeeTopic: string
  delegates: Delegate[]
  rollCall: Record<string, 'present' | 'absent'>

  // GSL
  gslSpeakers: string[]
  gslCurrentIndex: number

  // Motions
  motions: Motion[]
  activeMotion: Motion | null

  // Mod (Moderated Caucus)
  modSpeakers: string[]
  modCurrentIndex: number
  modTopic: string
  modStartTime: number | null

  // Speaker timer (shared across GSL/Mod/SingleSpeaker)
  speakerTimer: TimerState

  // Unmod
  unmodTimer: TimerState

  // Single Speaker
  singleSpeakerName: string | null

  // Voting
  votes: VoteEntry[]
  voteType: 'procedural' | 'substantial'
  voteMajority: 'simple' | 'twoThirds' | 'securityCouncil' | 'consensus'
  observerAllowed: boolean
  voteRound: 1 | 2
  voteResultsHidden: boolean

  scores: Record<string, number>
}

type Action =
  | { type: 'SET_PHASE'; phase: Phase }
  | { type: 'SET_COMMITTEE_NAME'; value: string }
  | { type: 'SET_COMMITTEE_TOPIC'; value: string }
  | { type: 'SET_DELEGATES'; delegates: Delegate[] }
  | { type: 'SET_ROLL_CALL'; country: string; status: 'present' | 'absent' }
  | { type: 'COMPLETE_ROLL_CALL' }

  // GSL
  | { type: 'GSL_ADD_SPEAKER'; country: string }
  | { type: 'GSL_REMOVE_SPEAKER'; country: string }
  | { type: 'GSL_ADVANCE' }
  | { type: 'GSL_IMPORT'; speakers: string[] }

  // Motion
  | { type: 'PROPOSE_MOTION'; motion: Motion }
  | { type: 'RESOLVE_MOTION'; id: string; approved: boolean }
  | { type: 'REMOVE_MOTION'; id: string }
  | { type: 'SET_ACTIVE_MOTION'; motion: Motion | null }

  // Mod
  | { type: 'MOD_ADD_SPEAKER'; country: string }
  | { type: 'MOD_REMOVE_SPEAKER'; country: string }
  | { type: 'MOD_ADVANCE' }
  | { type: 'MOD_SET_TOPIC'; topic: string }
  | { type: 'MOD_SET_CAUCUS_START'; startedAt: number | null }

  // Speaker Timer
  | { type: 'SET_SPEAKER_TIMER'; timer: Partial<TimerState> }
  | { type: 'TICK_SPEAKER' }

  // Unmod
  | { type: 'UNMOD_SET_TIMER'; timer: Partial<TimerState> }
  | { type: 'TICK_UNMOD' }

  // Single Speaker
  | { type: 'SINGLE_SET'; name: string | null }

  // Voting
  | { type: 'VOTE_CAST'; country: string; vote: VoteValue }
  | { type: 'VOTE_SET_TYPE'; voteType: 'procedural' | 'substantial' }
  | { type: 'VOTE_SET_MAJORITY'; majority: 'simple' | 'twoThirds' | 'securityCouncil' | 'consensus' }
  | { type: 'VOTE_SET_OBSERVER'; allowed: boolean }
  | { type: 'VOTE_NEXT_ROUND' }
  | { type: 'VOTE_TOGGLE_RESULTS' }
  | { type: 'VOTE_RESET' }

  | { type: 'ADD_SCORE'; country: string; points: number }
  | { type: 'RESET_SESSION' }

// ── Constants ────────────────────────────────────────────────────────────────

const FLAG = (code: string) => code.toUpperCase().replace(/./g, c => String.fromCodePoint(c.charCodeAt(0) + 0x1F1E6 - 65))

const ALL_COUNTRIES: { code: string; name: string }[] = [
  { code: 'AF', name: 'Afganistán' }, { code: 'AL', name: 'Albania' }, { code: 'DZ', name: 'Argelia' },
  { code: 'AD', name: 'Andorra' }, { code: 'AO', name: 'Angola' }, { code: 'AG', name: 'Antigua y Barbuda' },
  { code: 'AR', name: 'Argentina' }, { code: 'AM', name: 'Armenia' }, { code: 'AU', name: 'Australia' },
  { code: 'AT', name: 'Austria' }, { code: 'AZ', name: 'Azerbaiyán' }, { code: 'BS', name: 'Bahamas' },
  { code: 'BH', name: 'Bahréin' }, { code: 'BD', name: 'Bangladesh' }, { code: 'BB', name: 'Barbados' },
  { code: 'BY', name: 'Bielorrusia' }, { code: 'BE', name: 'Bélgica' }, { code: 'BZ', name: 'Belice' },
  { code: 'BJ', name: 'Benín' }, { code: 'BT', name: 'Bután' }, { code: 'BO', name: 'Bolivia' },
  { code: 'BA', name: 'Bosnia y Herzegovina' }, { code: 'BW', name: 'Botswana' }, { code: 'BR', name: 'Brasil' },
  { code: 'BN', name: 'Brunéi' }, { code: 'BG', name: 'Bulgaria' }, { code: 'BF', name: 'Burkina Faso' },
  { code: 'BI', name: 'Burundi' }, { code: 'CV', name: 'Cabo Verde' }, { code: 'KH', name: 'Camboya' },
  { code: 'CM', name: 'Camerún' }, { code: 'CA', name: 'Canadá' }, { code: 'CF', name: 'República Centroafricana' },
  { code: 'TD', name: 'Chad' }, { code: 'CL', name: 'Chile' }, { code: 'CN', name: 'China' },
  { code: 'CO', name: 'Colombia' }, { code: 'KM', name: 'Comoras' }, { code: 'CG', name: 'Congo' },
  { code: 'CD', name: 'República Democrática del Congo' }, { code: 'CR', name: 'Costa Rica' }, { code: 'CI', name: 'Costa de Marfil' },
  { code: 'HR', name: 'Croacia' }, { code: 'CU', name: 'Cuba' }, { code: 'CY', name: 'Chipre' },
  { code: 'CZ', name: 'República Checa' }, { code: 'DK', name: 'Dinamarca' }, { code: 'DJ', name: 'Yibuti' },
  { code: 'DM', name: 'Dominica' }, { code: 'DO', name: 'República Dominicana' }, { code: 'EC', name: 'Ecuador' },
  { code: 'EG', name: 'Egipto' }, { code: 'SV', name: 'El Salvador' }, { code: 'GQ', name: 'Guinea Ecuatorial' },
  { code: 'ER', name: 'Eritrea' }, { code: 'EE', name: 'Estonia' }, { code: 'SZ', name: 'Eswatini' },
  { code: 'ET', name: 'Etiopía' }, { code: 'FJ', name: 'Fiyi' }, { code: 'FI', name: 'Finlandia' },
  { code: 'FR', name: 'Francia' }, { code: 'GA', name: 'Gabón' }, { code: 'GM', name: 'Gambia' },
  { code: 'GE', name: 'Georgia' }, { code: 'DE', name: 'Alemania' }, { code: 'GH', name: 'Ghana' },
  { code: 'GR', name: 'Grecia' }, { code: 'GD', name: 'Granada' }, { code: 'GT', name: 'Guatemala' },
  { code: 'GN', name: 'Guinea' }, { code: 'GW', name: 'Guinea-Bisáu' }, { code: 'GY', name: 'Guyana' },
  { code: 'HT', name: 'Haití' }, { code: 'HN', name: 'Honduras' }, { code: 'HU', name: 'Hungría' },
  { code: 'IS', name: 'Islandia' }, { code: 'IN', name: 'India' }, { code: 'ID', name: 'Indonesia' },
  { code: 'IR', name: 'Irán' }, { code: 'IQ', name: 'Irak' }, { code: 'IE', name: 'Irlanda' },
  { code: 'IL', name: 'Israel' }, { code: 'IT', name: 'Italia' }, { code: 'JM', name: 'Jamaica' },
  { code: 'JP', name: 'Japón' }, { code: 'JO', name: 'Jordania' }, { code: 'KZ', name: 'Kazajistán' },
  { code: 'KE', name: 'Kenia' }, { code: 'KI', name: 'Kiribati' }, { code: 'KW', name: 'Kuwait' },
  { code: 'KG', name: 'Kirguistán' }, { code: 'LA', name: 'Laos' }, { code: 'LV', name: 'Letonia' },
  { code: 'LB', name: 'Líbano' }, { code: 'LS', name: 'Lesoto' }, { code: 'LR', name: 'Liberia' },
  { code: 'LY', name: 'Libia' }, { code: 'LI', name: 'Liechtenstein' }, { code: 'LT', name: 'Lituania' },
  { code: 'LU', name: 'Luxemburgo' }, { code: 'MG', name: 'Madagascar' }, { code: 'MW', name: 'Malaui' },
  { code: 'MY', name: 'Malasia' }, { code: 'MV', name: 'Maldivas' }, { code: 'ML', name: 'Malí' },
  { code: 'MT', name: 'Malta' }, { code: 'MH', name: 'Islas Marshall' }, { code: 'MR', name: 'Mauritania' },
  { code: 'MU', name: 'Mauricio' }, { code: 'MX', name: 'México' }, { code: 'FM', name: 'Micronesia' },
  { code: 'MD', name: 'Moldavia' }, { code: 'MC', name: 'Mónaco' }, { code: 'MN', name: 'Mongolia' },
  { code: 'ME', name: 'Montenegro' }, { code: 'MA', name: 'Marruecos' }, { code: 'MZ', name: 'Mozambique' },
  { code: 'MM', name: 'Myanmar' }, { code: 'NA', name: 'Namibia' }, { code: 'NR', name: 'Nauru' },
  { code: 'NP', name: 'Nepal' }, { code: 'NL', name: 'Países Bajos' }, { code: 'NZ', name: 'Nueva Zelanda' },
  { code: 'NI', name: 'Nicaragua' }, { code: 'NE', name: 'Níger' }, { code: 'NG', name: 'Nigeria' },
  { code: 'KP', name: 'RPD de Corea' }, { code: 'MK', name: 'Macedonia del Norte' }, { code: 'NO', name: 'Noruega' },
  { code: 'OM', name: 'Omán' }, { code: 'PK', name: 'Pakistán' }, { code: 'PW', name: 'Palaos' },
  { code: 'PS', name: 'Palestina' }, { code: 'PA', name: 'Panamá' }, { code: 'PG', name: 'Papúa Nueva Guinea' },
  { code: 'PY', name: 'Paraguay' }, { code: 'PE', name: 'Perú' }, { code: 'PH', name: 'Filipinas' },
  { code: 'PL', name: 'Polonia' }, { code: 'PT', name: 'Portugal' }, { code: 'QA', name: 'Katar' },
  { code: 'RO', name: 'Rumania' }, { code: 'RU', name: 'Federación Rusa' }, { code: 'RW', name: 'Ruanda' },
  { code: 'KN', name: 'San Cristóbal y Nieves' }, { code: 'LC', name: 'Santa Lucía' },
  { code: 'VC', name: 'San Vicente y las Granadinas' }, { code: 'WS', name: 'Samoa' },
  { code: 'SM', name: 'San Marino' }, { code: 'ST', name: 'Santo Tomé y Príncipe' }, { code: 'SA', name: 'Arabia Saudita' },
  { code: 'SN', name: 'Senegal' }, { code: 'RS', name: 'Serbia' }, { code: 'SC', name: 'Seychelles' },
  { code: 'SL', name: 'Sierra Leona' }, { code: 'SG', name: 'Singapur' }, { code: 'SK', name: 'Eslovaquia' },
  { code: 'SI', name: 'Eslovenia' }, { code: 'SB', name: 'Islas Salomón' }, { code: 'SO', name: 'Somalia' },
  { code: 'ZA', name: 'Sudáfrica' }, { code: 'KR', name: 'República de Corea' }, { code: 'SS', name: 'Sudán del Sur' },
  { code: 'ES', name: 'España' }, { code: 'LK', name: 'Sri Lanka' }, { code: 'SD', name: 'Sudán' },
  { code: 'SR', name: 'Surinam' }, { code: 'SE', name: 'Suecia' }, { code: 'CH', name: 'Suiza' },
  { code: 'SY', name: 'República Árabe Siria' }, { code: 'TJ', name: 'Tayikistán' }, { code: 'TZ', name: 'Tanzania' },
  { code: 'TH', name: 'Tailandia' }, { code: 'TL', name: 'Timor-Leste' }, { code: 'TG', name: 'Togo' },
  { code: 'TO', name: 'Tonga' }, { code: 'TT', name: 'Trinidad y Tobago' }, { code: 'TN', name: 'Túnez' },
  { code: 'TR', name: 'Turquía' }, { code: 'TM', name: 'Turkmenistán' }, { code: 'TV', name: 'Tuvalu' },
  { code: 'UG', name: 'Uganda' }, { code: 'UA', name: 'Ucrania' }, { code: 'AE', name: 'Emiratos Árabes Unidos' },
  { code: 'GB', name: 'Reino Unido' }, { code: 'US', name: 'Estados Unidos' }, { code: 'UY', name: 'Uruguay' },
  { code: 'UZ', name: 'Uzbekistán' }, { code: 'VU', name: 'Vanuatu' }, { code: 'VA', name: 'Santa Sede' },
  { code: 'VE', name: 'Venezuela' }, { code: 'VN', name: 'Vietnam' }, { code: 'YE', name: 'Yemen' },
  { code: 'ZM', name: 'Zambia' }, { code: 'ZW', name: 'Zimbabue' },
]

const TEMPLATES: Record<string, string[]> = {
  UNGA: ALL_COUNTRIES.map(c => c.code),
  UNSC: ['US', 'GB', 'FR', 'RU', 'CN', 'AL', 'BR', 'EC', 'GA', 'JP', 'MT', 'MZ', 'KR', 'SI', 'GY'],
  ECOSOC: ['US', 'GB', 'FR', 'RU', 'CN', 'DE', 'JP', 'BR', 'IN', 'IT', 'CA', 'AU', 'KR', 'ZA', 'AR', 'MX', 'ID', 'TR', 'SA', 'NG', 'EG', 'ET', 'KE', 'MA', 'DZ', 'SN', 'GH', 'CI', 'CM', 'UG', 'BW', 'GA', 'CG', 'MW', 'MZ', 'ZM', 'CV', 'AO', 'BJ', 'BF', 'GN', 'ML', 'NE', 'RW', 'SL', 'TG', 'NA', 'LS', 'CD', 'BI', 'TD', 'CF', 'KM', 'DJ', 'GQ', 'ER', 'SZ', 'GM', 'GW', 'LR', 'MG', 'MR', 'MU', 'SC', 'SO', 'SS', 'SD', 'TZ', 'TN', 'ZM', 'ZW'],
  WHO: ['US', 'GB', 'FR', 'RU', 'CN', 'DE', 'JP', 'BR', 'IN', 'IT', 'CA', 'AU', 'ES', 'NL', 'SE', 'NO', 'DK', 'FI', 'BE', 'AT', 'CH', 'GR', 'PT', 'PL', 'CZ', 'HU', 'RO', 'BG', 'HR', 'SK', 'SI', 'LT', 'LV', 'EE'],
  UNHCR: ['US', 'GB', 'FR', 'RU', 'CN', 'DE', 'JP', 'BR', 'IN', 'IT', 'CA', 'AU', 'ES', 'NL', 'SE', 'NO', 'DK', 'FI', 'BE', 'AT', 'CH', 'GR', 'PT', 'PL', 'CZ', 'HU', 'RO', 'BG', 'HR', 'SK', 'SI', 'LT', 'LV', 'EE', 'IE', 'LU', 'MT', 'CY', 'TR', 'IL', 'JO', 'LB', 'EG', 'TN', 'MA', 'DZ', 'ET', 'KE', 'UG', 'TZ', 'ZM', 'MW', 'ZA', 'NG', 'GH'],
  UNHRC: ['US', 'GB', 'FR', 'RU', 'CN', 'DE', 'JP', 'BR', 'IN', 'ID', 'IT', 'CA', 'AU', 'ES', 'NL', 'SE', 'NO', 'DK', 'FI', 'BE', 'AT', 'CH', 'GR', 'PT', 'PL', 'CZ', 'HU', 'RO', 'BG', 'HR', 'SK', 'SI', 'LT', 'LV', 'EE', 'IE', 'LU', 'MT', 'CY', 'TR', 'IL', 'JO', 'LB', 'EG', 'TN', 'MA', 'DZ'],
  UNICEF: ['US', 'GB', 'FR', 'RU', 'CN', 'DE', 'JP', 'BR', 'IN', 'IT', 'CA', 'AU', 'ES', 'NL', 'SE', 'NO', 'DK', 'FI', 'BE', 'AT', 'CH', 'GR', 'PT', 'PL', 'CZ', 'HU', 'RO', 'BG', 'HR', 'SK', 'SI', 'LT', 'LV', 'EE'],
  ASEAN: ['BN', 'KH', 'ID', 'LA', 'MY', 'MM', 'PH', 'SG', 'TH', 'VN'],
  AU: ['DZ', 'AO', 'BJ', 'BW', 'BF', 'BI', 'CV', 'CM', 'CF', 'TD', 'KM', 'CG', 'CD', 'CI', 'DJ', 'EG', 'GQ', 'ER', 'SZ', 'ET', 'GA', 'GM', 'GH', 'GN', 'GW', 'KE', 'LS', 'LR', 'LY', 'MG', 'MW', 'ML', 'MR', 'MU', 'MA', 'MZ', 'NA', 'NE', 'NG', 'RW', 'ST', 'SN', 'SC', 'SL', 'SO', 'ZA', 'SS', 'SD', 'TZ', 'TG', 'TN', 'UG', 'ZM', 'ZW'],
  NATO: ['US', 'GB', 'FR', 'DE', 'IT', 'CA', 'ES', 'NL', 'TR', 'PL', 'RO', 'GR', 'CZ', 'HU', 'PT', 'NO', 'DK', 'BE', 'HR', 'SK', 'BG', 'EE', 'LV', 'LT', 'SI', 'AL', 'MK', 'ME', 'IS', 'LU'],
  EU: ['AT', 'BE', 'BG', 'HR', 'CY', 'CZ', 'DK', 'EE', 'FI', 'FR', 'DE', 'GR', 'HU', 'IE', 'IT', 'LV', 'LT', 'LU', 'MT', 'NL', 'PL', 'PT', 'RO', 'SK', 'SI', 'ES', 'SE'],
  G20: ['AR', 'AU', 'BR', 'CA', 'CN', 'FR', 'DE', 'IN', 'ID', 'IT', 'JP', 'KR', 'MX', 'RU', 'SA', 'ZA', 'TR', 'GB', 'US', 'EU'],
}

const TEMPLATE_LABELS: Record<string, string> = {
  UNGA: 'Asamblea General de las Naciones Unidas', UNSC: 'Consejo de Seguridad de las Naciones Unidas',
  ECOSOC: 'Consejo Económico y Social', WHO: 'Organización Mundial de la Salud',
  UNHCR: 'Alto Comisionado de las Naciones Unidas para los Refugiados',
  UNHRC: 'Consejo de Derechos Humanos de las Naciones Unidas',
  UNICEF: 'Fondo de las Naciones Unidas para la Infancia',
  ASEAN: 'Asociación de Naciones del Sudeste Asiático',
  AU: 'Unión Africana', NATO: 'Organización del Tratado del Atlántico Norte',
  EU: 'Unión Europea', G20: 'Grupo de los 20',
}
const TEMPLATE_SHORT: Record<string, string> = {
  UNGA: 'UNGA', UNSC: 'CS', ECOSOC: 'ECOSOC', WHO: 'OMS',
  UNHCR: 'ACNUR', UNHRC: 'CDH', UNICEF: 'UNICEF',
  ASEAN: 'ASEAN', AU: 'UA', NATO: 'OTAN', EU: 'UE', G20: 'G-20',
}

const PHASE_ORDER: Phase[] = ['setup', 'rollcall', 'gsl', 'motions', 'mod', 'unmod', 'singleSpeaker', 'voting', 'summary']
const PHASE_LABELS: Record<Phase, string> = {
  setup: 'Configuración', rollcall: 'Pasar lista', gsl: 'Lista de oradores', motions: 'Mociones',
  mod: 'Mod', unmod: 'Unmod', singleSpeaker: 'Orador único', voting: 'Votación', summary: 'Resumen',
}
const TAB_PANELS: Phase[] = ['gsl', 'motions', 'mod', 'unmod', 'singleSpeaker', 'voting']

// ── Design ───────────────────────────────────────────────────────────────────

const theme = {
  cream: '#F0E7D5', white: '#FFFFFF', dark: '#1A1A2E', dark2: '#0F0F23',
  primary: '#A01028', secondary: '#259DBE',
  tertiary: '#FAA419', tertiaryHover: '#FFF9F0',
  text: '#1A1A2E', muted: '#7F8C8D', dim: '#B0ABA4', border: '#E0D8C8',
  green: '#27AE60', greenBg: '#E8F5E9', amber: '#B76A00', amberBg: '#FFF3E0',
  red: '#C0392B', redBg: '#FFEBEE',
  shadow: '0 2px 8px rgba(0,0,0,0.08), 0 1px 3px rgba(0,0,0,0.04)',
  iosgrey: '#E5E5E5',
}

const serif = (sz: string) => ({ fontFamily: 'var(--font-cormorant)', fontSize: sz, fontWeight: 500, color: theme.text })
const mono = () => ({ fontFamily: 'var(--font-outfit)', fontSize: '0.78rem', color: theme.text })
const card: React.CSSProperties = { background: theme.white, borderRadius: 4, border: `1px solid ${theme.border}`, boxShadow: theme.shadow }
const fmt = (s: number) => { const m = Math.floor(s / 60); const sec = s % 60; return `${m}:${sec.toString().padStart(2, '0')}` }
const fmtFull = (s: number) => { const m = Math.floor(s / 60); const sec = s % 60; return `${m}m ${sec}s` }

// ── Reducer ──────────────────────────────────────────────────────────────────

const initTimer: TimerState = { running: false, timeLeft: 90, maxTime: 90, startedAt: null }

const initState: State = {
  phase: 'setup', committeeName: '', committeeTopic: '',
  delegates: [], rollCall: {},
  gslSpeakers: [], gslCurrentIndex: -1,
  motions: [], activeMotion: null,
  modSpeakers: [], modCurrentIndex: -1, modTopic: '', modStartTime: null,
  speakerTimer: { ...initTimer },
  unmodTimer: { ...initTimer, maxTime: 300, timeLeft: 300 },
  singleSpeakerName: null,
  votes: [], voteType: 'procedural', voteMajority: 'simple',
  observerAllowed: false, voteRound: 1, voteResultsHidden: false,
  scores: {},
}

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'SET_PHASE': {
      return { ...state, phase: action.phase }
    }
    case 'SET_COMMITTEE_NAME': return { ...state, committeeName: action.value }
    case 'SET_COMMITTEE_TOPIC': return { ...state, committeeTopic: action.value }
    case 'SET_DELEGATES': return { ...state, delegates: action.delegates }
    case 'SET_ROLL_CALL':
      return { ...state, rollCall: { ...state.rollCall, [action.country]: action.status } }
    case 'COMPLETE_ROLL_CALL': {
      const rc = { ...state.rollCall }
      state.delegates.forEach(d => { if (!rc[d.name]) rc[d.name] = 'absent' })
      return { ...state, rollCall: rc, phase: 'gsl' }
    }

    case 'GSL_ADD_SPEAKER':
      return state.gslSpeakers.includes(action.country) ? state : { ...state, gslSpeakers: [...state.gslSpeakers, action.country] }
    case 'GSL_REMOVE_SPEAKER':
      return { ...state, gslSpeakers: state.gslSpeakers.filter(c => c !== action.country) }
    case 'GSL_ADVANCE': {
      const next = state.gslCurrentIndex + 1
      if (next >= state.gslSpeakers.length) return { ...state, gslCurrentIndex: state.gslSpeakers.length }
      return { ...state, gslCurrentIndex: next, speakerTimer: { ...state.speakerTimer, running: false, timeLeft: state.speakerTimer.maxTime, startedAt: null } }
    }
    case 'GSL_IMPORT':
      return { ...state, gslSpeakers: action.speakers }

    case 'PROPOSE_MOTION':
      return { ...state, motions: [action.motion, ...state.motions] }
    case 'RESOLVE_MOTION': {
      const motions = state.motions.map(m => m.id === action.id ? { ...m, status: action.approved ? 'approved' as const : 'rejected' as const } : m)
      return { ...state, motions }
    }
    case 'REMOVE_MOTION':
      return { ...state, motions: state.motions.filter(m => m.id !== action.id) }
    case 'SET_ACTIVE_MOTION':
      return { ...state, activeMotion: action.motion }

    case 'MOD_ADD_SPEAKER':
      return state.modSpeakers.includes(action.country) ? state : { ...state, modSpeakers: [...state.modSpeakers, action.country] }
    case 'MOD_REMOVE_SPEAKER':
      return { ...state, modSpeakers: state.modSpeakers.filter(c => c !== action.country) }
    case 'MOD_ADVANCE': {
      const next = state.modCurrentIndex + 1
      if (next >= state.modSpeakers.length) return { ...state, modCurrentIndex: state.modSpeakers.length }
      return { ...state, modCurrentIndex: next, speakerTimer: { ...state.speakerTimer, running: false, timeLeft: state.speakerTimer.maxTime, startedAt: null } }
    }
    case 'MOD_SET_TOPIC':
      return { ...state, modTopic: action.topic }
    case 'MOD_SET_CAUCUS_START':
      return { ...state, modStartTime: action.startedAt }

    case 'SET_SPEAKER_TIMER':
      return { ...state, speakerTimer: { ...state.speakerTimer, ...action.timer } }
    case 'TICK_SPEAKER':
      if (!state.speakerTimer.running) return state
      return { ...state, speakerTimer: { ...state.speakerTimer, timeLeft: Math.max(0, state.speakerTimer.timeLeft - 1), running: state.speakerTimer.timeLeft > 1 } }

    case 'UNMOD_SET_TIMER':
      return { ...state, unmodTimer: { ...state.unmodTimer, ...action.timer } }
    case 'TICK_UNMOD':
      if (!state.unmodTimer.running) return state
      return { ...state, unmodTimer: { ...state.unmodTimer, timeLeft: Math.max(0, state.unmodTimer.timeLeft - 1), running: state.unmodTimer.timeLeft > 1 } }

    case 'SINGLE_SET':
      return { ...state, singleSpeakerName: action.name }

    case 'VOTE_CAST':
      return { ...state, votes: [...state.votes.filter(v => v.country !== action.country), { country: action.country, vote: action.vote }] }
    case 'VOTE_SET_TYPE':
      return { ...state, voteType: action.voteType }
    case 'VOTE_SET_MAJORITY':
      return { ...state, voteMajority: action.majority }
    case 'VOTE_SET_OBSERVER':
      return { ...state, observerAllowed: action.allowed }
    case 'VOTE_NEXT_ROUND':
      return { ...state, voteRound: 2 as const, votes: [] }
    case 'VOTE_TOGGLE_RESULTS':
      return { ...state, voteResultsHidden: !state.voteResultsHidden }
    case 'VOTE_RESET':
      return { ...state, votes: [], voteRound: 1, voteResultsHidden: false }

    case 'ADD_SCORE': {
      const prev = state.scores[action.country] ?? 0
      return { ...state, scores: { ...state.scores, [action.country]: prev + action.points } }
    }
    case 'RESET_SESSION': return { ...initState, delegates: state.delegates }
    default: return state
  }
}

// ── Top Bar ──────────────────────────────────────────────────────────────────

function TopBar({ state, dispatch }: { state: State; dispatch: React.Dispatch<Action> }) {
  return (
    <div style={{
      flexShrink: 0, background: theme.dark, borderBottom: `1px solid rgba(255,255,255,0.06)`,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '6px 20px', gap: 6, minHeight: 32,
    }}>
      {state.phase !== 'setup' && state.phase !== 'rollcall' && state.phase !== 'summary' && (
        <>
          <TabBtn label="Lista de oradores" phase="gsl" icon={ION.home} current={state.phase} dispatch={dispatch} />
          <TabBtn label="Mociones" phase="motions" icon={ION.walk} current={state.phase} dispatch={dispatch} />
          <TabBtn label="Mod" phase="mod" icon={ION.chatbubble} current={state.phase} dispatch={dispatch} />
          <TabBtn label="Unmod" phase="unmod" icon={ION.chatbubbles} current={state.phase} dispatch={dispatch} />
          <TabBtn label="Único orador" phase="singleSpeaker" icon={ION.mic} current={state.phase} dispatch={dispatch} />
          <TabBtn label="Votar" phase="voting" icon={ION.chartbar} current={state.phase} dispatch={dispatch} />
        </>
      )}
    </div>
  )
}

const ION = {
  home: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-4 0a1 1 0 01-1-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 01-1 1',
  walk: 'M13 5a2 2 0 100-4 2 2 0 000 4z M3 20l3-5 3 3 2-7 3 3 3-5 M13 12l3-3',
  chatbubble: 'M21 12a9 9 0 11-18 0 9 9 0 0118 0z M9 9h6M9 13h3',
  chatbubbles: 'M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a2 2 0 01-2-2v-1 M5 5h10a2 2 0 012 2v5a2 2 0 01-2 2H9l-4 4V7a2 2 0 012-2z',
  mic: 'M12 2a3 3 0 00-3 3v6a3 3 0 006 0V5a3 3 0 00-3-3z M19 10v1a7 7 0 01-14 0v-1 M12 19v3',
  chartbar: 'M4 20V4 M10 20V8 M16 20V12 M22 20v-4',
}

function TabBtn({ label, phase, icon, current, dispatch }: {
  label: string; phase: Phase; icon: string; current: Phase; dispatch: React.Dispatch<Action>
}) {
  const active = current === phase
  return (
    <button onClick={() => dispatch({ type: 'SET_PHASE', phase })}
      style={{
        fontFamily: 'var(--font-outfit)', fontSize: '0.65rem', fontWeight: active ? 600 : 400,
        padding: '4px 10px', borderRadius: 3, border: active ? `1px solid ${theme.tertiary}` : '1px solid rgba(255,255,255,0.08)',
        background: active ? 'rgba(250,164,25,0.12)' : 'rgba(255,255,255,0.04)',
        color: active ? theme.tertiary : 'rgba(255,255,255,0.5)',
        cursor: 'pointer', whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: 4,
        transition: 'all 0.15s',
      }}>
      <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d={icon} />
      </svg>
      {label}
    </button>
  )
}

// ── Left: Step Navigation ────────────────────────────────────────────────────

const PHASE_ICONS: Record<Phase, string> = {
  setup: '⚙️', rollcall: '✔️', gsl: '🎤', motions: '📌',
  mod: '🔴', unmod: '⚪', singleSpeaker: '👤', voting: '🗳️', summary: '📊',
}

function StepNav({ state, dispatch }: { state: State; dispatch: React.Dispatch<Action> }) {
  const curIdx = PHASE_ORDER.indexOf(state.phase)

  return (
    <div style={{
      width: 52, flexShrink: 0, background: theme.dark,
      borderRight: `1px solid rgba(255,255,255,0.06)`,
      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2,
      padding: '8px 0', overflow: 'auto',
    }}>
      {PHASE_ORDER.map((p, i) => {
        const active = p === state.phase
        const past = i < curIdx
        const locked = i > curIdx
        const canClick = !locked || p === 'setup' || p === 'summary'
        return (
          <button key={p} onClick={() => { if (canClick) dispatch({ type: 'SET_PHASE', phase: p }) }}
            title={PHASE_LABELS[p]}
            style={{
              position: 'relative', width: 36, height: 36, borderRadius: 10, border: 'none',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: canClick ? 'pointer' : 'default',
              background: active ? theme.primary : past ? theme.green : 'rgba(255,255,255,0.04)',
              color: active ? '#fff' : past ? '#fff' : 'rgba(255,255,255,0.2)',
              fontSize: '0.9rem', transition: 'all 0.2s ease',
              opacity: locked && !canClick ? 0.3 : 1,
              boxShadow: active ? `0 0 0 2px ${theme.tertiary}` : 'none',
            }}>
            {active ? (
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="5 3 19 12 5 21 5 3" />
              </svg>
            ) : past ? (
              <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            ) : (
              <span>{PHASE_ICONS[p]}</span>
            )}
          </button>
        )
      })}
    </div>
  )
}

// ── Right: Context Panel ─────────────────────────────────────────────────────

function ContextPanel({ state }: { state: State }) {
  const currentGsl = state.gslCurrentIndex >= 0 && state.gslCurrentIndex < state.gslSpeakers.length ? state.gslSpeakers[state.gslCurrentIndex] : null
  const nextGsl = currentGsl ? state.gslSpeakers.slice(state.gslCurrentIndex + 1, state.gslCurrentIndex + 4) : state.gslSpeakers.slice(0, 4)
  const currentMod = state.modCurrentIndex >= 0 && state.modCurrentIndex < state.modSpeakers.length ? state.modSpeakers[state.modCurrentIndex] : null
  const present = state.delegates.filter(d => state.rollCall[d.name] === 'present').length
  const approvedCount = state.motions.filter(m => m.status === 'approved').length
  const rejectedCount = state.motions.filter(m => m.status === 'rejected').length

  const ti = state.speakerTimer
  const speakerPct = ti.maxTime > 0 ? ti.timeLeft / ti.maxTime : 0

  return (
    <div style={{ width: 250, flexShrink: 0, background: theme.white, borderLeft: `1px solid ${theme.border}`, display: 'flex', flexDirection: 'column', overflow: 'auto' }}>
      <Section title={state.phase === 'mod' ? 'Orador Mod' : 'Orador GSL'}>
        {state.phase === 'mod' && currentMod ? (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
              <span style={{ fontSize: '1.2rem' }}>{state.delegates.find(d => d.name === currentMod)?.flag}</span>
              <span style={{ ...mono(), fontWeight: 600, fontSize: '0.85rem' }}>{currentMod}</span>
              <span style={{ fontFamily: 'var(--font-outfit)', fontSize: '0.45rem', fontWeight: 600, padding: '1px 5px', borderRadius: 2, background: ti.running ? theme.greenBg : theme.amberBg, color: ti.running ? theme.green : theme.amber }}>
                {ti.running ? 'LIVE' : 'PAUSED'}
              </span>
            </div>
            <Bar pct={speakerPct} />
            <p style={{ fontFamily: 'var(--font-outfit)', fontSize: '1.5rem', fontWeight: 600, color: theme.text, margin: 0 }}>{fmt(ti.timeLeft)}</p>
          </div>
        ) : currentGsl ? (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
              <span style={{ fontSize: '1.2rem' }}>{state.delegates.find(d => d.name === currentGsl)?.flag}</span>
              <span style={{ ...mono(), fontWeight: 600, fontSize: '0.85rem' }}>{currentGsl}</span>
              <span style={{ fontFamily: 'var(--font-outfit)', fontSize: '0.45rem', fontWeight: 600, padding: '1px 5px', borderRadius: 2, background: ti.running ? theme.greenBg : theme.amberBg, color: ti.running ? theme.green : theme.amber }}>
                {ti.running ? 'LIVE' : 'PAUSED'}
              </span>
            </div>
            <Bar pct={speakerPct} />
            <p style={{ fontFamily: 'var(--font-outfit)', fontSize: '1.5rem', fontWeight: 600, color: theme.text, margin: 0 }}>{fmt(ti.timeLeft)}</p>
          </div>
        ) : (
          <p style={{ ...mono(), fontSize: '0.68rem', color: theme.muted }}>Sin orador activo</p>
        )}
      </Section>
      <Section title="Próximos oradores GSL">
        {nextGsl.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {nextGsl.map((name, i) => {
              const d = state.delegates.find(x => x.name === name)
              return (
                <div key={name} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                  <span style={{ fontFamily: 'var(--font-outfit)', fontSize: '0.5rem', color: theme.dim, minWidth: 10 }}>{i + 1}.</span>
                  <span style={{ fontSize: '0.75rem' }}>{d?.flag}</span>
                  <span style={{ ...mono(), fontSize: '0.62rem' }}>{name}</span>
                </div>
              )
            })}
          </div>
        ) : <p style={{ ...mono(), fontSize: '0.68rem', color: theme.muted }}>Lista vacía</p>}
      </Section>
      <Section title="Moción activa">
        {state.activeMotion ? (
          <div>
            <p style={{ ...mono(), fontSize: '0.72rem', fontWeight: 600, margin: 0 }}>{state.activeMotion.label}</p>
            <p style={{ ...mono(), fontSize: '0.55rem', color: theme.muted, margin: '2px 0 0' }}>by {state.activeMotion.proposer}</p>
          </div>
        ) : (
          <p style={{ ...mono(), fontSize: '0.68rem', color: theme.muted }}>None</p>
        )}
      </Section>
      <Section title="Estadísticas">
        <p style={{ ...mono(), fontSize: '0.62rem', color: theme.muted, margin: 0 }}>{state.delegates.length} delegates · {present} present</p>
        <p style={{ ...mono(), fontSize: '0.62rem', color: theme.muted, margin: '2px 0 0' }}>{state.motions.length} motions · {approvedCount} passed · {rejectedCount} rejected</p>
        <p style={{ ...mono(), fontSize: '0.62rem', color: theme.muted, margin: '2px 0 0' }}>{state.gslSpeakers.length} GSL speeches</p>
      </Section>
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ padding: '8px 12px', borderBottom: `1px solid ${theme.border}` }}>
      <p style={{ fontFamily: 'var(--font-outfit)', fontSize: '0.45rem', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: theme.muted, margin: '0 0 4px' }}>{title}</p>
      {children}
    </div>
  )
}

function Bar({ pct }: { pct: number }) {
  return (
    <div style={{ height: 3, background: theme.border, borderRadius: 2, overflow: 'hidden', marginBottom: 3 }}>
      <div style={{ height: '100%', width: `${Math.min(100, pct * 100)}%`, borderRadius: 2, transition: 'width 1s linear', background: pct < 0.1 ? theme.red : pct < 0.3 ? theme.amber : theme.green }} />
    </div>
  )
}

// ── Setup ────────────────────────────────────────────────────────────────────

function SetupPanel({ state, dispatch }: { state: State; dispatch: React.Dispatch<Action> }) {
  const [customName, setCustomName] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [template, setTemplate] = useState<string | null>(null)
  const [selected, setSelected] = useState<Delegate[]>(state.delegates)
  const [title, setTitle] = useState(state.committeeName || 'MUN Command Session')
  useEffect(() => { setSelected(state.delegates) }, [state.delegates])
  const available = ALL_COUNTRIES.filter(c => !selected.some(s => s.name === c.name))
    .filter(c => !searchTerm || c.name.toLowerCase().includes(searchTerm.toLowerCase()))
  const syncDelegates = (d: Delegate[]) => { setSelected(d); dispatch({ type: 'SET_DELEGATES', delegates: d }) }
  const addCountry = (c: { code: string; name: string }) => syncDelegates([...selected, { name: c.name, flag: FLAG(c.code) }])
  const removeCountry = (name: string) => syncDelegates(selected.filter(s => s.name !== name))
  const addCustom = () => {
    if (!customName.trim()) return
    const id = `CUSTOM_${Date.now()}`
    syncDelegates([...selected, { name: customName.trim(), flag: '🏳️', isCustom: true }])
    setCustomName('')
  }
  const selectTemplate = (t: string) => {
    setTemplate(t)
    const codes = TEMPLATES[t]
    const dels = codes.map(code => {
      const c = ALL_COUNTRIES.find(x => x.code === code)
      return { name: c?.name || code, flag: FLAG(code), powerStatus: undefined as PowerStatus | undefined }
    })
    syncDelegates(dels)
    setTitle(TEMPLATE_LABELS[t] || t)
  }
  const clearAll = () => { syncDelegates([]); setTemplate(null); setTitle('MUN Command Session') }
  const startSession = () => {
    dispatch({ type: 'SET_COMMITTEE_NAME', value: title })
    dispatch({ type: 'SET_DELEGATES', delegates: selected })
    dispatch({ type: 'SET_PHASE', phase: 'rollcall' })
  }
  const editTitle = () => {
    const t = prompt('Nombre del comité', title === 'MUN Command Session' ? '' : title) || ''
    if (t.length > 30) { alert('Los nombres de los comités no pueden tener más de 30 caracteres'); return }
    if (t) setTitle(t)
  }
  const setPower = (name: string, power: PowerStatus) => {
    syncDelegates(selected.map(s => s.name === name ? { ...s, powerStatus: s.powerStatus === power ? undefined : power } : s))
  }
  const loadFile = () => {
    const inp = document.createElement('input')
    inp.type = 'file'; inp.accept = '.json'
    inp.onchange = (e: any) => {
      const file = e.target?.files?.[0]
      if (!file) return
      const reader = new FileReader()
      reader.onload = (ev) => {
        try {
          const json = JSON.parse(ev.target?.result as string)
          if (json.committeeName) setTitle(json.committeeName)
          if (json.delegates) syncDelegates(json.delegates.map((d: any) => ({ name: d.name || d, flag: d.flag || FLAG(d.code || ''), powerStatus: d.powerStatus, isCustom: d.isCustom })))
        } catch { }
      }
      reader.readAsText(file)
    }
    inp.click()
  }
  const exportFile = () => {
    const blob = new Blob([JSON.stringify({ committeeName: title, delegates: selected }, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a'); a.href = url; a.download = 'comite_actual.json'; a.click()
    URL.revokeObjectURL(url)
  }

  const setupSx: React.CSSProperties = {
    fontFamily: 'var(--font-outfit)', color: theme.text, fontSize: '0.78rem',
  }
  const inpSx: React.CSSProperties = {
    width: '100%', background: theme.cream, border: `1px solid ${theme.border}`,
    color: theme.text, padding: '7px 10px', fontSize: '0.78rem',
    fontFamily: 'var(--font-outfit)', outline: 'none', borderRadius: 3,
    boxSizing: 'border-box',
  }
  const btnTertiary: React.CSSProperties = {
    borderRadius: 8, border: `1px solid ${theme.tertiary}`, height: 30,
    background: '#fff', color: theme.tertiary, cursor: 'pointer', fontSize: '0.75rem',
    fontFamily: 'var(--font-outfit)', display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 1,
  }
  const addBtn: React.CSSProperties = {
    background: 'none', border: 'none', cursor: 'pointer', color: theme.tertiary,
    fontSize: '1.6rem', padding: 0, margin: 0, lineHeight: 1, display: 'flex',
  }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: 16, height: '100%', ...setupSx }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div style={{ ...card, padding: '12px 14px', display: 'flex', alignItems: 'center', gap: 12 }}>
          <h3 style={{ margin: 0, fontFamily: 'var(--font-outfit)', fontSize: '1rem', fontWeight: 600, color: theme.text, whiteSpace: 'nowrap' }}>
            Cargar Comité
          </h3>
          <div style={{ display: 'flex', gap: 12, flex: 1 }}>
            <button onClick={loadFile} style={btnTertiary}>Del Archivo</button>
            <button onClick={() => setTemplate('__picker__')} style={btnTertiary}>Desde Plantilla</button>
            <button onClick={exportFile} style={{ ...btnTertiary, borderColor: theme.border, color: theme.muted }}>Exportar</button>
          </div>
        </div>

        <div style={{ ...card, padding: '14px', display: 'flex', flexDirection: 'column', gap: 16, flex: 1, minHeight: 504 }}>
          <h2 style={{ margin: 0, fontFamily: 'var(--font-outfit)', fontSize: '1.1rem', fontWeight: 600, color: theme.text }}>
            Configurar nuevo comité
          </h2>

          <div>
            <h5 style={{ margin: '0 0 6px', fontFamily: 'var(--font-outfit)', fontSize: '0.8rem', fontWeight: 500, color: theme.muted }}>
              Personalizar miembros
            </h5>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: theme.cream, border: `1px solid ${theme.border}`, borderRadius: 3, padding: '4px 8px' }}>
              <span style={{ fontSize: '1.2rem' }}>🏳️</span>
              <input value={customName} onChange={e => setCustomName(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && addCustom()}
                placeholder="Ingrese delegado personalizado"
                style={{ flex: 1, border: 'none', background: 'transparent', outline: 'none', fontFamily: 'var(--font-outfit)', fontSize: '0.78rem', color: theme.text }} />
              <button onClick={addCustom} disabled={!customName.trim()} style={{ ...addBtn, opacity: !customName.trim() ? 0.3 : 1 }}>+</button>
            </div>
          </div>

          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
            <h5 style={{ margin: '0 0 6px', fontFamily: 'var(--font-outfit)', fontSize: '0.8rem', fontWeight: 500, color: theme.muted }}>
              Estados Miembro de la ONU
            </h5>
            <input value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
              placeholder="Buscar"
              style={{ ...inpSx, marginBottom: 8, fontSize: '0.75rem', padding: '6px 10px' }} />
            <div style={{ flex: 1, overflow: 'auto', borderTop: `1px solid ${theme.border}` }}>
              {available.map(c => (
                <div key={c.code} onClick={() => addCountry(c)}
                  style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 8px', cursor: 'pointer', borderBottom: `1px solid ${theme.iosgrey}`, transition: 'background 0.1s' }}
                  onMouseEnter={e => (e.currentTarget.style.background = theme.cream)}
                  onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                  <span style={{ fontSize: '1.2rem' }}>{FLAG(c.code)}</span>
                  <span style={{ ...setupSx, fontSize: '0.78rem' }}>{c.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div style={{ ...card, padding: '14px', display: 'flex', flexDirection: 'column', minHeight: 'calc(100vh - 210px)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
          <h2 style={{ margin: 0, fontFamily: 'var(--font-outfit)', fontSize: '1.1rem', fontWeight: 600, color: theme.text, flex: 1 }}>
            {title}
          </h2>
          <button onClick={editTitle}
            style={{ background: 'none', border: `1px solid ${theme.tertiary}`, borderRadius: 4, color: theme.tertiary, cursor: 'pointer', padding: '2px 8px', fontSize: '0.85rem', display: 'flex', alignItems: 'center' }}>
            ✏️
          </button>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
          <span style={{ ...setupSx, fontWeight: 600 }}>Países</span>
          <span style={{ ...setupSx, color: theme.muted }}>{selected.length} Países</span>
        </div>

        <div style={{ flex: 1, overflow: 'auto', marginBottom: 10 }}>
          {selected.map(s => (
            <div key={s.name} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '5px 4px', borderBottom: `1px solid ${theme.iosgrey}` }}>
              <span style={{ fontSize: '1.1rem' }}>{s.flag}</span>
              <span style={{ ...setupSx, fontSize: '0.78rem', flex: 1 }}>{s.name}</span>
              <select value={s.powerStatus || ''} onChange={e => setPower(s.name, e.target.value as PowerStatus)}
                style={{ fontFamily: 'var(--font-outfit)', fontSize: '0.6rem', padding: '1px 4px', border: `1px solid ${theme.border}`, borderRadius: 2, background: '#fff', color: theme.text }}>
                <option value="">Delegate</option>
                <option value="VetoPower">Veto Power</option>
                <option value="Observer">Observer</option>
              </select>
              <button onClick={() => removeCountry(s.name)}
                style={{ background: 'none', border: 'none', color: theme.muted, cursor: 'pointer', fontSize: '1.1rem', padding: '0 2px', lineHeight: 1 }}>⋯</button>
            </div>
          ))}
          {selected.length === 0 && (
            <p style={{ ...setupSx, color: theme.muted, textAlign: 'center', padding: '20px 0' }}>No hay países seleccionados</p>
          )}
        </div>

        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={clearAll}
            style={{ flex: 1, background: 'none', border: 'none', color: theme.primary, cursor: 'pointer', fontFamily: 'var(--font-outfit)', fontSize: '0.78rem', padding: '8px 0' }}>
            Borrar selección
          </button>
          <button onClick={startSession} disabled={selected.length === 0}
            style={{ flex: 2, borderRadius: 8, border: 'none', background: theme.primary, color: '#fff', cursor: selected.length === 0 ? 'not-allowed' : 'pointer', fontFamily: 'var(--font-outfit)', fontSize: '0.85rem', fontWeight: 600, padding: '10px 0', opacity: selected.length === 0 ? 0.5 : 1 }}>
            Iniciar sesión
          </button>
        </div>

        {template && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}
            onClick={() => setTemplate(null)}>
            <div style={{ background: '#fff', borderRadius: 12, padding: 20, maxWidth: 400, width: '90%', maxHeight: '80vh', overflow: 'auto' }}
              onClick={e => e.stopPropagation()}>
              <h3 style={{ margin: '0 0 12px', fontFamily: 'var(--font-outfit)', fontSize: '1rem', fontWeight: 600, color: theme.text }}>Seleccionar plantilla</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                {Object.keys(TEMPLATES).map(t => (
                  <button key={t} onClick={() => selectTemplate(t)}
                    style={{ textAlign: 'left', padding: '8px 12px', border: `1px solid ${theme.border}`, borderRadius: 6, background: theme.cream, cursor: 'pointer', fontFamily: 'var(--font-outfit)', fontSize: '0.78rem', color: theme.text }}>
                    <strong>{TEMPLATE_SHORT[t]}</strong> — {TEMPLATE_LABELS[t]} ({TEMPLATES[t].length} países)
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// ── Roll Call ────────────────────────────────────────────────────────────────

function RollCallPanel({ state, dispatch }: { state: State; dispatch: React.Dispatch<Action> }) {
  const present = Object.values(state.rollCall).filter(v => v === 'present').length
  const total = state.delegates.length
  const setAll = (status: 'present' | 'absent') => {
    state.delegates.forEach(d => dispatch({ type: 'SET_ROLL_CALL', country: d.name, status }))
  }

  return (
    <div style={{ maxWidth: 600 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
        <h2 style={{ ...serif('1.5rem'), margin: 0 }}>Pasar lista</h2>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <span style={{ ...mono(), fontSize: '0.8rem', color: theme.muted }}>{present} / {total}</span>
          <button onClick={() => setAll('present')} style={smBtn}>Todos presentes</button>
          <button onClick={() => setAll('absent')} style={smBtn}>Todos ausentes</button>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 2, marginBottom: 14, maxHeight: '60vh', overflow: 'auto' }}>
        {state.delegates.map(d => {
          const s = state.rollCall[d.name] ?? 'absent'
          return (
            <div key={d.name} style={{ ...card, display: 'flex', alignItems: 'center', gap: 8, padding: '5px 10px' }}>
              <span style={{ fontSize: '1rem' }}>{d.flag}</span>
              <span style={{ ...mono(), fontWeight: 500, flex: 1 }}>{d.name}</span>
              <button onClick={() => dispatch({ type: 'SET_ROLL_CALL', country: d.name, status: 'present' })}
                style={{ ...smBtn, background: s === 'present' ? theme.green : 'transparent', color: s === 'present' ? '#fff' : theme.muted, borderColor: s === 'present' ? theme.green : theme.border, fontWeight: s === 'present' ? 600 : 400 }}>
                Presente
              </button>
              <button onClick={() => dispatch({ type: 'SET_ROLL_CALL', country: d.name, status: 'absent' })}
                style={{ ...smBtn, background: s === 'absent' ? theme.redBg : 'transparent', color: s === 'absent' ? theme.red : theme.muted, borderColor: s === 'absent' ? theme.red : theme.border }}>
                Ausente
              </button>
            </div>
          )
        })}
      </div>

      <div style={{ display: 'flex', gap: 8 }}>
        <button onClick={() => dispatch({ type: 'COMPLETE_ROLL_CALL' })} disabled={present === 0}
          style={{ ...btnPrimary, opacity: present === 0 ? 0.4 : 1, flex: 1 }}>
          Iniciar sesión
        </button>
      </div>
    </div>
  )
}

// ── GSL Panel ────────────────────────────────────────────────────────────────

function GslPanel({ state, dispatch }: { state: State; dispatch: React.Dispatch<Action> }) {
  const [search, setSearch] = useState('')
  const ti = state.speakerTimer
  const current = state.gslCurrentIndex >= 0 && state.gslCurrentIndex < state.gslSpeakers.length ? state.gslSpeakers[state.gslCurrentIndex] : null
  const present = state.delegates.filter(d => state.rollCall[d.name] === 'present')
  const available = present.filter(d => !state.gslSpeakers.includes(d.name))
    .filter(d => !search || d.name.toLowerCase().includes(search.toLowerCase()))

  const startFirstSpeaker = () => {
    if (state.gslSpeakers.length === 0) return
    dispatch({ type: 'GSL_ADVANCE' })
    dispatch({ type: 'SET_SPEAKER_TIMER', timer: { startedAt: Date.now(), timeLeft: ti.maxTime, running: true } })
  }

  const nextSpeaker = () => {
    dispatch({ type: 'SET_SPEAKER_TIMER', timer: { startedAt: null, timeLeft: ti.maxTime, running: false } })
    dispatch({ type: 'GSL_ADVANCE' })
  }

  const speakerPct = ti.maxTime > 0 ? ti.timeLeft / ti.maxTime : 0

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14, maxWidth: 700 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ ...serif('1.5rem'), margin: 0 }}>Lista de oradores</h2>
        <span style={{ ...mono(), fontSize: '0.75rem', color: theme.muted }}>{state.gslSpeakers.length} oradores</span>
      </div>

      {/* Timer */}
      <div style={{ ...card, padding: 16 }}>
        {current ? (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
              <span style={{ fontSize: '1.4rem' }}>{state.delegates.find(d => d.name === current)?.flag}</span>
              <span style={{ ...mono(), fontWeight: 600, fontSize: '0.95rem' }}>{current}</span>
              <span style={{ fontFamily: 'var(--font-outfit)', fontSize: '0.5rem', fontWeight: 600, padding: '2px 6px', borderRadius: 2, background: ti.running ? theme.greenBg : theme.amberBg, color: ti.running ? theme.green : theme.amber }}>
                {ti.running ? 'LIVE' : 'PAUSED'}
              </span>
              <span style={{ ...mono(), fontSize: '0.6rem', color: theme.muted }}>Orador actual</span>
            </div>
            <Bar pct={speakerPct} />
            <p style={{ fontFamily: 'var(--font-outfit)', fontSize: '3rem', fontWeight: 700, color: theme.text, margin: '4px 0 12px', letterSpacing: '0.03em' }}>
              {fmt(ti.timeLeft)}
            </p>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              <ActionBtn2 label={ti.running ? '⏸ Pausar' : '▶ Iniciar'}
                onClick={() => dispatch({ type: 'SET_SPEAKER_TIMER', timer: { startedAt: ti.running ? null : Date.now(), running: !ti.running, timeLeft: ti.timeLeft } })}
                disabled={ti.timeLeft <= 0} primary={!ti.running} />
              <ActionBtn2 label="⏭ Siguiente" onClick={nextSpeaker} disabled={!current} />
              <ActionBtn2 label="⏹ Ceder" onClick={() => { }} />
              <ActionBtn2 label="⚙ Tiempo" onClick={() => {
                const m = prompt('Minutos:', '1') || '1'
                const s = prompt('Segundos:', '30') || '30'
                const total = parseInt(m) * 60 + parseInt(s)
                if (total > 0) dispatch({ type: 'SET_SPEAKER_TIMER', timer: { maxTime: total, timeLeft: total } })
              }} />
              <ActionBtn2 label="↻ Reiniciar" onClick={() => dispatch({ type: 'SET_SPEAKER_TIMER', timer: { startedAt: null, timeLeft: ti.maxTime, running: false } })} />
            </div>
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '12px 0' }}>
            <p style={{ ...mono(), fontSize: '0.8rem', color: theme.muted, marginBottom: 10 }}>No hay orador activo</p>
            {state.gslSpeakers.length > 0 && (
              <ActionBtn2 label="▶ Iniciar primer orador" onClick={startFirstSpeaker} primary />
            )}
          </div>
        )}
      </div>

      {/* Upcoming Speakers */}
      <div style={{ ...card }}>
        <div style={{ padding: '8px 12px', borderBottom: `1px solid ${theme.border}`, display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ ...mono(), fontWeight: 600 }}>Próximos oradores</span>
          <span style={{ ...mono(), fontSize: '0.6rem', color: theme.muted }}>{state.gslSpeakers.length}</span>
        </div>
        <div style={{ padding: 4, display: 'flex', flexDirection: 'column', maxHeight: 260, overflow: 'auto' }}>
          {state.gslSpeakers.length === 0 && (
            <p style={{ ...mono(), fontSize: '0.68rem', color: theme.dim, textAlign: 'center', padding: '16px 0' }}>No hay oradores en la lista</p>
          )}
          {state.gslSpeakers.map((name, i) => {
            const isCurrent = i === state.gslCurrentIndex
            const isPast = i < state.gslCurrentIndex
            const d = state.delegates.find(x => x.name === name)
            return (
              <div key={name} style={{
                display: 'flex', alignItems: 'center', gap: 6, padding: '5px 8px', borderRadius: 3,
                opacity: isPast ? 0.3 : 1, background: isCurrent ? theme.greenBg : 'transparent',
                borderLeft: isCurrent ? `3px solid ${theme.green}` : '3px solid transparent',
              }}>
                <span style={{ fontFamily: 'var(--font-outfit)', fontSize: '0.5rem', color: theme.dim, minWidth: 16 }}>{i + 1}</span>
                <span style={{ fontSize: '0.85rem' }}>{d?.flag}</span>
                <span style={{ ...mono(), fontWeight: isCurrent ? 600 : 400, fontSize: '0.72rem', flex: 1 }}>{name}</span>
                {isCurrent && <span style={{ fontFamily: 'var(--font-outfit)', fontSize: '0.45rem', fontWeight: 600, padding: '1px 5px', borderRadius: 2, background: ti.running ? theme.greenBg : theme.amberBg, color: ti.running ? theme.green : theme.amber }}>{ti.running ? 'LIVE' : 'PAUSED'}</span>}
                {!isPast && !isCurrent && (
                  <button onClick={() => dispatch({ type: 'GSL_REMOVE_SPEAKER', country: name })} style={{ background: 'none', border: 'none', color: theme.dim, cursor: 'pointer', fontSize: '0.85rem', padding: 0, lineHeight: 1 }}>×</button>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Add Speakers */}
      <div style={{ ...card, padding: 10 }}>
        <input value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Buscar delegado para agregar..."
          style={{ ...inp, marginBottom: 8, fontSize: '0.72rem', padding: '6px 10px' }} />
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, maxHeight: 150, overflow: 'auto' }}>
          {available.map(d => (
            <button key={d.name} onClick={() => dispatch({ type: 'GSL_ADD_SPEAKER', country: d.name })}
              style={{ ...smBtn, fontSize: '0.6rem', padding: '2px 8px' }}>
              + {d.flag} {d.name}
            </button>
          ))}
          {available.length === 0 && <span style={{ ...mono(), fontSize: '0.62rem', color: theme.dim, padding: 4 }}>Todos los delegados están en la lista</span>}
        </div>
      </div>
    </div>
  )
}

// ── Motions Panel ────────────────────────────────────────────────────────────

function MotionsPanel({ state, dispatch }: { state: State; dispatch: React.Dispatch<Action> }) {
  const [showForm, setShowForm] = useState(false)
  const [motionType, setMotionType] = useState<MotionType>('mod')
  const [topic, setTopic] = useState('')
  const [caucusMins, setCaucusMins] = useState('10')
  const [caucusSecs, setCaucusSecs] = useState('0')
  const [speakerMins, setSpeakerMins] = useState('1')
  const [speakerSecs, setSpeakerSecs] = useState('0')

  const submitMotion = () => {
    const cTime = parseInt(caucusMins || '0') * 60 + parseInt(caucusSecs || '0')
    const sTime = parseInt(speakerMins || '0') * 60 + parseInt(speakerSecs || '0')
    if (!topic.trim() && motionType !== 'custom') return
    const label = motionType === 'mod' ? 'Caucus Moderado'
      : motionType === 'unmod' ? 'Caucus No Moderado'
      : topic.trim() || 'Moción personalizada'
    const motion: Motion = {
      id: String(Date.now()), label, proposer: 'Chair', status: 'pending',
      type: motionType, topic: topic.trim(), caucusTime: cTime, speakingTime: sTime,
    }
    dispatch({ type: 'PROPOSE_MOTION', motion })
    setShowForm(false)
  }

  const mostDisruptive = state.motions.filter(m => m.status === 'pending')[0] || null

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, maxWidth: 800 }}>
      {/* Left: Moción más disruptiva */}
      <div style={{ ...card, padding: 16 }}>
        <div style={{ marginBottom: 12 }}>
          <h2 style={{ ...serif('1.2rem'), margin: 0 }}>Moción más disruptiva</h2>
        </div>
        {mostDisruptive ? (
          <div>
            <div style={{ marginBottom: 10 }}>
              <p style={{ ...mono(), fontWeight: 600, fontSize: '0.9rem', margin: '0 0 4px' }}>{mostDisruptive.label}</p>
              {mostDisruptive.topic && <p style={{ ...mono(), fontSize: '0.7rem', color: theme.muted, margin: 0 }}>Tema: {mostDisruptive.topic}</p>}
              <p style={{ ...mono(), fontSize: '0.6rem', color: theme.dim, margin: '2px 0 0' }}>
                {mostDisruptive.proposer} {mostDisruptive.caucusTime ? `· ${fmtFull(mostDisruptive.caucusTime)}` : ''}
              </p>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button onClick={() => dispatch({ type: 'RESOLVE_MOTION', id: mostDisruptive.id, approved: true })}
                className="pass" style={{ flex: 1, padding: '8px 0', borderRadius: 4, border: 'none', cursor: 'pointer', fontFamily: 'var(--font-outfit)', fontSize: '0.75rem', fontWeight: 600, background: theme.green, color: '#fff' }}>
                Aprobar
              </button>
              <button onClick={() => dispatch({ type: 'RESOLVE_MOTION', id: mostDisruptive.id, approved: false })}
                className="fail" style={{ flex: 1, padding: '8px 0', borderRadius: 4, border: 'none', cursor: 'pointer', fontFamily: 'var(--font-outfit)', fontSize: '0.75rem', fontWeight: 600, background: theme.red, color: '#fff' }}>
                Rechazar
              </button>
            </div>
          </div>
        ) : (
          <p style={{ ...mono(), fontSize: '0.75rem', color: theme.dim, textAlign: 'center', padding: '20px 0' }}>No hay mociones pendientes</p>
        )}
      </div>

      {/* Right: Más mociones */}
      <div style={{ ...card, display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '10px 14px', borderBottom: `1px solid ${theme.border}` }}>
          <h2 style={{ ...serif('1.2rem'), margin: 0 }}>Más mociones</h2>
        </div>
        <div style={{ flex: 1, overflow: 'auto', maxHeight: 400, padding: 4 }}>
          {state.motions.length === 0 ? (
            <p style={{ ...mono(), fontSize: '0.7rem', color: theme.dim, textAlign: 'center', padding: '20px 0' }}>No hay mociones</p>
          ) : (
            state.motions.map(m => (
              <div key={m.id} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 10px', borderRadius: 3, marginBottom: 2, borderLeft: `3px solid ${m.status === 'approved' ? theme.green : m.status === 'rejected' ? theme.red : theme.tertiary}` }}>
                <div style={{ flex: 1 }}>
                  <p style={{ ...mono(), fontWeight: 600, fontSize: '0.68rem', margin: 0 }}>{m.label}</p>
                  {m.topic && <p style={{ ...mono(), fontSize: '0.55rem', color: theme.muted, margin: '1px 0 0' }}>{m.topic}</p>}
                </div>
                <span style={{ fontFamily: 'var(--font-outfit)', fontSize: '0.45rem', fontWeight: 600, padding: '1px 5px', borderRadius: 2, background: m.status === 'approved' ? theme.greenBg : m.status === 'rejected' ? theme.redBg : theme.amberBg, color: m.status === 'approved' ? theme.green : m.status === 'rejected' ? theme.red : theme.amber }}>
                  {m.status === 'approved' ? 'Aprobado' : m.status === 'rejected' ? 'Rechazado' : 'Pendiente'}
                </span>
                {m.status === 'pending' && (
                  <div style={{ display: 'flex', gap: 2 }}>
                    <button onClick={() => dispatch({ type: 'RESOLVE_MOTION', id: m.id, approved: true })}
                      style={{ background: theme.greenBg, border: 'none', borderRadius: 2, cursor: 'pointer', padding: '1px 5px', fontSize: '0.6rem', color: theme.green }}>✓</button>
                    <button onClick={() => dispatch({ type: 'RESOLVE_MOTION', id: m.id, approved: false })}
                      style={{ background: theme.redBg, border: 'none', borderRadius: 2, cursor: 'pointer', padding: '1px 5px', fontSize: '0.6rem', color: theme.red }}>✗</button>
                  </div>
                )}
                <button onClick={() => dispatch({ type: 'REMOVE_MOTION', id: m.id })}
                  style={{ background: 'none', border: 'none', color: theme.dim, cursor: 'pointer', fontSize: '0.75rem', padding: 0 }}>×</button>
              </div>
            ))
          )}
        </div>
        <div style={{ padding: '8px 10px', borderTop: `1px solid ${theme.border}`, display: 'flex', gap: 6 }}>
          <button onClick={() => { state.motions.forEach(m => { if (m.status === 'pending') dispatch({ type: 'REMOVE_MOTION', id: m.id }) }) }}
            style={{ flex: 1, ...btnSecondary, fontSize: '0.6rem', padding: '5px 0' }}>
            Borrar mociones
          </button>
          <button onClick={() => setShowForm(true)}
            style={{ flex: 1, ...btnPrimary, fontSize: '0.6rem', padding: '5px 0' }}>
            Añadir moción
          </button>
        </div>
      </div>

      {/* Modal form */}
      {showForm && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}
          onClick={() => setShowForm(false)}>
          <div style={{ background: '#fff', borderRadius: 12, padding: 20, maxWidth: 420, width: '90%', maxHeight: '80vh', overflow: 'auto' }}
            onClick={e => e.stopPropagation()}>
            <h3 style={{ margin: '0 0 12px', fontFamily: 'var(--font-outfit)', fontSize: '1rem', fontWeight: 600, color: theme.text }}>Crear moción</h3>

            <div style={{ display: 'flex', gap: 6, marginBottom: 10 }}>
              {(['mod', 'unmod', 'custom'] as const).map(t => (
                <button key={t} onClick={() => setMotionType(t)}
                  style={{ flex: 1, padding: '6px 10px', borderRadius: 4, cursor: 'pointer', fontFamily: 'var(--font-outfit)', fontSize: '0.68rem', fontWeight: motionType === t ? 600 : 400, border: motionType === t ? `1px solid ${theme.primary}` : `1px solid ${theme.border}`, background: motionType === t ? theme.primary : '#fff', color: motionType === t ? '#fff' : theme.text }}>
                  {t === 'mod' ? 'Moderado' : t === 'unmod' ? 'No Moderado' : 'Personalizar'}
                </button>
              ))}
            </div>

            {motionType !== 'custom' && (
              <div style={{ marginBottom: 10 }}>
                <label style={{ ...mono(), fontSize: '0.6rem', color: theme.muted, display: 'block', marginBottom: 2 }}>Tema</label>
                <input value={topic} onChange={e => setTopic(e.target.value)} placeholder="Tema del caucus" style={{ ...inp, fontSize: '0.75rem', padding: '6px 10px' }} />
              </div>
            )}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 12 }}>
              <div>
                <label style={{ ...mono(), fontSize: '0.6rem', color: theme.muted, display: 'block', marginBottom: 2 }}>Tiempo de caucus</label>
                <div style={{ display: 'flex', gap: 4 }}>
                  <input value={caucusMins} onChange={e => setCaucusMins(e.target.value)} placeholder="Min" style={{ ...inp, fontSize: '0.75rem', padding: '6px 8px', width: '50%' }} />
                  <input value={caucusSecs} onChange={e => setCaucusSecs(e.target.value)} placeholder="Seg" style={{ ...inp, fontSize: '0.75rem', padding: '6px 8px', width: '50%' }} />
                </div>
              </div>
              <div>
                <label style={{ ...mono(), fontSize: '0.6rem', color: theme.muted, display: 'block', marginBottom: 2 }}>Tiempo por orador</label>
                <div style={{ display: 'flex', gap: 4 }}>
                  <input value={speakerMins} onChange={e => setSpeakerMins(e.target.value)} placeholder="Min" style={{ ...inp, fontSize: '0.75rem', padding: '6px 8px', width: '50%' }} />
                  <input value={speakerSecs} onChange={e => setSpeakerSecs(e.target.value)} placeholder="Seg" style={{ ...inp, fontSize: '0.75rem', padding: '6px 8px', width: '50%' }} />
                </div>
              </div>
            </div>
            <button onClick={submitMotion} disabled={!topic.trim() && motionType !== 'custom'}
              style={{ width: '100%', ...btnPrimary, opacity: (!topic.trim() && motionType !== 'custom') ? 0.4 : 1 }}>
              Enviar moción
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

// ── Mod Panel ────────────────────────────────────────────────────────────────

function ModPanel({ state, dispatch }: { state: State; dispatch: React.Dispatch<Action> }) {
  const ti = state.speakerTimer
  const current = state.modCurrentIndex >= 0 && state.modCurrentIndex < state.modSpeakers.length ? state.modSpeakers[state.modCurrentIndex] : null
  const present = state.delegates.filter(d => state.rollCall[d.name] === 'present')
  const [search, setSearch] = useState('')
  const [editTopic, setEditTopic] = useState(state.modTopic)
  const [caucusMins, setCaucusMins] = useState('15')
  const [caucusSecs, setCaucusSecs] = useState('0')

  const available = present.filter(d => !state.modSpeakers.includes(d.name))
    .filter(d => !search || d.name.toLowerCase().includes(search.toLowerCase()))

  const caucusTotal = parseInt(caucusMins || '0') * 60 + parseInt(caucusSecs || '0')
  const caucusElapsed = state.modStartTime ? Math.floor((Date.now() - state.modStartTime) / 1000) : 0
  const caucusLeft = Math.max(0, caucusTotal - caucusElapsed)

  const startCaucus = () => {
    if (caucusTotal > 0) dispatch({ type: 'MOD_SET_CAUCUS_START', startedAt: Date.now() })
  }

  const speakerPct = ti.maxTime > 0 ? ti.timeLeft / ti.maxTime : 0
  const caucusPct = caucusTotal > 0 ? caucusLeft / caucusTotal : 0

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14, maxWidth: 700 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ ...serif('1.5rem'), margin: 0 }}>Caucus Moderado</h2>
        <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
          <label style={{ ...mono(), fontSize: '0.55rem', color: theme.muted }}>Tema:</label>
          <input value={editTopic} onChange={e => setEditTopic(e.target.value)}
            onBlur={() => dispatch({ type: 'MOD_SET_TOPIC', topic: editTopic })}
            onKeyDown={e => e.key === 'Enter' && dispatch({ type: 'MOD_SET_TOPIC', topic: editTopic })}
            style={{ ...inp, fontSize: '0.65rem', padding: '3px 8px', width: 200 }} />
        </div>
      </div>

      {/* Two timers: Caucus + Speaker */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        {/* Caucus Timer */}
        <div style={{ ...card, padding: 14, textAlign: 'center' }}>
          <p style={{ ...mono(), fontSize: '0.5rem', fontWeight: 600, color: theme.muted, margin: '0 0 4px', textTransform: 'uppercase' }}>Tiempo de caucus</p>
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'center', gap: 4 }}>
            <span style={{ fontFamily: 'var(--font-outfit)', fontSize: '2rem', fontWeight: 700, color: state.modStartTime ? theme.text : theme.muted }}>
              {fmt(state.modStartTime ? caucusLeft : caucusTotal)}
            </span>
            <span style={{ fontFamily: 'var(--font-outfit)', fontSize: '1.2rem', fontWeight: 500, color: theme.dim }}>/ {fmt(caucusTotal)}</span>
          </div>
          <Bar pct={state.modStartTime ? caucusPct : 1} />
          {state.modStartTime ? (
            <ActionBtn2 label="⏹ Detener" onClick={() => dispatch({ type: 'MOD_SET_CAUCUS_START', startedAt: null })} />
          ) : (
            <div style={{ display: 'flex', gap: 4, justifyContent: 'center', marginTop: 4 }}>
              <input value={caucusMins} onChange={e => setCaucusMins(e.target.value)} placeholder="Min" style={{ ...inp, fontSize: '0.6rem', padding: '3px 6px', width: 50 }} />
              <input value={caucusSecs} onChange={e => setCaucusSecs(e.target.value)} placeholder="Seg" style={{ ...inp, fontSize: '0.6rem', padding: '3px 6px', width: 50 }} />
              <ActionBtn2 label="Iniciar" onClick={startCaucus} primary />
            </div>
          )}
        </div>

        {/* Speaker Timer */}
        <div style={{ ...card, padding: 14, textAlign: 'center' }}>
          <p style={{ ...mono(), fontSize: '0.5rem', fontWeight: 600, color: theme.muted, margin: '0 0 4px', textTransform: 'uppercase' }}>Tiempo por orador</p>
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'center', gap: 4 }}>
            <span style={{ fontFamily: 'var(--font-outfit)', fontSize: '2rem', fontWeight: 700, color: current ? theme.text : theme.muted }}>
              {fmt(ti.timeLeft)}
            </span>
            <span style={{ fontFamily: 'var(--font-outfit)', fontSize: '1.2rem', fontWeight: 500, color: theme.dim }}>/ {fmt(ti.maxTime)}</span>
          </div>
          <Bar pct={speakerPct} />
          {current ? (
            <div style={{ display: 'flex', gap: 4, justifyContent: 'center', flexWrap: 'wrap' }}>
              <ActionBtn2 label={ti.running ? '⏸ Pausar' : '▶ Iniciar'}
                onClick={() => dispatch({ type: 'SET_SPEAKER_TIMER', timer: { startedAt: ti.running ? null : Date.now(), running: !ti.running, timeLeft: ti.timeLeft } })}
                disabled={ti.timeLeft <= 0} primary={!ti.running} />
              <ActionBtn2 label="⏭ Siguiente" onClick={() => {
                dispatch({ type: 'SET_SPEAKER_TIMER', timer: { startedAt: null, timeLeft: ti.maxTime, running: false } })
                dispatch({ type: 'MOD_ADVANCE' })
              }} disabled={!current} />
              <ActionBtn2 label="⚙" onClick={() => {
                const m = prompt('Minutos:', '1') || '1'
                const s = prompt('Segundos:', '0') || '0'
                const total = parseInt(m) * 60 + parseInt(s)
                if (total > 0) dispatch({ type: 'SET_SPEAKER_TIMER', timer: { maxTime: total, timeLeft: total } })
              }} />
              <ActionBtn2 label="↻" onClick={() => dispatch({ type: 'SET_SPEAKER_TIMER', timer: { startedAt: null, timeLeft: ti.maxTime, running: false } })} />
            </div>
          ) : (
            <p style={{ ...mono(), fontSize: '0.65rem', color: theme.dim, margin: 0 }}>{state.modSpeakers.length > 0 ? 'Presione Iniciar' : 'No hay orador activo'}</p>
          )}
        </div>
      </div>

      {/* Current + Next speaker info */}
      <div style={{ ...card, padding: 14 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <div>
            <p style={{ ...mono(), fontSize: '0.5rem', fontWeight: 600, color: theme.muted, margin: '0 0 6px', textTransform: 'uppercase' }}>Orador actual</p>
            {current ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ fontSize: '1.2rem' }}>{state.delegates.find(d => d.name === current)?.flag}</span>
                <span style={{ ...mono(), fontWeight: 600, fontSize: '0.85rem' }}>{current}</span>
                <span style={{ fontFamily: 'var(--font-outfit)', fontSize: '0.45rem', fontWeight: 600, padding: '1px 5px', borderRadius: 2, background: ti.running ? theme.greenBg : theme.amberBg, color: ti.running ? theme.green : theme.amber }}>
                  {ti.running ? 'LIVE' : 'PAUSED'}
                </span>
              </div>
            ) : (
              <p style={{ ...mono(), fontSize: '0.68rem', color: theme.dim, margin: 0 }}>Ninguno</p>
            )}
          </div>
          <div>
            <p style={{ ...mono(), fontSize: '0.5rem', fontWeight: 600, color: theme.muted, margin: '0 0 6px', textTransform: 'uppercase' }}>Siguiente orador</p>
            {(() => {
              const nextIdx = state.modCurrentIndex + 1
              const next = nextIdx < state.modSpeakers.length ? state.modSpeakers[nextIdx] : null
              return next ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ fontSize: '1.2rem' }}>{state.delegates.find(d => d.name === next)?.flag}</span>
                  <span style={{ ...mono(), fontSize: '0.85rem' }}>{next}</span>
                </div>
              ) : (
                <p style={{ ...mono(), fontSize: '0.68rem', color: theme.dim, margin: 0 }}>Ninguno</p>
              )
            })()}
          </div>
        </div>
      </div>

      {/* Speakers List */}
      <div style={{ ...card }}>
        <div style={{ padding: '8px 12px', borderBottom: `1px solid ${theme.border}`, display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ ...mono(), fontWeight: 600 }}>Próximos oradores</span>
          <span style={{ ...mono(), fontSize: '0.6rem', color: theme.muted }}>{state.modSpeakers.length}</span>
        </div>
        <div style={{ padding: 4, maxHeight: 160, overflow: 'auto' }}>
          {state.modSpeakers.length === 0 && (
            <p style={{ ...mono(), fontSize: '0.68rem', color: theme.dim, textAlign: 'center', padding: '12px 0' }}>No hay oradores</p>
          )}
          {state.modSpeakers.map((name, i) => {
            const isCurrent = i === state.modCurrentIndex
            const isPast = i < state.modCurrentIndex
            const d = state.delegates.find(x => x.name === name)
            return (
              <div key={name} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '4px 8px', opacity: isPast ? 0.3 : 1, background: isCurrent ? theme.greenBg : 'transparent', borderLeft: isCurrent ? `3px solid ${theme.green}` : '3px solid transparent' }}>
                <span style={{ fontFamily: 'var(--font-outfit)', fontSize: '0.5rem', color: theme.dim, minWidth: 14 }}>{i + 1}</span>
                <span style={{ fontSize: '0.75rem' }}>{d?.flag}</span>
                <span style={{ ...mono(), fontSize: '0.65rem', flex: 1 }}>{name}</span>
                {!isPast && !isCurrent && (
                  <button onClick={() => dispatch({ type: 'MOD_REMOVE_SPEAKER', country: name })} style={{ background: 'none', border: 'none', color: theme.dim, cursor: 'pointer', fontSize: '0.8rem', padding: 0 }}>×</button>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Add Speaker */}
      <div style={{ ...card, padding: 10 }}>
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar delegado..."
          style={{ ...inp, fontSize: '0.7rem', padding: '5px 8px', marginBottom: 6 }} />
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 3, maxHeight: 120, overflow: 'auto' }}>
          {available.map(d => (
            <button key={d.name} onClick={() => dispatch({ type: 'MOD_ADD_SPEAKER', country: d.name })}
              style={{ ...smBtn, fontSize: '0.55rem', padding: '2px 6px' }}>+ {d.flag} {d.name}</button>
          ))}
          {!present.length && <p style={{ ...mono(), fontSize: '0.6rem', color: theme.dim, padding: 4 }}>Pasar lista antes de añadir oradores</p>}
        </div>
      </div>
    </div>
  )
}

// ── Unmod Panel ──────────────────────────────────────────────────────────────

function UnmodPanel({ state, dispatch }: { state: State; dispatch: React.Dispatch<Action> }) {
  const ti = state.unmodTimer
  const pct = ti.maxTime > 0 ? ti.timeLeft / ti.maxTime : 0

  const setupCaucus = () => {
    const m = prompt('Minutos:', '5') || '5'
    const s = prompt('Segundos:', '0') || '0'
    const total = parseInt(m) * 60 + parseInt(s)
    if (total > 0) dispatch({ type: 'UNMOD_SET_TIMER', timer: { maxTime: total, timeLeft: total } })
  }

  return (
    <div style={{ maxWidth: 600 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
        <h2 style={{ ...serif('1.5rem'), margin: 0 }}>Caucus No Moderado</h2>
        <span style={{ ...mono(), fontSize: '0.75rem', color: theme.muted }}>Sin oradores</span>
      </div>

      <div style={{ ...card, padding: 20, textAlign: 'center' }}>
        <p style={{ fontFamily: 'var(--font-outfit)', fontSize: '4rem', fontWeight: 700, color: theme.text, margin: '0 0 8px', letterSpacing: '0.03em' }}>
          {fmt(ti.timeLeft)}
        </p>
        <Bar pct={pct} />
        <p style={{ ...mono(), fontSize: '0.65rem', color: theme.muted, margin: '6px 0 14px' }}>
          Tiempo total: {fmtFull(ti.maxTime)}
        </p>
        <div style={{ display: 'flex', gap: 6, justifyContent: 'center', flexWrap: 'wrap' }}>
          <ActionBtn2 label={ti.running ? '⏸ Pausar' : '▶ Iniciar'}
            onClick={() => dispatch({ type: 'UNMOD_SET_TIMER', timer: { startedAt: ti.running ? null : Date.now(), running: !ti.running, timeLeft: ti.timeLeft } })}
            disabled={ti.timeLeft <= 0} primary={!ti.running} />
          <ActionBtn2 label="➕ Agregar tiempo" onClick={() => {
            const m = prompt('Minutos extra:', '2') || '2'
            const s = prompt('Segundos:', '0') || '0'
            const extra = parseInt(m) * 60 + parseInt(s)
            if (extra > 0) dispatch({ type: 'UNMOD_SET_TIMER', timer: { timeLeft: ti.timeLeft + extra, maxTime: ti.maxTime + extra } })
          }} />
          <ActionBtn2 label="⚙ Configurar" onClick={setupCaucus} />
          <ActionBtn2 label="↻ Reiniciar" onClick={() => dispatch({ type: 'UNMOD_SET_TIMER', timer: { startedAt: null, timeLeft: ti.maxTime, running: false } })} />
        </div>
      </div>

      <div style={{ ...card, padding: 14, marginTop: 14 }}>
        <p style={{ ...mono(), fontSize: '0.68rem', color: theme.muted, textAlign: 'center' }}>
          El caucus no moderado no tiene lista de oradores. Los delegados debaten informalmente.
        </p>
      </div>
    </div>
  )
}

// ── Single Speaker Panel ─────────────────────────────────────────────────────

function SingleSpeakerPanel({ state, dispatch }: { state: State; dispatch: React.Dispatch<Action> }) {
  const ti = state.speakerTimer
  const [search, setSearch] = useState('')
  const present = state.delegates.filter(d => state.rollCall[d.name] === 'present')
  const available = present.filter(d => !search || d.name.toLowerCase().includes(search.toLowerCase()))
  const speakerPct = ti.maxTime > 0 ? ti.timeLeft / ti.maxTime : 0

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14, maxWidth: 600 }}>
      <h2 style={{ ...serif('1.5rem'), margin: 0 }}>Orador único</h2>

      <div style={{ ...card, padding: 16 }}>
        {state.singleSpeakerName ? (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
              <span style={{ fontSize: '1.4rem' }}>{state.delegates.find(d => d.name === state.singleSpeakerName)?.flag}</span>
              <span style={{ ...mono(), fontWeight: 600, fontSize: '0.95rem' }}>{state.singleSpeakerName}</span>
              <span style={{ fontFamily: 'var(--font-outfit)', fontSize: '0.5rem', fontWeight: 600, padding: '2px 6px', borderRadius: 2, background: ti.running ? theme.greenBg : theme.amberBg, color: ti.running ? theme.green : theme.amber }}>
                {ti.running ? 'LIVE' : 'PAUSED'}
              </span>
            </div>
            <Bar pct={speakerPct} />
            <p style={{ fontFamily: 'var(--font-outfit)', fontSize: '3rem', fontWeight: 700, color: theme.text, margin: '4px 0 12px' }}>
              {fmt(ti.timeLeft)}
            </p>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              <ActionBtn2 label={ti.running ? '⏸ Pausar' : '▶ Iniciar'}
                onClick={() => dispatch({ type: 'SET_SPEAKER_TIMER', timer: { startedAt: ti.running ? null : Date.now(), running: !ti.running, timeLeft: ti.timeLeft } })}
                disabled={ti.timeLeft <= 0} primary={!ti.running} />
              <ActionBtn2 label="⏟ Detener" onClick={() => dispatch({ type: 'SINGLE_SET', name: null })} />
              <ActionBtn2 label="⚙ Tiempo" onClick={() => {
                const m = prompt('Minutos:', '2') || '2'
                const s = prompt('Segundos:', '0') || '0'
                const total = parseInt(m) * 60 + parseInt(s)
                if (total > 0) dispatch({ type: 'SET_SPEAKER_TIMER', timer: { maxTime: total, timeLeft: total } })
              }} />
              <ActionBtn2 label="↻ Reiniciar" onClick={() => dispatch({ type: 'SET_SPEAKER_TIMER', timer: { startedAt: null, timeLeft: ti.maxTime, running: false } })} />
            </div>
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '12px 0' }}>
            <p style={{ ...mono(), fontSize: '0.8rem', color: theme.muted, marginBottom: 8 }}>Seleccione un orador</p>
          </div>
        )}
      </div>

      <div style={{ ...card, padding: 10 }}>
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar delegado..."
          style={{ ...inp, fontSize: '0.7rem', padding: '5px 8px', marginBottom: 6 }} />
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 3, maxHeight: 260, overflow: 'auto' }}>
          {available.map(d => (
            <button key={d.name} onClick={() => {
              dispatch({ type: 'SINGLE_SET', name: d.name })
              dispatch({ type: 'SET_SPEAKER_TIMER', timer: { maxTime: 120, timeLeft: 120, startedAt: null, running: false } })
            }}
              style={{
                ...smBtn, fontSize: '0.6rem', padding: '4px 10px',
                background: state.singleSpeakerName === d.name ? theme.secondary : '#fff',
                color: state.singleSpeakerName === d.name ? '#fff' : theme.text,
                borderColor: state.singleSpeakerName === d.name ? theme.secondary : theme.border,
              }}>
              {d.flag} {d.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

// ── Voting Panel ─────────────────────────────────────────────────────────────

function VotingPanel({ state, dispatch }: { state: State; dispatch: React.Dispatch<Action> }) {
  const present = state.delegates.filter(d => state.rollCall[d.name] === 'present')
  const observers = present.filter(d => d.powerStatus === 'Observer')
  const votingDelegates = state.observerAllowed ? present : present.filter(d => d.powerStatus !== 'Observer')

  const yesVotes = state.votes.filter(v => v.vote === 'yes').length
  const noVotes = state.votes.filter(v => v.vote === 'no').length
  const abstainVotes = state.votes.filter(v => v.vote === 'abstain').length
  const rightsVotes = state.votes.filter(v => v.vote === 'rights').length
  const passVotes = state.votes.filter(v => v.vote === 'pass').length
  const totalVotes = yesVotes + noVotes + abstainVotes
  const majority = Math.floor(votingDelegates.length / 2) + 1
  const passed = yesVotes >= majority

  const vetoCountries = ['US', 'GB', 'FR', 'RU', 'CN']
  const vetoDelegates = votingDelegates.filter(d => vetoCountries.some(c => {
    const country = ALL_COUNTRIES.find(x => x.name === d.name)
    return country?.code === c
  }) || d.powerStatus === 'VetoPower')
  const anyVeto = state.votes.filter(v => v.vote === 'no' && vetoDelegates.some(d => d.name === v.country)).length > 0

  const vote = (country: string, v: VoteValue) => dispatch({ type: 'VOTE_CAST', country, vote: v })
  const reset = () => dispatch({ type: 'VOTE_RESET' })

  const finalize = () => {
    if (state.voteRound === 1 && !passed) {
      dispatch({ type: 'VOTE_NEXT_ROUND' })
      return
    }
    const status = passed && !anyVeto ? 'approved' : 'rejected'
    if (state.activeMotion) dispatch({ type: 'RESOLVE_MOTION', id: state.activeMotion.id, approved: status === 'approved' })
    reset()
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14, maxWidth: 700 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ ...serif('1.5rem'), margin: 0 }}>Votación</h2>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <span style={{ ...mono(), fontSize: '0.6rem', color: theme.muted }}>
            Ronda {state.voteRound === 1 ? '1era' : '2da'} · {state.voteType === 'procedural' ? 'Procedimental' : 'Sustancial'}
          </span>
          <ActionBtn2 label="⚙ Configurar" onClick={() => {
            const type = prompt('Tipo (procedural/sustancial):', state.voteType) || state.voteType
            if (type === 'procedural' || type === 'substantial') dispatch({ type: 'VOTE_SET_TYPE', voteType: type })
          }} />
          <ActionBtn2 label="↻ Reset" onClick={reset} />
        </div>
      </div>

      {state.activeMotion && (
        <div style={{ ...card, padding: '8px 12px', borderLeft: `3px solid ${theme.primary}`, display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ ...mono(), fontWeight: 600, flex: 1, fontSize: '0.8rem' }}>{state.activeMotion.label}</span>
          <span style={{ ...mono(), fontSize: '0.55rem', color: theme.muted }}>by {state.activeMotion.proposer}</span>
        </div>
      )}

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
        {[
          { label: 'A favor', value: yesVotes, color: theme.green },
          { label: 'En contra', value: noVotes, color: theme.red },
          { label: 'Abstenciones', value: abstainVotes, color: theme.muted },
          { label: 'Mayoría', value: majority, color: theme.primary },
        ].map(s => (
          <div key={s.label} style={{ ...card, padding: '8px', textAlign: 'center' }}>
            <p style={{ fontFamily: 'var(--font-outfit)', fontSize: '1.3rem', fontWeight: 700, color: s.color, margin: 0 }}>{s.value}</p>
            <p style={{ fontFamily: 'var(--font-outfit)', fontSize: '0.45rem', fontWeight: 600, color: theme.muted, margin: '2px 0 0', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{s.label}</p>
          </div>
        ))}
      </div>

      {/* Vote Controls */}
      <div style={{ ...card }}>
        <div style={{ padding: '8px 12px', borderBottom: `1px solid ${theme.border}`, display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ ...mono(), fontWeight: 600 }}>Delegados</span>
          <span style={{ ...mono(), fontSize: '0.6rem', color: theme.muted }}>{votingDelegates.length} votantes</span>
        </div>
        <div style={{ padding: 4, maxHeight: 300, overflow: 'auto' }}>
          {votingDelegates.map(d => {
            const v = state.votes.find(x => x.country === d.name)
            const isObserver = d.powerStatus === 'Observer'
            const isVeto = d.powerStatus === 'VetoPower'
            return (
              <div key={d.name} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '4px 8px', borderRadius: 3, marginBottom: 1, borderLeft: `3px solid ${v ? (v.vote === 'yes' ? theme.green : v.vote === 'no' ? theme.red : theme.border) : 'transparent'}` }}>
                <span style={{ fontSize: '0.85rem' }}>{d.flag}</span>
                <span style={{ ...mono(), fontSize: '0.65rem', fontWeight: 500, flex: 1 }}>{d.name}</span>
                {isVeto && <span style={{ fontFamily: 'var(--font-outfit)', fontSize: '0.45rem', fontWeight: 600, padding: '1px 4px', borderRadius: 2, background: theme.amberBg, color: theme.amber }}>VETO</span>}
                {isObserver && <span style={{ fontFamily: 'var(--font-outfit)', fontSize: '0.45rem', fontWeight: 600, padding: '1px 4px', borderRadius: 2, background: theme.cream, color: theme.secondary }}>OBS</span>}
                <div style={{ display: 'flex', gap: 2 }}>
                  {isObserver ? (
                    <>
                      <VoteBtn label="Sí" active={v?.vote === 'yes'} color={theme.green} onClick={() => vote(d.name, 'yes')} />
                      <VoteBtn label="No" active={v?.vote === 'no'} color={theme.red} onClick={() => vote(d.name, 'no')} />
                      <VoteBtn label="Abst" active={v?.vote === 'abstain'} color={theme.muted} onClick={() => vote(d.name, 'abstain')} />
                    </>
                  ) : (
                    <>
                      <VoteBtn label="Sí" active={v?.vote === 'yes'} color={theme.green} onClick={() => vote(d.name, 'yes')} />
                      <VoteBtn label="No" active={v?.vote === 'no'} color={theme.red} onClick={() => vote(d.name, 'no')} />
                      <VoteBtn label="Abst" active={v?.vote === 'abstain'} color={theme.muted} onClick={() => vote(d.name, 'abstain')} />
                      <VoteBtn label="Dchos" active={v?.vote === 'rights'} color={theme.secondary} onClick={() => vote(d.name, 'rights')} />
                      <VoteBtn label="Pass" active={v?.vote === 'pass'} color={theme.dim} onClick={() => vote(d.name, 'pass')} />
                    </>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Results + Finalize */}
      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
        <button onClick={finalize} disabled={totalVotes === 0}
          style={{ ...btnPrimary, opacity: totalVotes === 0 ? 0.4 : 1 }}>
          {state.voteRound === 1 && !passed ? 'Ir a 2da Ronda' : 'Finalizar votación'}
        </button>
        {totalVotes > 0 && (
          <span style={{ ...mono(), fontSize: '0.75rem', fontWeight: 600, color: passed && !anyVeto ? theme.green : theme.red }}>
            {passed && !anyVeto ? 'Votación satisfactoria ✓' : anyVeto ? 'VETADO ✗' : 'No pasa ✗'}
          </span>
        )}
      </div>
    </div>
  )
}

function VoteBtn({ label, active, color, onClick }: { label: string; active: boolean; color: string; onClick: () => void }) {
  return (
    <button onClick={onClick}
      style={{
        fontFamily: 'var(--font-outfit)', fontSize: '0.5rem', fontWeight: active ? 600 : 400,
        padding: '2px 6px', borderRadius: 3, cursor: 'pointer', whiteSpace: 'nowrap',
        border: active ? `1px solid ${color}` : `1px solid ${theme.border}`,
        background: active ? color : 'transparent',
        color: active ? '#fff' : theme.muted,
      }}>
      {label}
    </button>
  )
}

// ── Summary ──────────────────────────────────────────────────────────────────

function SummaryPanel({ state, dispatch }: { state: State; dispatch: React.Dispatch<Action> }) {
  const present = state.delegates.filter(d => state.rollCall[d.name] === 'present').length
  const approved = state.motions.filter(m => m.status === 'approved').length
  const rejected = state.motions.filter(m => m.status === 'rejected').length

  return (
    <div style={{ maxWidth: 500 }}>
      <h2 style={{ ...serif('1.5rem'), margin: '0 0 16px' }}>Resumen de la sesión</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div style={card}>
          <div style={{ padding: 14 }}>
            <p style={{ ...mono(), fontSize: '0.55rem', fontWeight: 600, color: theme.muted, margin: '0 0 2px', textTransform: 'uppercase', letterSpacing: '0.12em' }}>Comité</p>
            <p style={{ ...mono(), fontWeight: 600, fontSize: '1rem', margin: 0 }}>{state.committeeName || 'Sin nombre'}</p>
            {state.committeeTopic && <p style={{ ...mono(), fontSize: '0.68rem', color: theme.muted, margin: '2px 0 0' }}>{state.committeeTopic}</p>}
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
          {[
            { label: 'Delegados', value: state.delegates.length },
            { label: 'Presentes', value: present },
            { label: 'Discursos', value: state.gslSpeakers.length },
          ].map(s => (
            <div key={s.label} style={{ ...card, padding: '10px', textAlign: 'center' }}>
              <p style={{ fontFamily: 'var(--font-outfit)', fontSize: '1.4rem', fontWeight: 600, color: theme.text, margin: 0 }}>{s.value}</p>
              <p style={{ fontFamily: 'var(--font-outfit)', fontSize: '0.45rem', fontWeight: 600, color: theme.muted, margin: '2px 0 0', textTransform: 'uppercase', letterSpacing: '0.12em' }}>{s.label}</p>
            </div>
          ))}
        </div>
        <div style={card}>
          <div style={{ padding: '8px 12px', borderBottom: `1px solid ${theme.border}` }}>
            <span style={{ fontFamily: 'var(--font-outfit)', fontSize: '0.55rem', fontWeight: 600, color: theme.muted, textTransform: 'uppercase', letterSpacing: '0.12em' }}>Mociones</span>
          </div>
          <div style={{ padding: 8 }}>
            {state.motions.length === 0 ? (
              <p style={{ ...mono(), fontSize: '0.65rem', color: theme.dim, textAlign: 'center', padding: '8px 0' }}>No se propusieron mociones</p>
            ) : (
              state.motions.map(m => (
                <div key={m.id} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '4px 8px', borderRadius: 3, marginBottom: 2, borderLeft: `3px solid ${m.status === 'approved' ? theme.green : m.status === 'rejected' ? theme.red : theme.border}` }}>
                  <span style={{ ...mono(), fontSize: '0.68rem', flex: 1 }}>{m.label}</span>
                  <span style={{ fontFamily: 'var(--font-outfit)', fontSize: '0.5rem', fontWeight: 600, padding: '2px 6px', borderRadius: 2, background: m.status === 'approved' ? theme.greenBg : m.status === 'rejected' ? theme.redBg : theme.amberBg, color: m.status === 'approved' ? theme.green : m.status === 'rejected' ? theme.red : theme.amber }}>
                    {m.status === 'approved' ? 'Aprobado' : m.status === 'rejected' ? 'Rechazado' : 'Pendiente'}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
        <button onClick={() => dispatch({ type: 'RESET_SESSION' })} style={btnSecondary}>
          Nueva sesión
        </button>
      </div>
    </div>
  )
}

// ── Shared ───────────────────────────────────────────────────────────────────

const inp: React.CSSProperties = {
  width: '100%', background: theme.cream, border: `1px solid ${theme.border}`,
  color: theme.text, padding: '7px 10px', fontSize: '0.8rem',
  fontFamily: 'var(--font-outfit)', outline: 'none', borderRadius: 3,
  boxSizing: 'border-box',
}

const btnPrimary: React.CSSProperties = {
  fontFamily: 'var(--font-outfit)', fontSize: '0.72rem', fontWeight: 600,
  padding: '7px 16px', borderRadius: 3, border: 'none', cursor: 'pointer',
  background: theme.primary, color: '#fff', letterSpacing: '0.02em',
  transition: 'all 0.15s',
}

const btnSecondary: React.CSSProperties = {
  fontFamily: 'var(--font-outfit)', fontSize: '0.72rem', fontWeight: 500,
  padding: '7px 16px', borderRadius: 3, cursor: 'pointer',
  background: 'transparent', color: theme.text, border: `1px solid ${theme.border}`,
  letterSpacing: '0.02em', transition: 'all 0.15s',
}

const smBtn: React.CSSProperties = {
  fontFamily: 'var(--font-outfit)', fontSize: '0.6rem', fontWeight: 500,
  padding: '2px 9px', borderRadius: 3, cursor: 'pointer',
  background: 'transparent', border: `1px solid ${theme.border}`,
  color: theme.muted, letterSpacing: '0.02em', whiteSpace: 'nowrap',
}

function ActionBtn2({ label, onClick, disabled, primary }: {
  label: string; onClick?: () => void; disabled?: boolean; primary?: boolean
}) {
  return (
    <button onClick={onClick} disabled={disabled}
      style={{
        fontFamily: 'var(--font-outfit)', fontSize: '0.65rem', fontWeight: primary ? 600 : 500,
        padding: '6px 14px', borderRadius: 3, cursor: disabled ? 'not-allowed' : 'pointer',
        border: primary ? 'none' : `1px solid ${theme.border}`,
        background: primary ? theme.primary : 'transparent',
        color: primary ? '#fff' : theme.text,
        opacity: disabled ? 0.3 : 1, whiteSpace: 'nowrap',
        transition: 'all 0.1s',
      }}>
      {label}
    </button>
  )
}

// ── Action Dock ──────────────────────────────────────────────────────────────

function ActionDock({ state, dispatch }: { state: State; dispatch: React.Dispatch<Action> }) {
  const ti = state.speakerTimer

  const dockBtn: React.CSSProperties = {
    fontFamily: 'var(--font-outfit)', fontSize: '0.68rem', fontWeight: 500,
    padding: '6px 14px', borderRadius: 4, cursor: 'pointer', border: 'none',
    background: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.85)',
    whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: 4,
    transition: 'all 0.15s',
  }
  const dockPrimary: React.CSSProperties = {
    ...dockBtn, background: theme.primary, color: '#fff', fontWeight: 600,
  }
  const dockLabel = (s: string) => (
    <span style={{ fontFamily: 'var(--font-outfit)', fontSize: '0.5rem', fontWeight: 600, color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{s}</span>
  )

  let actions: React.ReactNode = null

  switch (state.phase) {
    case 'setup':
      actions = (
        <>
          {dockLabel('Comité')}
          <span style={{ ...mono(), fontSize: '0.7rem', color: 'rgba(255,255,255,0.5)' }}>{state.delegates.length} países</span>
          <div style={{ flex: 1 }} />
          <button style={dockBtn}
            onClick={() => dispatch({ type: 'SET_DELEGATES', delegates: [] })}>
            Borrar selección
          </button>
          <button style={dockPrimary} disabled={state.delegates.length === 0}
            onClick={() => {
              dispatch({ type: 'SET_COMMITTEE_NAME', value: state.committeeName || 'MUN Command Session' })
              dispatch({ type: 'SET_PHASE', phase: 'rollcall' })
            }}>Iniciar sesión</button>
        </>
      )
      break
    case 'rollcall':
      actions = (
        <>
          {dockLabel('Lista')}
          <span style={{ ...mono(), fontSize: '0.7rem', color: 'rgba(255,255,255,0.5)' }}>
            {Object.values(state.rollCall).filter(v => v === 'present').length}/{state.delegates.length}
          </span>
          <div style={{ flex: 1 }} />
          <button style={dockBtn} onClick={() => state.delegates.forEach(d => dispatch({ type: 'SET_ROLL_CALL', country: d.name, status: 'present' }))}>
            Todos presentes
          </button>
          <button style={dockBtn} onClick={() => state.delegates.forEach(d => dispatch({ type: 'SET_ROLL_CALL', country: d.name, status: 'absent' }))}>
            Todos ausentes
          </button>
          <button style={dockPrimary} disabled={Object.values(state.rollCall).filter(v => v === 'present').length === 0}
            onClick={() => dispatch({ type: 'COMPLETE_ROLL_CALL' })}>Iniciar sesión</button>
        </>
      )
      break
    case 'gsl':
      actions = (
        <>
          {dockLabel('Orador')}
          {(() => {
            const current = state.gslCurrentIndex >= 0 && state.gslCurrentIndex < state.gslSpeakers.length ? state.gslSpeakers[state.gslCurrentIndex] : null
            if (!current) return <span style={{ ...mono(), fontSize: '0.7rem', color: 'rgba(255,255,255,0.35)' }}>Sin orador</span>
            return <span style={{ ...mono(), fontSize: '0.7rem', color: '#fff' }}>{current}</span>
          })()}
          <div style={{ flex: 1 }} />
          <button style={dockBtn} onClick={() => dispatch({ type: 'SET_SPEAKER_TIMER', timer: { startedAt: ti.running ? null : Date.now(), running: !ti.running, timeLeft: ti.timeLeft } })}>
            {ti.running ? '⏸ Pausar' : '▶ Iniciar'}
          </button>
          <button style={dockBtn} onClick={() => {
            dispatch({ type: 'SET_SPEAKER_TIMER', timer: { startedAt: null, timeLeft: ti.maxTime, running: false } })
            dispatch({ type: 'GSL_ADVANCE' })
          }}>⏭ Siguiente</button>
          <button style={dockBtn} onClick={() => {
            const m = prompt('Minutos:', '1') || '1'
            const s = prompt('Segundos:', '30') || '30'
            const total = parseInt(m) * 60 + parseInt(s)
            if (total > 0) dispatch({ type: 'SET_SPEAKER_TIMER', timer: { maxTime: total, timeLeft: total } })
          }}>⚙ Tiempo</button>
          <button style={dockBtn} onClick={() => dispatch({ type: 'SET_SPEAKER_TIMER', timer: { startedAt: null, timeLeft: ti.maxTime, running: false } })}>↻</button>
        </>
      )
      break
    case 'motions':
      actions = (
        <>
          {dockLabel('Mociones')}
          <span style={{ ...mono(), fontSize: '0.7rem', color: 'rgba(255,255,255,0.5)' }}>{state.motions.length}</span>
          <div style={{ flex: 1 }} />
          <button style={dockBtn} onClick={() => {
            state.motions.forEach(m => { if (m.status === 'pending') dispatch({ type: 'REMOVE_MOTION', id: m.id }) })
          }}>Borrar pendientes</button>
          <button style={dockPrimary} onClick={() => dispatch({ type: 'SET_PHASE', phase: 'mod' })}>
            Ir a Mod
          </button>
        </>
      )
      break
    case 'mod':
      actions = (
        <>
          {dockLabel('Caucus')}
          <span style={{ ...mono(), fontSize: '0.7rem', color: 'rgba(255,255,255,0.35)' }}>{state.modTopic || 'Sin tema'}</span>
          <div style={{ flex: 1 }} />
          <button style={dockBtn} onClick={() => dispatch({ type: 'SET_SPEAKER_TIMER', timer: { startedAt: ti.running ? null : Date.now(), running: !ti.running, timeLeft: ti.timeLeft } })}>
            {ti.running ? '⏸ Pausar' : '▶ Iniciar'}
          </button>
          <button style={dockBtn} onClick={() => {
            dispatch({ type: 'SET_SPEAKER_TIMER', timer: { startedAt: null, timeLeft: ti.maxTime, running: false } })
            dispatch({ type: 'MOD_ADVANCE' })
          }}>⏭ Siguiente</button>
        </>
      )
      break
    case 'unmod':
      actions = (
        <>
          {dockLabel('Unmod')}
          <div style={{ flex: 1 }} />
          <button style={dockBtn} onClick={() => dispatch({ type: 'UNMOD_SET_TIMER', timer: { startedAt: null, running: !state.unmodTimer.running, timeLeft: state.unmodTimer.timeLeft } })}>
            {state.unmodTimer.running ? '⏸ Pausar' : '▶ Iniciar'}
          </button>
          <button style={dockBtn} onClick={() => {
            const m = prompt('Minutos extra:', '2') || '2'
            const s = prompt('Segundos:', '0') || '0'
            const extra = parseInt(m) * 60 + parseInt(s)
            if (extra > 0) dispatch({ type: 'UNMOD_SET_TIMER', timer: { timeLeft: state.unmodTimer.timeLeft + extra, maxTime: state.unmodTimer.maxTime + extra } })
          }}>➕ Agregar tiempo</button>
        </>
      )
      break
    case 'singleSpeaker':
      actions = (
        <>
          {dockLabel('Orador')}
          <span style={{ ...mono(), fontSize: '0.7rem', color: 'rgba(255,255,255,0.5)' }}>{state.singleSpeakerName || 'No seleccionado'}</span>
          <div style={{ flex: 1 }} />
          {state.singleSpeakerName && (
            <>
              <button style={dockBtn} onClick={() => dispatch({ type: 'SET_SPEAKER_TIMER', timer: { startedAt: ti.running ? null : Date.now(), running: !ti.running, timeLeft: ti.timeLeft } })}>
                {ti.running ? '⏸ Pausar' : '▶ Iniciar'}
              </button>
              <button style={dockBtn} onClick={() => dispatch({ type: 'SINGLE_SET', name: null })}>⏟ Detener</button>
            </>
          )}
        </>
      )
      break
    case 'voting':
      actions = (
        <>
          {dockLabel('Votación')}
          <span style={{ ...mono(), fontSize: '0.7rem', color: 'rgba(255,255,255,0.5)' }}>Ronda {state.voteRound}</span>
          <div style={{ flex: 1 }} />
          <button style={dockBtn} onClick={() => dispatch({ type: 'VOTE_RESET' })}>↻ Reset</button>
          <button style={dockPrimary} disabled={state.votes.length === 0}>Finalizar</button>
        </>
      )
      break
    case 'summary':
      actions = (
        <>
          {dockLabel('Sesión')}
          <div style={{ flex: 1 }} />
          <button style={dockPrimary} onClick={() => dispatch({ type: 'RESET_SESSION' })}>Nueva sesión</button>
        </>
      )
      break
  }

  return (
    <div style={{
      position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 100,
      background: 'rgba(26,26,46,0.95)', backdropFilter: 'blur(10px)',
      borderTop: '1px solid rgba(255,255,255,0.08)',
      display: 'flex', alignItems: 'center', gap: 8,
      padding: '6px 16px', minHeight: 40,
    }}>
      {actions}
    </div>
  )
}

// ── Main ChairPanel ──────────────────────────────────────────────────────────

export default function ChairPanel({ committeeId: _committeeId }: { committeeId?: string } = {}) {
  const [state, dispatch] = useReducer(reducer, initState)
  const [prevPhase, setPrevPhase] = useState<Phase>(state.phase)
  const [animDir, setAnimDir] = useState<'enter' | 'leave'>('enter')

  useEffect(() => {
    if (prevPhase !== state.phase) {
      setAnimDir('leave')
      const t = setTimeout(() => {
        setPrevPhase(state.phase)
        setAnimDir('enter')
      }, 150)
      return () => clearTimeout(t)
    }
  }, [state.phase, prevPhase])

  useEffect(() => {
    if (!state.speakerTimer.running) return
    const id = setInterval(() => dispatch({ type: 'TICK_SPEAKER' }), 1000)
    return () => clearInterval(id)
  }, [state.speakerTimer.running])

  useEffect(() => {
    if (!state.unmodTimer.running) return
    const id = setInterval(() => dispatch({ type: 'TICK_UNMOD' }), 1000)
    return () => clearInterval(id)
  }, [state.unmodTimer.running])

  const pageContent = () => {
    switch (state.phase) {
      case 'setup': return <SetupPanel state={state} dispatch={dispatch} />
      case 'rollcall': return <RollCallPanel state={state} dispatch={dispatch} />
      case 'gsl': return <GslPanel state={state} dispatch={dispatch} />
      case 'motions': return <MotionsPanel state={state} dispatch={dispatch} />
      case 'mod': return <ModPanel state={state} dispatch={dispatch} />
      case 'unmod': return <UnmodPanel state={state} dispatch={dispatch} />
      case 'singleSpeaker': return <SingleSpeakerPanel state={state} dispatch={dispatch} />
      case 'voting': return <VotingPanel state={state} dispatch={dispatch} />
      case 'summary': return <SummaryPanel state={state} dispatch={dispatch} />
    }
  }

  const animStyle: React.CSSProperties = animDir === 'enter'
    ? { opacity: 1, transform: 'translateY(0)' }
    : { opacity: 0, transform: 'translateY(8px)' }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: theme.cream }}>
      <TopBar state={state} dispatch={dispatch} />
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden', paddingBottom: 52 }}>
        <StepNav state={state} dispatch={dispatch} />
        <div style={{ flex: 1, overflow: 'auto', padding: 24, transition: 'opacity 0.15s ease, transform 0.15s ease', ...animStyle }}
          key={state.phase}>
          {pageContent()}
        </div>
        <div style={{ width: 250, flexShrink: 0, position: 'sticky', top: 0, alignSelf: 'flex-start', maxHeight: 'calc(100vh - 84px)' }}>
          <ContextPanel state={state} />
        </div>
      </div>
      <ActionDock state={state} dispatch={dispatch} />
    </div>
  )
}
