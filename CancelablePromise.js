export default class CancelablePromise {
  constructor(executor) {
    let superResolve, superReject;
    this._promise = new Promise(executor);

    this._canceled = false;
    this._onError = [];
    this._onSuccess = [];

    let success = (...args) => {
      if(this._canceled) return;

      this._onSuccess.forEach((cb) => {
        cb(...args);
      });
      this.then = this._promise.then.bind(this._promise);
    };

    let error = (...args) => {
      if(this._canceled) return;

      this._onError.forEach((cb) => {
        cb(...args);
      });
      this.then = this._promise.then.bind(this._promise);
    };
    this._promise.then(success, error);
  }

  then(success, error) {
    if (success) this._onSuccess.push(success);
    if (error) this._onError.push(error);
  }

  cancel() {
    this._canceled = true;
  }
}
