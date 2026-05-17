// MUN ROLES SYSTEM (Core Permission Layer)
// This controls access across the entire MUN platform

import { useState, useEffect } from 'react'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from '@/lib/firebase'
import { getUserProfile } from '@/lib/user'

export type MunRole = 'admin' | 'chair' | 'delegate'

export interface MunUserRole {
  uid: string
  name: string
  role: MunRole
  committeeId?: string
  country?: string
}

export function useRolesStore() {
  const [currentUser, setCurrentUser] = useState<MunUserRole | null>(null)
  const [users, setUsers] = useState<MunUserRole[]>([])
  const [loading, setLoading] = useState(true)

  // SET CURRENT USER (after login)
  const setUser = (user: MunUserRole) => {
    setCurrentUser(user)
  }

  // ROLE CHECKS (PERMISSIONS)
  const isAdmin = () => currentUser?.role === 'admin'
  const isChair = () => currentUser?.role === 'chair'
  const isDelegate = () => currentUser?.role === 'delegate'

  // PERMISSION MATRIX
  const canManageSystem = () => isAdmin()
  const canControlCommittee = () => isAdmin() || isChair()
  const canVote = () => isDelegate() || isChair()
  const canCreateSession = () => isAdmin() || isChair()

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      try {
        setLoading(true)

        if (!user) {
          setCurrentUser(null)
          setLoading(false)
          return
        }

        const profile = await getUserProfile(user.uid)

        if (profile) {
          setCurrentUser({
            uid: user.uid,
            name: profile.name || 'Usuario',
            role: profile.role || 'delegate',
            committeeId: profile.committeeId,
            country: profile.country,
          })
        }

      } catch (err) {
        console.error('Error loading user role:', err)
      } finally {
        setLoading(false)
      }
    })

    return () => unsub()
  }, [])

  return {
    currentUser,
    loading,
    users,

    setUser,

    isAdmin,
    isChair,
    isDelegate,

    canManageSystem,
    canControlCommittee,
    canVote,
    canCreateSession,

    setUsers,
  }
}
