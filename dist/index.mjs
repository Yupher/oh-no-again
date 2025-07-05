import { retryHelper } from '../src/retryHelper.js';
import { requestBatcher } from '../src/requestBatcher.js';

/**
 * @module oh-no-again
 * @description Tiny utility for retrying, batching, and timing out async tasks.
 */

/**
 * @typedef {import('./src/requestBatcher').requestBatcher} requestBatcher
 * @typedef {import('./src/retryHelper').retryHelper} retryHelper
 */

export {
  /** @type {requestBatcher} */
  requestBatcher,

  /** @type {retryHelper} */
  retryHelper,
};
