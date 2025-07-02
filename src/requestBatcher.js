const { createBatches } = require('./batch');
const { retryHelper } = require('./retryHelper');

async function requestBatcher(data, batchSize, taskFn, retryOptions = {}) {
  const batches = createBatches(data, batchSize);
  const results = [];

  for (const batch of batches) {
    const promises = batch.map((item, i) => {
      const fn = (signal) =>
        taskFn.length >= 3 ? taskFn(item, i, signal) : taskFn(item, i);

      return retryOptions.retries > 0 ? retryHelper(fn, retryOptions) : fn();
    });

    const batchResults = await Promise.all(promises);
    results.push(...batchResults);
  }

  return results;
}

module.exports = { requestBatcher };
