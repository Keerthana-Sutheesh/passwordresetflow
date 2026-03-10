import {
  createPasswordResetToken,
  performPasswordReset,
  verifyPasswordResetToken,
} from '../services/auth.service.js';

export async function requestPasswordReset(req, res) {
  try {
    const { email } = req.body;
    const result = await createPasswordResetToken(email);
    return res.status(200).json(result);
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: error.message });
    }

    if (error.name === 'NotFoundError') {
      return res.status(404).json({ message: error.message });
    }

    if (error.name === 'EmailDeliveryError') {
      return res.status(502).json({ message: error.message });
    }

    console.error('requestPasswordReset failed:', error.message);

    return res.status(500).json({ message: 'Internal server error' });
  }
}

export async function validateResetToken(req, res) {
  try {
    const { token } = req.query;
    const result = await verifyPasswordResetToken(token);
    return res.status(200).json(result);
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: error.message });
    }

    if (error.name === 'TokenError') {
      return res.status(401).json({ message: error.message });
    }

    return res.status(500).json({ message: 'Internal server error' });
  }
}

export async function resetPassword(req, res) {
  try {
    const { token, password } = req.body;
    const result = await performPasswordReset(token, password);
    return res.status(200).json(result);
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: error.message });
    }

    if (error.name === 'TokenError') {
      return res.status(401).json({ message: error.message });
    }

    return res.status(500).json({ message: 'Internal server error' });
  }
}
