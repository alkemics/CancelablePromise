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
  return cancelable(
    this.then(
      createCallback(onSuccess, options),
      createCallback(onError, options)
    ),
    options
  );
}

function catchFunc(options, onError) {
  return cancelable(this.catch(createCallback(onError, options)), options);
}

function finallyFunc(options, onFinally) {
  return cancelable(this.finally(onFinally), options);
}

function cancelFunc(options) {
  options.isCanceled = true;
}

function isCanceled(options) {
  return options.isCanceled;
}

export function cancelable(promise, options = { isCanceled: false }) {
  return {
    then: thenFunc.bind(promise, options),
    catch: catchFunc.bind(promise, options),
    finally: finallyFunc.bind(promise, options),
    cancel: cancelFunc.bind(promise, options),
    isCanceled: isCanceled.bind(promise, options),
  };
}

export function CancelablePromise(executor) {
  return cancelable(new Promise(executor));
}

CancelablePromise.all = (iterable) => cancelable(Promise.all(iterable));
CancelablePromise.allSettled = (iterable) =>
  cancelable(Promise.allSettled(iterable));
CancelablePromise.race = (iterable) => cancelable(Promise.race(iterable));
CancelablePromise.resolve = (value) => cancelable(Promise.resolve(value));
CancelablePromise.reject = (value) => cancelable(Promise.reject(value));

export default CancelablePromise;
