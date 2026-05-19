'use client'

import { useState } from 'react'
import { useCommitteeStore } from '@/mun-v2/store/useCommitteeStore'
import type { Delegate } from '@/mun-v2/types/mun.types'

export type MunView = 'delegaciones' | 'comites' | 'sesiones'

export function useMun() {
  const [view, setView] = useState<MunView>('delegaciones')

  const delegates = useCommitteeStore((s) => s.state.delegates)

  const delegaciones: Delegate[] = delegates ?? []
  const comites: { id: string; name: string }[] = []
  const sesiones: { id: string; name: string; status: string }[] = []

  return {
    view,
    setView,
    delegaciones,
    comites,
    sesiones,
    delegacionesCount: delegaciones.length,
    comitesCount: comites.length,
    sesionesCount: sesiones.length,
  }
}