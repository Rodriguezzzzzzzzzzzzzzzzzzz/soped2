# Configuración de correos de autenticación en Firebase Console

## Acceso

1. Ir a [Firebase Console](https://console.firebase.google.com/)
2. Seleccionar proyecto **soped-mun-platform**
3. Ir a **Authentication** → **Templates**

---

## 1. Verificación de correo electrónico

### Remitente
| Campo | Valor |
|---|---|
| **Remitente** | `Equipo SoPeD` |
| **Responder a** | `presidencia@soped.pe` |

### Asunto
```
Verifica tu correo electrónico – SoPeD
```

### Cuerpo (HTML)
Copiar el contenido de `lib/email/templates/verification.html`

---

## 2. Restablecimiento de contraseña

### Remitente
| Campo | Valor |
|---|---|
| **Remitente** | `Equipo SoPeD` |
| **Responder a** | `presidencia@soped.pe` |

### Asunto
```
Restablece tu contraseña – SoPeD
```

### Cuerpo (HTML)
Copiar el contenido de `lib/email/templates/password-reset.html`

---

## 3. Cambio de correo electrónico

### Remitente
| Campo | Valor |
|---|---|
| **Remitente** | `Equipo SoPeD` |
| **Responder a** | `presidencia@soped.pe` |

### Asunto
```
Confirmación de cambio de correo – SoPeD
```

### Cuerpo (HTML)
Copiar el contenido de `lib/email/templates/email-change.html`

---

## 4. Configurar acción por defecto (opcional)

En **Authentication** → **Settings** → **Authorized domains**:

| Dominio | Descripción |
|---|---|
| `soped.pe` | Dominio principal de la plataforma |

---

## Referencia de variables disponibles en plantillas

| Variable | Descripción |
|---|---|
| `{{action_url}}` | Enlace de acción (verificación / restablecimiento) |
| `{{display_name}}` | Nombre del usuario (si se configuró) |
| `{{email}}` | Correo electrónico del usuario |
| `{{new_email}}` | Nuevo correo (solo en cambio de email) |

---

## Limitaciones conocidas

1. **Dirección del remitente**: Firebase Auth siempre envía desde
   `noreply@soped-mun-platform.firebaseapp.com` en el plan Spark (gratuito).
   El **nombre** del remitente es personalizable, pero la **dirección** no.

2. **Personalización de estilo**: Firebase sanitiza el HTML de las plantillas.
   Algunos estilos CSS avanzados pueden ser modificados o eliminados.
   Las plantillas incluidas en `lib/email/templates/` usan estilos inline
   y tablas para máxima compatibilidad.

---

## Cómo cambiar la dirección del remitente (Firebase Blaze - pago)

Para que los correos se envíen desde `noreply@soped.pe` en lugar de
`noreply@soped-mun-platform.firebaseapp.com`, se requiere:

1. **Plan Blaze** (pago por uso) en Firebase
2. **Verificar el dominio** `soped.pe` en Firebase Console
3. **Configurar registros SPF/DKIM** en el DNS de `soped.pe`
4. **Configurar la dirección personalizada** en
   Firebase Console → Authentication → Templates → "Custom email domain"

### Pasos técnicos

```bash
# 1. Agregar registro SPF en el DNS de soped.pe
Tipo: TXT
Nombre: @
Valor: v=spf1 include:_spf.firebaseemail.com ~all

# 2. Firebase genera registros DKIM automáticos al verificar el dominio

# 3. Configurar en Firebase Console:
#    Authentication → Templates → "Configure email sender"
#    → Agregar dominio personalizado: soped.pe
#    → Seguir las instrucciones de verificación
```

---

## Migración a sistema de correo transaccional profesional

Si en el futuro se requiere un control total sobre los correos
(bienvenida, notificaciones, recordatorios, etc.) y una dirección
de remitente personalizada sin depender del plan Blaze de Firebase,
se recomienda:

1. **Resend** (recomendado): API moderna, SDK para Node.js/Next.js,
   plantillas React Email, entregabilidad superior.
   - SDK ya preparado en `lib/email/index.ts`
   - Configurar `RESEND_API_KEY` en entorno

2. **SendGrid**: Más conocido, buena entregabilidad, plan gratuito
   de 100 emails/día.
   - SDK ya preparado en `lib/email/index.ts`
   - Configurar `SENDGRID_API_KEY` en entorno

3. **Postmark**: Excelente entregabilidad, enfocado en correos
   transaccionales, plantillas profesionales.

### Para migrar:

1. Elegir proveedor y obtener API key
2. Verificar dominio `soped.pe` en el proveedor
3. Configurar registros DNS (SPF, DKIM, DMARC)
4. Implementar el adaptador correspondiente en `lib/email/index.ts`
5. Cambiar `EMAIL_PROVIDER` en las variables de entorno
6. Desactivar plantillas de Firebase Console y migrar la lógica
   de envío a las Actions de Firebase Auth (bloqueantes) o
   a Cloud Functions
