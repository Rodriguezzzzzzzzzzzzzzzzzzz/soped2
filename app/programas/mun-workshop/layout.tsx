import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'MUN Workshop — SoPeD',
  description:
    'Programa intensivo de formación diplomática. Domina las reglas de procedimiento, negociación internacional y estrategia en comité para Modelos de Naciones Unidas.',
  openGraph: {
    title: 'MUN Workshop — SoPeD',
    description:
      'Formación diplomática intensiva. Reglas de procedimiento, negociación y estrategia en comité.',
    siteName: 'SoPeD — Sociedad Peruana de Debate',
    locale: 'es_PE',
    type: 'website',
  },
}

export default function MUNWorkshopLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
