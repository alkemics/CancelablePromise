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
    let superResolve, superReject;
    this._promise = new Promise(executor);

    this._canceled = false;
  }

  then(success, error) {
    return new CancelablePromise((resolve, reject) => {
      this._promise.then((r) => {
        if (success && !this._canceled) {
          const returned = success(r);
          resolve(returned || r);
        }
      }, (r) => {
        if (error && !this._canceled) {
          const returned = error(r);
          reject(returned || r);
        }
      });
    });
  }

  catch(error) {
    return this.then(undefined, error);
  }

  cancel() {
    this._canceled = true;
    return this;
  }
}
