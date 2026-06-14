# SoPeD Session — Esquema de Base de Datos

## Convenciones

- IDs: `UUID v4` generados por PostgreSQL (`gen_random_uuid()`)
- Timestamps: `TIMESTAMPTZ` con `DEFAULT NOW()`
- Soft delete: `deleted_at TIMESTAMPTZ` donde aplique
- Indexación: todos los `SELECT` frecuentes tienen índice
- RLS habilitado en todas las tablas con datos sensibles

---

## Tablas del Sistema

### `profiles` — Perfiles de usuario (extensión de auth.users)

```sql
CREATE TABLE profiles (
  id              UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email           TEXT NOT NULL,
  full_name       TEXT NOT NULL DEFAULT '',
  display_name    TEXT,
  avatar_url      TEXT,
  role            TEXT NOT NULL DEFAULT 'delegate'
                  CHECK (role IN ('super_admin', 'secretariat', 'director', 'adjunct', 'delegate', 'observer')),
  institution     TEXT,
  phone           TEXT,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_profiles_role ON profiles(role);

-- Trigger para crear profile automáticamente después de signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, email, full_name)
  VALUES (NEW.id, NEW.email, COALESCE(NEW.raw_user_meta_data->>'full_name', ''));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();
```

### `audit_logs` — Registro de auditoría

```sql
CREATE TABLE audit_logs (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  committee_id    UUID REFERENCES committees(id) ON DELETE SET NULL,
  actor_id        UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  action          TEXT NOT NULL,
  details         JSONB DEFAULT '{}',
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_audit_committee ON audit_logs(committee_id);
CREATE INDEX idx_audit_actor ON audit_logs(actor_id);
CREATE INDEX idx_audit_created ON audit_logs(created_at DESC);

-- Política: solo inserts, nunca updates/deletes
-- Solo super_admin y secretariat pueden SELECT
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
```

---

## Tablas de Conferencias

### `conferences` — Conferencias/eventos MUN

```sql
CREATE TABLE conferences (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name            TEXT NOT NULL,
  edition         INTEGER NOT NULL,
  description     TEXT,
  start_date      DATE,
  end_date        DATE,
  venue           TEXT,
  logo_url        TEXT,
  status          TEXT NOT NULL DEFAULT 'draft'
                  CHECK (status IN ('draft', 'active', 'completed', 'cancelled')),
  created_by      UUID REFERENCES auth.users(id),
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_conferences_status ON conferences(status);
```

### `committees` — Comités dentro de una conferencia

```sql
CREATE TABLE committees (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conference_id       UUID NOT NULL REFERENCES conferences(id) ON DELETE CASCADE,
  name                TEXT NOT NULL,
  abbreviation        TEXT NOT NULL,
  topic               TEXT,
  description         TEXT,
  type                TEXT NOT NULL DEFAULT 'general'
                      CHECK (type IN (
                        'security_council', 'general_assembly', 'economic_social',
                        'human_rights', 'crisis', 'special', 'general'
                      )),
  language            TEXT DEFAULT 'es' CHECK (language IN ('es', 'en', 'pt')),
  phase               TEXT NOT NULL DEFAULT 'setup'
                      CHECK (phase IN (
                        'setup', 'rollcall', 'session', 'suspended', 'closed'
                      )),
  speaker_time_secs   INTEGER DEFAULT 90 CHECK (speaker_time_secs >= 15),
  max_speakers_list   INTEGER DEFAULT 30,
  ranking_published   BOOLEAN DEFAULT FALSE,
  suspend_code         TEXT,
  closed_at           TIMESTAMPTZ,
  created_at          TIMESTAMPTZ DEFAULT NOW(),
  updated_at          TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_committees_conference ON committees(conference_id);
CREATE INDEX idx_committees_phase ON committees(phase);
```

### `committee_delegates` — Asignación de delegados a comités

```sql
CREATE TABLE committee_delegates (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  committee_id    UUID NOT NULL REFERENCES committees(id) ON DELETE CASCADE,
  user_id         UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  role            TEXT NOT NULL DEFAULT 'delegate'
                  CHECK (role IN ('director', 'adjunct', 'delegate', 'observer')),
  country_name    TEXT NOT NULL,
  country_flag    TEXT,
  country_iso     CHAR(2),
  is_present      BOOLEAN DEFAULT FALSE,
  joined_at       TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE(committee_id, country_name),
  UNIQUE(committee_id, user_id)
);

CREATE INDEX idx_cd_committee ON committee_delegates(committee_id);
CREATE INDEX idx_cd_user ON committee_delegates(user_id);
```

---

## Tablas de Sesión

### `sessions` — Sesiones de un comité

```sql
CREATE TABLE sessions (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  committee_id    UUID NOT NULL REFERENCES committees(id) ON DELETE CASCADE,
  name            TEXT NOT NULL,
  phase           TEXT NOT NULL DEFAULT 'setup'
                  CHECK (phase IN ('setup', 'rollcall', 'session', 'suspended', 'closed')),
  started_at      TIMESTAMPTZ DEFAULT NOW(),
  ended_at        TIMESTAMPTZ,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_sessions_committee ON sessions(committee_id);
```

### `attendance` — Asistencia por sesión

```sql
CREATE TABLE attendance (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id      UUID NOT NULL REFERENCES sessions(id) ON DELETE CASCADE,
  delegate_id     UUID NOT NULL REFERENCES committee_delegates(id) ON DELETE CASCADE,
  status          TEXT NOT NULL DEFAULT 'absent'
                  CHECK (status IN ('present', 'voting', 'absent', 'late')),
  timestamp       TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE(session_id, delegate_id)
);

CREATE INDEX idx_attendance_session ON attendance(session_id);
```

### `speakers_list` — Lista de oradores (GSL)

```sql
CREATE TABLE speakers_list (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id      UUID NOT NULL REFERENCES sessions(id) ON DELETE CASCADE,
  delegate_id     UUID NOT NULL REFERENCES committee_delegates(id) ON DELETE CASCADE,
  position        INTEGER NOT NULL,
  speaking_time   INTEGER,  -- segundos asignados (null = default)
  status          TEXT NOT NULL DEFAULT 'waiting'
                  CHECK (status IN ('waiting', 'speaking', 'completed', 'removed')),
  started_at      TIMESTAMPTZ,
  ended_at        TIMESTAMPTZ,
  created_at      TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE(session_id, position)
);

CREATE INDEX idx_speakers_session ON speakers_list(session_id);
```

### `motions` — Mociones propuestas

```sql
CREATE TABLE motions (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id      UUID NOT NULL REFERENCES sessions(id) ON DELETE CASCADE,
  proposer_id     UUID REFERENCES committee_delegates(id),
  category        TEXT NOT NULL CHECK (category IN ('debate', 'resolution', 'procedural')),
  type_id         TEXT NOT NULL,
  label           TEXT NOT NULL,
  description     TEXT,
  timer_seconds   INTEGER DEFAULT 0,
  status          TEXT NOT NULL DEFAULT 'pending'
                  CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  resolved_at     TIMESTAMPTZ,

  UNIQUE(session_id, id)
);

CREATE INDEX idx_motions_session ON motions(session_id);
CREATE INDEX idx_motions_status ON motions(status);
```

### `caucus_sessions` — Caucus activos

```sql
CREATE TABLE caucus_sessions (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id      UUID NOT NULL REFERENCES sessions(id) ON DELETE CASCADE,
  type            TEXT NOT NULL CHECK (type IN ('moderated', 'unmoderated')),
  topic           TEXT,
  total_duration  INTEGER NOT NULL,  -- segundos
  speaker_time    INTEGER,           -- segundos por orador (solo moderated)
  status          TEXT NOT NULL DEFAULT 'active'
                  CHECK (status IN ('active', 'completed')),
  started_at      TIMESTAMPTZ DEFAULT NOW(),
  ended_at        TIMESTAMPTZ
);

CREATE INDEX idx_caucus_session ON caucus_sessions(session_id);
```

---

## Tablas de Votación

### `voting_sessions` — Sesiones de votación

```sql
CREATE TABLE voting_sessions (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id      UUID NOT NULL REFERENCES sessions(id) ON DELETE CASCADE,
  motion_id       UUID REFERENCES motions(id) ON DELETE SET NULL,
  title           TEXT NOT NULL,
  type            TEXT NOT NULL DEFAULT 'procedural'
                  CHECK (type IN ('procedural', 'substantive', 'secret', 'acclamation')),
  status          TEXT NOT NULL DEFAULT 'open'
                  CHECK (status IN ('open', 'closed', 'cancelled')),
  votes_for       INTEGER DEFAULT 0,
  votes_against   INTEGER DEFAULT 0,
  votes_abstain   INTEGER DEFAULT 0,
  total_votes     INTEGER DEFAULT 0,
  result          TEXT CHECK (result IN ('approved', 'rejected', 'tie')),
  opened_at       TIMESTAMPTZ DEFAULT NOW(),
  closed_at       TIMESTAMPTZ
);

CREATE INDEX idx_voting_session ON voting_sessions(session_id);
```

### `delegate_votes` — Votos individuales

```sql
CREATE TABLE delegate_votes (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  voting_id       UUID NOT NULL REFERENCES voting_sessions(id) ON DELETE CASCADE,
  delegate_id     UUID NOT NULL REFERENCES committee_delegates(id) ON DELETE CASCADE,
  vote            TEXT NOT NULL CHECK (vote IN ('for', 'against', 'abstain')),
  cast_at         TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE(voting_id, delegate_id)
);

CREATE INDEX idx_dv_voting ON delegate_votes(voting_id);
```

---

## Tablas de Documentos

### `documents` — Documentos del comité

```sql
CREATE TABLE documents (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  committee_id    UUID NOT NULL REFERENCES committees(id) ON DELETE CASCADE,
  title           TEXT NOT NULL,
  type            TEXT NOT NULL CHECK (type IN (
                    'working_paper', 'draft_resolution', 'resolution',
                    'position_paper', 'background_guide', 'other'
                  )),
  content         TEXT,
  version         INTEGER NOT NULL DEFAULT 1,
  status          TEXT NOT NULL DEFAULT 'draft'
                  CHECK (status IN ('draft', 'submitted', 'approved', 'rejected')),
  submitted_by    UUID REFERENCES committee_delegates(id),
  approved_by     UUID REFERENCES committee_delegates(id),
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_documents_committee ON documents(committee_id);
```

### `document_versions` — Historial de versiones de documentos

```sql
CREATE TABLE document_versions (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  document_id     UUID NOT NULL REFERENCES documents(id) ON DELETE CASCADE,
  version         INTEGER NOT NULL,
  content         TEXT NOT NULL,
  changes_summary TEXT,
  edited_by       UUID REFERENCES committee_delegates(id),
  created_at      TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE(document_id, version)
);

CREATE INDEX idx_dv_document ON document_versions(document_id);
```

---

## Tablas de Certificados

### `certificates` — Certificados emitidos

```sql
CREATE TABLE certificates (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code            TEXT UNIQUE NOT NULL,
  delegate_id     UUID REFERENCES committee_delegates(id) ON DELETE SET NULL,
  user_id         UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  full_name       TEXT NOT NULL,
  conference_id   UUID REFERENCES conferences(id) ON DELETE SET NULL,
  committee_id    UUID REFERENCES committees(id) ON DELETE SET NULL,
  program         TEXT NOT NULL,
  participation   TEXT NOT NULL,
  issue_date      DATE NOT NULL DEFAULT CURRENT_DATE,
  status          TEXT NOT NULL DEFAULT 'valid'
                  CHECK (status IN ('valid', 'revoked', 'expired')),
  metadata        JSONB DEFAULT '{}',
  created_by      UUID REFERENCES auth.users(id),
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE UNIQUE INDEX idx_certificates_code ON certificates(code);
CREATE INDEX idx_certificates_user ON certificates(user_id);
```

---

## Tablas de Puntajes

### `scores` — Puntajes asignados

```sql
CREATE TABLE scores (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  committee_id    UUID NOT NULL REFERENCES committees(id) ON DELETE CASCADE,
  delegate_id     UUID NOT NULL REFERENCES committee_delegates(id) ON DELETE CASCADE,
  points          NUMERIC(5,1) NOT NULL CHECK (points > 0),
  reason          TEXT NOT NULL,
  assigned_by     UUID NOT NULL REFERENCES committee_delegates(id),
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_scores_committee ON scores(committee_id);
CREATE INDEX idx_scores_delegate ON scores(delegate_id);
```

---

## Resumen de Relaciones

```
conferences 1──N committees
committees 1──N sessions
committees 1──N committee_delegates
committees 1──N documents
committees 1──N scores
committees 1──N certificates
sessions 1──N attendance
sessions 1──N speakers_list
sessions 1──N motions
sessions 1──N voting_sessions
sessions 1──N caucus_sessions
voting_sessions 1──N delegate_votes
documents 1──N document_versions
auth.users 1──1 profiles
committee_delegates N──1 users
```

---

## Instrucciones de Migración

```bash
# 1. Crear las tablas en orden:
#    profiles → conferences → committees → committee_delegates
#    → sessions → attendance → speakers_list → motions
#    → caucus_sessions → voting_sessions → delegate_votes
#    → documents → document_versions → certificates
#    → scores → audit_logs

# 2. Ejecutar en Supabase SQL Editor o via migración:

supabase migration new session_schema
# Copiar los CREATE TABLE statements al archivo de migración
supabase db push

# 3. Habilitar RLS en cada tabla:
ALTER TABLE committees ENABLE ROW LEVEL SECURITY;
ALTER TABLE committee_delegates ENABLE ROW LEVEL SECURITY;
ALTER TABLE scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE voting_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE delegate_votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
```

### Diagrama de migración sugerida

```
Fase 1 (MVP):
  profiles, conferences, committees, committee_delegates,
  sessions, attendance, speakers_list, motions

Fase 2 (V1):
  voting_sessions, delegate_votes, caucus_sessions, scores

Fase 3 (V2):
  documents, document_versions, certificates, audit_logs
```
