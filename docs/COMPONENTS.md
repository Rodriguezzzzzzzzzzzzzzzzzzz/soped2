# SoPeD Session — Catálogo de Componentes

## Convenciones de nomenclatura

- Cada componente en su propio archivo
- Nombres en PascalCase
- Props tipadas con TypeScript `interface`
- Componentes de layout: sufijo `Layout`
- Componentes de página: sufijo `Page` (separados de la ruta)
- Hooks: prefijo `use`, en carpeta `hooks/`
- Stores: prefijo `use`, sufijo `Store`, en carpeta `stores/`

---

## 1. Componentes de Layout

### `SessionLayout`

**Propósito:** Layout principal de todas las páginas de sesión.

```
┌─────────────────────────────────────┐
│  Navbar (sobredosis institucional)  │
├──────────┬──────────────────────────┤
│ Sidebar  │  Main Content            │
│          │                          │
│ - Setup  │  (children)              │
│ - GSL    │                          │
│ - Motions│                          │
│ - Voting │                          │
│ - Docs   │                          │
│ - Admin  │                          │
│          │                          │
├──────────┴──────────────────────────┤
│  Footer                              │
└──────────────────────────────────────┘
```

**Props:**
```typescript
interface SessionLayoutProps {
  committeeId: string
  children: React.ReactNode
}
```

### `CommitteeSidebar`

**Propósito:** Sidebar de navegación específica del comité.

**Ítems por rol:** (cambian según permisos del usuario)

### `ProjectorLayout`

**Propósito:** Layout de pantalla completa para proyector. Sin navbar ni sidebar.

---

## 2. Componentes de Timer

### `Timer`

**Propósito:** Cronómetro simple (cuenta regresiva).

**Props:**
```typescript
interface TimerProps {
  seconds: number
  running: boolean
  size?: 'sm' | 'md' | 'lg'
  variant?: 'default' | 'urgent' | 'expired'
  onComplete?: () => void
}
```

**Estados visuales:**
- Normal: color institucional
- Urgente (< 30s o < 20%): rojo/ámbar
- Expirado (0): rojo intenso + animación

### `MacroTimer`

**Propósito:** Timer grande para duración total de un caucus o sesión.

**Props:**
```typescript
interface MacroTimerProps {
  totalSeconds: number
  remainingSeconds: number
  label: string
  running: boolean
  onPause?: () => void
  onResume?: () => void
}
```

### `MicroTimer`

**Propósito:** Timer pequeño para tiempo por orador individual.

**Props:**
```typescript
interface MicroTimerProps {
  seconds: number
  maxSeconds: number
  running: boolean
  speakerName?: string
}
```

---

## 3. Componentes de Lista de Oradores

### `SpeakersQueue`

**Propósito:** Lista ordenada de oradores.

```typescript
interface SpeakersQueueProps {
  speakers: SpeakerEntry[]
  currentIndex: number
  onAdd: (delegateId: string) => void
  onRemove: (speakerId: string) => void
  onAdvance: () => void
  canManage: boolean
}
```

### `SpeakerCard`

**Propósito:** Card individual para un orador en la lista.

```typescript
interface SpeakerCardProps {
  delegate: DelegateInfo
  position: number
  isCurrent: boolean
  isMine: boolean
  onRemove?: () => void
}
```

### `AddSpeakerButton`

**Propósito:** Botón para delegado solicitar entrada a la lista de oradores.

### `RequestSpeakerButton`

**Propósito:** Botón para delegado solicitar palabra (levanta la mano virtualmente).

---

## 4. Componentes de Mociones

### `MotionCard`

**Propósito:** Card que muestra una moción propuesta.

```typescript
interface MotionCardProps {
  motion: Motion
  onApprove: () => void
  onReject: () => void
  canManage: boolean
}
```

### `MotionProposalForm`

**Propósito:** Formulario para que un delegado proponga una moción.

```typescript
interface MotionProposalFormProps {
  categories: MotionCategory[]
  onPropose: (motion: MotionDraft) => void
}
```

### `ActiveMotionBanner`

**Propósito:** Banner que muestra la moción activa actual (visible para todos).

### `MotionVoteModal`

**Propósito:** Modal para votar a favor/en contra de una moción.

```typescript
interface MotionVoteModalProps {
  motion: Motion
  onVote: (vote: 'for' | 'against') => void
  onClose: () => void
}
```

---

## 5. Componentes de Votación

### `VotingPanel`

**Propósito:** Panel completo de control de votación (vista Director).

```typescript
interface VotingPanelProps {
  session: VotingSession
  delegates: DelegateInfo[]
  onStart: (type: VotingType) => void
  onClose: () => void
}
```

### `VoteButton`

**Propósito:** Botón de votación para delegados (For/Against/Abstain).

### `VotingResults`

**Propósito:** Visualización de resultados de votación.

```typescript
interface VotingResultsProps {
  for: number
  against: number
  abstain: number
  total: number
  result: 'approved' | 'rejected' | 'tie'
  type: VotingType
}
```

### `VotingHistory`

**Propósito:** Historial de votaciones anteriores del comité.

---

## 6. Componentes de Delegados

### `DelegateList`

**Propósito:** Lista completa de delegados de un comité con su estado.

```typescript
interface DelegateListProps {
  delegates: DelegateInfo[]
  rollCall: Record<string, RollCallStatus>
  onStatusChange?: (delegateId: string, status: RollCallStatus) => void
  canManage?: boolean
}
```

### `DelegateCard`

**Propósito:** Card individual de delegado.

```typescript
interface DelegateCardProps {
  delegate: DelegateInfo
  status: RollCallStatus
  isSpeaking: boolean
  showScore?: boolean
  score?: number
}
```

### `AttendancePanel`

**Propósito:** Panel de pase de lista (roll call).

```typescript
interface AttendancePanelProps {
  delegates: DelegateInfo[]
  onStatusChange: (delegateId: string, status: 'present' | 'voting' | 'absent') => void
  onComplete: () => void
}
```

---

## 7. Componentes de Proyector

### `ProjectorView`

**Propósito:** Vista principal del proyector.

```typescript
interface ProjectorViewProps {
  committeeId: string
}
```

### `ProjectorTimer`

**Propósito:** Timer gigante para proyector.

### `ProjectorSpeaker`

**Propósito:** Muestra el orador actual en el proyector.

### `ProjectorMotion`

**Propósito:** Muestra la moción activa en el proyector.

### `ProjectorQueue`

**Propósito:** Muestra la lista de oradores en el proyector.

---

## 8. Componentes de Documentos

### `DocumentList`

**Propósito:** Lista de documentos del comité.

```typescript
interface DocumentListProps {
  documents: Document[]
  onSelect: (doc: Document) => void
  canCreate: boolean
  onCreate: () => void
}
```

### `DocumentEditor`

**Propósito:** Editor de documentos (working papers, draft resolutions).

```typescript
interface DocumentEditorProps {
  document: Document
  onSave: (content: string) => void
  readOnly: boolean
}
```

### `DocumentViewer`

**Propósito:** Visor de documentos (solo lectura).

### `VersionHistory`

**Propósito:** Historial de versiones de un documento.

---

## 9. Componentes de Certificados

### `CertificateGenerator`

**Propósito:** Formulario para emitir un certificado.

```typescript
interface CertificateGeneratorProps {
  delegate: DelegateInfo
  onGenerate: (data: CertificateData) => void
}
```

### `CertificateList`

**Propósito:** Lista de certificados emitidos.

### `CertificatePreview`

**Propósito:** Vista previa del certificado antes de emitir.

---

## 10. Componentes de Administración

### `CommitteeSetupForm`

**Propósito:** Formulario de configuración inicial del comité.

```typescript
interface CommitteeSetupFormProps {
  initial?: CommitteeConfig
  onSave: (config: CommitteeConfig) => void
}
```

### `DelegateManagement`

**Propósito:** Panel de gestión de delegados (agregar/remover/asignar).

```typescript
interface DelegateManagementProps {
  delegates: DelegateInfo[]
  availableUsers: UserProfile[]
  onAssign: (userId: string, country: string) => void
  onRemove: (delegateId: string) => void
}
```

### `AuditLogViewer`

**Propósito:** Visor de logs de auditoría.

```typescript
interface AuditLogViewerProps {
  logs: AuditEntry[]
  filter?: AuditFilter
}
```

### `SessionControls`

**Propósito:** Controles para suspender/reanudar/cerrar sesión.

```typescript
interface SessionControlsProps {
  phase: SessionPhase
  onSuspend: () => void
  onResume: () => void
  onClose: () => void
}
```

---

## 11. Componentes de Secretaría

### `SecretariatDashboard`

**Propósito:** Dashboard global de secretaría.

```typescript
interface SecretariatDashboardProps {
  committees: CommitteeSummary[]
}
```

### `CommitteeOverviewGrid`

**Propósito:** Grid con resumen de cada comité.

### `GlobalAttendancePanel`

**Propósito:** Panel de asistencia global de todos los comités.

### `GlobalCertificateEmitter`

**Propósito:** Emitir certificados para múltiples delegados a la vez.

---

## 12. Componentes Compartidos (UI)

### `StatusBadge`

**Propósito:** Badge de estado genérico.

```typescript
interface StatusBadgeProps {
  status: 'active' | 'completed' | 'pending' | 'approved' | 'rejected'
  size?: 'sm' | 'md'
}
```

### `SessionPhaseIndicator`

**Propósito:** Indicador visual de la fase actual de la sesión.

### `CommitteeCard`

**Propósito:** Card de resumen de un comité (usado en dashboard).

### `TimerDisplay`

**Propósito:** Display genérico de tiempo en formato MM:SS.

---

## Estructura de Archivos

```
components/
  session/
    layout/
      SessionLayout.tsx
      CommitteeSidebar.tsx
      ProjectorLayout.tsx

    timer/
      Timer.tsx
      MacroTimer.tsx
      MicroTimer.tsx
      TimerDisplay.tsx

    speakers/
      SpeakersQueue.tsx
      SpeakerCard.tsx
      AddSpeakerButton.tsx
      RequestSpeakerButton.tsx

    motions/
      MotionCard.tsx
      MotionProposalForm.tsx
      ActiveMotionBanner.tsx
      MotionVoteModal.tsx

    voting/
      VotingPanel.tsx
      VoteButton.tsx
      VotingResults.tsx
      VotingHistory.tsx

    delegates/
      DelegateList.tsx
      DelegateCard.tsx
      AttendancePanel.tsx

    projector/
      ProjectorView.tsx
      ProjectorTimer.tsx
      ProjectorSpeaker.tsx
      ProjectorMotion.tsx
      ProjectorQueue.tsx

    documents/
      DocumentList.tsx
      DocumentEditor.tsx
      DocumentViewer.tsx
      VersionHistory.tsx

    certificates/
      CertificateGenerator.tsx
      CertificateList.tsx
      CertificatePreview.tsx

    admin/
      CommitteeSetupForm.tsx
      DelegateManagement.tsx
      AuditLogViewer.tsx
      SessionControls.tsx

    secretariat/
      SecretariatDashboard.tsx
      CommitteeOverviewGrid.tsx
      GlobalAttendancePanel.tsx
      GlobalCertificateEmitter.tsx

    shared/
      StatusBadge.tsx
      SessionPhaseIndicator.tsx
      CommitteeCard.tsx
```
