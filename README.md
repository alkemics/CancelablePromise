# CancelablePromise
A simple Cancelable Promise

## Usage
```
var myPromise = new CancelablePromise((resolve, reject) => { ... });
myPromise.then((response) => { console.log('not canceled'); });
myPromise.cancel();
```
