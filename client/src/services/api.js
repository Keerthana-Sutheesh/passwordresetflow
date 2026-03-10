const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL?.trim();

async function handleResponse(response) {
  const payload = await response.json();

  if (!response.ok) {
    throw new Error(payload.message || 'Request failed');
  }

  return payload;
}

export async function requestPasswordReset(email) {
  const response = await fetch(`${API_BASE_URL}/forgot-password`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email }),
  });

  return handleResponse(response);
}

export async function validateResetToken(token) {
  const response = await fetch(
    `${API_BASE_URL}/reset-password/validate?token=${encodeURIComponent(token)}`
  );

  return handleResponse(response);
}

export async function resetPassword(token, password) {
  const response = await fetch(`${API_BASE_URL}/reset-password`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ token, password }),
  });

  return handleResponse(response);
}
