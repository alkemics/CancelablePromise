import CancelablePromise from './CancelablePromise';

describe('CancelablePromise', () => {
  const callback = jest.fn();
  const defer = () => new Promise((resolve) => setTimeout(resolve, 1));

  afterEach(() => {
    callback.mockClear();
  });

  it('should handle errors', async () => {
    const promise = new CancelablePromise((resolve, reject) => {
      reject('eagle');
    });
    await promise
      .then(
        () => {
          throw new Error('It should not be executed');
        },
        (reason) => {
          callback(reason);
          return 'rabbit';
        }
      )
      .then((reason) => {
        callback(reason);
      });
    expect(callback).toHaveBeenCalledTimes(2);
    expect(callback).toHaveBeenCalledWith('eagle');
    expect(callback).toHaveBeenCalledWith('rabbit');
  });

  it('should return new value to the next then', async () => {
    const promise = new CancelablePromise((resolve) => {
      resolve(5);
    });
    await promise
      .then((value) => {
        callback(value);
        return value + 10;
      })
      .then((value) => {
        callback(value);
      });
    expect(callback).toHaveBeenCalledTimes(2);
    expect(callback).toHaveBeenCalledWith(5);
    expect(callback).toHaveBeenCalledWith(15);
  });

  it('should work like a tree', async () => {
    const promise = new CancelablePromise((resolve) => {
      resolve('I am');
    });
    const promise2 = promise.then((value) => `${value} a duck`);
    const promise3 = promise.then((value) => `${value} a dog`);
    await Promise.all([
      promise2.then((value) => {
        callback(value);
      }),
      promise3.then((value) => {
        callback(value);
      }),
    ]);
    expect(callback).toHaveBeenCalledTimes(2);
    expect(callback).toHaveBeenCalledWith('I am a duck');
    expect(callback).toHaveBeenCalledWith('I am a dog');
  });

  it('should work also when then is added in a then', async () => {
    const promise = new CancelablePromise((resolve) => {
      resolve('chicken');
    });
    const promise2 = promise
      .then((value) => {
        callback(value);
        promise2.then((v) => {
          callback(v);
        });
        return 'rabbit';
      })
      .then((value) => {
        callback(value);
        return 'fox';
      });
    await promise2;
    await defer();
    expect(callback).toHaveBeenCalledTimes(3);
    expect(callback).toHaveBeenCalledWith('chicken');
    expect(callback).toHaveBeenCalledWith('fox');
    expect(callback).toHaveBeenCalledWith('rabbit');
  });

  it('should work when empty or partial then', async () => {
    const promise = new CancelablePromise((resolve) => {
      resolve('chicken');
    });
    const promise2 = promise.then();
    await promise2
      .then((value) => {
        callback(value);
        return 'fox';
      })
      .then((value) => {
        callback(value);
      });
    expect(callback).toHaveBeenCalledTimes(2);
    expect(callback).toHaveBeenCalledWith('chicken');
    expect(callback).toHaveBeenCalledWith('fox');
  });

  describe('should not execute callbacks if canceled', () => {
    it('with successful promise', async () => {
      const promise = new CancelablePromise((resolve) => {
        resolve();
      });
      promise.cancel();
      promise.then(callback, callback).then(callback, callback).catch(callback);
      await defer();
      expect(callback).not.toHaveBeenCalled();
    });

    it('with rejected promise', async () => {
      const promise = new CancelablePromise((resolve, reject) => {
        reject('rejected error');
      });
      promise.cancel();
      promise.then(callback, callback).then(callback, callback).catch(callback);
      await defer();
      expect(callback).not.toHaveBeenCalled();
    });

    it('with all promises', async () => {
      const allPromise = CancelablePromise.all([
        new Promise((resolve) => {
          resolve();
        }),
      ]);
      allPromise.cancel();
      allPromise
        .then(callback, callback)
        .then(callback, callback)
        .catch(callback);
      await defer();
      expect(callback).not.toHaveBeenCalled();
    });

    it('with raced promises', async () => {
      const racedPromise = CancelablePromise.race([
        new Promise((resolve) => {
          resolve();
        }),
      ]);
      racedPromise.cancel();
      racedPromise
        .then(callback, callback)
        .then(callback, callback)
        .catch(callback);
      await defer();
      expect(callback).not.toHaveBeenCalled();
    });

    it('with static reject', async () => {
      const staticRejectedPromise = CancelablePromise.reject(
        new Promise((resolve) => {
          resolve();
        })
      );
      staticRejectedPromise.cancel();
      staticRejectedPromise
        .then(callback, callback)
        .then(callback, callback)
        .catch(callback);
      await defer();
      expect(callback).not.toHaveBeenCalled();
    });
  });

  it('should reject the promise when the success callback throws an error', async () => {
    const promise = new CancelablePromise((resolve) => {
      resolve();
    });
    await promise
      .then(() => {
        callback();
        throw new Error('rejected error');
      })
      .catch(callback);
    expect(callback).toHaveBeenCalledTimes(2);
  });

  it('should reject the promise when the error callback throws an error', async () => {
    const promise = new CancelablePromise((resolve, reject) => {
      reject(new Error('rejected error'));
    });
    await promise
      .catch((error) => {
        callback();
        throw error;
      })
      .catch(callback);
    expect(callback).toHaveBeenCalledTimes(2);
  });

  it('should call cancel function if rejected after a cancel', async () => {
    const promise = new CancelablePromise((resolve, reject) => {
      reject(new Error('rejected error'));
    });
    promise.then(callback, callback);
    promise.catch(callback);
    promise.cancel(callback);
    await defer();
    expect(callback).toHaveBeenCalledTimes(1);
  });
});
