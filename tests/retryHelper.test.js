import { describe, it, expect } from 'vitest';
import { retryHelper } from '../dist/index.cjs';

describe('retryHelper', () => {
  it('should retry and succeed', async () => {
    let attempts = 0;

    const result = await retryHelper(
      async (signal) => {
        attempts++;
        if (attempts < 3) throw new Error('fail');
        return 'success';
      },
      {
        retries: 5,
        delay: 10,
        timeout: 500,
      },
    );

    expect(result).toBe('success');
    expect(attempts).toBe(3);
  });

  it('should fail after max retries', async () => {
    let attempts = 0;

    await expect(() =>
      retryHelper(
        () => {
          attempts++;
          throw new Error('always fails');
        },
        {
          retries: 2,
          delay: 10,
          timeout: 500,
        },
      ),
    ).rejects.toThrow('always fails');

    expect(attempts).toBe(2);
  });
});
