## [4.3.1](https://github.com/alkemics/CancelablePromise/releases/tag/v4.3.1) (2022-10-14)

Noticeable changes:

- fix(type): add toStringTag symbol to class fields to be compatible with Promise type

Other changes:

- chore(release): update preparation commit message
- chore(deps-dev): bump @babel/preset-env from 7.19.3 to 7.19.4
- chore(deps-dev): bump terser from 5.15.0 to 5.15.1
- chore(deps-dev): bump core-js from 3.25.3 to 3.25.5
- chore(deps-dev): bump @babel/cli from 7.18.10 to 7.19.3
- chore(deps-dev): bump @babel/core from 7.19.1 to 7.19.3
- chore(deps-dev): bump @babel/preset-typescript from 7.17.12 to 7.18.6
- fix(cypress): migrate cypress config file for v10
- fix(tests): fix tests for jest v28

## [4.3.0](https://github.com/alkemics/CancelablePromise/releases/tag/v4.3.0) (2022-03-14)

- chore(deps-dev): bump @typescript-eslint/eslint-plugin
- chore(deps-dev): bump @typescript-eslint/parser from 5.13.0 to 5.14.0
- chore(deps-dev): bump lint-staged from 12.3.4 to 12.3.5
- feat(any): support Promise.any

## [4.2.1](https://github.com/alkemics/CancelablePromise/releases/tag/v4.2.1) (2021-07-09)

- add browser entrypoint in package.json
- upgrade dev dependencies

## [4.2.0](https://github.com/alkemics/CancelablePromise/releases/tag/v4.2.0) (2021-06-17)

- Fix finally usecase always been called
- Merge onCancelList and finallyList
- Add isCancelablePromise util
- Migrate to Typescript and improve umd/esm outputs

## [4.1.0](https://github.com/alkemics/CancelablePromise/releases/tag/v4.1.0) (2021-06-16)

- Prepare release without commit
- Cancel cancelable promise returned by a then/catch callback

Consider this example:

```js
const { CancelablePromise } = require('cancelable-promise');

const promise1 = new CancelablePromise((resolve, reject, onCancel) => {
  const timer = setTimeout(() => {
    console.log('resolve promise1');
    resolve();
  }, 1000);
  const abort = () => {
    clearTimeout(timer);
  };
  onCancel(abort);
});

const promise2 = promise1.then(() => {
  const promise3 = new CancelablePromise((resolve, reject, onCancel) => {
    const timer = setTimeout(() => {
      console.log('resolve promise 3');
      resolve();
    }, 1000);
    const abort = () => {
      clearTimeout(timer);
    };
    onCancel(abort);
  });
  return promise3;
});

setTimeout(() => {
  console.log('cancel promise 2');
  promise2.cancel();
}, 1500);
```

Before this release, output was:

```
resolve promise1
cancel promise 2
resolve promise 3
```

Now if you return a cancelable promise in a then/catch callback, it will cancel it too when you are canceling the parent promise. Output will be:

```
resolve promise1
cancel promise 2
```

## [4.0.0](https://github.com/alkemics/CancelablePromise/releases/tag/v4.0.0) (2021-05-27)

- Update dependencies and add esm module

**[Breaking change]**

No more `dist` folder, you will find releases in `umd` and `esm` folders.

```diff
- https://unpkg.com/cancelable-promise@3.0.0/dist/CancelablePromise.min.js
+ https://unpkg.com/cancelable-promise@4.0.0/umd/CancelablePromise.min.js
+ https://unpkg.com/cancelable-promise@4.0.0/esm/CancelablePromise.min.js
```

**[Feature]** ESM module

```html
<script type="module">
  import { cancelable } from 'https://unpkg.com/cancelable-promise@4.0.0/esm/CancelablePromise.min.mjs';
</script>
```

## [3.2.3](https://github.com/alkemics/CancelablePromise/releases/tag/v3.2.3) (2021-01-13)

- add types in package.json

## [3.2.0](https://github.com/alkemics/CancelablePromise/releases/tag/v3.2.0) (2020-10-10)

- feature: execute onCancel or finally callback when promise is canceled

```javascript
import CancelablePromise from 'cancelable-promise';

const promise = new CancelablePromise((resolve, reject, onCancel) => {
  const worker = new Worker('some-script.js');

  onCancel(() => {
    worker.terminate();
  });

  worker.onmessage = (event) => resolve(event.data);
  worker.onerror = (error) => reject(error);
});

promise.cancel(); // It will execute the callback passed to onCancel
```

```javascript
let worker;
const promise = cancelable(
  new Promise((resolve, reject) => {
    worker = new Worker('some-script.js');
    worker.onmessage = (event) => {
      resolve(event.data); // never executed
    };
    worker.onerror = (error) => {
      reject(error); // never executed
    };
  })
)
  .then(() => {
    console.log('never logged');
  })
  .finally(
    () => {
      console.log('executed');
      if (worker) {
        worker.terminate();
        worker = null;
      }
    },
    // runWhenCanceled boolean
    true
  );

promise.cancel();
```

## [3.1.3](https://github.com/alkemics/CancelablePromise/releases/tag/v3.1.3) (2020-08-31)

- upgrade dev dependencies
- add node v14 to nodejs workflows

## [3.1.2](https://github.com/alkemics/CancelablePromise/releases/tag/v3.1.2) (2020-07-20)

- upgrade dev dependencies

## [3.1.1](https://github.com/alkemics/CancelablePromise/releases/tag/v3.1.1) (2020-05-01)

- export CancelablePromiseType and CancelablePromiseConstructor types
- upgrade dev dependencies

## [3.1.0](https://github.com/alkemics/CancelablePromise/releases/tag/v3.1.0) (2020-04-28)

- upgrade dev dependencies
- add `isCanceled` method to cancelable promises

## [3.0.0](https://github.com/alkemics/CancelablePromise/releases/tag/v3.0.0) (2020-04-07)

- Complete rewrite of `CancelablePromise`.
  Now promises returned from `Promise` API such as `then` or `catch` can cancel the root promise and all promises created from this root promise:

```javascript
// CancelablePromise v2
import CancelablePromise from 'cancelable-promise';

const promise = new CancelablePromise((resolve) => setTimeout(resolve, 1))
  .then(() => console.log('callback2 executed'))
  .then(() => console.log('callback3 executed'));
promise.cancel();
// logs:
// callback2 executed
// callback3 executed
```

```javascript
// CancelablePromise v3
import CancelablePromise from 'cancelable-promise';

const promise = new CancelablePromise((resolve) => setTimeout(resolve, 1))
  .then(() => console.log('callback2 executed'))
  .then(() => console.log('callback3 executed'));
promise.cancel();
// no logs
```

- a functionnal util has been added:

```javascript
import { cancelable } from 'cancelable-promise';

cancelable(new Promise((resolve) => setTimeout(resolve, 1)));
```

- UMD module, `CancelablePromise` can be loaded in browser
