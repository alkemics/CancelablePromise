# CancelablePromise

A simple Cancelable Promise for browser

## Install

```
npm install --save cancelable-promise
```

This package is based on ES Promise.
See [caniuse](https://caniuse.com/#search=Promise) for browser support.
See [core-js](https://github.com/zloirock/core-js#ecmascript-promise) for polyfills.

## Usage

CancelablePromise acts like an ES Promise: you can use `Promise.all`, `Promise.race` with your CancelablePromise for example. The only difference is you'll have a `cancel` method on your promise to cancel future execution of `then` or `catch` functions. CancelablePromise will also cancel all callbacks attached to new promises returned by `then`/`catch`.

```javascript
import { cancelablePromise, makeCancelable } from 'cancelable-promise';

const promise = cancelablePromise((resolve) => setTimeout(resolve, 1))
  .then(() => console.log('not logged'))
  .then(() => console.log('not logged'));

promise.cancel();
// Nothing will be logged
```

There are 3 possible ways to create a cancelable promise:

```javascript
import {
  cancelablePromise,
  makeCancelable,
  CancelablePromise,
} from 'cancelable-promise';

cancelablePromise((resolve, reject) => {});

makeCancelable(new Promise((resolve, reject) => {}));

new CancelablePromise((resolve, reject) => {});
```

### Delegate AbortController.abort()

```javascript
import { makeCancelable } from 'cancelable-promise';

const controller = new AbortController();
const signal = controller.signal;
const promise = makeCancelable(fetch('url', { signal }), { controller });
// canceling the promise will abort the controller
promise.cancel();
```

```javascript
import { CancelablePromise } from 'cancelable-promise';

const controller1 = new AbortController();
const controller2 = new AbortController();
const promise = CancelablePromise.all(
  [
    fetch('url1', { signal: controller1.signal }),
    fetch('url2', { signal: controller2.signal }),
  ],
  { controller: [controller1, controller2] }
);
// canceling the promise will abort these controllers
promise.cancel();
```

### Cancel promise with AbortController

```javascript
import { cancelablePromise } from 'cancelable-promise';

const controller = new AbortController();
const signal = controller.signal;
const promise = makeCancelable(fetch('url', { signal }), { signal });
// aborting the controller will cancel the promise
controller.abort();
```

## Test

You can run tests with `npm test`
