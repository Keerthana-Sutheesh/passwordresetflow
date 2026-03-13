import { sendResetEmail } from '../../src/services/email.service.js';

function buildResponse(statusCode, payload) {
  return {
    statusCode,
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  };
}

export async function handler(event) {
  if (event.httpMethod !== 'POST') {
    return buildResponse(405, { message: 'Method not allowed' });
  }

  try {
    const body = event.body ? JSON.parse(event.body) : {};
    const to = body?.to?.trim();
    const resetUrl = body?.resetUrl?.trim();

    if (!to || !resetUrl) {
      return buildResponse(400, { message: 'to and resetUrl are required' });
    }

    await sendResetEmail({ to, resetUrl });
    return buildResponse(200, { message: 'Reset email sent successfully' });
  } catch (error) {
    console.error('Netlify send-reset-email failed:', error.message);
    return buildResponse(502, { message: error.message || 'Failed to send reset email' });
  }
}
