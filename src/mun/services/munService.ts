// ─────────────────────────────────────────────────────────────────────────────
// SoPeD MUN Platform — munService
// Adapter layer: swap Supabase for any backend (REST, Prisma, PocketBase…)
// ─────────────────────────────────────────────────────────────────────────────

import type { CommitteeState, MunEvent, MunSession, Motion, ScoreEntry } from '@/types/mun.types'

import { db } from '@/lib/firebase'
import {
  collection,
  addDoc,
  getDocs,
  getDoc,
  doc,
  updateDoc,
  query,
  where
} from 'firebase/firestore'

// ── Types ────────────────────────────────────────────────────────────────────

export interface CreateEventPayload {
  name: string
  edition: number
}

export interface CreateSessionPayload {
  eventId: string
  name: string
}

export interface CreateCommitteePayload {
  sessionId: string
  name: string
  topic: string
  type: string
  delegateCountries: string[]   // country ISO codes
}

// ── Supabase Client ───────────────────────────────────────────────────────────
// Uncomment and install @supabase/supabase-js when ready:
//
// import { createClient } from '@supabase/supabase-js'
// const supabase = createClient(
//   process.env.NEXT_PUBLIC_SUPABASE_URL!,
//   process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
// )

// ── Service ───────────────────────────────────────────────────────────────────

export const munService = {

  // ── LISTING METHODS ───────────────────────────────────────

  async getCommittees(): Promise<any[]> {
    const snap = await getDocs(collection(db, 'committees'))
    return snap.docs.map(d => ({ id: d.id, ...(d.data() as any) }))
  },

  async getSessions(): Promise<any[]> {
    const snap = await getDocs(collection(db, 'mun_sessions'))
    return snap.docs.map(d => ({ id: d.id, ...(d.data() as any) }))
  },

  async getDelegations(): Promise<any[]> {
    const snap = await getDocs(collection(db, 'delegates'))
    return snap.docs.map(d => ({ id: d.id, ...(d.data() as any) }))
  },

  // ── EVENTS ───────────────────────────────────────────────
  async getEvents(): Promise<MunEvent[]> {
    const snap = await getDocs(collection(db, 'mun_events'))
    return snap.docs.map(d => ({ id: d.id, ...(d.data() as any) }))
  },

  async createEvent(payload: CreateEventPayload): Promise<MunEvent> {
    const ref = await addDoc(collection(db, 'mun_events'), {
      ...payload,
      createdAt: new Date().toISOString(),
    })
    const snap = await getDoc(ref)
    return { id: snap.id, ...(snap.data() as any) }
  },

  // ── SESSIONS ─────────────────────────────────────────────
  async createSession(payload: CreateSessionPayload): Promise<MunSession> {
    const ref = await addDoc(collection(db, 'mun_sessions'), {
      ...payload,
      startedAt: new Date().toISOString(),
    })
    const snap = await getDoc(ref)
    return { id: snap.id, ...(snap.data() as any) }
  },

  // ── COMMITTEES ───────────────────────────────────────────
  async getCommittee(id: string): Promise<CommitteeState | null> {
    const snap = await getDoc(doc(db, 'committees', id))
    if (!snap.exists()) return null
    return { id: snap.id, ...(snap.data() as any) }
  },

  async createCommittee(payload: CreateCommitteePayload): Promise<CommitteeState> {
    const ref = await addDoc(collection(db, 'committees'), {
      ...payload,
      phase: 'setup',
      createdAt: new Date().toISOString(),
    })
    const snap = await getDoc(ref)
    return { id: snap.id, ...(snap.data() as any) }
  },

  async updatePhase(committeeId: string, phase: CommitteeState['phase']): Promise<void> {
    await updateDoc(doc(db, 'committees', committeeId), { phase })
  },

  // ── MOTIONS ──────────────────────────────────────────────
  async saveMotion(committeeId: string, motion: Motion): Promise<void> {
    await addDoc(collection(db, 'committees', committeeId, 'motions'), {
      ...motion,
      createdAt: new Date().toISOString(),
    })
  },

  // ── SCORES ───────────────────────────────────────────────
  async saveScore(committeeId: string, entry: ScoreEntry): Promise<void> {
    await addDoc(collection(db, 'committees', committeeId, 'scores'), {
      ...entry,
      createdAt: new Date().toISOString(),
    })
  },

  async getScores(committeeId: string): Promise<ScoreEntry[]> {
    const q = query(collection(db, 'committees', committeeId, 'scores'))
    const snap = await getDocs(q)
    return snap.docs.map(d => d.data() as ScoreEntry)
  },

  // ── RANKING ──────────────────────────────────────────────
  async publishRanking(committeeId: string): Promise<void> {
    await updateDoc(doc(db, 'committees', committeeId), {
      ranking_published: true,
      closed_at: new Date().toISOString(),
    })
  },
}

// ── SQL Schema (Supabase / PostgreSQL) ────────────────────────────────────────
//
// Run this in your Supabase SQL editor:
//
// -- Events
// create table mun_events (
//   id          uuid primary key default gen_random_uuid(),
//   name        text not null,
//   edition     int  not null,
//   created_at  timestamptz default now()
// );
//
// -- Sessions
// create table mun_sessions (
//   id          uuid primary key default gen_random_uuid(),
//   event_id    uuid references mun_events(id) on delete cascade,
//   name        text not null,
//   started_at  timestamptz default now()
// );
//
// -- Committees
// create table committees (
//   id                  uuid primary key default gen_random_uuid(),
//   session_id          uuid references mun_sessions(id) on delete cascade,
//   name                text not null,
//   topic               text,
//   type                text default 'General',
//   phase               text default 'setup',
//   speaker_time_secs   int  default 90,
//   ranking_published   boolean default false,
//   suspend_code        text,
//   closed_at           timestamptz,
//   created_at          timestamptz default now()
// );
//
// -- Delegates
// create table delegates (
//   id              uuid primary key default gen_random_uuid(),
//   committee_id    uuid references committees(id) on delete cascade,
//   country_name    text not null,
//   country_flag    text,
//   country_iso     char(2),
//   status          text default 'absent',
//   user_id         uuid references auth.users(id)
// );
//
// -- Motions log
// create table motions (
//   id              uuid primary key default gen_random_uuid(),
//   committee_id    uuid references committees(id) on delete cascade,
//   category        text not null,
//   type_id         text not null,
//   label           text not null,
//   proposer        text,
//   timer_seconds   int  default 0,
//   status          text default 'pending',
//   created_at      timestamptz default now()
// );
//
// -- Scores — protected by RLS
// create table scores (
//   id              uuid primary key default gen_random_uuid(),
//   committee_id    uuid references committees(id) on delete cascade,
//   country_name    text not null,
//   points          numeric(5,1) not null,
//   reason          text,
//   created_at      timestamptz default now()
// );
//
// alter table scores enable row level security;
//
// create policy "Only directors read scores"
//   on scores for select
//   using (
//     exists (
//       select 1 from committee_roles
//       where user_id = auth.uid()
//         and committee_id = scores.committee_id
//         and role = 'director'
//     )
//   );
//
// -- Role assignments
// create table committee_roles (
//   id              uuid primary key default gen_random_uuid(),
//   committee_id    uuid references committees(id) on delete cascade,
//   user_id         uuid references auth.users(id),
//   role            text not null,    -- 'director' | 'adjunct' | 'delegate'
//   country_name    text,             -- for delegates
//   created_at      timestamptz default now()
// );
