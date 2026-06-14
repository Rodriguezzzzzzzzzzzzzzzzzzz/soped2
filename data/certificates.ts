/* ===================================================================
   SoPeD — Certificate Verification Data Layer
   ===================================================================
   Uses mock data initially. Ready for Supabase/PostgreSQL migration.
   =================================================================== */

// ─── Types ──────────────────────────────────────────────────────────
export interface Certificate {
  id: string
  code: string
  fullName: string
  program: string
  participation: string
  issueDate: string
  status: 'valid' | 'revoked' | 'expired'
  metadata?: Record<string, string>
}

// ─── Mock Data ──────────────────────────────────────────────────────
const MOCK_CERTIFICATES: Certificate[] = [
  {
    id: 'cert-001',
    code: 'SOPED-2026-MUN-001847',
    fullName: 'Rodrigo Manuel Rodriguez',
    program: 'Modelo de Naciones Unidas',
    participation: 'Delegado — CSNU',
    issueDate: '2026-03-15',
    status: 'valid',
  },
  {
    id: 'cert-002',
    code: 'SOPED-2026-MUN-001848',
    fullName: 'Lucero Beys Romero',
    program: 'Modelo de Naciones Unidas',
    participation: 'Delegada — AGONU',
    issueDate: '2026-03-15',
    status: 'valid',
  },
  {
    id: 'cert-003',
    code: 'SOPED-2026-DEB-000312',
    fullName: 'Pedro Adrian Villalba',
    program: 'Torneo de Debate Escolar',
    participation: 'Primer lugar — Categoría Avanzada',
    issueDate: '2026-02-10',
    status: 'valid',
  },
  {
    id: 'cert-004',
    code: 'SOPED-2025-LID-000521',
    fullName: 'Mateo Landaveri',
    program: 'Programa de Liderazgo Juvenil',
    participation: 'Participante destacado',
    issueDate: '2025-11-20',
    status: 'valid',
  },
  {
    id: 'cert-005',
    code: 'SOPED-2025-MUN-001201',
    fullName: 'Valeria Gutiérrez Mendoza',
    program: 'Modelo de Naciones Unidas',
    participation: 'Presidenta — ECOSOC',
    issueDate: '2025-09-30',
    status: 'valid',
  },
  {
    id: 'cert-006',
    code: 'SOPED-2025-DEB-000198',
    fullName: 'Santiago López Huamán',
    program: 'Taller de Argumentación Avanzada',
    participation: 'Instructor',
    issueDate: '2025-07-15',
    status: 'valid',
  },
  {
    id: 'cert-007',
    code: 'SOPED-2026-MUN-001849',
    fullName: 'Camila Torres Paredes',
    program: 'Modelo de Naciones Unidas',
    participation: 'Delegada — OEA',
    issueDate: '2026-03-15',
    status: 'valid',
  },
]

// ─── Lookup ─────────────────────────────────────────────────────────
export function findCertificateByCode(code: string): Certificate | null {
  const normalized = code.trim().toUpperCase()
  const found = MOCK_CERTIFICATES.find((c) => c.code === normalized)
  return found ?? null
}

export function getAllCertificates(): Certificate[] {
  return MOCK_CERTIFICATES
}

/*
  ═════════════════════════════════════════════════════════════════════
  INSTRUCCIONES — Agregar un nuevo certificado
  ═════════════════════════════════════════════════════════════════════

  1. Agrega un nuevo objeto al array MOCK_CERTIFICATES:

     {
       id: 'cert-008',
       code: 'SOPED-2026-MUN-001850',
       fullName: 'Nombre del Participante',
       program: 'Modelo de Naciones Unidas',
       participation: 'Delegado — Comité',
       issueDate: '2026-04-01',
       status: 'valid',
     }

  2. Formato del código:  SOPED-{AAAA}-{PROGRAMA}-{NNNNNN}
     - AAAA      → año de emisión (4 dígitos)
     - PROGRAMA  → MUN | DEB | LID (máx 6 caracteres)
     - NNNNNN    → número correlativo (6 dígitos, leading zeros)

  ═════════════════════════════════════════════════════════════════════
  MIGRACIÓN A SUPABASE / POSTGRESQL
  ═════════════════════════════════════════════════════════════════════

  Para migrar, solo reemplaza el cuerpo de findCertificateByCode():

  ┌─────────────────────────────────────────────────────────────────────
  │ import { createClient } from '@supabase/supabase-js'
  │
  │ const supabase = createClient(
  │   process.env.NEXT_PUBLIC_SUPABASE_URL!,
  │   process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  │ )
  │
  │ export async function findCertificateByCode(
  │   code: string
  │ ): Promise<Certificate | null> {
  │   const { data } = await supabase
  │     .from('certificates')
  │     .select('*')
  │     .eq('code', code.trim().toUpperCase())
  │     .single()
  │   return data as Certificate | null
  │ }
  └─────────────────────────────────────────────────────────────────────

  Tabla SQL sugerida:

  ┌─────────────────────────────────────────────────────────────────────
  │ CREATE TABLE certificates (
  │   id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  │   code          TEXT UNIQUE NOT NULL,
  │   full_name     TEXT NOT NULL,
  │   program       TEXT NOT NULL,
  │   participation TEXT NOT NULL,
  │   issue_date    DATE NOT NULL,
  │   status        TEXT NOT NULL DEFAULT 'valid'
  │     CHECK (status IN ('valid', 'revoked', 'expired')),
  │   metadata      JSONB,
  │   created_at    TIMESTAMPTZ DEFAULT NOW(),
  │   updated_at    TIMESTAMPTZ DEFAULT NOW()
  │ );
  │
  │ CREATE INDEX idx_certificates_code ON certificates (code);
  └─────────────────────────────────────────────────────────────────────
*/
