// services/munService.ts
// Adapter layer — swap fetch() for Supabase when ready.
// All score endpoints are server-only (validated by role on API side).

import type { CommitteeState, Motion, ScoreEntry } from '@/types/mun.types'

// ── REST stubs (replace with Supabase client when backend is ready) ──────────

const API = '/api/mun'

async function req<T>(path: string, opts?: RequestInit): Promise<T> {
  const res = await fetch(`${API}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...opts,
  })
  if (!res.ok) {
    const msg = await res.text().catch(() => res.statusText)
    throw new Error(`munService: ${res.status} — ${msg}`)
  }
  return res.json() as Promise<T>
}

// ── Committee ────────────────────────────────────────────────────────────────

export const munService = {

  getCommittee: (id: string) =>
    req<CommitteeState>(`/committees/${id}`),

  createCommittee: (payload: {
    sessionId: string; name: string; topic: string
    type: string; delegateCountries: string[]
  }) => req<CommitteeState>('/committees', { method: 'POST', body: JSON.stringify(payload) }),

  updatePhase: (id: string, phase: CommitteeState['phase']) =>
    req<void>(`/committees/${id}/phase`, { method: 'PATCH', body: JSON.stringify({ phase }) }),

  // ── Motions ────────────────────────────────────────────────────────────────
  saveMotion: (committeeId: string, motion: Motion) =>
    req<void>(`/committees/${committeeId}/motions`, { method: 'POST', body: JSON.stringify(motion) }),

  // ── Scores — NEVER call from delegate UI ──────────────────────────────────
  saveScore: (committeeId: string, entry: ScoreEntry) =>
    req<void>(`/committees/${committeeId}/scores`, { method: 'POST', body: JSON.stringify(entry) }),

  // Director only — middleware must verify role server-side
  getScores: (committeeId: string) =>
    req<ScoreEntry[]>(`/committees/${committeeId}/scores`),

  publishRanking: (committeeId: string) =>
    req<void>(`/committees/${committeeId}/publish`, { method: 'POST' }),
}

// ── Supabase drop-in (uncomment + npm i @supabase/supabase-js) ───────────────
//
// import { createClient } from '@supabase/supabase-js'
// const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)
//
// export const munService = {
//   getCommittee:   (id: string) => sb.from('committees').select('*').eq('id', id).single().then(r => r.data),
//   saveMotion:     (cId: string, m: Motion) => sb.from('motions').insert({ committee_id: cId, ...m }),
//   saveScore:      (cId: string, e: ScoreEntry) => sb.from('scores').insert({ committee_id: cId, ...e }),
//   publishRanking: (cId: string) => sb.from('committees').update({ ranking_published: true }).eq('id', cId),
// }
