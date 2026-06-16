import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Oratoria Workshop — SoPeD',
  description:
    'Programa de public speaking de élite. Domina la voz, presencia escénica, comunicación verbal y no verbal, y manejo del público.',
  openGraph: {
    title: 'Oratoria Workshop — SoPeD',
    description:
      'Programa de public speaking de élite. Voz, presencia escénica y comunicación de alto impacto.',
    siteName: 'SoPeD — Sociedad Peruana de Debate',
    locale: 'es_PE',
    type: 'website',
  },
}

export default function OratoriaLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
