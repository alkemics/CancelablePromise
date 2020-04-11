function createCallback(onResult, options) {
  if (onResult) {
    return (arg) => {
      if (!options.isCanceled) {
        return onResult(arg);
      }
      return arg;
    };
  }
}

function thenFunc(options, onSuccess, onError) {
  return proxify(
    this.then(
      createCallback(onSuccess, options),
      createCallback(onError, options)
    ),
    options
  );
}

function catchFunc(options, onError) {
  return proxify(this.catch(createCallback(onError, options)), options);
}

function finallyFunc(options, onFinally) {
  return proxify(this.finally(onFinally), options);
}

function cancelFunc(options) {
  options.isCanceled = true;
}

function proxify(promise, options = { isCanceled: false }) {
  return {
    then: thenFunc.bind(promise, options),
    catch: catchFunc.bind(promise, options),
    finally: finallyFunc.bind(promise, options),
    cancel: cancelFunc.bind(promise, options),
  };
}

export function CancelablePromise(arg) {
  const promise =
    Object.prototype.toString.call(arg) === '[object Promise]'
      ? arg
      : new Promise(arg);
  return proxify(promise);
}

CancelablePromise.all = (iterable) => proxify(Promise.all(iterable));
CancelablePromise.allSettled = (iterable) =>
  proxify(Promise.allSettled(iterable));
CancelablePromise.race = (iterable) => proxify(Promise.race(iterable));
CancelablePromise.resolve = (value) => proxify(Promise.resolve(value));
CancelablePromise.reject = (value) => proxify(Promise.reject(value));

export default CancelablePromise;
