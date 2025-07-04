const { requestBatcher } = require('./src/requestBatcher');
const { retryHelper } = require('./src/retryHelper');

/**
 * @module oh-no-again
 * @description Tiny utility for retrying, batching, and timing out async tasks.
 */

/**
 * @typedef {import('./src/requestBatcher').requestBatcher} requestBatcher
 * @typedef {import('./src/retryHelper').retryHelper} retryHelper
 */

module.exports = {
  /** @type {requestBatcher} */
  requestBatcher,

  /** @type {retryHelper} */
  retryHelper,
};
