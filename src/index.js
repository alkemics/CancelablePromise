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

function cancelFunc(extraProps) {
  if (!extraProps.isCanceled) {
    extraProps.isCanceled = true;
    const controllerOpt = extraProps.options?.controller;
    if (controllerOpt) {
      // controller option can be a single controller or a list of controllers
      const controllers = [].concat(controllerOpt);
      for (const controller of controllers) {
        controller?.abort();
      }
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

export const makeCancelable = (promise, options) => {
  const cancelablePromise = proxify(promise, { isCanceled: false, options });
  const signalOpt = options?.signal;
  if (signalOpt) {
    const signals = [].concat(signalOpt);
    for (const signal of signals) {
      signal.addEventListener('abort', () => {
        cancelablePromise.cancel();
      });
    }
  }
  return cancelablePromise;
};

export const cancelablePromise = (executor, options) => {
  return makeCancelable(new Promise(executor), options);
};

export class CancelablePromise {
  static all(iterable, options) {
    return makeCancelable(Promise.all(iterable), options);
  }

  static allSettled(iterable, options) {
    return makeCancelable(Promise.allSettled(iterable), options);
  }

  static race(iterable, options) {
    return makeCancelable(Promise.race(iterable), options);
  }

  static reject(value, options) {
    return makeCancelable(Promise.reject(value), options);
  }

  static resolve(value, options) {
    return makeCancelable(Promise.resolve(value), options);
  }

  constructor(executor, options) {
    const promise = cancelablePromise(executor, options);
    this.then = promise.then;
    this.catch = promise.catch;
    this.finally = promise.finally;
    this.cancel = promise.cancel;
  }
}
