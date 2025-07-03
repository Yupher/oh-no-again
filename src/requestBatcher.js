const { createBatches } = require('./batch');
const { retryHelper } = require('./retryHelper');
const { ohFetch } = require('./ohFetch');
async function requestBatcher(data, batchSize, taskFn, options = {}) {
  const batches = createBatches(data, batchSize);
  const results = [];

  for (const batch of batches) {
    const promises = batch.map((item, i) => {
      const fn = (signal) =>
        ohFetch(taskFn(item), {
          ...options,
          signal, // pass signal to ohFetch
        });

      return options.retries > 0 ? retryHelper(fn, options) : fn();
    });

    const batchResults = await Promise.all(promises);
    results.push(...batchResults);
  }

  return results;
}

module.exports = { requestBatcher };
