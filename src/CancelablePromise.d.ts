type CancelablePromiseExecutor<T> = (
  resolve: (value?: T | PromiseLike<T>) => void,
  reject: (reason?: any) => void,
  onCancel: (cancelHandler: () => void) => void
) => void;

interface PromiseFulfilledResult<T> {
  status: 'fulfilled';
  value: T;
}

interface PromiseRejectedResult {
  status: 'rejected';
  reason: any;
}

type PromiseSettledResult<T> =
  | PromiseFulfilledResult<T>
  | PromiseRejectedResult;

export interface CancelablePromiseType<T> {
  /**
   * Attaches callbacks for the resolution and/or rejection of the Promise.
   * @param onfulfilled The callback to execute when the Promise is resolved.
   * @param onrejected The callback to execute when the Promise is rejected.
   * @returns A Promise for the completion of which ever callback is executed.
   */
  then<TResult1 = T, TResult2 = never>(
    onfulfilled?:
      | ((value: T) => TResult1 | PromiseLike<TResult1>)
      | undefined
      | null,
    onrejected?:
      | ((reason: any) => TResult2 | PromiseLike<TResult2>)
      | undefined
      | null
  ): CancelablePromiseType<TResult1 | TResult2>;

  /**
   * Attaches a callback for only the rejection of the Promise.
   * @param onrejected The callback to execute when the Promise is rejected.
   * @returns A Promise for the completion of the callback.
   */
  catch<TResult = never>(
    onrejected?:
      | ((reason: any) => TResult | PromiseLike<TResult>)
      | undefined
      | null
  ): CancelablePromiseType<T | TResult>;

  /**
   * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
   * resolved value cannot be modified from the callback.
   * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
   * @returns A Promise for the completion of the callback.
   */
  finally(
    onfinally?: (() => void) | undefined | null,
    runWhenCanceled?: boolean
  ): CancelablePromiseType<T>;

  cancel(): void;

  isCanceled(): boolean;
}

export interface CancelablePromiseConstructor {
  /**
   * Creates a new Promise.
   * @param executor A callback used to initialize the promise. This callback is passed two arguments:
   * a resolve callback used to resolve the promise with a value or the result of another promise,
   * and a reject callback used to reject the promise with a provided reason or error.
   */
  new <T1>(executor: CancelablePromiseExecutor<T1>): CancelablePromiseType<T1>;
  <T1>(executor: CancelablePromiseExecutor<T1>): CancelablePromiseType<T1>;

  /**
   * Creates a Promise that is resolved with an array of results when all of the provided Promises
   * resolve, or rejected when any Promise is rejected.
   * @param values An array of Promises.
   * @returns A new Promise.
   */
  all<T1, T2, T3, T4, T5, T6, T7, T8, T9, T10>(
    values: readonly [
      T1 | PromiseLike<T1>,
      T2 | PromiseLike<T2>,
      T3 | PromiseLike<T3>,
      T4 | PromiseLike<T4>,
      T5 | PromiseLike<T5>,
      T6 | PromiseLike<T6>,
      T7 | PromiseLike<T7>,
      T8 | PromiseLike<T8>,
      T9 | PromiseLike<T9>,
      T10 | PromiseLike<T10>
    ]
  ): CancelablePromiseType<[T1, T2, T3, T4, T5, T6, T7, T8, T9, T10]>;

  /**
   * Creates a Promise that is resolved with an array of results when all of the provided Promises
   * resolve, or rejected when any Promise is rejected.
   * @param values An array of Promises.
   * @returns A new Promise.
   */
  all<T1, T2, T3, T4, T5, T6, T7, T8, T9>(
    values: readonly [
      T1 | PromiseLike<T1>,
      T2 | PromiseLike<T2>,
      T3 | PromiseLike<T3>,
      T4 | PromiseLike<T4>,
      T5 | PromiseLike<T5>,
      T6 | PromiseLike<T6>,
      T7 | PromiseLike<T7>,
      T8 | PromiseLike<T8>,
      T9 | PromiseLike<T9>
    ]
  ): CancelablePromiseType<[T1, T2, T3, T4, T5, T6, T7, T8, T9]>;

  /**
   * Creates a Promise that is resolved with an array of results when all of the provided Promises
   * resolve, or rejected when any Promise is rejected.
   * @param values An array of Promises.
   * @returns A new Promise.
   */
  all<T1, T2, T3, T4, T5, T6, T7, T8>(
    values: readonly [
      T1 | PromiseLike<T1>,
      T2 | PromiseLike<T2>,
      T3 | PromiseLike<T3>,
      T4 | PromiseLike<T4>,
      T5 | PromiseLike<T5>,
      T6 | PromiseLike<T6>,
      T7 | PromiseLike<T7>,
      T8 | PromiseLike<T8>
    ]
  ): CancelablePromiseType<[T1, T2, T3, T4, T5, T6, T7, T8]>;

  /**
   * Creates a Promise that is resolved with an array of results when all of the provided Promises
   * resolve, or rejected when any Promise is rejected.
   * @param values An array of Promises.
   * @returns A new Promise.
   */
  all<T1, T2, T3, T4, T5, T6, T7>(
    values: readonly [
      T1 | PromiseLike<T1>,
      T2 | PromiseLike<T2>,
      T3 | PromiseLike<T3>,
      T4 | PromiseLike<T4>,
      T5 | PromiseLike<T5>,
      T6 | PromiseLike<T6>,
      T7 | PromiseLike<T7>
    ]
  ): CancelablePromiseType<[T1, T2, T3, T4, T5, T6, T7]>;

  /**
   * Creates a Promise that is resolved with an array of results when all of the provided Promises
   * resolve, or rejected when any Promise is rejected.
   * @param values An array of Promises.
   * @returns A new Promise.
   */
  all<T1, T2, T3, T4, T5, T6>(
    values: readonly [
      T1 | PromiseLike<T1>,
      T2 | PromiseLike<T2>,
      T3 | PromiseLike<T3>,
      T4 | PromiseLike<T4>,
      T5 | PromiseLike<T5>,
      T6 | PromiseLike<T6>
    ]
  ): CancelablePromiseType<[T1, T2, T3, T4, T5, T6]>;

  /**
   * Creates a Promise that is resolved with an array of results when all of the provided Promises
   * resolve, or rejected when any Promise is rejected.
   * @param values An array of Promises.
   * @returns A new Promise.
   */
  all<T1, T2, T3, T4, T5>(
    values: readonly [
      T1 | PromiseLike<T1>,
      T2 | PromiseLike<T2>,
      T3 | PromiseLike<T3>,
      T4 | PromiseLike<T4>,
      T5 | PromiseLike<T5>
    ]
  ): CancelablePromiseType<[T1, T2, T3, T4, T5]>;

  /**
   * Creates a Promise that is resolved with an array of results when all of the provided Promises
   * resolve, or rejected when any Promise is rejected.
   * @param values An array of Promises.
   * @returns A new Promise.
   */
  all<T1, T2, T3, T4>(
    values: readonly [
      T1 | PromiseLike<T1>,
      T2 | PromiseLike<T2>,
      T3 | PromiseLike<T3>,
      T4 | PromiseLike<T4>
    ]
  ): CancelablePromiseType<[T1, T2, T3, T4]>;

  /**
   * Creates a Promise that is resolved with an array of results when all of the provided Promises
   * resolve, or rejected when any Promise is rejected.
   * @param values An array of Promises.
   * @returns A new Promise.
   */
  all<T1, T2, T3>(
    values: readonly [
      T1 | PromiseLike<T1>,
      T2 | PromiseLike<T2>,
      T3 | PromiseLike<T3>
    ]
  ): CancelablePromiseType<[T1, T2, T3]>;

  /**
   * Creates a Promise that is resolved with an array of results when all of the provided Promises
   * resolve, or rejected when any Promise is rejected.
   * @param values An array of Promises.
   * @returns A new Promise.
   */
  all<T1, T2>(
    values: readonly [T1 | PromiseLike<T1>, T2 | PromiseLike<T2>]
  ): CancelablePromiseType<[T1, T2]>;

  /**
   * Creates a Promise that is resolved with an array of results when all of the provided Promises
   * resolve, or rejected when any Promise is rejected.
   * @param values An array of Promises.
   * @returns A new Promise.
   */
  all<T1>(
    values: readonly (T1 | PromiseLike<T1>)[]
  ): CancelablePromiseType<T1[]>;

  /**
   * Creates a Promise that is resolved or rejected when any of the provided Promises are resolved
   * or rejected.
   * @param values An array of Promises.
   * @returns A new Promise.
   */
  race<T1>(
    values: readonly T1[]
  ): CancelablePromiseType<T1 extends PromiseLike<infer U> ? U : T1>;

  /**
   * Creates a Promise that is resolved or rejected when any of the provided Promises are resolved
   * or rejected.
   * @param values An iterable of Promises.
   * @returns A new Promise.
   */
  race<T1>(
    values: Iterable<T1>
  ): CancelablePromiseType<T1 extends PromiseLike<infer U> ? U : T1>;

  /**
   * Creates a new rejected promise for the provided reason.
   * @param reason The reason the promise was rejected.
   * @returns A new rejected Promise.
   */
  reject<T1 = never>(reason?: any): CancelablePromiseType<T1>;

  /**
   * Creates a new resolved promise for the provided value.
   * @param value A promise.
   * @returns A promise whose internal state matches the provided promise.
   */
  resolve<T1>(value: T1 | PromiseLike<T1>): CancelablePromiseType<T1>;

  /**
   * Creates a new resolved promise .
   * @returns A resolved promise.
   */
  resolve(): CancelablePromiseType<void>;

  /**
   * Creates a Promise that is resolved with an array of results when all
   * of the provided Promises resolve or reject.
   * @param values An array of Promises.
   * @returns A new Promise.
   */
  allSettled<T1 extends readonly unknown[] | readonly [unknown]>(
    values: T1
  ): CancelablePromiseType<
    {
      -readonly [P in keyof T1]: PromiseSettledResult<
        T1[P] extends PromiseLike<infer U> ? U : T1[P]
      >;
    }
  >;

  /**
   * Creates a Promise that is resolved with an array of results when all
   * of the provided Promises resolve or reject.
   * @param values An array of Promises.
   * @returns A new Promise.
   */
  allSettled<T1>(
    values: Iterable<T1>
  ): CancelablePromiseType<
    PromiseSettledResult<T1 extends PromiseLike<infer U> ? U : T1>[]
  >;
}

export function cancelable<T>(
  promise: PromiseLike<T>
): CancelablePromiseType<T>;

export const CancelablePromise: CancelablePromiseConstructor;
export default CancelablePromise;
