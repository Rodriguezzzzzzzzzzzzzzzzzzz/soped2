// services/munService.ts
// Adapter layer — swap Firestore for Supabase when ready.
// All score endpoints are server-only (validated by role on API side).

import type { CommitteeState, Motion, ScoreEntry } from '@/mun-v2/types/mun.types'

// ── Firestore persistence (client-side, direct) ─────────────────────────────
import { db } from '@/lib/firebase'
import { doc, getDoc, setDoc, onSnapshot, Unsubscribe } from 'firebase/firestore'

const SESSIONS_COLLECTION = 'committee_sessions'

export async function saveSessionState(committeeId: string, state: CommitteeState): Promise<void> {
  const ref = doc(db, SESSIONS_COLLECTION, committeeId)
  await setDoc(ref, state as Record<string, unknown>)
}

export async function loadSessionState(committeeId: string): Promise<CommitteeState | null> {
  const ref = doc(db, SESSIONS_COLLECTION, committeeId)
  const snap = await getDoc(ref)
  if (!snap.exists()) return null
  return snap.data() as CommitteeState
}

export function subscribeSessionState(
  committeeId: string,
  onData: (state: CommitteeState) => void,
  onError?: (err: Error) => void,
): Unsubscribe {
  const ref = doc(db, SESSIONS_COLLECTION, committeeId)
  return onSnapshot(
    ref,
    (snap) => {
      if (snap.exists()) {
        onData(snap.data() as CommitteeState)
      }
    },
    (err) => {
      if (onError) onError(err)
    },
  )
}

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
