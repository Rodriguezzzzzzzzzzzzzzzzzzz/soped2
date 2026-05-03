# SoPeD — Sociedad Peruana de Debate

Plataforma académica institucional completa construida con Next.js 14, TypeScript y Tailwind CSS.

## Stack

- **Framework**: Next.js 14 (App Router)
- **Lenguaje**: TypeScript
- **Estilos**: Tailwind CSS + CSS Variables
- **Fuentes**: Cormorant Garamond + Outfit (Google Fonts)

## Rutas disponibles

| Ruta | Descripción |
|------|-------------|
| `/` | Home institucional con IntroLoader Ferrari |
| `/nosotros` | Misión, visión y equipo directivo |
| `/programas` | Catálogo de programas académicos |
| `/eventos` | Catálogo de eventos con filtros |
| `/mun` | Página del programa SoPeD MUN |
| `/debate-escolar` | Programa de Debate Escolar |
| `/inscripcion` | Centro de inscripción (4 formularios) |
| `/login` | Autenticación institucional |
| `/dashboard` | Panel de control del usuario |

## Instalación local

```bash
npm install
npm run dev
```

Abrir [http://localhost:3000](http://localhost:3000)

## Deploy en Cloudflare Pages

1. Sube este repositorio a GitHub
2. En Cloudflare Pages → Create project → Connect to Git
3. Selecciona el repositorio
4. Configuración de build:
   - **Framework preset**: Next.js
   - **Build command**: `npm run build`
   - **Build output directory**: `.next`
5. Click "Save and Deploy"

## Variables de entorno

No se requieren variables de entorno para el deploy inicial.
Para producción con base de datos, añadir en Cloudflare Pages → Settings → Environment variables.
