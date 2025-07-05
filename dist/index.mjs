import { retryHelper } from '../index.js';
import { requestBatcher } from '../index.js';

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
