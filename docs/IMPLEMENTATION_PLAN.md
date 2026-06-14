# SoPeD Session — Plan de Implementación

## Hito 0: Setup del proyecto (Día 1)

### Tareas
- [ ] Verificar que el proyecto base compila (`npm run build`)
- [ ] Crear estructura de directorios para SoPeD Session
- [ ] Configurar Supabase: tablas del MVP (ver `DATABASE_SCHEMA.md`)
- [ ] Configurar variables de entorno en Vercel
- [ ] Migrar de `output: 'export'` a `output: 'standalone'` (necesario para rutas API/dinámicas)

### Dependencias
- Proyecto base funcionando
- Acceso a Supabase project
- Acceso a Vercel project

### Archivos a crear
```
src/session/
  types/
  stores/
  hooks/
  services/
  components/
  constants/
```

---

## Hito 1: MVP (Días 2-10)

### Objetivo
Tener un comité funcional donde el Director puede pasar lista, gestionar oradores, y los delegados pueden ver el estado en vivo.

### Día 2-3: Tipos y Stores

**Tipos (`src/session/types/session.types.ts`)**

Migrar y consolidar los tipos existentes de `src/mun-v2/types/mun.types.ts`:
- `CommitteeState` → versión completa con nuevos campos
- `Delegate`, `Motion`, `SpeakerEntry`, `VotingSession`, etc.
- Tipos de `SessionPhase` actualizados

**Store (`src/session/stores/useCommitteeStore.ts`)**

Basada en la existente de `src/mun-v2/store/useCommitteeStore.ts` pero:
- Conectada a Supabase
- optimistic updates + rollback
- Suscripciones Realtime

### Día 3-4: Layout base + Sidebar

- `SessionLayout` con sidebar y navbar
- Navegación por fases (Setup → RollCall → Session → Closed)
- Integración con el diseño institucional de SoPeD
- Sidebar con secciones contextuales según el rol

### Día 4-5: Setup del comité

- Formulario de configuración (nombre, tópico, tipo)
- Asignación de delegados (vista del director)
- Persistencia en Supabase

### Día 5-6: Pase de lista (Roll Call)

- `AttendancePanel` con lista de delegados
- Estados: Presente, Votando, Ausente
- Quórum (simple y compuesto)
- Completar roll call → transición a fase `session`
- Sincronización Realtime

### Día 6-8: Lista de Oradores (GSL)

- `SpeakersQueue` con add/remove/advance
- `SpeakerTimer` (useSpeakerTimer existente)
- Delegados pueden solicitar palabra
- Timer visible para todos
- Sincronización Realtime

### Día 8-10: Mociones básicas

- `MotionCard` + `MotionProposalForm`
- Categorías: moderated, unmoderated, open debate
- Director puede aprobar/rechazar
- Si se aprueba → inicia caucus con timer
- `ActiveMotionBanner` para todos

### MVP entregable

```
✓ Comité configurable
✓ Pase de lista con quórum
✓ Lista de oradores básica
✓ Timer de orador
✓ Mociones de debate (MOD, UNMOD)
✓ Vista de proyector (solo lectura)
✓ Sincronización Realtime
```

### Archivos del MVP

```
src/session/
  types/
    session.types.ts
    index.ts

  stores/
    useCommitteeStore.ts
    useAuthStore.ts

  hooks/
    useMunSession.ts        (migrar de mun-v2)
    useSpeakerTimer.ts      (migrar de mun-v2)
    useMotionTimer.ts       (migrar de mun-v2)

  services/
    committeeService.ts     (nuevo, con Supabase)
    realtimeService.ts      (nuevo)

  components/
    layout/
      SessionLayout.tsx
      CommitteeSidebar.tsx

    speakers/
      SpeakersQueue.tsx
      SpeakerCard.tsx
      SpeakerTimer.tsx

    motions/
      MotionCard.tsx
      MotionProposalForm.tsx
      ActiveMotionBanner.tsx

    delegates/
      AttendancePanel.tsx
      DelegateList.tsx

    setup/
      CommitteeSetupForm.tsx

    projector/
      ProjectorView.tsx

  constants/
    motion.constants.ts     (migrar de mun-v2)
    countries.constants.ts  (migrar de mun-v2)
    index.ts

app/session/
  page.tsx                  (dashboard)
  layout.tsx                (SessionLayout wrapper)
  setup/page.tsx
  gsl/page.tsx
  motions/page.tsx

app/view/[committee]/
  projector/page.tsx
```

---

## Hito 2: V1 (Días 11-18)

### Día 11-12: Votaciones completas

- `VotingPanel` para el Director
- `VoteButton` para delegados
- Tipos: procedural, substantive, secret, acclamation
- Cálculo de resultados
- `VotingHistory`

### Día 12-14: Puntajes y Ranking

- `Scores` manager (solo Director)
- Razones de puntaje visibles en el log
- `RankingEntry` calculado automáticamente
- Publicación de ranking (Director)
- Delegados ven solo su propio puntaje

### Día 14-15: Caucus Moderado

- Flujo completo: moción → aprobación → timer total + timer por orador
- Lista de oradores específica del caucus
- `MacroTimer` + `MicroTimer`

### Día 15-16: Caucus No Moderado

- Solo timer total
- Sin lista de oradores
- Delegados negocian libremente

### Día 16-17: Múltiples sesiones por comité

- Una conferencia tiene múltiples sesiones
- Cada sesión tiene su propio estado
- Historial de sesiones anteriores

### Día 17-18: Vista de proyector completa

- Timer gigante
- Orador actual destacado
- Lista de oradores completa
- Moción activa
- Fase actual

### V1 entregable

```
✓ Votaciones (4 tipos)
✓ Sistema de puntajes y ranking
✓ Caucus moderado completo
✓ Caucus no moderado
✓ Múltiples sesiones
✓ Proyector completo
```

---

## Hito 3: V2 (Días 19-25)

### Día 19-20: Documentos

- `DocumentList` + `DocumentEditor`
- Working papers y draft resolutions
- Versionado automático
- Aprobación por el Director
- Modo lectura/escritura según rol

### Día 20-22: Certificados

- `CertificateGenerator` integrado con `data/certificates.ts`
- Código único auto-generado
- Emisión individual y por lote
- QR en certificados
- Vista previa antes de emitir

### Día 22-23: Panel de Secretaría

- Dashboard global de todos los comités
- Asistencia global
- Monitoreo en vivo
- Emisión global de certificados
- Gestión de conferencias

### Día 23-24: Exportación de datos

- Exportar asistencia a CSV
- Exportar ranking a PDF
- Exportar lista de delegados

### Día 24-25: Chat del comité

- Canal de chat por comité (Realtime)
- Mensajes de texto
- Solo miembros del comité

### V2 entregable

```
✓ Documentos colaborativos con versionado
✓ Certificados con QR
✓ Panel de Secretaría
✓ Exportación de datos
✓ Chat del comité
```

---

## Hito 4: V3 (Días 26-32)

### Día 26-27: Múltiples conferencias

- Una instalación puede tener N conferencias simultáneas
- Aislamiento completo entre conferencias
- Delegados pueden estar en múltiples conferencias
- Switch de conferencia activa

### Día 27-28: Personalización de comités

- Tipos de comité personalizables
- Países personalizados
- Tiempos configurables
- Template de comités

### Día 28-29: Audit Logs completos

- Logging de todas las acciones
- Panel de auditoría
- Filtros por comité, fecha, actor
- Exportación de audit logs

### Día 29-30: API Pública

- API REST para consultar comités
- API para verificar certificados
- Documentación de la API

### Día 30-31: Dashboard global en vivo

- Dashboard para evento en vivo
- Estadísticas de participación
- Tiempos de sesión
- Gráficos de votación

### Día 31-32: Generación de PDF

- Certificados en PDF
- Resoluciones aprobadas en PDF
- Listas de delegados en PDF

### V3 entregable

```
✓ Múltiples conferencias simultáneas
✓ Comités personalizables
✓ Audit logs completos
✓ API pública
✓ Dashboard global en vivo
✓ Generación de PDF
```

---

## Resumen de tiempos

| Hito | Días | Desde | Dependencias |
|------|------|-------|-------------|
| Setup | 1 | Día 1 | Proyecto base |
| MVP | 9 | Día 2-10 | Setup |
| V1 | 8 | Día 11-18 | MVP |
| V2 | 7 | Día 19-25 | V1 |
| V3 | 7 | Día 26-32 | V2 |

**Total estimado: 32 días hábiles (~6 semanas)**

---

## Verificación de compilación

Antes de cada commit/hito:

```bash
rm -rf .next
npm run build
npm run lint
```

**Prohibido** dar por terminado si:
- `next build` falla
- `npm run lint` falla
- Aparece `Cannot find module`
- Hay hydration errors
- Hay runtime errors
- Hay `Cannot find module './683.js'` (chunks corruptos)
