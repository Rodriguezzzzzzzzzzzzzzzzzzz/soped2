'use client'

import Link from 'next/link'

export default function Navbar() {
  return (
    <nav className="flex items-center justify-between p-4 bg-white shadow-md">
      <Link href="/">
        <img
          src="/public-logosoped.svg"
          alt="SOPED"
          className="h-10 w-auto"
        />
      </Link>

      {/* Other navbar items remain unchanged */}
    </nav>
  )
}
