// src/ohFetch.js
/**
 * Perform an HTTP request with native fetch,
 * default headers/body, JSON parsing, and timeout.
 *
 * @param {object} data
 * @param {string} data.url - The URL to fetch.
 * @param {string} [data.method='GET'] - HTTP method (GET, POST, etc.).
 * @param {object} [data.headers] - Custom headers to include in the request.
 * @returns {Promise<any>} Parsed JSON or text response
 * @throws {Error} If fetch fails or response is not ok
 */
async function ohFetch(data) {
  if (typeof data.url !== 'string') {
    throw new TypeError('URL must be a string');
  }

  const finalOptions = {
    method: data.method || 'GET',
    headers: data.headers || { 'Content-Type': 'application/json' },
    signal: data.signal, // pass signal for aborting
    body: data.body ? JSON.stringify(data.body) : undefined,
  };

  const response = await fetch(data.url, finalOptions);

  if (!response.ok) {
    const errorText = await response.text().catch(() => '');
    throw new Error(
      `Fetch failed with ${response.status} ${response.statusText}. Body: ${errorText}`,
    );
  }

  const contentType = response.headers.get('content-type');
  if (contentType?.includes('application/json')) {
    return await response.json();
  }

  return await response.text(); // fallback
}

module.exports = { ohFetch };
