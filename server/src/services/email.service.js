import nodemailer from 'nodemailer';
import { EmailDeliveryError } from '../utils/errors.js';

let transporterInstance;

function getMailerConfig() {
  const smtpHost = process.env.SMTP_HOST?.trim();
  const smtpPort = Number.parseInt(process.env.SMTP_PORT || '587', 10);
  const smtpUser = process.env.SMTP_USER?.trim();
  const smtpPass = process.env.SMTP_PASS?.trim();
  const mailFrom = process.env.MAIL_FROM?.trim();
  const smtpSecure = process.env.SMTP_SECURE === 'true';

  if (!smtpHost || !smtpUser || !smtpPass || !mailFrom || Number.isNaN(smtpPort)) {
    throw new Error(
      'SMTP configuration is missing. Set SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, and MAIL_FROM in server/.env',
    );
  }

  return {
    smtpHost,
    smtpPort,
    smtpUser,
    smtpPass,
    smtpSecure,
    mailFrom,
  };
}

function getTransporter() {
  if (transporterInstance) {
    return transporterInstance;
  }

  const config = getMailerConfig();
  transporterInstance = nodemailer.createTransport({
    host: config.smtpHost,
    port: config.smtpPort,
    secure: config.smtpSecure,
    auth: {
      user: config.smtpUser,
      pass: config.smtpPass,
    },
  });

  return transporterInstance;
}

export async function sendResetEmail({ to, resetUrl }) {
  try {
    const config = getMailerConfig();
    const transporter = getTransporter();

    const info = await transporter.sendMail({
      from: config.mailFrom,
      to,
      subject: 'Password Reset Link',
      html: `<p>Use this link to reset your password:</p><p><a href="${resetUrl}">${resetUrl}</a></p>`,
    });

    if (process.env.EMAIL_LOG_ENABLED === 'true') {
      if (info?.messageId) {
        console.log(`Message sent successfully: ${info.messageId}`);
      }
      console.log(`Reset email sent to ${to}`);
    }
  } catch (error) {
    throw new EmailDeliveryError(`Failed to send reset email: ${error.message}`);
  }
}
