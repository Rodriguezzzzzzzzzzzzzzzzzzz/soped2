import { AUTH_CONFIG } from './config'
import type { PasswordChecks, PasswordStrength } from './types'

const COMMON_PASSWORDS = new Set([
  '12345678', 'password', 'password1', '123456789', '1234567890',
  'qwerty123', 'qwerty1', '11111111', 'abcdefgh', 'abc12345',
  'iloveyou', 'monkey', 'dragon', 'master', 'shadow',
  'sunshine', 'princess', 'football', 'baseball', 'welcome',
  'admin123', 'test123', 'passw0rd', 'letmein', 'trustno1',
])

export function validateEmail(email: string): { valid: boolean; message?: string } {
  if (!email || email.trim().length === 0) {
    return { valid: false, message: 'El correo es obligatorio.' }
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email.trim())) {
    return { valid: false, message: 'Ingresa un correo electrónico válido.' }
  }

  const domain = email.split('@')[1]
  if (domain && domain.length > 253) {
    return { valid: false, message: 'El dominio del correo es demasiado largo.' }
  }

  return { valid: true }
}

export function validatePassword(password: string): {
  valid: boolean
  strength: PasswordStrength
} {
  const checks: PasswordChecks = {
    length: password.length >= AUTH_CONFIG.password.minLength,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /[0-9]/.test(password),
    special: /[^A-Za-z0-9]/.test(password),
  }

  const passed = Object.values(checks).filter(Boolean).length
  const isCommon = COMMON_PASSWORDS.has(password.toLowerCase())

  let score: 0 | 1 | 2 | 3 | 4
  if (password.length === 0) {
    score = 0
  } else if (password.length < AUTH_CONFIG.password.minLength || passed < 2 || isCommon) {
    score = 1
  } else if (passed < 3) {
    score = 2
  } else if (passed < 5) {
    score = 3
  } else {
    score = 4
  }

  const labels = ['', 'Débil', 'Regular', 'Buena', 'Segura']
  const colors = ['', '#D32F2F', '#F57C00', '#FBC02D', '#388E3C']

  const valid = score >= 3 && !isCommon

  const strength: PasswordStrength = {
    score,
    label: labels[score],
    color: colors[score],
    checks,
  }

  return { valid, strength }
}

export function getPasswordErrorMessage(strength: PasswordStrength): string | null {
  const { checks } = strength

  if (strength.score === 1 && !checks.length) {
    return `Mínimo ${AUTH_CONFIG.password.minLength} caracteres.`
  }
  if (!checks.uppercase) return 'Falta una mayúscula.'
  if (!checks.lowercase) return 'Falta una minúscula.'
  if (!checks.number) return 'Falta un número.'
  if (!checks.special) return 'Falta un carácter especial.'
  if (strength.score < 3) return 'La contraseña no es lo suficientemente segura.'

  return null
}

export function isCommonPassword(password: string): boolean {
  return COMMON_PASSWORDS.has(password.toLowerCase())
}

export function sanitizeInput(input: string): string {
  return input.replace(/[<>&"'\/]/g, '')
}

export function isValidEmailDomain(email: string): boolean {
  const domain = email.split('@')[1]
  if (!domain) return false
  const parts = domain.split('.')
  return parts.length >= 2 && parts[parts.length - 1].length >= 2
}
