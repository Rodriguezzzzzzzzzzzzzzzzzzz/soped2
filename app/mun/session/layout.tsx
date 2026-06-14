import type { ReactNode } from 'react'

export default function SessionLayout({ children }: { children: ReactNode }) {
  return (
    <div style={{ paddingTop: 80, boxSizing: 'border-box' }}>
      {children}
    </div>
  )
}
