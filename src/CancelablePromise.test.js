import { CancelablePromise } from './CancelablePromise';

const delay = async (timeout = 0, callback) => {
  await new Promise((resolve) => setTimeout(resolve, timeout));
  if (callback) {
    return await callback();
  }
};

describe('Fulfilled worflow', () => {
  const promises = [
    [
      'CancelablePromise()',
      () =>
        CancelablePromise(
          new Promise((resolve) => {
            delay(1, resolve);
          })
        ),
    ],
    [
      'new CancelablePromise()',
      () =>
        new CancelablePromise((resolve) => {
          delay(1, resolve);
        }),
    ],
    [
      'new Promise()',
      () =>
        new Promise((resolve) => {
          delay(1, resolve);
        }),
    ],
  ];

  const expectResolveWorkflow = async (promise1) => {
    const callback = jest.fn();
    const promise2 = promise1.then(callback);
    const promise3 = promise1.then(() => {
      callback();
      return delay(1);
    });
    const promise4 = promise2.then(callback);
    const promise5 = promise3.then(() => {
      callback();
      return delay(1);
    });
    const promise6 = promise5.then().then(callback);
    const promise7 = promise6.finally(callback);
    await Promise.all([
      promise1,
      promise2,
      promise3,
      promise4,
      promise5,
      promise6,
      promise7,
    ]);
    expect(callback).toHaveBeenCalledTimes(6);
  };

  for (const [label, createPromise] of promises) {
    it(label, async () => {
      await expectResolveWorkflow(createPromise());
    });
  }
});

describe('Rejected worflow', () => {
  const promises = [
    [
      'CancelablePromise()',
      () =>
        CancelablePromise(
          new Promise((resolve, reject) => {
            delay(1, () => reject(new Error('native promise error')));
          })
        ),
    ],
    [
      'new CancelablePromise()',
      () =>
        new CancelablePromise((resolve, reject) => {
          delay(1, () => reject(new Error('cancelable promise error')));
        }),
    ],
    [
      'new Promise()',
      () =>
        new Promise((resolve, reject) => {
          delay(1, () => reject(new Error('native promise error')));
        }),
    ],
  ];

  const expectErrorWorkflow = async (promise1) => {
    const callback = jest.fn();
    const promise2 = promise1.then(callback).catch(() => callback(1));
    const promise3 = promise1.then(callback, () => callback(2));
    const promise4 = promise3.then(() => {
      callback(3);
      return delay(1, () => Promise.reject(new Error('internal error')));
    });
    const promise5 = promise4.catch(() => callback(4));
    const promise6 = promise4.then(callback, () => callback(5));
    const promise7 = promise6.finally(() => callback(6));
    await Promise.all([promise2, promise3, promise5, promise6, promise7]);
    expect(callback).toHaveBeenCalledTimes(6);
    expect(callback).toHaveBeenCalledWith(1);
    expect(callback).toHaveBeenCalledWith(2);
    expect(callback).toHaveBeenCalledWith(3);
    expect(callback).toHaveBeenCalledWith(4);
    expect(callback).toHaveBeenCalledWith(5);
    expect(callback).toHaveBeenCalledWith(6);
  };

  for (const [label, createPromise] of promises) {
    it(label, async () => {
      await expectErrorWorkflow(createPromise());
    });
  }
});

test('Cancel root promise', async () => {
  const callback = jest.fn();
  const promise1 = CancelablePromise(
    new Promise((resolve) => {
      delay(1, resolve);
    })
  );
  const promise2 = promise1.then(callback);
  promise1.then(callback).then(callback);
  promise2.then(callback);
  promise1.cancel();
  await delay(10);
  expect(callback).toHaveBeenCalledTimes(0);
});

test('Cancel a returned promise', async () => {
  const callback = jest.fn();
  const promise1 = CancelablePromise(
    new Promise((resolve) => {
      delay(1, resolve);
    })
  );
  const promise2 = promise1.then(callback);
  promise1.then(callback).then(callback);
  promise2.then(callback);
  promise2.cancel();
  await delay(10);
  expect(callback).toHaveBeenCalledTimes(0);
});

test('Cancel a rejected promise', async () => {
  const callback = jest.fn();
  const promise1 = CancelablePromise(
    new Promise((resolve, reject) => {
      reject();
    })
  );
  promise1.cancel();
  const promise2 = promise1.catch(callback);
  promise1.then(callback, callback).then(callback);
  promise2.then(callback);
  await delay(10);
  expect(callback).toHaveBeenCalledTimes(0);
});

test('Cancel a promise but finally should be still executed', async () => {
  const callback = jest.fn();
  const promise = CancelablePromise(
    new Promise((resolve) => {
      delay(1, resolve);
    })
  ).finally(callback);
  promise.cancel();
  await delay(10);
  expect(callback).toHaveBeenCalledTimes(1);
});

test('CancelablePromise.resolve()', async () => {
  const callback = jest.fn();
  await new Promise((resolve) => resolve(CancelablePromise.resolve('ok'))).then(
    callback
  );
  expect(callback).toHaveBeenCalledTimes(1);
  expect(callback).toHaveBeenCalledWith('ok');
});

test('CancelablePromise.reject()', async () => {
  const callback = jest.fn();
  await new Promise((resolve) => resolve(CancelablePromise.reject('ko'))).catch(
    callback
  );
  expect(callback).toHaveBeenCalledTimes(1);
  expect(callback).toHaveBeenCalledWith('ko');
});

describe('CancelablePromise.all()', () => {
  it('should resolve', async () => {
    const callback = jest.fn();
    const promise = CancelablePromise.all([
      Promise.resolve('ok1'),
      delay(1, () => 'ok2'),
    ]).then(callback);
    await promise;
    expect(callback).toHaveBeenCalledTimes(1);
    expect(callback).toHaveBeenCalledWith(['ok1', 'ok2']);
  });

  it('should cancel', async () => {
    const callback = jest.fn();
    const promise = CancelablePromise.all([
      CancelablePromise.resolve(),
      delay(1),
    ]).then(callback);
    promise.cancel();
    await delay(10);
    expect(callback).toHaveBeenCalledTimes(0);
  });
});

describe('CancelablePromise.allSettled()', () => {
  it('should resolve', async () => {
    const callback = jest.fn();
    const promise = CancelablePromise.allSettled([
      CancelablePromise.resolve('ok'),
      CancelablePromise.reject('ko'),
      delay(1, () => 'yes'),
    ]).then(callback);
    await promise;
    expect(callback).toHaveBeenCalledTimes(1);
    expect(callback).toHaveBeenCalledWith([
      { status: 'fulfilled', value: 'ok' },
      { status: 'rejected', reason: 'ko' },
      { status: 'fulfilled', value: 'yes' },
    ]);
  });

  it('should cancel', async () => {
    const callback = jest.fn();
    const promise = CancelablePromise.allSettled([
      CancelablePromise.resolve(),
      CancelablePromise.reject(),
      delay(1),
    ]).then(callback);
    promise.cancel();
    await delay(10);
    expect(callback).toHaveBeenCalledTimes(0);
  });
});

describe('CancelablePromise.race()', () => {
  it('should resolve', async () => {
    const callback = jest.fn();
    const promise = CancelablePromise.race([
      delay(2),
      delay(1, () => 'yes'),
    ]).then(callback);
    await promise;
    expect(callback).toHaveBeenCalledTimes(1);
    expect(callback).toHaveBeenCalledWith('yes');
  });

  it('should cancel', async () => {
    const callback = jest.fn();
    const promise = CancelablePromise.race([
      new Promise(() => {}),
      delay(1),
    ]).then(callback);
    promise.cancel();
    await delay(10);
    expect(callback).toHaveBeenCalledTimes(0);
  });
});
