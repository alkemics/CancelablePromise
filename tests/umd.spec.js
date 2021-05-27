import { cancelable, CancelablePromise } from '../umd/CancelablePromise.min.js';
import { expectCancelablePromise } from './cancelable-promise.expect';

expectCancelablePromise(() => ({ cancelable, CancelablePromise }));
