import { createTransport } from 'nodemailer'
import { env } from './env'

const transporter = createTransport({
  host: env.EMAIL_SERVER_HOST,
  port: env.EMAIL_SERVER_PORT,
  auth: {
    user: env.EMAIL_SERVER_USER,
    pass: env.EMAIL_SERVER_PASSWORD,
  },
  secure: env.NODE_ENV === 'production',
})

export class EmailService {
  static async sendVerificationEmail(email: string, token: string) {
    const verificationUrl = `${env.APP_URL}/verify-email?token=${token}`
    
    await transporter.sendMail({
      from: env.EMAIL_FROM,
      to: email,
      subject: 'Verify your email address',
      html: `
        <h1>Email Verification</h1>
        <p>Click the link below to verify your email address:</p>
        <a href="${verificationUrl}">Verify Email</a>
        <p>This link will expire in 24 hours.</p>
        <p>If you didn't create an account, you can safely ignore this email.</p>
      `,
    })
  }

  static async sendPasswordResetEmail(email: string, token: string) {
    const resetUrl = `${env.APP_URL}/reset-password?token=${token}`
    
    await transporter.sendMail({
      from: env.EMAIL_FROM,
      to: email,
      subject: 'Reset your password',
      html: `
        <h1>Password Reset</h1>
        <p>Click the link below to reset your password:</p>
        <a href="${resetUrl}">Reset Password</a>
        <p>This link will expire in 1 hour.</p>
        <p>If you didn't request a password reset, you can safely ignore this email.</p>
      `,
    })
  }
}
