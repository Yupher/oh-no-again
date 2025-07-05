const { createBatches } = require('./batch');
const { retryHelper } = require('./retryHelper');
const { ohFetch } = require('./ohFetch');
/**
 * Options for retry and fetch control.
 * @typedef {Object} RequestBatcherOptions
 * @property {number} [retries=3] - Number of retry attempts per request.
 * @property {number} [delay=300] - Delay in milliseconds for exponential backoff.
 * @property {number} [timeout=1000] - Timeout per request in milliseconds.
 * @property {string} [method='GET'] - HTTP method for the fetch request.
 * @property {Object.<string, string>} [headers] - Headers for the fetch request.
 * @property {any} [body] - Optional body payload for POST/PUT requests.
 */

/**
 * Perform batched and concurrent requests with retry and timeout.
 *
 * @template TInput
 * @template TResult
 * @param {TInput[]} data - The array of input items to process.
 * @param {number} batchSize - The number of concurrent requests to run at a time.
 * @param {(item: TInput) => { url: string, method?: string, headers?: Record<string, string>, body?: any }} taskFn - Function that returns fetch configuration for each item.
 * @param {RequestBatcherOptions} [options={}] - Optional configuration for retries and fetch.
 * @returns {Promise<TResult[]>} Resolves with an array of results.
 */
async function requestBatcher(data, batchSize, taskFn, options = {}) {
  const batches = createBatches(data, batchSize);
  const results = [];
  const {
    retries = 3,
    delay = 300,
    timeout = 1000,
    failFast = false,
    returnMeta = false,
  } = options;

  for (const batch of batches) {
    const promises = batch.map((item) => {
      const fn = (signal) => ohFetch({ ...taskFn(item), signal });
      const result =
        options.retries > 0
          ? retryHelper(fn, { retries, delay, timeout })
          : fn();
      return result
        .then((res) => (returnMeta ? { item, res, success: true } : res))
        .catch((err) => {
          if (failFast) throw err;
          return returnMeta
            ? { item, error: err.message || err, success: false }
            : null;
        });
    });

    const batchResults = await Promise.all(promises);
    results.push(...batchResults);
  }

  return results;
}

module.exports = { requestBatcher };
