const { setTimeout: wait } = require('timers/promises');

/**
 * @typedef {Object} RetryOptions
 * @property {number} [retries=3] - Max number of retry attempts.
 * @property {number} [delay=300] - Base delay in milliseconds for exponential backoff.
 * @property {number} [timeout=1000] - Timeout for each attempt in milliseconds.
 */

/**
 * Retry a function with timeout and exponential backoff.
 *
 * @template T
 * @param {(signal: AbortSignal) => Promise<T>} fn - The async function that receives an AbortSignal.
 * @param {RetryOptions} [options={}] - Retry configuration options.
 * @returns {Promise<T>} Resolves with the result of the function, or throws after retries fail.
 */
async function retryHelper(
  fn,
  { retries = 3, delay = 300, timeout = 1000 } = {},
) {
  let lastError;
  let timer;

  for (let i = 0; i < retries; i++) {
    try {
      const controller = new AbortController();
      timer = setTimeout(() => controller.abort(), timeout);

      const result = await fn(controller.signal); // signal passed
      clearTimeout(timer);
      return result;
    } catch (err) {
      clearTimeout(timer);
      lastError = err;
      if (i < retries - 1) {
        await wait(delay * 2 ** i); // backoff
      }
    }
  }

  throw lastError;
}

module.exports = { retryHelper };
