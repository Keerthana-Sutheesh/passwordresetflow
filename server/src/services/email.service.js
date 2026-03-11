import nodemailer from 'nodemailer';
import { EmailDeliveryError } from '../utils/errors.js';

let transporterInstance;

function getMailerConfig() {
  const smtpUser = process.env.SMTP_USER?.trim();
  const smtpPass = process.env.SMTP_PASS?.replace(/\s+/g, '').trim();
  const smtpFrom = process.env.SMTP_FROM?.trim() || smtpUser;

  if (!smtpUser || !smtpPass || !smtpFrom) {
    throw new Error('SMTP configuration is missing. Set SMTP_USER, SMTP_PASS and SMTP_FROM in server/.env');
  }

  return {
    smtpUser,
    smtpPass,
    smtpFrom,
  };
}

function getTransporter() {
  if (transporterInstance) {
    return transporterInstance;
  }

  const config = getMailerConfig();

transporterInstance = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: config.smtpUser,
    pass: config.smtpPass,
  },
  connectionTimeout: 10000,
  logger: true,
  debug: true,
});

  return transporterInstance;
}

export async function sendResetEmail({ to, resetUrl }) {
  try {
    const config = getMailerConfig();
    const transporter = getTransporter();
    const mailOptions = {
      from: config.smtpFrom,
      to,
      subject: 'Password Reset Link',
      html: `<p>Use this link to reset your password:</p><p><a href="${resetUrl}">${resetUrl}</a></p>`,
    };

    await new Promise((resolve, reject) => {
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          reject(error);
          return;
        }

        if (process.env.EMAIL_LOG_ENABLED === 'true') {
          console.log(`Message sent successfully: ${info.messageId}`);
        }

        resolve(info);
      });
    });

    if (process.env.EMAIL_LOG_ENABLED === 'true') {
      console.log(`Reset email sent to ${to}`);
    }
  } catch (error) {
    throw new EmailDeliveryError(`Failed to send reset email: ${error.message}`);
  }
}
