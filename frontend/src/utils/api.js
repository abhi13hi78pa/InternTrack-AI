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

