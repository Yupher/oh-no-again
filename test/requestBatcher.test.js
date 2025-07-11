import { describe, it, expect, vi, beforeEach } from 'vitest';
import { requestBatcher } from '../dist/index.cjs';

describe('requestBatcher', () => {
  const successMock = vi.fn();
  const failureMock = vi.fn();
  const retryMock = vi.fn();
  const abortMock = vi.fn();
  const batchStartMock = vi.fn();
  const batchCompleteMock = vi.fn();

  const hooks = {
    onSuccess: successMock,
    onFailure: failureMock,
    onRetry: retryMock,
    onAbort: abortMock,
    onBatchStart: batchStartMock,
    onBatchComplete: batchCompleteMock,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should batch and return metadata', async () => {
    const data = [1, 2, 3, 4];

    const result = await requestBatcher(
      data,
      2,
      (item) => ({
        url: 'https://httpbin.org/get',
        method: 'GET',
      }),
      {
        retries: 3,
        timeout: 1000,
        returnMeta: true,
        hooks,
      },
    );

    expect(result.length).toBe(4);
    expect(result.every((r) => r.success)).toBe(true);
    expect(successMock).toHaveBeenCalled();
    expect(batchStartMock).toHaveBeenCalled();
    expect(batchCompleteMock).toHaveBeenCalled();
  });

  it('should skip items when taskFn returns false', async () => {
    const data = [1, 2];

    const result = await requestBatcher(
      data,
      1,
      (item) => (item === 2 ? false : { url: 'https://httpbin.org/get' }),
      {
        returnMeta: true,
      },
    );

    expect(result.length).toBe(2);
    expect(result[0].success).toBe(true);
    expect(result[1].success).toBe(false);
    expect(result[1].skipped).toBe(true);
  });

  it('should retry on failure and call hooks', async () => {
    let attempt = 0;
    const result = await requestBatcher(
      [1],
      1,
      () => ({
        url: 'https://httpstat.us/500', // always fails
        method: 'GET',
      }),
      {
        retries: 2,
        delay: 10,
        returnMeta: true,
        hooks,
      },
    );

    expect(result[0].success).toBe(false);
    expect(retryMock).toHaveBeenCalled();
    expect(failureMock).toHaveBeenCalled();
  });
});
