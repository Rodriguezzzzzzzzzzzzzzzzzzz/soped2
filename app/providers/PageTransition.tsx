'use client'

export default function PageTransition({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0F0A0B' }}>
      {children}
    </div>
  )
}