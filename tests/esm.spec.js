import { expectCancelablePromise } from './cancelable-promise.expect';

describe('ESM cancelable promise', () => {
  expectCancelablePromise({
    html: 'esm',
    cancelablePath: 'cancelable',
    CancelablePromisePath: 'CancelablePromise',
  });
});
