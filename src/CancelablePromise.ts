const toStringTag: typeof Symbol.toStringTag =
  typeof Symbol !== 'undefined' ? Symbol.toStringTag : ('@@toStringTag' as any);

class CancelablePromiseInternal<T = any> {
  #internals: Internals;
  #promise: Promise<T>;

  [toStringTag] = 'CancelablePromise';

  constructor({
    executor = () => {},
    internals = defaultInternals(),
    promise = new Promise<T>((resolve, reject) =>
      executor(resolve, reject, (onCancel) => {
        internals.onCancelList.push(onCancel);
      })
    ),
  }: {
    executor?: (
      resolve: (value: T | PromiseLike<T>) => void,
      reject: (reason?: any) => void,
      onCancel: (cancelHandler: () => void) => void
    ) => void;
    internals?: Internals;
    promise?: Promise<T>;
  }) {
    this.cancel = this.cancel.bind(this);
    this.#internals = internals;
    this.#promise =
      promise ||
      new Promise<T>((resolve, reject) =>
        executor(resolve, reject, (onCancel) => {
          internals.onCancelList.push(onCancel);
        })
      );
  }

  then<TResult1 = T, TResult2 = never>(
    onfulfilled?:
      | ((
          value: T
        ) => TResult1 | PromiseLike<TResult1> | CancelablePromise<TResult1>)
      | undefined
      | null,
    onrejected?:
      | ((
          reason: any
        ) => TResult2 | PromiseLike<TResult2> | CancelablePromise<TResult2>)
      | undefined
      | null
  ): CancelablePromise<TResult1 | TResult2> {
    return makeCancelable<TResult1 | TResult2>(
      this.#promise.then(
        createCallback(onfulfilled, this.#internals),
        createCallback(onrejected, this.#internals)
      ),
      this.#internals
    );
  }

  catch<TResult = never>(
    onrejected?:
      | ((
          reason: any
        ) => TResult | PromiseLike<TResult> | CancelablePromise<TResult>)
      | undefined
      | null
  ): CancelablePromise<T | TResult> {
    return makeCancelable<T | TResult>(
      this.#promise.catch(createCallback(onrejected, this.#internals)),
      this.#internals
    );
  }

  finally(
    onfinally?: (() => void) | undefined | null,
    runWhenCanceled?: boolean
  ): CancelablePromise<T> {
    if (runWhenCanceled) {
      this.#internals.onCancelList.push(onfinally);
    }
    return makeCancelable<T>(
      this.#promise.finally(
        createCallback(() => {
          if (onfinally) {
            if (runWhenCanceled) {
              this.#internals.onCancelList =
                this.#internals.onCancelList.filter(
                  (callback) => callback !== onfinally
                );
            }
            return onfinally();
          }
        }, this.#internals)
      ),
      this.#internals
    );
  }

  cancel(): void {
    this.#internals.isCanceled = true;
    const callbacks = this.#internals.onCancelList;
    this.#internals.onCancelList = [];
    for (const callback of callbacks) {
      if (typeof callback === 'function') {
        try {
          callback();
        } catch (err) {
          console.error(err);
        }
      }
    }
  }

  isCanceled(): boolean {
    return this.#internals.isCanceled === true;
  }
}

export class CancelablePromise<T = any> extends CancelablePromiseInternal<T> {
  static all = function all(iterable: any) {
    return makeAllCancelable(iterable, Promise.all(iterable));
  } as CancelablePromiseOverloads['all'];

  static allSettled = function allSettled(iterable: any) {
    return makeAllCancelable(iterable, Promise.allSettled(iterable));
  } as CancelablePromiseOverloads['allSettled'];

  static any = function any(iterable: any) {
    return makeAllCancelable(iterable, Promise.any(iterable));
  } as CancelablePromiseOverloads['any'];

  static race = function race(iterable) {
    return makeAllCancelable(iterable, Promise.race(iterable));
  } as CancelablePromiseOverloads['race'];

  static resolve = function resolve(value) {
    return cancelable(Promise.resolve(value));
  } as CancelablePromiseOverloads['resolve'];

  static reject = function reject(reason) {
    return cancelable(Promise.reject(reason));
  } as CancelablePromiseOverloads['reject'];

  static isCancelable = isCancelablePromise;

  constructor(
    executor: (
      resolve: (value: T | PromiseLike<T>) => void,
      reject: (reason?: any) => void,
      onCancel: (cancelHandler: () => void) => void
    ) => void
  ) {
    super({ executor });
  }
}

export default CancelablePromise;

export function cancelable<T = any>(promise: Promise<T>): CancelablePromise<T> {
  return makeCancelable(promise, defaultInternals());
}

export function isCancelablePromise(promise: any): boolean {
  return (
    promise instanceof CancelablePromise ||
    promise instanceof CancelablePromiseInternal
  );
}

function createCallback(onResult: any, internals: Internals) {
  if (onResult) {
    return (arg?: any) => {
      if (!internals.isCanceled) {
        const result = onResult(arg);
        if (isCancelablePromise(result)) {
          internals.onCancelList.push(result.cancel);
        }
        return result;
      }
      return arg;
    };
  }
}

function makeCancelable<T>(promise: Promise<T>, internals: Internals) {
  return new CancelablePromiseInternal<T>({
    internals,
    promise,
  }) as CancelablePromise<T>;
}

function makeAllCancelable(iterable: any, promise: Promise<any>) {
  const internals = defaultInternals();
  internals.onCancelList.push(() => {
    for (const resolvable of iterable) {
      if (isCancelablePromise(resolvable)) {
        resolvable.cancel();
      }
    }
  });
  return new CancelablePromiseInternal({ internals, promise });
}

function defaultInternals(): Internals {
  return { isCanceled: false, onCancelList: [] };
}

interface Internals {
  isCanceled: boolean;
  onCancelList: any[];
}

interface CancelablePromiseOverloads {
  all<T extends readonly unknown[] | []>(
    values: T
  ): CancelablePromise<{ -readonly [P in keyof T]: Awaited<T[P]> }>;

  allSettled<T extends readonly unknown[] | []>(
    values: T
  ): CancelablePromise<{
    -readonly [P in keyof T]: PromiseSettledResult<Awaited<T[P]>>;
  }>;

  allSettled<T>(
    values: Iterable<T | PromiseLike<T> | CancelablePromise<T>>
  ): CancelablePromise<PromiseSettledResult<Awaited<T>>[]>;

  any<T extends readonly unknown[] | []>(
    values: T
  ): CancelablePromise<Awaited<T[number]>>;

  any<T>(
    values: Iterable<T | PromiseLike<T> | CancelablePromise<T>>
  ): CancelablePromise<Awaited<T>>;

  race<T extends readonly unknown[] | []>(
    values: T
  ): CancelablePromise<Awaited<T[number]>>;

  resolve(): CancelablePromise<void>;

  resolve<T>(
    value: T | PromiseLike<T> | CancelablePromise<T>
  ): CancelablePromise<T>;

  reject<T = never>(reason?: any): CancelablePromise<T>;
}
