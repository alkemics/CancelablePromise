import { expectCancelablePromise } from './cancelable-promise.expect';

describe('UMD cancelable promise', () => {
  expectCancelablePromise({
    html: 'umd',
    cancelablePath: 'CancelablePromise.cancelable',
    CancelablePromisePath: 'CancelablePromise.CancelablePromise',
  });
});
