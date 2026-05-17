import { useState } from 'react'
import { useMunStore } from './state/mun.store'

export type MunView = 'delegaciones' | 'comites' | 'sesiones'

export function useMun() {
  const [view, setView] = useState<MunView>('delegaciones')

  // CONNECTED TO CENTRAL MUN STORE
  const { delegaciones, comites, sesiones } = useMunStore()

  const delegacionesCount = delegaciones.length
  const comitesCount = comites.length
  const sesionesCount = sesiones.length

  return {
    view,
    setView,
    delegaciones,
    comites,
    sesiones,
    delegacionesCount,
    comitesCount,
    sesionesCount,
  }
}