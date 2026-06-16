/**
 * Transactional Email Service Abstraction Layer
 *
 * This module provides a unified interface for sending transactional emails.
 * Currently, Firebase Authentication handles all auth emails natively through
 * its built-in email template system (configured in Firebase Console).
 *
 * When ready to migrate to a professional email service (Resend, SendGrid, Postmark),
 * implement the EmailProvider interface below and set EMAIL_PROVIDER accordingly.
 *
 * Supported providers for future migration:
 *   - Resend    (https://resend.com)
 *   - SendGrid  (https://sendgrid.com)
 *   - Postmark  (https://postmarkapp.com)
 *   - AWS SES   (https://aws.amazon.com/ses)
 */

import { AUTH_CONFIG } from '@/lib/auth/config'

export type EmailProvider = 'firebase' | 'resend' | 'sendgrid' | 'postmark'

export interface SendEmailParams {
  to: string
  subject: string
  html: string
  text?: string
  replyTo?: string
}

export interface EmailAdapter {
  send(params: SendEmailParams): Promise<{ success: boolean; error?: string }>
}

/**
 * Firebase Auth adapter — delegates to Firebase's built-in email system.
 * Firebase handles verification, password reset, and email change natively
 * through templates configured at Firebase Console > Authentication > Templates.
 *
 * This adapter is a placeholder for custom transactional emails that are
 * not covered by Firebase Auth templates (e.g., welcome emails, notifications).
 */
class FirebaseAuthAdapter implements EmailAdapter {
  async send(_params: SendEmailParams): Promise<{ success: boolean; error?: string }> {
    console.warn(
      '[EmailService] Firebase Auth does not support sending custom transactional emails. ' +
      'Configure auth email templates at Firebase Console > Authentication > Templates. ' +
      'For custom emails, implement a Resend/SendGrid/Postmark adapter.'
    )
    return { success: false, error: 'Firebase Auth adapter does not support custom emails.' }
  }
}

/*
 * Resend adapter — ready for implementation when RESEND_API_KEY is configured.
 * 
 * Usage:
 *   const resend = new Resend(process.env.RESEND_API_KEY)
 *   await resend.emails.send({
 *     from: 'SoPeD <noreply@soped.pe>',
 *     to: params.to,
 *     subject: params.subject,
 *     html: params.html,
 *     replyTo: 'presidencia@soped.pe',
 *   })
 */

/*
 * SendGrid adapter — ready for implementation when SENDGRID_API_KEY is configured.
 * 
 * Usage:
 *   const sgMail = require('@sendgrid/mail')
 *   sgMail.setApiKey(process.env.SENDGRID_API_KEY)
 *   await sgMail.send({
 *     from: { name: 'SoPeD', email: 'noreply@soped.pe' },
 *     to: params.to,
 *     subject: params.subject,
 *     html: params.html,
 *     replyTo: 'presidencia@soped.pe',
 *   })
 */

let _adapter: EmailAdapter | null = null

function getProvider(): EmailProvider {
  if (AUTH_CONFIG.oauth.google.clientId) {
    // Future: read EMAIL_PROVIDER from env
  }
  return 'firebase'
}

export function getEmailAdapter(): EmailAdapter {
  if (!_adapter) {
    const provider = getProvider()
    switch (provider) {
      case 'firebase':
      default:
        _adapter = new FirebaseAuthAdapter()
        break
    }
  }
  return _adapter
}

export async function sendEmail(params: SendEmailParams): Promise<{ success: boolean; error?: string }> {
  return getEmailAdapter().send(params)
}

export const EMAIL_CONFIG = {
  from: {
    name: 'Equipo SoPeD',
    email: 'noreply@soped.pe',
  },
  replyTo: {
    name: 'SoPeD',
    email: 'presidencia@soped.pe',
  },
  supportEmail: 'presidencia@soped.pe',
}
