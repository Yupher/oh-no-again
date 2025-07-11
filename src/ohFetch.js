/**
 * @typedef {Object} FetchOptions
 * @property {string} url - The URL to fetch.
 * @property {string} [method='GET'] - HTTP method (GET, POST, etc.).
 * @property {object} [headers] - Request headers.
 * @property {AbortSignal} [signal] - Optional AbortSignal to cancel the request.
 * @property {object} [body] - Request body. Automatically stringified if present.
 */

/**
 * Perform an HTTP request with native fetch,
 * default headers/body handling, JSON parsing, and abort support.
 *
 * @param {FetchOptions} data - The request configuration.
 * @returns {Promise<any>} Parsed JSON or text response.
 * @throws {Error} If the fetch fails or the response is not OK.
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
  const contentType = res.headers.get('content-type') || '';
  const isJson = contentType.includes('application/json');
  const dataParsed = isJson ? await response.json() : await response.text();

  if (!response.ok) {
    const error = new Error(
      `Fetch failed with ${response.status} ${
        response.statusText
      }. Body: ${JSON.stringify(dataParsed)}`,
    );
    error.status = response.status;
    error.responseBody = dataParsed;
    throw error;
  }

  return { data: dataParsed, status: response.status };
}

module.exports = { ohFetch };
