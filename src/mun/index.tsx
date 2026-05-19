'use client'

import React from 'react'
import Layout from '@/components/layout/Layout'
import { useMun } from '@/src/mun/core'

export default function MunDashboard() {
  const { view, setView, delegaciones, comites, sesiones } = useMun()

  const btnStyle = 'px-4 py-2 rounded bg-blue-500 text-white mr-2'

  return (
    <Layout>
      <h1 className="text-2xl font-bold mb-4">MUN Dashboard</h1>
      <div className="mb-4">
        <button className={btnStyle} onClick={() => setView('delegaciones')}>
          Delegaciones
        </button>
        <button className={btnStyle} onClick={() => setView('comites')}>
          Comités
        </button>
        <button className={btnStyle} onClick={() => setView('sesiones')}>
          Sesiones
        </button>
      </div>
      <div>
        {view === 'delegaciones' && (
          <div>
            {delegaciones.map((d) => (
              <div key={d.id}>
                {d.country.name} - {d.status}
              </div>
            ))}
          </div>
        )}
        {view === 'comites' && (
          <div>
            {comites.map((c: { id: string; name: string }) => (
              <div key={c.id}>{c.name}</div>
            ))}
          </div>
        )}
        {view === 'sesiones' && (
          <div>
            {sesiones.map((s: { id: string; name: string; status: string }) => (
              <div key={s.id}>
                {s.name} - {s.status}
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  )
}
