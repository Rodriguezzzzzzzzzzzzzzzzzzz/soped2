import { ReactNode } from 'react'

type SectionProps = {
  children: ReactNode
  variant?: 'default' | 'muted'
  className?: string
}

export default function Section({
  children,
  variant = 'default',
  className = ''
}: SectionProps) {
  const background =
    variant === 'default'
      ? 'var(--surface-0)'
      : 'var(--surface-1)'

  return (
    <section
      className={className}
      style={{
        padding: '6rem 0',
        background,
      }}
    >
      <div className="max-w-7xl mx-auto px-6">
        {children}
      </div>
    </section>
  )
}