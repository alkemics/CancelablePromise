export default class CancelablePromise {
  static all(iterable) {
    return Promise.all(iterable);
  }
  static race(iterable) {
    return Promise.race(iterable);
  }
  static reject(iterable) {
    return Promise.reject(iterable);
  }
  static resolve(iterable) {
    return Promise.resolve(iterable);
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
          resolve(success(r));
        } else {
          resolve(r);
        }
      }, (r) => {
        if (this._canceled) {
          p.cancel();
        }
        if (error && !this._canceled) {
          resolve(error(r));
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
