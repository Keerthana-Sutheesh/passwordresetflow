import { useState } from 'react';
import AlertMessage from './AlertMessage.jsx';
import { requestPasswordReset } from '../services/api.js';

export default function ForgotPasswordForm() {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!email.trim()) {
      setErrorMessage('Please enter your email address');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await requestPasswordReset(email.trim());
      setSuccessMessage(response.message);
      setEmail('');
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="card shadow-sm card-width">
      <div className="card-body p-4">
        <h1 className="h4 mb-3">Forgot Password</h1>
        <p className="text-muted mb-3">Enter your registered email to receive a reset link.</p>

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label" htmlFor="email">
              Email address
            </label>
            <input
              id="email"
              type="email"
              className="form-control"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="name@example.com"
              required
            />
          </div>

          <button type="submit" className="btn btn-primary w-100" disabled={isSubmitting}>
            {isSubmitting ? 'Sending...' : 'Send Reset Link'}
          </button>
        </form>

        <AlertMessage type="danger" message={errorMessage} />
        <AlertMessage type="success" message={successMessage} />
      </div>
    </div>
  );
}
