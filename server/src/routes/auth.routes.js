import { Router } from 'express';
import {
  requestPasswordReset,
  validateResetToken,
  resetPassword,
} from '../controllers/auth.controller.js';

const router = Router();

router.post('/forgot-password', requestPasswordReset);
router.get('/reset-password/validate', validateResetToken);
router.post('/reset-password', resetPassword);

export default router;
