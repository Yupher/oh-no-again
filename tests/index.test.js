import { describe, it, expect } from 'vitest';
import { retryHelper, requestBatcher } from '../index.js';

describe('Main exports', () => {
  it('should export retryHelper and requestBatcher', () => {
    expect(typeof retryHelper).toBe('function');
    expect(typeof requestBatcher).toBe('function');
  });
});
