import CancelablePromiseDefault, {
  cancelable,
  CancelablePromise,
} from '../src/CancelablePromise';

test('cancelable types', async () => {
  const p1 = cancelable(
    new Promise<{ value: number }>((resolve) => {
      resolve({ value: 1 });
    })
  );
  p1.then((result) => {
    const num: number = result.value;
    return num;
  });
  const p2: CancelablePromise<string | number> = p1
    .catch<Error>((err: Error) => {
      return err;
    })
    .then((result) => {
      if (result instanceof Error) {
        return result.message;
      }
      return result.value;
    });
  p2.then<string | number>((result) => {
    return result;
  });
  const p3: CancelablePromise<string> = p2.then((result) => {
    return result.toString();
  });
  const p4 = p3.then(
    (result) => {
      return result;
    },
    (err: Error) => {
      return err;
    }
  );
  const p5: CancelablePromise<string | Error> = p4.then((result) => {
    return result;
  });
  await p5;
});

test('CancelablePromise types', async () => {
  const p1: CancelablePromise<number> = new CancelablePromise<{
    value: number;
  }>((resolve, reject, onCancel) => {
    const timer = setTimeout(() => {
      resolve({ value: 1 });
    }, 10);
    onCancel(() => {
      clearTimeout(timer);
      reject({ code: 1 });
    });
  })
    .then((result) => {
      return result.value;
    })
    .catch((err: { code: number }) => {
      return err.code;
    });
  await p1;
});

test('CancelablePromiseDefault types', async () => {
  const p1: CancelablePromise<number> = new CancelablePromiseDefault<{
    value: number;
  }>((resolve, reject, onCancel) => {
    const timer = setTimeout(() => {
      resolve({ value: 1 });
    }, 10);
    onCancel(() => {
      clearTimeout(timer);
      reject({ code: 1 });
    });
  })
    .then((result) => {
      return result.value;
    })
    .catch((err: { code: number }) => {
      return err.code;
    });
  await p1;
});

test('CancelablePromise.all', async () => {
  const p1: CancelablePromise<string> = CancelablePromise.all([
    Promise.resolve(1),
    Promise.resolve('2'),
    Promise.resolve(null),
  ]).then(([r1, r2, r3]) => {
    const num: number = r1;
    const str: string = r2;
    const nul: null = r3;
    return `${num}${str}${nul}`;
  });
  await p1;
});

test('CancelablePromise.allSettled', async () => {
  const p1: CancelablePromise<string> = CancelablePromise.allSettled([
    Promise.resolve(1),
    Promise.resolve('2'),
    Promise.resolve(null),
  ]).then(([r1, r2, r3]) => {
    const num: number = r1.status === 'fulfilled' ? r1.value : r1.reason;
    const str: string = r2.status === 'fulfilled' ? r2.value : r2.reason;
    const nul: null = r3.status === 'fulfilled' ? r3.value : r3.reason;
    return `${num}${str}${nul}`;
  });
  await p1;
});

test('CancelablePromise.race', async () => {
  const p1: CancelablePromise<string | number | null> = CancelablePromise.race([
    Promise.resolve(1),
    Promise.resolve('2'),
    Promise.resolve(null),
  ]).then((result) => {
    return result;
  });
  await p1;
});

test('CancelablePromise.resolve', async () => {
  const p1: CancelablePromise<number> = CancelablePromise.resolve({
    value: 1,
  }).then((result) => {
    return result.value;
  });
  await p1;
});

test('CancelablePromise.reject', async () => {
  const p1: CancelablePromise<string> = CancelablePromise.reject(
    new Error('error')
  ).catch((err: Error) => {
    return err.message;
  });
  await p1;
});
