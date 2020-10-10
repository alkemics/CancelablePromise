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

function makeCancelable(promise, options) {
  const methods = {
    then(onSuccess, onError) {
      return makeCancelable(
        promise.then(
          createCallback(onSuccess, options),
          createCallback(onError, options)
        ),
        options
      );
    },

    catch(onError) {
      return makeCancelable(
        promise.catch(createCallback(onError, options)),
        options
      );
    },

    finally(onFinally, runWhenCanceled) {
      if (runWhenCanceled) {
        if (!options.finallyList) {
          options.finallyList = [];
        }
        options.finallyList.push(onFinally);
      }
      return makeCancelable(
        promise.finally(() => {
          if (runWhenCanceled) {
            options.finallyList = options.finallyList.filter(
              (callback) => callback !== onFinally
            );
          }
          return onFinally();
        }),
        options
      );
    },

    cancel() {
      options.isCanceled = true;
      for (const callbacks of [options.onCancelList, options.finallyList]) {
        if (callbacks) {
          while (callbacks.length) {
            const onCancel = callbacks.shift();
            if (typeof onCancel === 'function') {
              onCancel();
            }
          }
        }
      }
    },

    isCanceled() {
      return options.isCanceled === true;
    },
  };

  return {
    then: methods.then.bind(undefined),
    catch: methods.catch.bind(undefined),
    finally: methods.finally.bind(undefined),
    cancel: methods.cancel.bind(undefined),
    isCanceled: methods.isCanceled.bind(undefined),
  };
}

export function cancelable(promise) {
  return makeCancelable(promise, {});
}

export function CancelablePromise(executor) {
  const onCancelList = [];
  return makeCancelable(
    new Promise((resolve, reject) => {
      return executor(resolve, reject, (onCancel) => {
        onCancelList.push(onCancel);
      });
    }),
    { onCancelList }
  );
}

CancelablePromise.all = (iterable) => cancelable(Promise.all(iterable));
CancelablePromise.allSettled = (iterable) =>
  cancelable(Promise.allSettled(iterable));
CancelablePromise.race = (iterable) => cancelable(Promise.race(iterable));
CancelablePromise.resolve = (value) => cancelable(Promise.resolve(value));
CancelablePromise.reject = (value) => cancelable(Promise.reject(value));

export default CancelablePromise;
