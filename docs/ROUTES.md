# SoPeD Session — Sistema de Rutas

## Estructura de rutas

```
/session                          ← Dashboard de sesiones activas
/session/setup                    ← Configuración de comité
/session/gsl                      ← Lista general de oradores
/session/motions                  ← Mociones
/session/mod                      ← Caucus moderado
/session/unmod                    ← Caucus no moderado
/session/single-speaker           ← Orador único
/session/voting                   ← Votaciones
/session/documents                ← Documentos
/session/certificates             ← Certificados
/session/admin                    ← Administración del comité
/session/secretariat              ← Panel de secretaría

/view/[committee]/projector       ← Vista proyector (solo lectura)
/view/[committee]/delegate        ← Vista delegado
```

---

## `/` — Página principal

**Ruta:** `/`

**Propósito:** Landing page de SoPeD Session (dentro de la web institucional).

**Comportamiento:**
- Si el usuario no ha iniciado sesión → mostrar intro + CTA para acceder
- Si el usuario inició sesión → redirigir a `/session`

**Componentes:**
- `Layout`
- Hero section
- Información del producto

---

## `/session` — Dashboard de Sesiones

**Ruta:** `/session`

**Propósito:** Panel principal donde el usuario ve las sesiones activas de sus comités.

**Vistas por rol:**

| Rol | Contenido |
|-----|-----------|
| **Director** | Lista de comités que dirige. Acceso a control total |
| **Delegado** | Comité al que pertenece. Acceso a su vista de delegado |
| **Secretaría** | Todos los comités de la conferencia activa |
| **Super Admin** | Todas las conferencias y comités |

**Componentes:**
- `SessionLayout` (sidebar + main content)
- `CommitteeCard` (cada comité activo)
- `SessionStatusBadge`
- `ActiveTimersSummary`

---

## `/session/setup` — Configuración

**Ruta:** `/session/setup`

**Propósito:** Configurar o editar un comité antes de iniciar la sesión.

**Campos:**
- Nombre del comité
- Tópico(s)
- Tipo (CSNU, AGONU, ECOSOC, UNHRC, Crisis, General)
- Tiempo de orador (default 90s)
- Delegados (asignados desde secretaría)

**Permisos:** Solo Director, Secretaría, Super Admin

**Componentes:**
- `CommitteeSetupForm`
- `DelegateAssignmentList`
- `TopicSelector`

---

## `/session/gsl` — Lista General de Oradores

**Ruta:** `/session/gsl`

**Propósito:** Gestionar la lista general de oradores (General Speakers List).

**Acciones:**
- Agregar delegado a la lista
- Remover delegado de la lista
- Avanzar al siguiente orador
- Timer por orador

**Vistas:**

| Rol | Puede |
|-----|-------|
| Director | Agregar/remover cualquier delegado, avanzar, controlar timer |
| Delegado | Solicitar entrada a la lista, ver su posición |
| Proyector | Solo lectura |

**Componentes:**
- `SpeakersQueue` (lista ordenada)
- `SpeakerTimer` (cronómetro del orador actual)
- `AddSpeakerButton`
- `RequestSpeakerButton` (delegado)

---

## `/session/motions` — Mociones

**Ruta:** `/session/motions`

**Propósito:** Proponer y votar mociones.

**Categorías de mociones:**
- **Debate:** Moderated Caucus, Unmoderated Caucus, Open Debate
- **Resolución:** Draft Submission, Resolution Presentation, Voting Procedure
- **Procedural:** Suspend Session, Close Debate, Adjourn

**Flujo:**
1. Delegado propone moción
2. Director recibe la moción
3. Director decide: aceptar (votación) o rechazar
4. Si acepta → votación procedural (mayoría simple)
5. Si pasa → moción activa (inicia caucus/timer)

**Componentes:**
- `MotionCard` (cada moción propuesta)
- `MotionProposalForm`
- `MotionVoteModal`
- `ActiveMotionBanner`

---

## `/session/mod` — Caucus Moderado

**Ruta:** `/session/mod`

**Propósito:** Gestionar un caucus moderado activo.

**Parámetros:**
- Tópico específico
- Duración total
- Tiempo por orador

**Durante el caucus:**
- Lista de oradores específica del caucus
- Timer total + timer por orador
- Los delegados levantan la mano para hablar

**Componentes:**
- `MacroTimer` (tiempo total del caucus)
- `MicroTimer` (tiempo por orador)
- `ModeratedCaucusPanel`

---

## `/session/unmod` — Caucus No Moderado

**Ruta:** `/session/unmod`

**Propósito:** Gestionar un caucus no moderado activo.

**Parámetros:**
- Duración total

**Durante el caucus:**
- Solo timer general
- Los delegados se levantan y negocian libremente
- Sin lista de oradores

**Componentes:**
- `MacroTimer`
- `UnmoderatedCaucusPanel`

---

## `/session/single-speaker` — Orador Único

**Ruta:** `/session/single-speaker`

**Propósito:** Asignar la palabra a un delegado específico por tiempo determinado.

**Componentes:**
- `SingleSpeakerTimer`
- `DelegateSelector`

---

## `/session/voting` — Votaciones

**Ruta:** `/session/voting`

**Propósito:** Iniciar y gestionar votaciones.

**Tipos de votación:**
- **Procedural:** Mayoría simple. Visible para todos
- **Sustantiva:** Mayoría calificada (2/3). Visible para todos
- **Secreta:** Votos individuales no visibles. Solo resultado final
- **Por aclamación:** Sin oposición. Automático

**Flujo:**
1. Director inicia votación (selecciona tipo)
2. Todos los delegados ven la votación activa
3. Delegados votan (for/against/abstain)
4. Director cierra votación
5. Resultados calculados y mostrados

**Componentes:**
- `VotingPanel` (panel completo de votación)
- `VoteButton` (for/against/abstain)
- `VotingResults` (resultados en vivo o finales)
- `VotingHistory` (historial de votaciones)

---

## `/session/documents` — Documentos

**Ruta:** `/session/documents`

**Propósito:** Gestionar documentos del comité (working papers, draft resolutions, resoluciones).

**Acciones:**
- Crear documento
- Editar documento
- Versionado automático
- Aprobar/rechazar documento (Director)
- Ver historial de versiones

**Componentes:**
- `DocumentList`
- `DocumentEditor`
- `DocumentViewer`
- `VersionHistory`

---

## `/session/certificates` — Certificados

**Ruta:** `/session/certificates`

**Propósito:** Emitir y gestionar certificados para los participantes.

**Acciones:**
- Emitir certificado individual
- Emitir certificados en lote
- Revocar certificado
- Ver certificados emitidos

**Formato del código:** `SOPED-{AAAA}-{COMITÉ}-{NNNNNN}`

**Componentes:**
- `CertificateGenerator`
- `CertificateList`
- `CertificatePreview`

---

## `/session/admin` — Administración del Comité

**Ruta:** `/session/admin`

**Propósito:** Panel de administración del comité.

**Acciones:**
- Gestionar delegados (agregar/remover)
- Cambiar roles
- Ver logs de auditoría
- Configurar parámetros del comité
- Suspender/reanudar/cerrar sesión

**Componentes:**
- `CommitteeAdminPanel`
- `DelegateManagement`
- `AuditLogViewer`
- `SessionControls`

---

## `/session/secretariat` — Panel de Secretaría

**Ruta:** `/session/secretariat`

**Propósito:** Vista global de todos los comités.

**Vista general:**
- Todos los comités activos
- Fase actual de cada comité
- Asistencia global
- Sesiones activas
- Emitir certificados globales

**Componentes:**
- `SecretariatDashboard`
- `GlobalAttendancePanel`
- `CommitteeOverviewGrid`
- `GlobalCertificateEmitter`

---

## `/view/[committee]/projector` — Proyector

**Ruta:** `/view/[committee]/projector`

**Propósito:** Vista de proyector para mostrar en pantalla grande durante la sesión.

**Modo solo lectura.** No hay interacción.

**Muestra:**
- Nombre del comité
- Fase actual
- Orador actual
- Lista de oradores
- Timer activo
- Moción activa

**Componentes:**
- `ProjectorView`
- `ProjectorTimer`
- `ProjectorSpeaker`
- `ProjectorMotion`

---

## `/view/[committee]/delegate` — Vista Delegado

**Ruta:** `/view/[committee]/delegate`

**Propósito:** Vista principal del delegado durante la sesión.

**Muestra:**
- Información de su delegación
- Fase actual del comité
- Botón para solicitar palabra
- Botón para proponer moción
- Timer activo
- Resultados de votación
- Su puntaje actual

**Componentes:**
- `DelegateView`
- `DelegateInfoCard`
- `RequestSpeakerButton`
- `ProposeMotionButton`
- `DelegateTimer`
