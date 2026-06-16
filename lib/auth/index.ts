import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  sendEmailVerification,
  applyActionCode,
  onAuthStateChanged,
  setPersistence,
  browserLocalPersistence,
  browserSessionPersistence,
  fetchSignInMethodsForEmail,
  updateProfile,
  type ActionCodeSettings,
  type User as FirebaseUser,
  type AuthError,
} from 'firebase/auth'
import { auth, ensureUserProfile, getUserProfile } from '@/lib/firebase'
import { validateEmail, validatePassword, sanitizeInput } from './validators'
import { logSecurityEvent, getDeviceInfo } from './audit'
import { AUTH_CONFIG } from './config'
import type {
  AuthUser,
  AuthResult,
  ActiveSession,
  VerificationStatus,
} from './types'

const ACTION_CODE_SETTINGS: ActionCodeSettings = {
  url: 'https://soped.pe/login',
  handleCodeInApp: false,
}

const FIREBASE_ERROR_MESSAGES: Record<string, string> = {
  'auth/email-already-in-use': 'Este correo ya está registrado.',
  'auth/invalid-credential': 'Credenciales inválidas.',
  'auth/user-not-found': 'Credenciales inválidas.',
  'auth/wrong-password': 'Credenciales inválidas.',
  'auth/invalid-email': 'Ingresa un correo electrónico válido.',
  'auth/weak-password': 'La contraseña es demasiado débil.',
  'auth/too-many-requests': 'Demasiados intentos. Intenta de nuevo más tarde.',
  'auth/user-disabled': 'Esta cuenta ha sido desactivada.',
  'auth/operation-not-allowed': 'Esta operación no está disponible temporalmente.',
  'auth/expired-action-code': 'El enlace de verificación ha expirado.',
  'auth/invalid-action-code': 'El enlace de verificación no es válido.',
}

function getFirebaseErrorMessage(error: unknown): string {
  const authError = error as AuthError
  const code = authError?.code
  return FIREBASE_ERROR_MESSAGES[code] || 'Ocurrió un error inesperado. Intenta de nuevo.'
}

function mapFirebaseUser(firebaseUser: FirebaseUser): AuthUser {
  return {
    uid: firebaseUser.uid,
    email: firebaseUser.email || '',
    displayName: firebaseUser.displayName,
    emailVerified: firebaseUser.emailVerified,
    role: 'delegate',
  }
}

async function getOrCreateUserProfile(firebaseUser: FirebaseUser): Promise<AuthUser> {
  const user = mapFirebaseUser(firebaseUser)
  try {
    const profile = await ensureUserProfile(firebaseUser)
    if (profile) {
      user.displayName = profile.name || firebaseUser.displayName
      user.role = profile.role || 'delegate'
    }
  } catch {
    // Profile is non-critical
  }
  return user
}

export const AuthService = {
  async register(
    email: string,
    password: string,
    displayName?: string
  ): Promise<AuthResult> {
    const sanitizedEmail = sanitizeInput(email.trim().toLowerCase())

    const emailCheck = validateEmail(sanitizedEmail)
    if (!emailCheck.valid) {
      return { success: false, error: emailCheck.message }
    }

    const passwordCheck = validatePassword(password)
    if (!passwordCheck.valid) {
      return { success: false, error: 'La contraseña no cumple los requisitos mínimos de seguridad.' }
    }

    try {
      const result = await createUserWithEmailAndPassword(auth, sanitizedEmail, password)

      if (displayName) {
        await updateProfile(result.user, { displayName: sanitizeInput(displayName.trim()) })
      }

      await getOrCreateUserProfile(result.user)

      if (AUTH_CONFIG.audit.enabled) {
        await sendEmailVerification(result.user, ACTION_CODE_SETTINGS)
        await logSecurityEvent({
          type: 'register_success',
          uid: result.user.uid,
          email: sanitizedEmail,
          metadata: { ...getDeviceInfo() },
        })
      }

      return {
        success: true,
        user: mapFirebaseUser(result.user),
        needsEmailVerification: true,
      }
    } catch (error) {
      const message = getFirebaseErrorMessage(error)
      await logSecurityEvent({
        type: 'login_failure',
        email: sanitizedEmail,
        metadata: { error: message },
      })
      return { success: false, error: message }
    }
  },

  async login(
    email: string,
    password: string,
    rememberMe: boolean = true
  ): Promise<AuthResult> {
    const sanitizedEmail = sanitizeInput(email.trim().toLowerCase())

    if (!sanitizedEmail || !password) {
      return { success: false, error: 'Completa todos los campos.' }
    }

    try {
      await setPersistence(
        auth,
        rememberMe ? browserLocalPersistence : browserSessionPersistence
      )

      const result = await signInWithEmailAndPassword(auth, sanitizedEmail, password)
      const user = await getOrCreateUserProfile(result.user)

      await logSecurityEvent({
        type: 'login_success',
        uid: result.user.uid,
        email: sanitizedEmail,
        metadata: { ...getDeviceInfo() },
      })

      if (!result.user.emailVerified) {
        return {
          success: true,
          user,
          needsEmailVerification: true,
        }
      }

      return { success: true, user }
    } catch (error) {
      const message = getFirebaseErrorMessage(error)
      await logSecurityEvent({
        type: 'login_failure',
        email: sanitizedEmail,
        metadata: { error: message, ...getDeviceInfo() },
      })
      return { success: false, error: message }
    }
  },

  async logout(): Promise<void> {
    const currentUser = auth.currentUser
    await signOut(auth)
    if (currentUser) {
      await logSecurityEvent({
        type: 'logout',
        uid: currentUser.uid,
      })
    }
  },

  async sendPasswordReset(email: string): Promise<AuthResult> {
    const sanitizedEmail = sanitizeInput(email.trim().toLowerCase())

    const emailCheck = validateEmail(sanitizedEmail)
    if (!emailCheck.valid) {
      return { success: false, error: emailCheck.message }
    }

    try {
      await sendPasswordResetEmail(auth, sanitizedEmail, ACTION_CODE_SETTINGS)
      await logSecurityEvent({
        type: 'password_reset_request',
        email: sanitizedEmail,
      })
      return { success: true }
    } catch (error) {
      return { success: false, error: getFirebaseErrorMessage(error) }
    }
  },

  async sendVerificationEmail(): Promise<AuthResult> {
    const user = auth.currentUser
    if (!user) {
      return { success: false, error: 'No hay sesión activa.' }
    }

    try {
      await sendEmailVerification(user, ACTION_CODE_SETTINGS)
      await logSecurityEvent({
        type: 'email_verification_sent',
        uid: user.uid,
      })
      return { success: true }
    } catch (error) {
      return { success: false, error: getFirebaseErrorMessage(error) }
    }
  },

  async verifyEmailWithCode(code: string): Promise<AuthResult> {
    try {
      await applyActionCode(auth, code)
      await logSecurityEvent({
        type: 'email_verified',
        uid: auth.currentUser?.uid,
      })
      return { success: true }
    } catch (error) {
      return { success: false, error: getFirebaseErrorMessage(error) }
    }
  },

  async checkEmailExists(email: string): Promise<boolean> {
    try {
      const methods = await fetchSignInMethodsForEmail(auth, sanitizeInput(email.trim().toLowerCase()))
      return methods.length > 0
    } catch {
      return false
    }
  },

  async checkDuplicateEmail(email: string): Promise<{ isDuplicate: boolean }> {
    const sanitized = sanitizeInput(email.trim().toLowerCase())
    const emailCheck = validateEmail(sanitized)
    if (!emailCheck.valid) {
      return { isDuplicate: false }
    }

    try {
      const methods = await fetchSignInMethodsForEmail(auth, sanitized)
      return { isDuplicate: methods.length > 0 }
    } catch {
      return { isDuplicate: false }
    }
  },

  getCurrentUser(): AuthUser | null {
    const firebaseUser = auth.currentUser
    if (!firebaseUser) return null
    return mapFirebaseUser(firebaseUser)
  },

  getEmailVerified(): boolean {
    return auth.currentUser?.emailVerified ?? false
  },

  getVerificationStatus(): VerificationStatus {
    const user = auth.currentUser
    if (!user) return 'locked'
    if (user.emailVerified) return 'verified'
    return 'pending'
  },

  onAuthStateChanged(callback: (user: AuthUser | null) => void): () => void {
    return onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const user = await getOrCreateUserProfile(firebaseUser)
        callback(user)
      } else {
        callback(null)
      }
    })
  },

  async getActiveSessions(): Promise<ActiveSession[]> {
    return []
  },

  async revokeSession(_sessionId: string): Promise<void> {
    return
  },

  getOAuthProviders() {
    const available: string[] = []
    if (AUTH_CONFIG.oauth.google.enabled) available.push('google')
    if (AUTH_CONFIG.oauth.github.enabled) available.push('github')
    if (AUTH_CONFIG.oauth.microsoft.enabled) available.push('microsoft')
    if (AUTH_CONFIG.oauth.linkedin.enabled) available.push('linkedin')
    return available
  },
}
