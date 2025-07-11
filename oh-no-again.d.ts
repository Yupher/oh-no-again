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
  hooks?: RetryHooks;
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
export interface BatcherOptions extends RetryOptions {
  failFast?: boolean; // If true, aborts the batch immediately on first failure
  returnMeta?: boolean; // // If true, results include { item, result/error, success }
  hooks?: BatchHooks;
}
export interface BatchSuccess<TInput, TResult> {
  item: TInput;
  result: TResult;
  status?: number;
  success: true;
}

export interface BatchFailure<TInput> {
  item: TInput;
  error: string;
  status?: number;
  success: false;
}
export interface RetryHooks {
  onRetry?: (error: Error, attempt: number) => void;
  onAbort?: (error: Error) => void;
  onSuccess?: (result: any) => void;
  onFailure?: (error: Error) => void;
}
export interface BatchHooks extends RetryHooks {
  onBatchStart?: (batchIndex: number, batch: any[]) => void;
  onBatchComplete?: (batchIndex: number, results: any[]) => void;
}

/**
 * Executes async tasks in batches with a concurrency limit.
 * Each task is retried on failure with timeout and abort support.
 * @param array The input items to process.
 * @param concurrency Max number of parallel executions.
 * @param taskFn A function that receives an input item and returns a TaskRequest.
 * @param options Optional retry + timeout settings.
 * @returns A Promise resolving to an array of results.
 */
export type BatchResult<TInput, TResult> =
  | TResult
  | BatchSuccess<TInput, TResult>
  | BatchFailure<TInput>;

export function requestBatcher<TInput, TResult>(
  array: TInput[],
  concurrency: number,
  taskFn: (item: TInput) => TaskRequest | false,
  options?: BatcherOptions,
): Promise<Array<BatchResult<TInput, TResult>>>;

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
