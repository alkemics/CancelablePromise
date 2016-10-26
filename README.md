# CancelablePromise
A simple Cancelable Promise for browser

## Install

```
npm install --save cancelable-promise
```

This package is based on ES6 Promise. See `promise-polyfill` for browser support.

## Usage
CancelablePromise acts like a ES6 Promise: you can use `Promise.all`, `Promise.race` with your CancelablePromise for example. The only difference is you'll have a `cancel` method on your promise to cancel future execution of `then` or `catch` functions. CancelablePromise will also cancel all callbacks attached to new promises returned by `then`/`catch`.
```
import CancelablePromise from 'cancelable-promise';
const myPromise = new CancelablePromise((resolve) => setTimeout(() => resolve('I\'m resolved'), 100));
myPromise.then((response) => console.log(response)).then(() => console.log('not cancel'));
myPromise.cancel();
// Nothing will be displayed in console
```

## Test
You can run tests with `npm run test`
