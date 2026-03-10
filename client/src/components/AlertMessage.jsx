export default function AlertMessage({ type = 'info', message }) {
  if (!message) {
    return null;
  }

  return <div className={`alert alert-${type} mt-3`}>{message}</div>;
}
