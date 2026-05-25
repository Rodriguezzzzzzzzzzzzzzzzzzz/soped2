'use client'

import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function PageTransition({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#05070d',
      }}
    >
      <div className="page-fade">{children}</div>

      <style jsx global>{`
        .page-fade {
          animation: pageFadeIn 160ms ease-out;
        }

        @keyframes pageFadeIn {
          from {
            opacity: 0;
            transform: translateY(6px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        html, body {
          background-color: #05070d !important;
        }
      `}</style>
    </div>
  )
}