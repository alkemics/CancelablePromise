## 3.0.0 (2020-04-07)

Complete rewrite of `CancelablePromise`.
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
import { cancelablePromise } from 'cancelable-promise';

const promise = cancelablePromise((resolve) => setTimeout(resolve, 1))
  .then(() => console.log('callback2 executed'))
  .then(() => console.log('callback3 executed'));
promise.cancel();
// no logs
```
