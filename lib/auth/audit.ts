import { db } from '@/lib/firebase'
import { doc, setDoc, collection, query, where, orderBy, limit, getDocs, serverTimestamp } from 'firebase/firestore'
import type { SecurityEvent, SecurityEventType } from './types'
import { AUTH_CONFIG } from './config'

export async function logSecurityEvent(event: SecurityEvent): Promise<void> {
  if (!AUTH_CONFIG.audit.enabled) return

  try {
    const eventData = {
      type: event.type,
      uid: event.uid || null,
      email: event.email || null,
      metadata: event.metadata || {},
      timestamp: serverTimestamp(),
      userAgent: typeof window !== 'undefined' ? navigator.userAgent : '',
    }

    const ref = doc(collection(db, 'security_events'))
    await setDoc(ref, eventData)
  } catch {
    // Silently fail — audit logging should never block the user
  }
}

export async function getRecentSecurityEvents(
  uid: string,
  maxResults: number = 20
): Promise<SecurityEvent[]> {
  try {
    const q = query(
      collection(db, 'security_events'),
      where('uid', '==', uid),
      orderBy('timestamp', 'desc'),
      limit(maxResults)
    )
    const snap = await getDocs(q)
    return snap.docs.map((d) => d.data() as SecurityEvent)
  } catch {
    return []
  }
}

export async function getLoginAttempts(
  email: string,
  windowMinutes: number = 15
): Promise<number> {
  try {
    const since = new Date(Date.now() - windowMinutes * 60 * 1000)
    const q = query(
      collection(db, 'security_events'),
      where('email', '==', email.toLowerCase()),
      where('type', '==', 'login_failure'),
      orderBy('timestamp', 'desc')
    )
    const snap = await getDocs(q)
    return snap.docs.filter((d) => {
      const t = d.data().timestamp?.toDate?.()
      return t && t > since
    }).length
  } catch {
    return 0
  }
}

export function getDeviceInfo() {
  if (typeof window === 'undefined') {
    return { browser: 'Unknown', os: 'Unknown', device: 'Unknown' }
  }

  const ua = navigator.userAgent
  const browser = ua.includes('Chrome') ? 'Chrome'
    : ua.includes('Firefox') ? 'Firefox'
    : ua.includes('Safari') ? 'Safari'
    : ua.includes('Edge') ? 'Edge'
    : 'Unknown'

  const os = ua.includes('Windows') ? 'Windows'
    : ua.includes('Mac') ? 'macOS'
    : ua.includes('Linux') ? 'Linux'
    : ua.includes('Android') ? 'Android'
    : ua.includes('iOS') ? 'iOS'
    : 'Unknown'

  const device = ua.includes('Mobile') ? 'Mobile'
    : ua.includes('Tablet') ? 'Tablet'
    : 'Desktop'

  return { browser, os, device }
}

export function canAttemptLogin(
  attempts: number,
  maxAttempts: number = AUTH_CONFIG.rateLimit.maxLoginAttempts
): { allowed: boolean; remaining: number; lockedUntil?: Date } {
  if (attempts >= maxAttempts) {
    const lockedUntil = new Date(Date.now() + AUTH_CONFIG.rateLimit.lockoutMinutes * 60 * 1000)
    return { allowed: false, remaining: 0, lockedUntil }
  }
  return { allowed: true, remaining: maxAttempts - attempts }
}
