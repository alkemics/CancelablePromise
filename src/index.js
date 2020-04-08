function createCallback(onResult, extraProps) {
  if (onResult) {
    return (arg) => {
      if (!extraProps.isCanceled) {
        return onResult(arg);
      }
      return arg;
    };
  }
}

function thenFunc(extraProps, onSuccess, onError) {
  return proxify(
    this.then(
      createCallback(onSuccess, extraProps),
      createCallback(onError, extraProps)
    ),
    extraProps
  );
}

function catchFunc(extraProps, onError) {
  return proxify(this.catch(createCallback(onError, extraProps)), extraProps);
}

function finallyFunc(extraProps, onFinally) {
  return proxify(
    this.finally(createCallback(onFinally, extraProps)),
    extraProps
  );
}

function cancelFunc(extraProps, onCancel) {
  if (!extraProps.isCanceled) {
    extraProps.isCanceled = true;
    if (onCancel) {
      onCancel();
    }
  }
  return extraProps.isCanceled;
}

function proxify(promise, extraProps) {
  /**
   * A solution could be to use a Proxy but ES Proxy can't be polyfilled
   * cf. from core-js (https://github.com/zloirock/core-js):
   * > ES Proxy can't be polyfilled, you can try proxy-polyfill
   * > which provides a very little subset of features.
   *
   * return new Proxy(promise, {
   *   get(localPromise, prop) {
   *     switch (prop) {
   *       case 'then':
   *         return thenFunc.bind(localPromise, extraProps);
   *       case 'catch':
   *         return catchFunc.bind(localPromise, extraProps);
   *       case 'finally':
   *         return finallyFunc.bind(localPromise, extraProps);
   *       case 'cancel':
   *         return cancelFunc.bind(localPromise, extraProps);
   *       default:
   *         return localPromise[prop];
   *     }
   *   },
   * });
   */
  return {
    then: thenFunc.bind(promise, extraProps),
    catch: catchFunc.bind(promise, extraProps),
    finally: finallyFunc.bind(promise, extraProps),
    cancel: cancelFunc.bind(promise, extraProps),
  };
}

export const cancelablePromise = (executor) => {
  const promise = new Promise(executor);
  return proxify(promise, { isCanceled: false });
};

export const makeCancelable = (promise) =>
  proxify(promise, { isCanceled: false });

export class CancelablePromise {
  static all(iterable) {
    return makeCancelable(Promise.all(iterable));
  }

  static allSettled(iterable) {
    return makeCancelable(Promise.allSettled(iterable));
  }

  static race(iterable) {
    return makeCancelable(Promise.race(iterable));
  }

  static reject(value) {
    return makeCancelable(Promise.reject(value));
  }

  static resolve(value) {
    return makeCancelable(Promise.resolve(value));
  }

  constructor(executor) {
    const promise = cancelablePromise(executor);
    this.then = promise.then;
    this.catch = promise.catch;
    this.finally = promise.finally;
    this.cancel = promise.cancel;
  }
}
