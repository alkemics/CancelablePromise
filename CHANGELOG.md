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
