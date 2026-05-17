'use client'

// components/mun/session/ChairPanel.tsx
// ─────────────────────────────────────────────────────────────────────────────
// FIXES vs ZIP original:
//   - nanoid → uid() from @/constants/mun.constants (no external deps)
//   - committeeId prop added (passed from server page)
//   - All @/ imports verified against tsconfig paths: { "@/*": ["./*"] }
//   - 'use client' at top (required — uses hooks + timers)
//   - Link from next/link ✓
//   - No useRouter (not needed at this level)
//   - CSS vars from globals.css: --font-cormorant, --font-outfit, --dark, --darker ✓
// ─────────────────────────────────────────────────────────────────────────────

import { useState, useMemo } from 'react'
import Link from 'next/link'

import { useMunSession } from '@/src/mun-v2/hooks/useMunSession'
import { useSpeakerTimer } from '@/src/mun-v2/hooks/useSpeakerTimer'
import { useMotionTimer } from '@/src/mun-v2/hooks/useMotionTimer'
import {
  ALL_COUNTRIES,
  MOTION_DEFINITIONS,
  COMMITTEE_TYPES,
  fmt,
  generateSuspendCode,
} from '@/src/mun/session/constants/mun.constants'
import type {
  Role,
  Country,
  DelegateStatus,
  MotionCategory,
  CommitteeState,
  BadgeVariant,
} from '@/types/mun.types'

// ── Props ────────────────────────────────────────────────────────────────────

interface ChairPanelProps {
  committeeId?: string
  initialCommittee?: Partial<CommitteeState>
}

// ── Design tokens — maps to existing SoPeD globals.css vars ──────────────────

const T = {
  glass:   'rgba(255,255,255,0.04)',
  border:  'rgba(255,255,255,0.08)',
  text:    '#e8e8e8',
  muted:   'rgba(255,255,255,0.45)',
  dim:     'rgba(255,255,255,0.22)',
  gold:    '#b8960c',
  goldL:   '#d4af37',
  green:   'rgba(34,197,94,0.9)',
  greenBg: 'rgba(34,197,94,0.07)',
  greenB:  'rgba(34,197,94,0.35)',
  amber:   'rgba(251,191,36,0.9)',
  amberBg: 'rgba(251,191,36,0.07)',
  amberB:  'rgba(251,191,36,0.35)',
  red:     'rgba(239,68,68,0.9)',
  redBg:   'rgba(239,68,68,0.07)',
  redB:    'rgba(239,68,68,0.35)',
} as const

const g = (e: React.CSSProperties = {}): React.CSSProperties =>
  ({ background: T.glass, border: `1px solid ${T.border}`, borderRadius: '3px', ...e })

const serif = (sz = '1rem', e: React.CSSProperties = {}): React.CSSProperties =>
  ({ fontFamily: 'var(--font-cormorant)', fontSize: sz, color: T.text, ...e })

const lbl = (e: React.CSSProperties = {}): React.CSSProperties => ({
  fontFamily: 'var(--font-outfit)', fontSize: '0.6rem', fontWeight: 600,
  letterSpacing: '0.15em', textTransform: 'uppercase' as const,
  color: 'rgba(184,150,12,0.7)', ...e,
})

const inputStyle: React.CSSProperties = {
  width: '100%', background: 'rgba(255,255,255,0.04)',
  border: `1px solid ${T.border}`, color: T.text,
  padding: '0.65rem 1rem', fontSize: '0.88rem',
  fontFamily: 'var(--font-outfit)', outline: 'none',
  boxSizing: 'border-box', borderRadius: '2px',
}

// ── Badge ─────────────────────────────────────────────────────────────────────

type BV = 'present' | 'voting' | 'absent' | 'approved' | 'rejected' | 'pending'

const BC: Record<BV, { bg: string; b: string; c: string; t: string }> = {
  present:  { bg: T.greenBg, b: T.greenB, c: T.green, t: 'Present'  },
  voting:   { bg: T.amberBg, b: T.amberB, c: T.amber, t: 'Voting'   },
  absent:   { bg: T.redBg,   b: T.redB,   c: T.red,   t: 'Absent'   },
  approved: { bg: T.greenBg, b: T.greenB, c: T.green, t: 'Approved' },
  rejected: { bg: T.redBg,   b: T.redB,   c: T.red,   t: 'Rejected' },
  pending:  { bg: T.amberBg, b: T.amberB, c: T.amber, t: 'Pending'  },
}

function Badge({ status }: { status: BV }) {
  const c = BC[status]
  return (
    <span style={{
      background: c.bg, border: `1px solid ${c.b}`, color: c.c,
      fontFamily: 'var(--font-outfit)', fontSize: '0.58rem', fontWeight: 600,
      letterSpacing: '0.1em', textTransform: 'uppercase', padding: '0.15rem 0.5rem', borderRadius: '2px',
    }}>{c.t}</span>
  )
}

// ── Btn ───────────────────────────────────────────────────────────────────────

type BtnV = 'primary' | 'secondary' | 'success' | 'danger' | 'ghost'
const BV_STYLE: Record<BtnV, React.CSSProperties> = {
  primary:   { background: 'rgba(184,150,12,0.12)', border: '1px solid rgba(184,150,12,0.4)', color: T.goldL },
  secondary: { background: T.glass, border: `1px solid ${T.border}`, color: T.muted },
  success:   { background: T.greenBg, border: `1px solid ${T.greenB}`, color: T.green },
  danger:    { background: T.redBg, border: `1px solid ${T.redB}`, color: T.red },
  ghost:     { background: 'transparent', border: '1px solid transparent', color: T.muted },
}

function Btn({ variant = 'primary', onClick, disabled, children, style = {} }: {
  variant?: BtnV; onClick?: () => void; disabled?: boolean
  children: React.ReactNode; style?: React.CSSProperties
}) {
  return (
    <button onClick={onClick} disabled={disabled} style={{
      ...BV_STYLE[variant],
      fontFamily: 'var(--font-outfit)', fontSize: '0.72rem', fontWeight: 500,
      letterSpacing: '0.08em', textTransform: 'uppercase', padding: '0.4rem 0.9rem',
      cursor: disabled ? 'not-allowed' : 'pointer', borderRadius: '2px',
      transition: 'all 0.2s', opacity: disabled ? 0.4 : 1, ...style,
    }}>{children}</button>
  )
}

// ── Room Simulation (SVG) ─────────────────────────────────────────────────────

function RoomSim({ delegates, rollCall, currentSpeaker, activeMotion }: {
  delegates: Country[]; rollCall: Record<string, DelegateStatus>
  currentSpeaker: string | null; activeMotion: CommitteeState['activeMotion']
}) {
  const n = delegates.length || 1
  const cx = 140, cy = 130, r = 92

  return (
    <div style={g({ padding: '0.85rem' })}>
      <p style={lbl({ marginBottom: '0.5rem' })}>Chamber View</p>
      <svg width="280" height="260" style={{ overflow: 'visible' }}>
        <defs>
          <radialGradient id="munBgGrad" cx="50%" cy="50%" r="50%">
            <stop offset="0%"   stopColor="rgba(9,28,54,0.4)" />
            <stop offset="100%" stopColor="transparent" />
          </radialGradient>
        </defs>
        <ellipse cx={cx} cy={cy} rx={r+20} ry={r+20} fill="url(#munBgGrad)" stroke="rgba(184,150,12,0.08)" strokeWidth={1}/>
        <ellipse cx={cx} cy={cy} rx={r-22} ry={r-22} fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth={1} strokeDasharray="4,4"/>
        <rect x={cx-30} y={18} width={60} height={24} rx={2} fill="rgba(184,150,12,0.12)" stroke="rgba(184,150,12,0.4)" strokeWidth={1}/>
        <text x={cx} y={34} textAnchor="middle" fill={T.goldL} fontSize={9} fontFamily="var(--font-outfit)" fontWeight={600}>CHAIR</text>
        {activeMotion && (
          <text x={cx} y={55} textAnchor="middle" fill={T.amber} fontSize={7} fontFamily="var(--font-outfit)">
            {activeMotion.label.slice(0, 22)}
          </text>
        )}
        {delegates.map((d, i) => {
          const angle = (2 * Math.PI * i / n) - Math.PI / 2
          const x = cx + r * Math.cos(angle), y = cy + r * Math.sin(angle)
          const st = rollCall[d.name], speaking = currentSpeaker === d.name
          let fill = T.glass, stroke = T.border
          if (st === 'present') { fill = T.greenBg; stroke = T.greenB }
          if (st === 'voting')  { fill = T.amberBg; stroke = T.amberB }
          if (st === 'absent')  { fill = T.redBg;   stroke = T.redB   }
          if (speaking) { fill = 'rgba(212,175,55,0.18)'; stroke = T.goldL }
          return (
            <g key={d.name}>
              {speaking && <circle cx={x} cy={y} r={19} fill="none" stroke={T.goldL} strokeWidth={1} strokeDasharray="3,2" opacity={0.7}/>}
              <circle cx={x} cy={y} r={13} fill={fill} stroke={stroke} strokeWidth={speaking ? 2 : 1}/>
              <text x={x} y={y+1} textAnchor="middle" dominantBaseline="middle" fontSize={11}>{d.flag}</text>
            </g>
          )
        })}
        <g transform="translate(4,242)">
          {[['Present',T.greenBg,T.greenB],['Voting',T.amberBg,T.amberB],['Absent',T.redBg,T.redB]].map(([l,bg,b],i)=>(
            <g key={l as string} transform={`translate(${i*90},0)`}>
              <circle cx={5} cy={5} r={4} fill={bg as string} stroke={b as string} strokeWidth={1}/>
              <text x={13} y={9} fill={T.dim} fontSize={9} fontFamily="var(--font-outfit)">{l}</text>
            </g>
          ))}
        </g>
      </svg>
    </div>
  )
}

// ── Quorum Panel ──────────────────────────────────────────────────────────────

function QuorumPanel({ total, present, voting, absent, simpleQuorum, compoundQuorum }: {
  total: number; present: number; voting: number; absent: number
  simpleQuorum: boolean; compoundQuorum: boolean
}) {
  return (
    <div style={g({ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' })}>
      <p style={lbl()}>Quorum Status</p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '0.4rem' }}>
        {([[present,'Present',T.greenBg,T.greenB,T.green],[voting,'Voting',T.amberBg,T.amberB,T.amber],[absent,'Absent',T.redBg,T.redB,T.red]] as [number,string,string,string,string][]).map(([n,lb,bg,b,c])=>(
          <div key={lb} style={{ background:bg, border:`1px solid ${b}`, padding:'0.5rem', textAlign:'center', borderRadius:'2px' }}>
            <p style={{ ...serif('1.4rem'), fontWeight:600, color:c, margin:0 }}>{n}</p>
            <p style={{ fontFamily:'var(--font-outfit)', fontSize:'0.55rem', color:T.dim, letterSpacing:'0.1em', textTransform:'uppercase', margin:'2px 0 0' }}>{lb}</p>
          </div>
        ))}
      </div>
      <div style={{ display:'flex', flexDirection:'column', gap:'0.3rem' }}>
        {([['Simple Quorum',`≥${Math.ceil(total/2)} / ${total}`,simpleQuorum],['Compound Quorum',`≥${Math.ceil(total*0.6)} voting`,compoundQuorum]] as [string,string,boolean][]).map(([lb,req,met])=>(
          <div key={lb} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'0.3rem 0', borderBottom:`1px solid ${T.border}` }}>
            <span style={{ fontFamily:'var(--font-outfit)', fontSize:'0.7rem', color:T.muted }}>{lb}</span>
            <div style={{ display:'flex', alignItems:'center', gap:'0.5rem' }}>
              <span style={{ fontFamily:'var(--font-outfit)', fontSize:'0.62rem', color:T.dim }}>{req}</span>
              <span style={{ color:met?T.green:T.red, fontSize:'0.85rem', fontWeight:600 }}>{met?'✓':'✗'}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ── Role Select ───────────────────────────────────────────────────────────────

function RoleSelectScreen({ onSelect }: { onSelect: (r: Role, c: Country | null) => void }) {
  const [chosen, setChosen] = useState<Role | null>(null)
  const [country, setCountry] = useState<Country | null>(null)
  const [search, setSearch] = useState('')
  const filtered = ALL_COUNTRIES.filter(c => c.name.toLowerCase().includes(search.toLowerCase()))
  const ROLES: { id: Role; label: string; desc: string; icon: string }[] = [
    { id:'director', label:'Director',         desc:'Full control — view & publish rankings',  icon:'◈' },
    { id:'adjunct',  label:'Director Adjunct', desc:'Operational access, partial control',     icon:'◇' },
    { id:'delegate', label:'Delegate',         desc:'Country representative with voting rights', icon:'▣' },
  ]
  return (
    <div style={{ minHeight:'100vh', background:'var(--dark)', display:'flex', alignItems:'center', justifyContent:'center', padding:'2rem', fontFamily:'var(--font-outfit)' }}>
      <div style={{ width:'100%', maxWidth:'440px' }}>
        <div style={{ textAlign:'center', marginBottom:'2.5rem' }}>
          <div style={{ width:'60px', height:'60px', border:'1px solid rgba(184,150,12,0.45)', background:'rgba(184,150,12,0.08)', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 1rem' }}>
            <span style={{ ...serif('2.2rem'), fontWeight:600, color:T.goldL }}>S</span>
          </div>
          <p style={{ ...serif('1.6rem'), fontWeight:600, letterSpacing:'0.06em' }}>SoPeD MUN</p>
          <p style={{ fontFamily:'var(--font-outfit)', fontSize:'0.62rem', color:T.dim, letterSpacing:'0.2em', textTransform:'uppercase', marginTop:'0.25rem' }}>Committee Session System</p>
        </div>
        <p style={{ ...lbl(), marginBottom:'0.75rem' }}>Select your role</p>
        <div style={{ display:'flex', flexDirection:'column', gap:'0.4rem', marginBottom:'1.25rem' }}>
          {ROLES.map(r => (
            <button key={r.id} onClick={() => setChosen(r.id)} style={{
              textAlign:'left', padding:'1rem 1.25rem',
              background:chosen===r.id?'rgba(184,150,12,0.09)':T.glass,
              border:`1px solid ${chosen===r.id?'rgba(184,150,12,0.35)':T.border}`,
              cursor:'pointer', display:'flex', gap:'1rem', alignItems:'center', borderRadius:'2px', transition:'all 0.2s',
            }}>
              <span style={{ color:T.goldL, fontSize:'1.1rem', flexShrink:0 }}>{r.icon}</span>
              <div>
                <p style={{ fontFamily:'var(--font-outfit)', fontWeight:500, fontSize:'0.9rem', color:chosen===r.id?T.goldL:T.text, margin:0 }}>{r.label}</p>
                <p style={{ fontFamily:'var(--font-outfit)', fontSize:'0.72rem', color:T.muted, margin:'2px 0 0' }}>{r.desc}</p>
              </div>
            </button>
          ))}
        </div>
        {chosen === 'delegate' && (
          <div style={g({ padding:'1rem', marginBottom:'1.25rem' })}>
            <p style={{ ...lbl(), marginBottom:'0.6rem' }}>Assigned Country</p>
            <input placeholder="Search countries..." value={search} onChange={e=>setSearch(e.target.value)} style={{ ...inputStyle, marginBottom:'0.5rem' }}/>
            <div style={{ maxHeight:'160px', overflowY:'auto', display:'flex', flexDirection:'column', gap:'2px' }}>
              {filtered.map(c => (
                <button key={c.name} onClick={()=>setCountry(c)} style={{
                  width:'100%', textAlign:'left', padding:'0.4rem 0.5rem',
                  background:country?.name===c.name?'rgba(184,150,12,0.08)':'transparent',
                  border:'none', color:country?.name===c.name?T.goldL:T.muted,
                  cursor:'pointer', fontSize:'0.82rem', display:'flex', gap:'0.5rem', borderRadius:'2px',
                }}>{c.flag} {c.name}</button>
              ))}
            </div>
          </div>
        )}
        <Btn onClick={()=>onSelect(chosen!,country)} disabled={!chosen||(chosen==='delegate'&&!country)}
          style={{ width:'100%', justifyContent:'center', padding:'0.8rem', fontSize:'0.82rem' }}>
          Enter Committee →
        </Btn>
      </div>
    </div>
  )
}

// ── Setup Screen ──────────────────────────────────────────────────────────────

function SetupScreen({ committee, setConfig, selectedDelegates, setDelegates, onNext }: {
  committee: CommitteeState['config']
  setConfig: (k: string, v: string) => void
  selectedDelegates: Country[]
  setDelegates: (d: Country[]) => void
  onNext: () => void
}) {
  const [search, setSearch] = useState('')
  const filtered = ALL_COUNTRIES.filter(c => c.name.toLowerCase().includes(search.toLowerCase()))
  const toggle = (c: Country) => {
    const ex = selectedDelegates.find(d => d.name === c.name)
    setDelegates(ex ? selectedDelegates.filter(d => d.name !== c.name) : [...selectedDelegates, c])
  }
  return (
    <div style={{ minHeight:'100vh', background:'var(--dark)', padding:'2rem', fontFamily:'var(--font-outfit)' }}>
      <div style={{ maxWidth:'960px', margin:'0 auto' }}>
        <div style={{ display:'flex', alignItems:'center', gap:'1rem', marginBottom:'2.5rem', paddingBottom:'1.5rem', borderBottom:`1px solid ${T.border}` }}>
          <div style={{ width:'36px', height:'36px', border:'1px solid rgba(184,150,12,0.4)', background:'rgba(184,150,12,0.08)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
            <span style={{ ...serif('1.1rem'), fontWeight:600, color:T.goldL }}>S</span>
          </div>
          <div>
            <p style={{ ...serif('1.2rem'), fontWeight:600, margin:0 }}>SoPeD MUN — Committee Setup</p>
            <p style={{ fontFamily:'var(--font-outfit)', fontSize:'0.6rem', color:T.dim, letterSpacing:'0.15em', textTransform:'uppercase', margin:0 }}>Configure before roll call</p>
          </div>
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'2.5rem', alignItems:'start' }}>
          {/* Left */}
          <div style={{ display:'flex', flexDirection:'column', gap:'1.25rem' }}>
            <h2 style={{ ...serif('2rem'), fontWeight:400, margin:0 }}><em>Configure</em> Committee</h2>
            {(['name','topic'] as const).map(k => (
              <div key={k}>
                <p style={{ ...lbl(), marginBottom:'0.4rem' }}>{k === 'name' ? 'Committee Name *' : 'Primary Topic'}</p>
                <input placeholder={k==='name'?'e.g. Consejo de Seguridad de la ONU':'e.g. Conflictos internacionales 2025'} value={committee[k]} onChange={e=>setConfig(k,e.target.value)} style={inputStyle}/>
              </div>
            ))}
            <div>
              <p style={{ ...lbl(), marginBottom:'0.5rem' }}>Committee Type</p>
              <div style={{ display:'flex', flexWrap:'wrap', gap:'0.35rem' }}>
                {COMMITTEE_TYPES.map(t => (
                  <Btn key={t} variant={committee.type===t?'primary':'secondary'} onClick={()=>setConfig('type',t)} style={{ padding:'0.3rem 0.7rem' }}>{t}</Btn>
                ))}
              </div>
            </div>
            <div style={g({ padding:'1.25rem' })}>
              <p style={{ ...lbl(), marginBottom:'0.75rem' }}>Summary</p>
              {[['Committee',committee.name||'—'],['Topic',committee.topic||'—'],['Type',committee.type],['Delegates',`${selectedDelegates.length} selected`]].map(([k,v])=>(
                <div key={k} style={{ display:'flex', justifyContent:'space-between', padding:'0.35rem 0', borderBottom:`1px solid ${T.border}` }}>
                  <span style={{ fontFamily:'var(--font-outfit)', fontSize:'0.72rem', color:T.muted }}>{k}</span>
                  <span style={{ fontFamily:'var(--font-outfit)', fontSize:'0.72rem', color:T.text, fontWeight:500 }}>{v}</span>
                </div>
              ))}
            </div>
            <Btn onClick={onNext} disabled={!committee.name||selectedDelegates.length<2} style={{ padding:'0.8rem', width:'100%', justifyContent:'center', fontSize:'0.82rem' }}>
              Proceed to Roll Call →
            </Btn>
          </div>
          {/* Right */}
          <div style={{ display:'flex', flexDirection:'column', gap:'0.85rem' }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
              <h2 style={{ ...serif('2rem'), fontWeight:400, margin:0 }}>Select Delegates</h2>
              <Btn variant="secondary" onClick={()=>setDelegates(ALL_COUNTRIES.slice(0,15))} style={{ padding:'0.3rem 0.7rem', fontSize:'0.65rem' }}>+ Quick 15</Btn>
            </div>
            <input placeholder="Search countries..." value={search} onChange={e=>setSearch(e.target.value)} style={inputStyle}/>
            {selectedDelegates.length > 0 && (
              <div style={{ display:'flex', flexWrap:'wrap', gap:'0.3rem' }}>
                {selectedDelegates.map(d => (
                  <span key={d.name} style={{ background:'rgba(184,150,12,0.1)', border:'1px solid rgba(184,150,12,0.3)', color:T.goldL, fontSize:'0.65rem', padding:'0.15rem 0.4rem', display:'inline-flex', alignItems:'center', gap:'0.3rem', borderRadius:'2px' }}>
                    {d.flag} {d.name}
                    <button onClick={()=>toggle(d)} style={{ background:'none', border:'none', color:T.goldL, cursor:'pointer', fontSize:'0.75rem', padding:0 }}>×</button>
                  </span>
                ))}
              </div>
            )}
            <div style={{ display:'flex', flexDirection:'column', gap:'2px', maxHeight:'400px', overflowY:'auto' }}>
              {filtered.map(c => {
                const sel = selectedDelegates.find(d => d.name === c.name)
                return (
                  <button key={c.name} onClick={()=>toggle(c)} style={{
                    textAlign:'left', padding:'0.45rem 0.75rem',
                    background:sel?'rgba(184,150,12,0.06)':'rgba(255,255,255,0.015)',
                    border:`1px solid ${sel?'rgba(184,150,12,0.25)':T.border}`,
                    color:sel?T.goldL:T.muted, cursor:'pointer',
                    display:'flex', alignItems:'center', gap:'0.5rem', fontSize:'0.82rem', borderRadius:'2px',
                  }}>
                    {c.flag} {c.name}
                    {sel && <span style={{ marginLeft:'auto', color:T.goldL }}>✓</span>}
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Roll Call Panel ───────────────────────────────────────────────────────────

function RollCallPanel({ delegates, rollCall, setStatus, onComplete, canControl }: {
  delegates: Country[]; rollCall: Record<string, DelegateStatus>
  setStatus: (c: string, s: DelegateStatus) => void
  onComplete: (() => void) | null; canControl: boolean
}) {
  return (
    <div style={{ display:'flex', flexDirection:'column', gap:'1.25rem' }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
        <div>
          <h2 style={{ ...serif('2rem'), fontWeight:400, margin:0 }}><em>Roll</em> Call</h2>
          <p style={{ fontFamily:'var(--font-outfit)', fontSize:'0.75rem', color:T.muted }}>{Object.keys(rollCall).length} / {delegates.length} registered</p>
        </div>
        {onComplete && canControl && <Btn onClick={onComplete} disabled={Object.keys(rollCall).length<1} style={{ padding:'0.55rem 1.5rem' }}>Complete Roll Call →</Btn>}
      </div>
      <div style={{ display:'flex', flexDirection:'column', gap:'0.35rem' }}>
        {delegates.map(d => {
          const st = rollCall[d.name] as DelegateStatus | undefined
          return (
            <div key={d.name} style={{ ...g(), padding:'0.75rem 1rem', display:'flex', alignItems:'center', gap:'1rem',
              borderLeft:st==='present'?`2px solid ${T.greenB}`:st==='voting'?`2px solid ${T.amberB}`:st==='absent'?`2px solid ${T.redB}`:'2px solid transparent' }}>
              <span style={{ fontSize:'1.2rem' }}>{d.flag}</span>
              <p style={{ fontFamily:'var(--font-outfit)', fontSize:'0.85rem', fontWeight:500, color:T.text, flex:1, margin:0 }}>{d.name}</p>
              {st && <Badge status={st}/>}
              {canControl && (
                <div style={{ display:'flex', gap:'0.35rem', marginLeft:'auto' }}>
                  {(['present','voting','absent'] as DelegateStatus[]).map(s => (
                    <button key={s} onClick={()=>setStatus(d.name,s)} style={{
                      fontFamily:'var(--font-outfit)', fontSize:'0.6rem', fontWeight:600,
                      letterSpacing:'0.08em', textTransform:'uppercase', padding:'0.3rem 0.65rem',
                      background:st===s?'rgba(0,0,0,0.2)':'rgba(255,255,255,0.03)',
                      border:`1px solid ${st===s?(s==='present'?T.greenB:s==='voting'?T.amberB:T.redB):T.border}`,
                      color:st===s?(s==='present'?T.green:s==='voting'?T.amber:T.red):T.dim,
                      cursor:'pointer', borderRadius:'2px',
                    }}>{s}</button>
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ── Speakers Panel ────────────────────────────────────────────────────────────

function SpeakersPanel({ session, speakerTimer, canControl, role, delegateCountry }: {
  session: ReturnType<typeof useMunSession>
  speakerTimer: ReturnType<typeof useSpeakerTimer>
  canControl: boolean; role: Role; delegateCountry: Country | null
}) {
  const { state, addSpeaker, removeSpeaker, advanceSpeaker, setSpeakerTime } = session
  const { timeLeft, maxTime, running, pct, isUrgent, start, pause, reset, setMaxTime } = speakerTimer
  const [timeInput, setTimeInput] = useState(String(maxTime))
  const currentSpeaker = session.currentSpeaker
  const eligible = session.eligibleSpeakers

  const handleNext = () => { pause(); reset(); advanceSpeaker() }

  return (
    <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'1.5rem' }}>
      <div style={{ display:'flex', flexDirection:'column', gap:'1rem' }}>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
          <h2 style={{ ...serif('1.8rem'), fontWeight:400, margin:0 }}>Speakers List</h2>
          {canControl && (
            <div style={{ display:'flex', gap:'0.4rem', alignItems:'center' }}>
              <input type="number" value={timeInput} onChange={e=>setTimeInput(e.target.value)}
                onBlur={()=>{const v=Math.max(15,parseInt(timeInput)||90);setMaxTime(v);setSpeakerTime(v)}}
                style={{ width:'56px', background:'rgba(255,255,255,0.04)', border:`1px solid ${T.border}`, color:T.text, padding:'0.3rem 0.5rem', fontSize:'0.78rem', fontFamily:'var(--font-outfit)', textAlign:'center', outline:'none', borderRadius:'2px' }}/>
              <span style={{ fontFamily:'var(--font-outfit)', fontSize:'0.65rem', color:T.muted }}>sec</span>
            </div>
          )}
        </div>
        {currentSpeaker && (
          <div style={g({ padding:'1.25rem', borderLeft:`2px solid ${T.goldL}` })}>
            <p style={{ ...lbl(), marginBottom:'0.4rem' }}>Now Speaking</p>
            <p style={{ ...serif('1.4rem'), fontWeight:500, margin:'0 0 0.75rem' }}>
              {state.delegates.find(d=>d.name===currentSpeaker.countryName)?.flag} {currentSpeaker.countryName}
            </p>
            <div style={{ marginBottom:'0.75rem' }}>
              <div style={{ height:'4px', background:'rgba(255,255,255,0.08)', borderRadius:'2px', overflow:'hidden' }}>
                <div style={{ height:'100%', width:`${pct*100}%`, background:isUrgent?T.redB:pct>0.4?`linear-gradient(90deg,${T.gold},${T.goldL})`:T.amberB, borderRadius:'2px', transition:'width 1s linear' }}/>
              </div>
              <p style={{ fontFamily:'var(--font-outfit)', fontSize:'0.78rem', color:isUrgent?T.red:T.goldL, fontWeight:600, marginTop:'0.4rem' }}>{fmt(timeLeft)}</p>
            </div>
            {canControl && (
              <div style={{ display:'flex', gap:'0.5rem' }}>
                {running?<Btn variant="secondary" onClick={pause}>⏸ Pause</Btn>:<Btn onClick={start}>▶ Resume</Btn>}
                <Btn variant="ghost" onClick={handleNext} style={{ marginLeft:'auto' }}>Next →</Btn>
              </div>
            )}
          </div>
        )}
        {!currentSpeaker && state.speakersList.length > 0 && canControl && (
          <Btn onClick={()=>{reset();start()}} style={{ padding:'0.65rem' }}>▶ Start Speakers List</Btn>
        )}
        <div style={{ display:'flex', flexDirection:'column', gap:'0.3rem', minHeight:'120px' }}>
          {state.speakersList.length===0 && <p style={{ fontFamily:'var(--font-outfit)', fontSize:'0.8rem', color:T.dim, padding:'2rem 0', textAlign:'center' }}>No speakers queued</p>}
          {state.speakersList.map((entry,i) => {
            const d = state.delegates.find(x=>x.name===entry.countryName)
            const isCurrent = i===state.currentSpeakerIndex, isPast = i<state.currentSpeakerIndex
            return (
              <div key={entry.countryName} style={{ ...g(), padding:'0.6rem 0.875rem', display:'flex', alignItems:'center', gap:'0.75rem', opacity:isPast?0.4:1,
                borderLeft:isCurrent?`2px solid ${T.goldL}`:isPast?'2px solid transparent':'2px solid rgba(255,255,255,0.06)' }}>
                <span style={{ fontFamily:'var(--font-outfit)', fontSize:'0.65rem', color:T.dim, minWidth:'16px' }}>{i+1}</span>
                <span style={{ fontSize:'1rem' }}>{d?.flag}</span>
                <span style={{ fontFamily:'var(--font-outfit)', fontSize:'0.82rem', color:isCurrent?T.goldL:T.text, flex:1 }}>{entry.countryName}</span>
                {isCurrent && <span style={{ fontFamily:'var(--font-outfit)', fontSize:'0.6rem', color:T.goldL }}>{running?'● LIVE':'NEXT'}</span>}
                {canControl && !isPast && <button onClick={()=>removeSpeaker(entry.countryName)} style={{ background:'none', border:'none', color:T.dim, cursor:'pointer', fontSize:'1rem', padding:'0 2px' }}>×</button>}
              </div>
            )
          })}
        </div>
      </div>
      <div style={{ display:'flex', flexDirection:'column', gap:'0.75rem' }}>
        <h3 style={{ ...serif('1.2rem'), fontWeight:500, color:T.muted, margin:0 }}>Add to List</h3>
        <div style={{ display:'flex', flexDirection:'column', gap:'0.25rem', maxHeight:'460px', overflowY:'auto' }}>
          {eligible.map(d => {
            const inList = state.speakersList.some(s=>s.countryName===d.name)
            const canAdd = (canControl||(role==='delegate'&&delegateCountry?.name===d.name)) && !inList
            return (
              <div key={d.name} style={{ ...g(), padding:'0.5rem 0.75rem', display:'flex', alignItems:'center', gap:'0.5rem', opacity:inList?0.45:1 }}>
                <span style={{ fontSize:'1rem' }}>{d.flag}</span>
                <span style={{ fontFamily:'var(--font-outfit)', fontSize:'0.8rem', color:inList?T.dim:T.text, flex:1 }}>{d.name}</span>
                {inList?<span style={{ fontFamily:'var(--font-outfit)', fontSize:'0.6rem', color:T.dim }}>queued</span>
                  :canAdd&&<button onClick={()=>addSpeaker(d.name)} style={{ background:'rgba(184,150,12,0.08)', border:'1px solid rgba(184,150,12,0.25)', color:T.goldL, fontSize:'0.62rem', padding:'0.2rem 0.5rem', cursor:'pointer', fontFamily:'var(--font-outfit)', letterSpacing:'0.06em', borderRadius:'2px' }}>+ Add</button>}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

// ── Motions Panel ─────────────────────────────────────────────────────────────

function MotionsPanel({ session, motionTimer, canControl, delegates }: {
  session: ReturnType<typeof useMunSession>
  motionTimer: ReturnType<typeof useMotionTimer>
  canControl: boolean; delegates: Country[]
}) {
  const { state, proposeMotion, resolveMotion, setSuspendCode } = session
  const { seconds, running, isUrgent, startWith, pause, resume, stop } = motionTimer
  const [showForm, setShowForm] = useState(false)
  const [category, setCategory] = useState<MotionCategory>('debate')
  const [typeId, setTypeId] = useState('moderated')
  const [proposer, setProposer] = useState('')
  const [timerInput, setTimerInput] = useState('60')

  const catDefs = MOTION_DEFINITIONS[category] ?? []
  const selDef = catDefs.find(m => m.id === typeId)

  const handleCat = (cat: MotionCategory) => {
    setCategory(cat)
    const first = MOTION_DEFINITIONS[cat][0]
    setTypeId(first.id); setTimerInput(String(first.defaultTime))
  }

  const handleSubmit = () => {
    if (!selDef) return
    const secs = parseInt(timerInput) || 0
    if (typeId === 'suspend') setSuspendCode(generateSuspendCode())
    proposeMotion({ category, typeId, label: selDef.label, proposer, timerSeconds: secs })
    if (selDef.hasTimer && secs > 0) startWith(secs)
    setShowForm(false)
  }

  const handleResolve = (approved: boolean) => { if (!approved) stop(); resolveMotion(approved) }

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:'1.5rem' }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
        <h2 style={{ ...serif('1.8rem'), fontWeight:400, margin:0 }}>Motion Engine</h2>
        {canControl && !state.activeMotion && <Btn variant={showForm?'secondary':'primary'} onClick={()=>setShowForm(f=>!f)}>{showForm?'Cancel':'+ Propose Motion'}</Btn>}
      </div>

      {state.activeMotion && (
        <div style={g({ padding:'1.5rem', borderLeft:`2px solid ${T.gold}` })}>
          <p style={{ ...lbl(), marginBottom:'0.5rem' }}>Active Motion</p>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', flexWrap:'wrap', gap:'0.75rem' }}>
            <div>
              <p style={{ ...serif('1.4rem'), fontWeight:500, margin:'0 0 0.25rem' }}>{state.activeMotion.label}</p>
              <p style={{ fontFamily:'var(--font-outfit)', fontSize:'0.75rem', color:T.muted }}>
                Proposed by <strong style={{ color:T.text }}>{state.activeMotion.proposer||'Floor'}</strong> · {state.activeMotion.timestamp}
              </p>
              {state.activeMotion.typeId==='suspend'&&<p style={{ fontFamily:'var(--font-outfit)', fontSize:'0.72rem', color:T.amber, marginTop:'0.4rem' }}>⚠ Will suspend session</p>}
              {state.activeMotion.typeId==='close'&&<p style={{ fontFamily:'var(--font-outfit)', fontSize:'0.72rem', color:T.red, marginTop:'0.4rem' }}>⚠ Will permanently close session</p>}
            </div>
            {seconds > 0 && (
              <div style={{ textAlign:'center' }}>
                <p style={{ ...serif('2.4rem'), fontWeight:600, color:isUrgent?T.red:T.goldL, lineHeight:1, margin:0 }}>{fmt(seconds)}</p>
                <p style={{ fontFamily:'var(--font-outfit)', fontSize:'0.6rem', color:T.dim }}>Motion Timer</p>
                <div style={{ display:'flex', gap:'0.3rem', marginTop:'0.4rem', justifyContent:'center' }}>
                  {running?<Btn variant="secondary" onClick={pause} style={{ padding:'0.25rem 0.6rem', fontSize:'0.65rem' }}>Pause</Btn>
                    :<Btn variant="ghost" onClick={resume} style={{ padding:'0.25rem 0.6rem', fontSize:'0.65rem' }}>Resume</Btn>}
                </div>
              </div>
            )}
          </div>
          {canControl && (
            <div style={{ display:'flex', gap:'0.75rem', marginTop:'1rem', paddingTop:'1rem', borderTop:`1px solid ${T.border}` }}>
              <Btn variant="success" onClick={()=>handleResolve(true)} style={{ padding:'0.55rem 1.5rem' }}>✓ Approve Motion</Btn>
              <Btn variant="danger"  onClick={()=>handleResolve(false)} style={{ padding:'0.55rem 1.5rem' }}>✗ Reject Motion</Btn>
            </div>
          )}
        </div>
      )}

      {showForm && canControl && (
        <div style={g({ padding:'1.5rem' })}>
          <p style={{ ...lbl(), marginBottom:'1rem' }}>New Motion</p>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'1rem', marginBottom:'1rem' }}>
            <div>
              <p style={{ ...lbl(), marginBottom:'0.4rem' }}>Category</p>
              {(['debate','resolution','procedural'] as MotionCategory[]).map(cat => (
                <button key={cat} onClick={()=>handleCat(cat)} style={{ display:'block', width:'100%', textAlign:'left', padding:'0.45rem 0.75rem', marginBottom:'0.25rem',
                  background:category===cat?'rgba(184,150,12,0.1)':T.glass, border:`1px solid ${category===cat?'rgba(184,150,12,0.35)':T.border}`,
                  color:category===cat?T.goldL:T.muted, fontFamily:'var(--font-outfit)', fontSize:'0.75rem', cursor:'pointer', borderRadius:'2px', textTransform:'capitalize' }}>{cat}</button>
              ))}
            </div>
            <div>
              <p style={{ ...lbl(), marginBottom:'0.4rem' }}>Motion Type</p>
              {catDefs.map(def => (
                <button key={def.id} onClick={()=>{setTypeId(def.id);setTimerInput(String(def.defaultTime))}} style={{ display:'block', width:'100%', textAlign:'left', padding:'0.45rem 0.75rem', marginBottom:'0.25rem',
                  background:typeId===def.id?'rgba(184,150,12,0.1)':T.glass, border:`1px solid ${typeId===def.id?'rgba(184,150,12,0.35)':T.border}`,
                  color:typeId===def.id?T.goldL:T.muted, fontFamily:'var(--font-outfit)', fontSize:'0.72rem', cursor:'pointer', borderRadius:'2px' }}>{def.label}</button>
              ))}
            </div>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'1rem', marginBottom:'1rem' }}>
            <div>
              <p style={{ ...lbl(), marginBottom:'0.4rem' }}>Proposer</p>
              <select value={proposer} onChange={e=>setProposer(e.target.value)} style={{ ...inputStyle, cursor:'pointer' }}>
                <option value="" style={{ background:'#091c36' }}>— Floor —</option>
                {delegates.map(d=><option key={d.name} value={d.name} style={{ background:'#091c36' }}>{d.flag} {d.name}</option>)}
              </select>
            </div>
            {selDef?.hasTimer && (
              <div>
                <p style={{ ...lbl(), marginBottom:'0.4rem' }}>Timer (seconds)</p>
                <input type="number" value={timerInput} min={0} onChange={e=>setTimerInput(e.target.value)} style={inputStyle}/>
              </div>
            )}
          </div>
          {typeId==='close' && <div style={{ background:T.redBg, border:`1px solid ${T.redB}`, padding:'0.75rem 1rem', marginBottom:'1rem', borderRadius:'2px' }}><p style={{ fontFamily:'var(--font-outfit)', fontSize:'0.78rem', color:T.red }}>⚠ Closing debate will end the session and generate the final ranking.</p></div>}
          {typeId==='suspend' && <div style={{ background:T.amberBg, border:`1px solid ${T.amberB}`, padding:'0.75rem 1rem', marginBottom:'1rem', borderRadius:'2px' }}><p style={{ fontFamily:'var(--font-outfit)', fontSize:'0.78rem', color:T.amber }}>A 4-character unlock code will be generated for the Chair.</p></div>}
          <Btn onClick={handleSubmit} style={{ padding:'0.65rem 2rem' }}>Submit Motion →</Btn>
        </div>
      )}

      {state.motionHistory.length > 0 && (
        <div>
          <p style={{ ...lbl(), marginBottom:'0.75rem' }}>Motion History</p>
          <div style={{ display:'flex', flexDirection:'column', gap:'0.3rem' }}>
            {state.motionHistory.map(m => (
              <div key={m.id} style={{ ...g(), padding:'0.75rem 1rem', display:'flex', alignItems:'center', gap:'1rem', opacity:0.75 }}>
                <div style={{ flex:1 }}>
                  <p style={{ fontFamily:'var(--font-outfit)', fontSize:'0.82rem', color:T.text, margin:0 }}>{m.label}</p>
                  <p style={{ fontFamily:'var(--font-outfit)', fontSize:'0.65rem', color:T.dim, margin:'2px 0 0' }}>{m.proposer||'Floor'} · {m.timestamp}</p>
                </div>
                <Badge status={m.status as BV}/>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

// ── Logs Panel ────────────────────────────────────────────────────────────────

function LogsPanel({ logs }: { logs: CommitteeState['logs'] }) {
  const LC = { success:T.green, error:T.red, warning:T.amber, info:T.muted }
  return (
    <div style={{ display:'flex', flexDirection:'column', gap:'1rem' }}>
      <h2 style={{ ...serif('1.8rem'), fontWeight:400, margin:0 }}>Session Log</h2>
      <div style={{ display:'flex', flexDirection:'column', gap:'0.25rem', maxHeight:'600px', overflowY:'auto' }}>
        {logs.length===0&&<p style={{ fontFamily:'var(--font-outfit)', fontSize:'0.8rem', color:T.dim, padding:'2rem 0', textAlign:'center' }}>No events logged yet</p>}
        {logs.map(l=>(
          <div key={l.id} style={{ ...g(), padding:'0.55rem 0.875rem', display:'flex', gap:'0.75rem', alignItems:'flex-start' }}>
            <span style={{ fontFamily:'var(--font-outfit)', fontSize:'0.62rem', color:T.dim, flexShrink:0, marginTop:'1px' }}>{new Date(l.timestamp).toLocaleTimeString()}</span>
            <p style={{ fontFamily:'var(--font-outfit)', fontSize:'0.78rem', color:LC[l.type], flex:1, lineHeight:1.5, margin:0 }}>{l.message}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

// ── Suspended Overlay ─────────────────────────────────────────────────────────

function SuspendedOverlay({ suspendCode, motionSeconds, onUnlock, canControl }: {
  suspendCode: string | null; motionSeconds: number; onUnlock: (c: string) => void; canControl: boolean
}) {
  const [input, setInput] = useState('')
  return (
    <div style={{ display:'flex', alignItems:'center', justifyContent:'center', minHeight:'400px' }}>
      <div style={g({ borderTop:`2px solid ${T.redB}`, padding:'3rem', textAlign:'center', maxWidth:'380px' })}>
        <p style={{ fontSize:'2.5rem', marginBottom:'1rem' }}>⏸</p>
        <p style={{ ...serif('2rem'), fontWeight:500, color:T.amber, marginBottom:'0.5rem' }}>Session Suspended</p>
        {motionSeconds>0&&<p style={{ ...serif('2.8rem'), fontWeight:600, color:T.goldL, margin:'1rem 0' }}>{fmt(motionSeconds)}</p>}
        <p style={{ fontFamily:'var(--font-outfit)', fontSize:'0.8rem', color:T.muted, marginBottom:'1.5rem' }}>Enter the unlock code to resume</p>
        {canControl&&suspendCode&&<p style={{ fontFamily:'var(--font-outfit)', fontSize:'0.7rem', color:T.dim, marginBottom:'1rem' }}>Code: <strong style={{ color:T.amber, letterSpacing:'0.2em' }}>{suspendCode}</strong></p>}
        <div style={{ display:'flex', gap:'0.5rem' }}>
          <input placeholder="Enter code..." value={input} onChange={e=>setInput(e.target.value.toUpperCase())} onKeyDown={e=>e.key==='Enter'&&onUnlock(input)}
            style={{ ...inputStyle, textAlign:'center', letterSpacing:'0.2em' }}/>
          <Btn variant="success" onClick={()=>onUnlock(input)} style={{ padding:'0.65rem 1rem' }}>Unlock</Btn>
        </div>
      </div>
    </div>
  )
}

// ── Closed Screen ─────────────────────────────────────────────────────────────

function ClosedScreen({ session, role, delegateCountry }: {
  session: ReturnType<typeof useMunSession>; role: Role; delegateCountry: Country | null
}) {
  const { state, ranking, publishRanking, revokeRanking } = session
  const canSee = role === 'director'
  const MEDALS = ['🥇','🥈','🥉']
  return (
    <div style={{ minHeight:'100vh', background:'var(--dark)', display:'flex', alignItems:'center', justifyContent:'center', padding:'2rem', fontFamily:'var(--font-outfit)' }}>
      <div style={{ width:'100%', maxWidth:'560px' }}>
        <div style={{ textAlign:'center', marginBottom:'2.5rem' }}>
          <p style={{ fontSize:'3rem', marginBottom:'1rem' }}>🔒</p>
          <h1 style={{ ...serif('2.5rem'), fontWeight:400, marginBottom:'0.5rem' }}>Session Concluded</h1>
          <p style={{ fontFamily:'var(--font-outfit)', fontSize:'0.8rem', color:T.muted }}>{state.config.name||'Committee'}</p>
        </div>
        {canSee ? (
          <div>
            <div style={g({ padding:'1.5rem', marginBottom:'1.5rem' })}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'1rem' }}>
                <p style={lbl()}>Final Ranking — Director View</p>
                <span style={{ fontFamily:'var(--font-outfit)', fontSize:'0.6rem', color:T.red, border:`1px solid ${T.redB}`, padding:'0.15rem 0.5rem', borderRadius:'2px' }}>CONFIDENTIAL</span>
              </div>
              {ranking.length===0?<p style={{ fontFamily:'var(--font-outfit)', fontSize:'0.8rem', color:T.dim }}>No scores recorded</p>:(
                <div style={{ display:'flex', flexDirection:'column', gap:'0.5rem' }}>
                  {ranking.map((r,i)=>(
                    <div key={r.countryName} style={{ ...g(), padding:'0.875rem 1.25rem', display:'flex', alignItems:'center', gap:'1rem',
                      borderLeft:i===0?`2px solid ${T.goldL}`:i===1?'2px solid rgba(192,192,192,0.5)':i===2?'2px solid rgba(205,127,50,0.5)':'2px solid transparent' }}>
                      <span style={{ fontSize:'1.2rem' }}>{MEDALS[i]??`${r.rank}.`}</span>
                      <span style={{ fontSize:'1.1rem' }}>{r.flag}</span>
                      <span style={{ fontFamily:'var(--font-outfit)', fontWeight:500, fontSize:'0.88rem', color:T.text, flex:1 }}>{r.countryName}</span>
                      <span style={{ ...serif('1.3rem'), fontWeight:600, color:T.goldL }}>{r.total.toFixed(1)}</span>
                      <span style={{ fontFamily:'var(--font-outfit)', fontSize:'0.62rem', color:T.dim }}>pts</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <Btn onClick={state.rankingPublished?revokeRanking:publishRanking} variant={state.rankingPublished?'secondary':'primary'}
              style={{ width:'100%', padding:'0.8rem', fontSize:'0.82rem', justifyContent:'center' }}>
              {state.rankingPublished?'✓ Published — Click to Revoke':'Publish Ranking to All Delegates →'}
            </Btn>
          </div>
        ):(
          <div style={g({ padding:'2rem', textAlign:'center' })}>
            {state.rankingPublished?(
              <div>
                <p style={{ fontFamily:'var(--font-outfit)', fontSize:'0.8rem', color:T.muted, marginBottom:'1rem' }}>Final ranking — published by Director</p>
                {ranking.slice(0,3).map((r,i)=>(
                  <div key={r.countryName} style={{ ...g(), padding:'0.75rem 1rem', display:'flex', alignItems:'center', gap:'0.75rem', marginBottom:'0.4rem' }}>
                    <span>{MEDALS[i]}</span><span style={{ fontSize:'1rem' }}>{r.flag}</span>
                    <span style={{ fontFamily:'var(--font-outfit)', fontSize:'0.85rem', color:T.text, flex:1 }}>{r.countryName}</span>
                    <span style={{ ...serif('1.2rem'), color:T.goldL }}>{r.total.toFixed(1)} pts</span>
                  </div>
                ))}
              </div>
            ):(
              <div>
                <p style={{ fontSize:'2rem', marginBottom:'0.75rem' }}>⏳</p>
                <p style={{ fontFamily:'var(--font-outfit)', fontSize:'0.85rem', color:T.muted }}>Awaiting ranking publication from the Director</p>
              </div>
            )}
          </div>
        )}
        <div style={{ textAlign:'center', marginTop:'2rem' }}>
          <Link href="/dashboard" className="btn-text">← Return to Dashboard</Link>
        </div>
      </div>
    </div>
  )
}

// ── ChairPanel — Main Export ──────────────────────────────────────────────────

export default function ChairPanel({ committeeId, initialCommittee }: ChairPanelProps) {
  const session      = useMunSession(initialCommittee)
  const speakerTimer = useSpeakerTimer(90)
  const motionTimer  = useMotionTimer()

  const [role, setRole]                       = useState<Role | null>(null)
  const [delegateCountry, setDelegateCountry] = useState<Country | null>(null)
  const [activeTab, setActiveTab]             = useState<'speakers'|'motions'|'rollcall'|'logs'>('speakers')

  const { state, quorum, currentSpeaker, resumeSession } = session
  const canControl = role === 'director' || role === 'adjunct'

  const handleRoleSelect = (r: Role, country: Country | null) => {
    setRole(r); if (country) setDelegateCountry(country); session.setPhase('setup')
  }

  const handleUnlock = (code: string) => {
    if (code === state.suspendCode) resumeSession()
  }

  const TABS = [
    { id:'speakers' as const, label:'Speakers List' },
    { id:'motions'  as const, label:'Motions'       },
    { id:'rollcall' as const, label:'Roll Call'     },
    { id:'logs'     as const, label:'Session Log'   },
  ]

  // ── Phase routing ─────────────────────────────────────────────────────────
  if (state.phase === 'role_select') return <RoleSelectScreen onSelect={handleRoleSelect}/>
  if (state.phase === 'setup') return (
    <SetupScreen committee={state.config} setConfig={session.setConfig} selectedDelegates={state.delegates} setDelegates={session.setDelegates}
      onNext={()=>{session.log('Committee configured');session.setPhase('rollcall')}}/>
  )
  if (state.phase === 'closed') return <ClosedScreen session={session} role={role!} delegateCountry={delegateCountry}/>

  // ── Main layout ───────────────────────────────────────────────────────────
  return (
    <div style={{ display:'flex', height:'100vh', background:'var(--dark)', fontFamily:'var(--font-outfit)', overflow:'hidden' }}>

      {/* ── Left Sidebar ── */}
      <aside style={{ width:'232px', background:'var(--darker)', borderRight:`1px solid ${T.border}`, display:'flex', flexDirection:'column', padding:'1rem', gap:'0.875rem', flexShrink:0, overflow:'hidden' }}>
        <div style={{ display:'flex', alignItems:'center', gap:'0.65rem', paddingBottom:'0.875rem', borderBottom:`1px solid ${T.border}` }}>
          <div style={{ width:'28px', height:'28px', border:'1px solid rgba(184,150,12,0.4)', background:'rgba(184,150,12,0.08)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
            <span style={{ ...serif('0.9rem'), fontWeight:600, color:T.goldL }}>S</span>
          </div>
          <div>
            <p style={{ ...serif('0.85rem'), fontWeight:600, margin:0 }}>SoPeD MUN</p>
            <p style={{ fontFamily:'var(--font-outfit)', fontSize:'0.52rem', color:T.dim, letterSpacing:'0.12em', textTransform:'uppercase', margin:0 }}>{state.config.type||'General'}</p>
          </div>
        </div>
        <div style={{ display:'flex', flexDirection:'column', gap:'0.35rem' }}>
          <p style={{ ...lbl(), fontSize:'0.52rem' }}>Committee</p>
          <p style={{ ...serif('0.85rem'), fontWeight:500, color:T.goldL, margin:0 }}>{state.config.name||'Unnamed'}</p>
          {state.config.topic&&<p style={{ fontFamily:'var(--font-outfit)', fontSize:'0.68rem', color:T.muted, lineHeight:1.4, margin:0 }}>{state.config.topic}</p>}
        </div>
        <div style={g({ padding:'0.65rem' })}>
          <p style={{ ...lbl(), fontSize:'0.52rem', marginBottom:'0.3rem' }}>Session Phase</p>
          <p style={{ fontFamily:'var(--font-outfit)', fontWeight:500, fontSize:'0.82rem', color:state.phase==='rollcall'?T.amber:state.phase==='suspended'?T.red:T.green, margin:0 }}>
            {state.phase==='rollcall'?'⟳ Roll Call':state.phase==='suspended'?'⏸ Suspended':'● In Session'}
          </p>
          <p style={{ fontFamily:'var(--font-outfit)', fontSize:'0.62rem', color:T.dim, margin:'2px 0 0' }}>{state.delegates.length} delegates · {quorum.present+quorum.voting} present</p>
        </div>
        <div style={{ display:'flex', gap:'0.3rem' }}>
          {([['SQ',quorum.simpleQuorum,'Simple Quorum'],['CQ',quorum.compoundQuorum,'Compound Quorum']] as [string,boolean,string][]).map(([k,met,title])=>(
            <div key={k} title={title} style={{ flex:1, textAlign:'center', padding:'0.4rem 0.2rem', background:met?T.greenBg:T.redBg, border:`1px solid ${met?T.greenB:T.redB}`, borderRadius:'2px' }}>
              <p style={{ fontFamily:'var(--font-outfit)', fontSize:'0.58rem', letterSpacing:'0.08em', color:T.dim, margin:0 }}>{k}</p>
              <p style={{ fontFamily:'var(--font-outfit)', fontSize:'0.9rem', color:met?T.green:T.red, margin:'2px 0 0', fontWeight:600 }}>{met?'✓':'✗'}</p>
            </div>
          ))}
        </div>
        {state.activeMotion&&(
          <div style={g({ padding:'0.65rem', borderLeft:`2px solid ${T.gold}` })}>
            <p style={{ ...lbl(), fontSize:'0.52rem', marginBottom:'0.25rem' }}>Active Motion</p>
            <p style={{ fontFamily:'var(--font-outfit)', fontSize:'0.72rem', color:T.amber, margin:0 }}>{state.activeMotion.label}</p>
            {motionTimer.seconds>0&&<p style={{ ...serif('1.2rem'), fontWeight:600, color:motionTimer.isUrgent?T.red:T.goldL, margin:'4px 0 0' }}>{fmt(motionTimer.seconds)}</p>}
          </div>
        )}
        <div style={{ marginTop:'auto', borderTop:`1px solid ${T.border}`, paddingTop:'0.875rem' }}>
          <div style={g({ padding:'0.65rem' })}>
            <p style={{ ...lbl(), fontSize:'0.52rem', marginBottom:'0.3rem' }}>Your Role</p>
            <p style={{ fontFamily:'var(--font-outfit)', fontSize:'0.78rem', fontWeight:500, color:role==='director'?T.goldL:role==='adjunct'?T.amber:T.green, margin:0 }}>
              {role==='director'?'◈ Director':role==='adjunct'?'◇ Director Adjunct':`▣ ${delegateCountry?.flag??''} ${delegateCountry?.name??''}`}
            </p>
          </div>
        </div>
      </aside>

      {/* ── Main content ── */}
      <div style={{ flex:1, display:'flex', flexDirection:'column', overflow:'hidden', minWidth:0 }}>
        <div style={{ height:'48px', borderBottom:`1px solid ${T.border}`, display:'flex', alignItems:'center', padding:'0 1.25rem', gap:'0.5rem', flexShrink:0 }}>
          {state.phase==='session'&&TABS.map(t=>(
            <button key={t.id} onClick={()=>setActiveTab(t.id)} style={{ background:'none', border:'none', fontFamily:'var(--font-outfit)', fontSize:'0.75rem', fontWeight:activeTab===t.id?500:400, color:activeTab===t.id?T.goldL:T.muted, letterSpacing:'0.06em', cursor:'pointer', padding:'0.25rem 0.5rem', marginBottom:'-1px', borderBottom:activeTab===t.id?`2px solid ${T.goldL}`:'2px solid transparent' }}>{t.label}</button>
          ))}
          {state.phase==='rollcall'&&<span style={{ ...serif('0.95rem'), fontWeight:500 }}>Roll Call</span>}
          {state.phase==='suspended'&&<div style={{ marginLeft:'auto', background:T.redBg, border:`1px solid ${T.redB}`, color:T.red, padding:'0.2rem 0.75rem', fontSize:'0.68rem', fontFamily:'var(--font-outfit)', letterSpacing:'0.08em', borderRadius:'2px' }}>⏸ SESSION SUSPENDED</div>}
        </div>
        <div style={{ flex:1, overflow:'auto', padding:'1.25rem' }}>
          {state.phase==='suspended'
            ?<SuspendedOverlay suspendCode={state.suspendCode} motionSeconds={motionTimer.seconds} onUnlock={handleUnlock} canControl={canControl}/>
            :state.phase==='rollcall'
            ?<RollCallPanel delegates={state.delegates} rollCall={state.rollCall} setStatus={session.setDelegateStatus} onComplete={canControl?session.completeRollCall:null} canControl={canControl}/>
            :activeTab==='speakers'
            ?<SpeakersPanel session={session} speakerTimer={speakerTimer} canControl={canControl} role={role!} delegateCountry={delegateCountry}/>
            :activeTab==='motions'
            ?<MotionsPanel session={session} motionTimer={motionTimer} canControl={canControl} delegates={state.delegates}/>
            :activeTab==='rollcall'
            ?<RollCallPanel delegates={state.delegates} rollCall={state.rollCall} setStatus={session.setDelegateStatus} onComplete={null} canControl={canControl}/>
            :<LogsPanel logs={state.logs}/>
          }
        </div>
      </div>

      {/* ── Right panel ── */}
      <aside style={{ width:'308px', borderLeft:`1px solid ${T.border}`, background:'var(--darker)', padding:'1rem', display:'flex', flexDirection:'column', gap:'0.875rem', overflow:'auto', flexShrink:0 }}>
        <QuorumPanel {...quorum}/>
        <RoomSim delegates={state.delegates} rollCall={state.rollCall} currentSpeaker={currentSpeaker?.countryName??null} activeMotion={state.activeMotion}/>
        {state.motionHistory.slice(0,3).length>0&&(
          <div style={g({ padding:'0.875rem' })}>
            <p style={{ ...lbl(), marginBottom:'0.5rem' }}>Recent Motions</p>
            {state.motionHistory.slice(0,3).map(m=>(
              <div key={m.id} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'0.35rem 0', borderBottom:`1px solid ${T.border}` }}>
                <span style={{ fontFamily:'var(--font-outfit)', fontSize:'0.68rem', color:T.muted }}>{m.label}</span>
                <Badge status={m.status as BV}/>
              </div>
            ))}
          </div>
        )}
        {currentSpeaker&&(
          <div style={g({ padding:'0.875rem', borderTop:`2px solid ${T.gold}` })}>
            <p style={{ ...lbl(), marginBottom:'0.4rem' }}>Now Speaking</p>
            <p style={{ fontFamily:'var(--font-outfit)', fontWeight:500, fontSize:'0.85rem', color:T.goldL, margin:0 }}>
              {state.delegates.find(d=>d.name===currentSpeaker.countryName)?.flag} {currentSpeaker.countryName}
            </p>
            <p style={{ ...serif('1.6rem'), fontWeight:600, color:speakerTimer.isUrgent?T.red:T.goldL, margin:'4px 0 0' }}>{fmt(speakerTimer.timeLeft)}</p>
          </div>
        )}
      </aside>
    </div>
  )
}
