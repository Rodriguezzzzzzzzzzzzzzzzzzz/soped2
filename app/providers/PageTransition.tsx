'use client'

export default function PageTransition({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div style={{ minHeight: '100vh' }}>
      {children}
    </div>
  )
}