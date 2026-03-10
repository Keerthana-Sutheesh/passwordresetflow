import bcrypt from 'bcryptjs';
import {
  findUserByEmail,
  findUserByResetTokenHash,
  updateUserById,
} from '../repositories/user.repository.js';
import { sendResetEmail } from './email.service.js';
import { NotFoundError, TokenError, ValidationError } from '../utils/errors.js';
import { generateResetToken, hashToken } from '../utils/token.js';

const TOKEN_EXPIRY_MINUTES = Number(process.env.TOKEN_EXPIRY_MINUTES) || 15;

function validateEmail(email) {
  if (!email || typeof email !== 'string') {
    throw new ValidationError('Valid email is required');
  }
}

function validatePassword(password) {
  if (!password || typeof password !== 'string') {
    throw new ValidationError('Password is required');
  }

  if (password.length < 8) {
    throw new ValidationError('Password must be at least 8 characters long');
  }
}

function validateToken(token) {
  if (!token || typeof token !== 'string') {
    throw new ValidationError('Valid token is required');
  }
}

function ensureTokenNotExpired(user) {
  if (!user.resetTokenExpiresAt) {
    throw new TokenError('Invalid reset token');
  }

  const expiresAt = new Date(user.resetTokenExpiresAt).getTime();
  if (Date.now() > expiresAt) {
    throw new TokenError('Reset link has expired');
  }
}

export async function createPasswordResetToken(email) {
  validateEmail(email);

  const user = await findUserByEmail(email);
  if (!user) {
    throw new NotFoundError('User not found');
  }

  const token = generateResetToken();
  const tokenHash = hashToken(token);
  const expiresAt = new Date(Date.now() + TOKEN_EXPIRY_MINUTES * 60 * 1000).toISOString();

  await updateUserById(user.id, {
    resetTokenHash: tokenHash,
    resetTokenExpiresAt: expiresAt,
  });

  const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';
  const resetUrl = `${clientUrl}/reset-password?token=${token}`;

  await sendResetEmail({
    to: user.email,
    resetUrl,
  });

  return {
    message: 'Password reset link sent to your email',
    expiresAt,
  };
}

export async function verifyPasswordResetToken(token) {
  validateToken(token);

  const tokenHash = hashToken(token);
  const user = await findUserByResetTokenHash(tokenHash);

  if (!user) {
    throw new TokenError('Invalid reset token');
  }

  ensureTokenNotExpired(user);

  return {
    message: 'Token is valid',
    email: user.email,
    expiresAt: user.resetTokenExpiresAt,
  };
}

export async function performPasswordReset(token, password) {
  validateToken(token);
  validatePassword(password);

  const tokenHash = hashToken(token);
  const user = await findUserByResetTokenHash(tokenHash);

  if (!user) {
    throw new TokenError('Invalid reset token');
  }

  ensureTokenNotExpired(user);

  const hashedPassword = await bcrypt.hash(password, 10);

  await updateUserById(user.id, {
    password: hashedPassword,
    resetTokenHash: null,
    resetTokenExpiresAt: null,
  });

  return {
    message: 'Password has been reset successfully',
  };
}
