export const AUTH_CONFIG = {
  password: {
    minLength: 8,
    requireUppercase: true,
    requireLowercase: true,
    requireNumber: true,
    requireSpecial: true,
  },
  session: {
    rememberMeDays: 30,
    defaultTimeoutMs: 24 * 60 * 60 * 1000,
  },
  rateLimit: {
    maxLoginAttempts: 5,
    lockoutMinutes: 15,
    maxResendAttempts: 3,
    resendCooldownSeconds: 60,
  },
  verification: {
    codeLength: 6,
    expiryMinutes: 10,
  },
  audit: {
    enabled: true,
  },
  turnstile: {
    siteKey: process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || '',
  },
  oauth: {
    google: { enabled: false, clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '' },
    github: { enabled: false, clientId: process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID || '' },
    microsoft: { enabled: false, clientId: process.env.NEXT_PUBLIC_MICROSOFT_CLIENT_ID || '' },
    linkedin: { enabled: false, clientId: process.env.NEXT_PUBLIC_LINKEDIN_CLIENT_ID || '' },
  },
} as const
