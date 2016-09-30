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
    this._onError = [];
    this._onSuccess = [];

    let success = (...args) => {
      if(this._canceled) return;

      this.then = this._promise.then.bind(this._promise);

      this._onSuccess.forEach((cb) => {
        cb(...args);
      });
    };

    let error = (...args) => {
      if(this._canceled) return;

      this.then = this._promise.then.bind(this._promise);

      this._onError.forEach((cb) => {
        cb(...args);
      });
    };
    this._promise.then(success, error);
  }

  then(success, error) {
    if (success) this._onSuccess.push(success);
    if (error) this._onError.push(error);
    return this;
  }

  catch(error) {
    if (error) this._onError.push(error);
    return this;
  }

  cancel() {
    this._canceled = true;
  }
}
