import { useEffect, useMemo, useState } from 'react';
import AlertMessage from './AlertMessage.jsx';
import { resetPassword, validateResetToken } from '../services/api.js';

function getTokenFromUrl() {
  const params = new URLSearchParams(window.location.search);
  return params.get('token') || '';
}

export default function ResetPasswordForm() {
  const token = useMemo(() => getTokenFromUrl(), []);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isValidating, setIsValidating] = useState(true);
  const [isTokenValid, setIsTokenValid] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [email, setEmail] = useState('');
  const [expiresAt, setExpiresAt] = useState('');

  useEffect(() => {
    async function validateTokenState() {
      if (!token) {
        setErrorMessage('Reset token is missing in the URL');
        setIsValidating(false);
        return;
      }

      try {
        const response = await validateResetToken(token);
        setIsTokenValid(true);
        setEmail(response.email);
        setExpiresAt(response.expiresAt);
      } catch (error) {
        setErrorMessage(error.message);
      } finally {
        setIsValidating(false);
      }
    }

    validateTokenState();
  }, [token]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (password.length < 8) {
      setErrorMessage('Password must be at least 8 characters long');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await resetPassword(token, password);
      setSuccessMessage(response.message);
      setPassword('');
      setConfirmPassword('');
      setIsTokenValid(false);
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isValidating) {
    return (
      <div className="card shadow-sm card-width">
        <div className="card-body p-4 text-center">Validating reset link...</div>
      </div>
    );
  }

  return (
    <div className="card shadow-sm card-width">
      <div className="card-body p-4">
        <h1 className="h4 mb-3">Reset Password</h1>

        {isTokenValid ? (
          <>
            <p className="text-muted mb-1">Account: {email}</p>
            <p className="text-muted mb-3">
              Link expires at: {new Date(expiresAt).toLocaleString()}
            </p>

            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label" htmlFor="password">
                  New Password
                </label>
                <input
                  id="password"
                  type="password"
                  className="form-control"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label" htmlFor="confirmPassword">
                  Confirm Password
                </label>
                <input
                  id="confirmPassword"
                  type="password"
                  className="form-control"
                  value={confirmPassword}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                  required
                />
              </div>

              <button type="submit" className="btn btn-primary w-100" disabled={isSubmitting}>
                {isSubmitting ? 'Updating...' : 'Update Password'}
              </button>
            </form>
          </>
        ) : (
          <p className="text-muted mb-0">This reset link is not valid.</p>
        )}

        <AlertMessage type="danger" message={errorMessage} />
        <AlertMessage type="success" message={successMessage} />
      </div>
    </div>
  );
}
