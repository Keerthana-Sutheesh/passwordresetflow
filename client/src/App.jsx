import ForgotPasswordForm from './components/ForgotPasswordForm.jsx';
import ResetPasswordForm from './components/ResetPasswordForm.jsx';

function isResetRoute() {
  return window.location.pathname === '/reset-password';
}

export default function App() {
  return (
    <main className="container app-container d-flex align-items-center justify-content-center py-5">
      {isResetRoute() ? <ResetPasswordForm /> : <ForgotPasswordForm />}
    </main>
  );
}
