# SoPeD Session — Arquitectura del Sistema

## 1. Visión General

**SoPeD Session** es una plataforma de simulación de Modelo de Naciones Unidas (MUN) en tiempo real, diseñada para reemplazar herramientas como MUN Command. Permite gestionar conferencias, comités, delegados, votaciones, documentos y certificados desde un solo lugar.

### Principios de diseño

- **Tiempo real primero** — todas las operaciones críticas (lista de oradores, votaciones, mociones) usan WebSockets/Supabase Realtime
- **Offline-resilient** — el estado local (Zustand) persiste aunque la conexión se pierda temporalmente
- **Multi-comité** — un servidor puede manejar N comités simultáneos, cada uno con su propio estado
- **Roles estrictos** — Director, Secretaría, Delegado, Observador; cada uno con una vista y permisos diferentes
- **Auditable** — cada acción queda registrada en `audit_logs` con timestamp, actor y detalle

---

## 2. Casos de Uso

### 2.1. Director de Comité
| CU | Descripción |
|----|-------------|
| CU-01 | Iniciar sesión y seleccionar comité asignado |
| CU-02 | Configurar comité (nombre, tópico, tipo) |
| CU-03 | Realizar pase de lista (roll call) |
| CU-04 | Gestionar lista de oradores (GSL) |
| CU-05 | Recibir y votar mociones |
| CU-06 | Iniciar/controlar caucus moderado (MOD) |
| CU-07 | Iniciar/controlar caucus no moderado (UNMOD) |
| CU-08 | Iniciar votación (procedural/sustantiva) |
| CU-09 | Asignar puntajes a delegados |
| CU-10 | Publicar ranking |
| CU-11 | Suspender/reanudar sesión |
| CU-12 | Cerrar sesión |

### 2.2. Delegado
| CU | Descripción |
|----|-------------|
| CU-13 | Ver su comité y delegación asignada |
| CU-14 | Solicitar palabra en GSL |
| CU-15 | Proponer moción |
| CU-16 | Participar en votaciones |
| CU-17 | Ver documentos del comité |
| CU-18 | Ver cronómetros en vivo |
| CU-19 | Ver su puntaje (solo el propio) |

### 2.3. Secretaría
| CU | Descripción |
|----|-------------|
| CU-20 | Gestionar conferencias (crear/editar) |
| CU-21 | Asignar delegados a comités |
| CU-22 | Monitorear todos los comités |
| CU-23 | Emitir certificados |
| CU-24 | Ver panel de asistencia global |

### 2.4. Administrador
| CU | Descripción |
|----|-------------|
| CU-25 | Gestionar usuarios y roles |
| CU-26 | Configurar sistema |
| CU-27 | Ver logs de auditoría |
| CU-28 | Gestionar plantillas de certificados |

### 2.5. Público / Proyector
| CU | Descripción |
|----|-------------|
| CU-29 | Ver proyección en vivo del comité (solo lectura) |
| CU-30 | Ver cronómetros, orador actual, mociones |

---

## 3. Roles

| Rol | Abreviatura | Permisos |
|-----|-------------|----------|
| **Super Admin** | `super_admin` | Todo el sistema |
| **Secretaría General** | `secretariat` | Gestionar conferencias, comités, certificados |
| **Director** | `director` | Controlar un comité (fase, mociones, puntajes) |
| **Co-Director** | `adjunct` | Asistir al director (sin control de puntajes) |
| **Delegado** | `delegate` | Participar en su comité (votar, mociones, hablar) |
| **Observador** | `observer` | Solo lectura |

### Matriz de permisos

| Acción | SAdmin | Sec | Dir | Adj | Del | Obs |
|--------|--------|-----|-----|-----|-----|-----|
| Gestionar usuarios | ✓ | - | - | - | - | - |
| Crear conferencia | ✓ | ✓ | - | - | - | - |
| Asignar delegados | ✓ | ✓ | - | - | - | - |
| Configurar comité | ✓ | ✓ | ✓ | - | - | - |
| Pase de lista | - | - | ✓ | ✓ | - | - |
| Gestionar GSL | - | - | ✓ | ✓ | - | - |
| Aprobar moción | - | - | ✓ | ✓ | - | - |
| Votar procedural | - | - | ✓ | ✓ | ✓ | - |
| Votar sustantivo | - | - | ✓ | ✓ | ✓ | - |
| Asignar puntaje | - | - | ✓ | - | - | - |
| Publicar ranking | - | - | ✓ | - | - | - |
| Suspender sesión | ✓ | ✓ | ✓ | ✓ | - | - |
| Ver scoring ajeno | - | - | ✓ | ✓ | - | - |
| Ver scoring propio | - | - | ✓ | ✓ | ✓ | - |
| Emitir certificados | ✓ | ✓ | - | - | - | - |
| Ver proyector | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |

---

## 4. Arquitectura Frontend

### 4.1. Estructura de capas

```
pages/ (Next.js App Router)
  └─ components/ (React componentes)
       └─ hooks/ (lógica reutilizable)
            └─ stores/ (Zustand)
                 └─ services/ (API/Supabase)
                      └─ types/ (TypeScript)
```

### 4.2. Patrón de estado

```
Supabase Realtime
      ↓ (suscribirse a cambios)
Zustand Store (estado local optimista)
      ↓ (render)
React Components
      ↓ (acciones del usuario)
Zustand actions → optimista → Supabase mutation
                      ↓ (si falla → rollback)
```

### 4.3. Stores (Zustand)

| Store | Propósito |
|-------|-----------|
| `useCommitteeStore` | Estado del comité activo (fase, delegados, speakers, mociones) |
| `useAuthStore` | Sesión del usuario, token, rol actual |
| `useTimerStore` | Estados de cronómetros (speaker, motion, macro/micro) |
| `useVotingStore` | Sesión de votación activa, resultados parciales |
| `useDocumentStore` | Documentos del comité (borradores, resoluciones) |
| `useUIStore` | Sidebar, modales, preferencias de vista |

### 4.4. Realtime

SoPeD Session usa **Supabase Realtime** para sincronización:

| Canal | Eventos | Suscriptores |
|-------|---------|-------------|
| `committee:{id}` | fase, oradores, moción activa | Todos en el comité |
| `speakers:{id}` | lista de oradores | Director + Delegados |
| `voting:{id}` | votación activa, resultados | Director + Delegados |
| `timer:{id}` | cronómetros | Todos |
| `scores:{id}` | puntajes (solo director) | Director |

---

## 5. Arquitectura Backend

### 5.1. Supabase como Backend

| Componente | Uso |
|------------|-----|
| **PostgreSQL** | Datos persistentes (usuarios, comités, votaciones, documentos) |
| **Supabase Auth** | Autenticación (magic link, Google, email/password) |
| **Supabase Realtime** | WebSockets para sincronización en vivo |
| **Row Level Security (RLS)** | Permisos a nivel de fila |
| **Supabase Storage** | Documentos, archivos, logos de países |
| **Edge Functions** | Generación de certificados, exportación de datos |

### 5.2. Flujo de datos

```
Cliente (Next.js)
  → Zustand (acción optimista)
    → Supabase client (mutación)
      → PostgreSQL (persistencia)
        → Realtime (broadcast a otros clientes)
          → Otros clientes reciben el cambio via Suscripción Realtime
```

### 5.3. API Routes (cuando sea necesario)

| Ruta | Propósito |
|------|-----------|
| `POST /api/session/generate-certificate` | Generar PDF de certificado |
| `POST /api/session/export-attendance` | Exportar asistencia a CSV |
| `POST /api/session/export-ranking` | Exportar ranking a PDF |

---

## 6. Arquitectura Realtime

### 6.1. Modelo de suscripción

```
Cada comité es un canal Realtime:

committee:{committeeId}
├── presence:*        (quién está conectado)
├── phase             (cambio de fase)
├── speakers          (lista de oradores)
├── active_motion     (moción activa)
├── timers            (cronómetros sincronizados)
├── voting:*          (votación activa)
├── documents:*       (documentos compartidos)
└── audit:*           (logs del comité)
```

### 6.2. Optimistic Updates

Todas las mutaciones críticas siguen este patrón:

1. Validar localmente (rol, estado del comité)
2. Actualizar Zustand inmediatamente (optimista)
3. Enviar a Supabase
4. Si Supabase rechaza → revertir cambio en Zustand + mostrar error
5. Si otro cliente envía cambio → Realtime lo recibe → actualiza Zustand

---

## 7. Arquitectura de Base de Datos

Ver `DATABASE_SCHEMA.md` para el detalle completo.

### Diagrama relacional

```
conferences
  └── committees
       ├── committee_delegates
       ├── speakers_list
       ├── motions
       ├── voting_sessions
       │    └── delegate_votes
       ├── caucus_sessions
       ├── attendance
       └── documents
            └── document_versions
```

---

## 8. Modelo Multi-Comité

### 8.1. Estructura de conferencia

```
Conferencia (SoPeD MUN 2026)
  ├── Comité: CSNU (15 delegados)
  │    ├── Sesión 1 (mañana)
  │    ├── Sesión 2 (tarde)
  │    └── ...
  ├── Comité: AGONU (40 delegados)
  │    └── ...
  └── Comité: ECOSOC (30 delegados)
       └── ...
```

### 8.2. Aislamiento

Cada comité es completamente independiente:
- Estado propio (fase, oradores, mociones, votaciones)
- Puntajes independientes
- Director independiente
- Delegados no pueden ver datos de otros comités
- Los cronómetros de un comité no afectan a otros

### 8.3. Vista Secretaría

La Secretaría puede:
- Ver todos los comités en una vista de dashboard
- Monitorear fase actual de cada comité
- Ver asistencia global
- Forzar suspensión de cualquier comité

---

## 9. Sistema de Certificados

Integrado con el módulo existente en `/verificar-certificado`:

1. **Emisión**: Director/Secretaría genera certificado desde el panel
2. **Datos**: nombre, programa, rol, fecha, código único (`SOPED-AAAA-PROGRAMA-NNNNNN`)
3. **Código único**: generado automáticamente, guardado en `certificates`
4. **QR**: el certificado incluye QR que apunta a `/verificar-certificado?code=...`
5. **Verificación**: pública en `/verificar-certificado`

---

## 10. Sistema de Votaciones

### 10.1. Tipos de votación

| Tipo | Descripción |
|------|-------------|
| **Procedural** | Mociones de procedimiento (mayoría simple) |
| **Sustantiva** | Resoluciones (mayoría calificada) |
| **Por aclamación** | Sin oposición |
| **Voto secreto** | Votos no visibles para otros delegados |

### 10.2. Flujo de votación

1. Director inicia votación → estado `voting`
2. Delegados votan (a favor/contra/abstención)
3. Director cierra votación → resultados calculados
4. Resultados mostrados a todos
5. Voto registrado permanentemente en `delegate_votes`

---

## 11. Sistema de Documentos

### 11.1. Tipos de documento

| Tipo | Descripción |
|------|-------------|
| **Borrador** | Draft de resolución en progreso |
| **Resolución** | Documento final aprobado |
| **Working Paper** | Documento de trabajo |
| **Posición** | Declaración de posición del país |
| **Guía** | Guía de comité (background guide) |

### 11.2. Control de versiones

Cada documento tiene versiones:
- Los delegados proponen cambios
- El director aprueba versiones
- Versionado automático (v1, v2, v3...)
- Historial completo de cambios

---

## 12. Sistema de Auditoría

### 12.1. Eventos auditables

| Evento | Detalle |
|--------|---------|
| Login/logout | usuario, timestamp, IP |
| Cambio de fase | comité, fase anterior → nueva, actor |
| Moción propuesta | tipo, proponente, timestamp |
| Votación | tipo, resultados, timestamp |
| Puntaje asignado | delegado, puntos, razón, actor |
| Certificado emitido | delegado, código, actor |
| Documento creado/editado | documento, versión, actor |
| Delegado asignado | comité, país, actor |

### 12.2. Almacenamiento

Tabla `audit_logs` con:
- `id`, `committee_id`, `actor_id`, `action`, `details` (JSONB), `created_at`
- Política de retención: 2 años
- Inmutable: inserts-only, sin updates ni deletes

---

## 13. WebSockets

### 13.1. Supabase Realtime vs WebSocket nativo

| Caso | Solución |
|------|----------|
| Cambios en DB (fase, mociones, votos) | Supabase Realtime (Broadcast) |
| Presencia (quién está conectado) | Supabase Realtime (Presence) |
| Cronómetros sincronizados | Supabase Realtime (Broadcast, ~100ms) |
| Chat de comité | Supabase Realtime (Broadcast) |

### 13.2. Canales

```typescript
// Cada comité tiene su propio canal Realtime
const channel = supabase.channel(`committee:${committeeId}`)

// Suscripciones
channel.on('broadcast', { event: 'speakers' }, handleSpeakers)
channel.on('broadcast', { event: 'timer' }, handleTimer)
channel.on('broadcast', { event: 'motion' }, handleMotion)
channel.on('broadcast', { event: 'voting' }, handleVoting)
channel.on('presence', { event: 'sync' }, handlePresence)
```

---

## 14. Escalabilidad

### 14.1. Consideraciones

| Aspecto | Estrategia |
|---------|-----------|
| **Concurrencia** | Supabase Realtime maneja hasta 500 conexiones simultáneas por proyecto |
| **Carga DB** | Indexación en `committee_id`, `status`, `created_at` |
| **Caché** | Zustand como caché cliente. Evita re-fetch innecesario |
| **Estática vs Dinámica** | Páginas públicas estáticas (SSG). Páginas de sesión dinámicas (no cacheables) |
| **Chunks JS** | Lazy-load de componentes pesados (editor de documentos, generación de PDF) |

### 14.2. Límites esperados

| Escenario | Usuarios concurrentes | Comités simultáneos |
|-----------|----------------------|---------------------|
| Conferencia pequeña | 50 | 3 |
| Conferencia mediana | 200 | 10 |
| Conferencia grande | 500 | 20 |

---

## 15. Seguridad

### 15.1. Row Level Security (RLS)

Políticas en Supabase:

```sql
-- committees: solo miembros del comité pueden leer
CREATE POLICY "committee_access" ON committees
  FOR SELECT USING (
    committee_id IN (
      SELECT committee_id FROM committee_delegates
      WHERE user_id = auth.uid()
    )
    OR has_role(auth.uid(), 'secretariat')
    OR has_role(auth.uid(), 'super_admin')
  );

-- scores: solo directores pueden leer
CREATE POLICY "scores_director_only" ON scores
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM committee_delegates
      WHERE user_id = auth.uid()
        AND committee_id = scores.committee_id
        AND role IN ('director', 'adjunct', 'secretariat', 'super_admin')
    )
  );

-- voting_sessions: todos ven, solo director crea cierra
CREATE POLICY "voting_select" ON voting_sessions
  FOR SELECT USING (
    committee_id IN (SELECT committee_id FROM committee_delegates WHERE user_id = auth.uid())
  );

CREATE POLICY "voting_insert" ON voting_sessions
  FOR INSERT WITH CHECK (
    has_role_on_committee(auth.uid(), committee_id, 'director')
    OR has_role(auth.uid(), 'secretariat')
  );
```

### 15.2. Validación del lado servidor

Toda mutación crítica debe validarse del lado servidor:
- Solo el director puede cambiar fases, asignar puntajes, cerrar votaciones
- Un delegado no puede votar dos veces en la misma votación
- Un delegado no puede estar en la lista de oradores si no está presente

---

## 16. Roadmap

### MVP (Semana 1-3)
- Autenticación con Supabase Auth
- Creación de comité (config + delegados)
- Pase de lista (roll call)
- Lista de oradores (GSL)
- Timer básico
- Mociones (MOD, UNMOD)
- 3 comités precargados

### V1 (Semana 4-6)
- Votaciones (procedural, sustantiva, secreta)
- Sistema de puntajes y ranking
- Vista de proyector
- Sesiones múltiples por comité
- Historial de mociones

### V2 (Semana 7-9)
- Documentos colaborativos (working papers, draft resolutions)
- Sistema de certificados + QR
- Panel de Secretaría
- Exportación de datos (asistencia, ranking)
- Chat del comité

### V3 (Semana 10-12)
- Múltiples conferencias simultáneas
- Personalización de comités
- API pública para integraciones
- Dashboard global (en vivo)
- Audit logs completos
- Generación de PDF (certificados, resoluciones)
