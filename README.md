# CancelablePromise

[![GitHub license](https://img.shields.io/github/license/alkemics/CancelablePromise)](https://github.com/alkemics/CancelablePromise/blob/master/LICENSE) [![npm version](https://img.shields.io/npm/v/cancelable-promise)](https://www.npmjs.com/package/cancelable-promise) [![Node.js CI](https://github.com/alkemics/CancelablePromise/workflows/Node.js%20CI/badge.svg?branch=master)](https://github.com/alkemics/CancelablePromise/actions?query=workflow%3A%22Node.js+CI%22) [![End-to-end tests](https://github.com/alkemics/CancelablePromise/workflows/End-to-end%20tests/badge.svg?branch=master)](https://github.com/alkemics/CancelablePromise/actions?query=workflow%3A%22End-to-end+tests%22) [![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](https://github.com/alkemics/CancelablePromise/pulls)

A simple Cancelable Promise for browser

This package is based on ES Promise.

- See [caniuse](https://caniuse.com/#search=Promise) for browser support
- See [core-js](https://github.com/zloirock/core-js#ecmascript-promise) for polyfills

FYI, you can cancel a fetch request with AbortController & AbortSignal.

- See [MDN](https://developer.mozilla.org/en-US/docs/Web/API/AbortController)
- See [caniuse](https://caniuse.com/#feat=abortcontroller)

## Install

```
npm install --save cancelable-promise
```

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

## Tests

Run `eslint` and `jest`

```shell
npm test
```

Run `cypress`

```shell
npm run cypress
```

## Contributing

This repository is open to any contribution: you are welcome to open a pull request.

## License

[MIT License](LICENSE)
