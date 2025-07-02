const { setTimeout: wait } = require('timers/promises');

/**
 * Retry a function with timeout and exponential backoff.
 * @param {() => Promise<any>} fn - The async function to execute.
 * @param {Object} options - Retry options.
 * @param {number} options.retries - Max number of retries.
 * @param {number} options.delay - Delay between retries (ms).
 * @param {number} options.timeout - Max time allowed per try (ms).
 */
async function retryHelper(
  fn,
  { retries = 3, delay = 300, timeout = 1000 } = {},
) {
  let lastError;

  for (let i = 0; i < retries; i++) {
    try {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), timeout);

      const result = await fn(controller.signal); // signal passed
      clearTimeout(timer);
      return result;
    } catch (err) {
      lastError = err;

      if (i < retries - 1) {
        await wait(delay * 2 ** i); // backoff
      }
    }
  }

  throw lastError;
}

module.exports = { retryHelper };
