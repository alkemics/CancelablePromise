const handleCallback = (resolve, reject, callback, r) => {
  try {
    resolve(callback(r));
  } catch (e) {
    reject(e);
  }
};

export default class CancelablePromise {
  static all(iterable) {
    return new CancelablePromise((y, n) => {
      Promise.all(iterable).then(y, n);
    });
  }

  static race(iterable) {
    return new CancelablePromise((y, n) => {
      Promise.race(iterable).then(y, n);
    });
  }

  static reject(value) {
    return new CancelablePromise((y, n) => {
      Promise.reject(value).then(y, n);
    });
  }

  static resolve(value) {
    return new CancelablePromise((y, n) => {
      Promise.resolve(value).then(y, n);
    });
  }

  constructor(executor) {
    this._promise = new Promise(executor);
    this._canceled = false;
  }

  then(success, error) {
    const p = new CancelablePromise((resolve, reject) => {
      this._promise.then((r) => {
        if (this._canceled) {
          p.cancel();
        }
        if (success && !this._canceled) {
          handleCallback(resolve, reject, success, r);
        } else {
          resolve(r);
        }
      }, (r) => {
        if (this._canceled) {
          p.cancel();
        }
        if (error && !this._canceled) {
          handleCallback(resolve, reject, error, r);
        } else {
          reject(r);
        }
      });
    });
    return p;
  }

  catch(error) {
    return this.then(undefined, error);
  }

  cancel() {
    this._canceled = true;
    return this;
  }
}
