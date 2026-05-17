import React from 'react'
import Layout from '@/components/Layout'
import { useMunSystem } from '@/src/mun'

export default function MunDashboard() {
  const { view, setView, data } = useMunSystem()

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
            {data.delegaciones.map((d) => (
              <div key={d.id}>
                {d.country} - {d.status}
              </div>
            ))}
          </div>
        )}
        {view === 'comites' && (
          <div>
            {data.comites.map((c) => (
              <div key={c.id}>{c.name}</div>
            ))}
          </div>
        )}
        {view === 'sesiones' && (
          <div>
            {data.sesiones.map((s) => (
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
