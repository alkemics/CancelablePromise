export default class CancelablePromise extends Promise {
  constructor(executor) {
    super(executor);
    this._canceled = false;
    this._onError = [];
    this._onSuccess = [];

    let success = (...args) => {
      if(this._canceled) return;

      this._onSuccess.forEach((cb) => {
        cb(...args);
      });
      this.then = super['then'];
    };

    let error = (...args) => {
      if(this._canceled) return;

      this._onError.forEach((cb) => {
        cb(...args);
      });
      this.then = super['then'];
    };
    super['then'](success, error);
  }

  then(success, error) {
    if (success) this._onSuccess.push(success);
    if (error) this._onError.push(error);
  }

  cancel() {
    this._canceled = true;
  }
}
