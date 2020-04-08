# cancelable-promise

[![GitHub license](https://img.shields.io/github/license/alkemics/CancelablePromise)](https://github.com/alkemics/CancelablePromise/blob/master/LICENSE) [![npm version](https://img.shields.io/npm/v/cancelable-promise)](https://www.npmjs.com/package/cancelable-promise) [![Node.js CI](https://github.com/alkemics/CancelablePromise/workflows/Node.js%20CI/badge.svg?branch=master)](https://github.com/alkemics/CancelablePromise/actions?query=workflow%3A%22Node.js+CI%22) [![End-to-end tests](https://github.com/alkemics/CancelablePromise/workflows/End-to-end%20tests/badge.svg?branch=master)](https://github.com/alkemics/CancelablePromise/actions?query=workflow%3A%22End-to-end+tests%22) [![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](https://github.com/alkemics/CancelablePromise/pulls)

A simple Cancelable Promise.

This package is based on ES Promise.

- See [caniuse](https://caniuse.com/#search=Promise) for browser support
- See [core-js](https://github.com/zloirock/core-js#ecmascript-promise) for polyfills

FYI, you can cancel a fetch request with AbortController & AbortSignal.

- See [MDN](https://developer.mozilla.org/en-US/docs/Web/API/AbortController)
- See [caniuse](https://caniuse.com/#feat=abortcontroller)

## Table of Contents

- [Install](#install)
- [Usage](#usage)
  - [Basic example](#basic-example)
  - [Delegate abort AbortController](#delegate-abort-abortcontroller)
  - [Cancel promise with AbortController](#cancel-promise-with-abortcontroller)
- [API](#api)
  - [cancelablePromise](#cancelablepromise)
  - [makeCancelable](#makecancelable)
  - [CancelablePromise constructor](#cancelablepromise-constructor)
  - [Static methods](#static-methods)
- [Scripts](#scripts)
  - [Build](#build)
  - [Tests](#tests)
  - [End-to-end tests](#end-to-end-tests)
- [Contributing](#contributing)
  - [Contributors](#contributors)
- [Code of conduct](#code-of-conduct)
- [License](#license)

## Install

```
npm install --save cancelable-promise
```

## Usage

CancelablePromise acts like an ES Promise: you can use `Promise.all`, `Promise.race` with your CancelablePromise for example. The only difference is you'll have a `cancel` method on your promise to cancel future execution of `then` or `catch` functions. CancelablePromise will also cancel all callbacks attached to new promises returned by `then`/`catch`.

### Basic example

```javascript
import { cancelablePromise, makeCancelable } from 'cancelable-promise';

const promise = cancelablePromise((resolve) => setTimeout(resolve, 1))
  .then(() => console.log('not logged'))
  .then(() => console.log('not logged'));

promise.cancel();
// Nothing will be logged
```

### Delegate abort AbortController

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

## API

### cancelablePromise

```javascript
import { cancelablePromise } from 'cancelable-promise';

/**
 * cancelablePromise
 *
 * @param {(resolve, reject) => void} executor - same as Promise(executor)
 * @param {Object} options - optional
 * @param {AbortController | AbortControler[]} options.controler
 * @param {AbortSignal | AbortSignal[]} options.signal
 * @returns {CancelablePromise}
 */

const promise = cancelablePromise(
  (resolve, reject) => {
    resolve('ok');
  },
  { controller, signal }
);
```

### makeCancelable

```javascript
import { cancelablePromise } from 'cancelable-promise';

/**
 * makeCancelable
 *
 * @param {Promise} promise - native promise as 1st arg
 * @param {Object} options - optional
 * @param {AbortController | AbortControler[]} options.controler
 * @param {AbortSignal | AbortSignal[]} options.signal
 * @returns {CancelablePromise}
 */

const promise = makeCancelable(
  new Promise(
    (resolve, reject) => {
      resolve('ok');
    },
    { controller, signal }
  )
);
```

### CancelablePromise constructor

```javascript
import { CancelablePromise } from 'cancelable-promise';

/**
 * CancelablePromise constructor
 *
 * @param {(resolve, reject) => void} executor - same as Promise(executor)
 * @param {Object} options - optional
 * @param {AbortController | AbortControler[]} options.controler
 * @param {AbortSignal | AbortSignal[]} options.signal
 * @returns {CancelablePromise}
 */

const promise = new CancelablePromise(
  (resolve, reject) => {
    resolve('ok');
  },
  { controller, signal }
);
```

### Static methods

Same as Promise static methods.

```javascript
import { CancelablePromise } from 'cancelable-promise';

CancelablePromise.resolve();
CancelablePromise.reject();
CancelablePromise.all([promise1, promise2], options);
CancelablePromise.race([promise1, promise2], options);
CancelablePromise.allSettled([promise1, promise2], options);
// for options, see cancelablePromise or makeCancelable options
```

## Scripts

### Build

Run babel

```
npm run build
```

### Tests

Run `eslint` and `jest`

```shell
npm test
```

### End-to-end tests

Run `cypress`

```shell
npm run cypress
```

## Contributing

Feel free to dive in! [Open an issue](https://github.com/alkemics/CancelablePromise/issues) or [submit PRs](https://github.com/alkemics/CancelablePromise/compare).

### Contributors

This project exists thanks to all [the people who contribute](https://github.com/alkemics/CancelablePromise/graphs/contributors).

## Code of conduct

[Contributor Covenant Code of Conduct](CODE_OF_CONDUCT.md).

## License

[MIT License](LICENSE) © Alkemics
