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

## Test

You can run tests with `npm test`
