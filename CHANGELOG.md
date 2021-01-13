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
