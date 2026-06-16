import type { User as FirebaseUser } from 'firebase/auth'

export interface AuthUser {
  uid: string
  email: string
  displayName: string | null
  emailVerified: boolean
  createdAt?: string
  lastLoginAt?: string
  role: UserRole
}

export type UserRole = 'delegate' | 'chair' | 'admin'

export type AuthMode = 'login' | 'register'

export interface AuthFormData {
  email: string
  password: string
}

export interface PasswordChecks {
  length: boolean
  uppercase: boolean
  lowercase: boolean
  number: boolean
  special: boolean
}

export interface PasswordStrength {
  score: 0 | 1 | 2 | 3 | 4
  label: string
  color: string
  checks: PasswordChecks
}

export interface AuthResult {
  success: boolean
  user?: AuthUser
  error?: string
  needsEmailVerification?: boolean
}

export interface SecurityEvent {
  type: SecurityEventType
  uid?: string
  email?: string
  metadata?: Record<string, unknown>
  timestamp?: Date
}

export type SecurityEventType =
  | 'login_success'
  | 'login_failure'
  | 'register_success'
  | 'logout'
  | 'password_change'
  | 'password_reset_request'
  | 'password_reset_complete'
  | 'email_verification_sent'
  | 'email_verified'
  | 'mfa_enabled'
  | 'mfa_disabled'
  | 'session_revoked'
  | 'account_suspended'
  | 'account_locked'
  | 'login_from_new_device'
  | 'oauth_link'
  | 'profile_updated'

export interface ActiveSession {
  id: string
  device: string
  browser: string
  os: string
  location: string
  ip: string
  lastActive: Date
  createdAt: Date
  isCurrent: boolean
}

export type VerificationStatus = 'pending' | 'verified' | 'suspended' | 'locked'

export function createEmptyFirebaseUser(): FirebaseUser {
  return {} as FirebaseUser
}
