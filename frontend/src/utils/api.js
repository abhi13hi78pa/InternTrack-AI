const API_BASE_URL = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '');

export function apiUrl(path) {
  if (!path.startsWith('/')) {
    return `${API_BASE_URL}/${path}`;
  }

  return `${API_BASE_URL}${path}`;
}

export function apiFetch(path, options) {
  return fetch(apiUrl(path), options);
}

export async function parseApiResponse(response, fallbackMessage = 'Request failed') {
  const contentType = response.headers.get('content-type') || '';
  const body = await response.text();
  let data = null;

  if (body && contentType.includes('application/json')) {
    try {
      data = JSON.parse(body);
    } catch {
      throw new Error('Server returned invalid JSON');
    }
  }

  if (!response.ok) {
    const message = data?.message || body || `${fallbackMessage} (${response.status})`;
    throw new Error(message);
  }

  return data ?? body;
}
