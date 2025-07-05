const { setTimeout: wait } = require('timers/promises');

/**
 * @typedef {Object} RetryOptions
 * @property {number} [retries=3] - Max number of retry attempts.
 * @property {number} [delay=300] - Base delay in milliseconds for exponential backoff.
 * @property {number} [timeout=1000] - Timeout for each attempt in milliseconds.
 * @property {Object} [hooks] - Optional lifecycle hooks.
 * @property {(error: Error, attempt: number) => void} [hooks.onRetry] - Called on each retry attempt.
 * @property {(error: Error) => void} [hooks.onAbort] - Called when an attempt is aborted due to timeout.
 * @property {(result: any) => void} [hooks.onSuccess] - Called on successful attempt.
 * @property {(error: Error) => void} [hooks.onFailure] - Called when all attempts fail.
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
  { retries = 3, delay = 300, timeout = 1000, hooks = {} } = {},
) {
  let lastError;
  let timer;

  for (let i = 0; i < retries; i++) {
    try {
      const controller = new AbortController();
      timer = setTimeout(() => controller.abort(), timeout);

      const result = await fn(controller.signal); // signal passed
      clearTimeout(timer);
      if (hooks.onSuccess) hooks.onSuccess(result);
      return result;
    } catch (err) {
      clearTimeout(timer);
      lastError = err;
      if (err.name === 'AbortError' && hooks.onAbort) {
        hooks.onAbort(err);
      }
      if (i < retries - 1) {
        if (hooks.onRetry) hooks.onRetry(err, i);
        await wait(delay * 2 ** i); // backoff
      }
    }
  }
  if (hooks.onFailure) hooks.onFailure(lastError);
  throw lastError;
}

module.exports = { retryHelper };
