// oh-no-again.d.ts

/**
 * Retry configuration options.
 */
export interface RetryOptions {
  /** Maximum number of retry attempts (default: 3) */
  retries?: number;

  /** Initial delay between retries in milliseconds (default: 300ms) */
  delay?: number;

  /** Timeout per attempt in milliseconds (default: 1000ms) */
  timeout?: number;
}

/**
 * Helper function to retry an async operation with exponential backoff and timeout support.
 * @param fn The async function that receives an AbortSignal.
 * @param options Retry configuration options.
 * @returns The resolved result of the function if successful, or throws an error.
 */
export function retryHelper<T>(
  fn: (signal: AbortSignal) => Promise<T>,
  options?: RetryOptions,
): Promise<T>;

/**
 * Describes a fetch-compatible request task.
 */
export interface TaskRequest {
  url: string;
  method?: string;
  headers?: Record<string, string>;
  body?: any;
}

/**
 * Same as RetryOptions, reused for batching.
 */
export interface BatcherOptions extends RetryOptions {}

/**
 * Executes async tasks in batches with a concurrency limit.
 * Each task is retried on failure with timeout and abort support.
 * @param array The input items to process.
 * @param concurrency Max number of parallel executions.
 * @param taskFn A function that receives an input item and returns a TaskRequest.
 * @param options Optional retry + timeout settings.
 * @returns A Promise resolving to an array of results.
 */
export function requestBatcher<TInput, TResult>(
  array: TInput[],
  concurrency: number,
  taskFn: (item: TInput) => TaskRequest,
  options?: BatcherOptions,
): Promise<TResult[]>;

/**
 * Optional internal fetch wrapper used under the hood.
 * May be exported in the future.
 */
// export function ohFetch<T = any>(
//   url: string,
//   options?: {
//     method?: string;
//     headers?: Record<string, string>;
//     body?: any;
//     signal?: AbortSignal;
//   }
// ): Promise<T>;
