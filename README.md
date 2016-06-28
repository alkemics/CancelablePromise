# CancelablePromise
A simple Cancelable Promise for browser

## Install

```
npm install --save cancelable-promise
```

This package is based on ES6 Promise. See `promise-polyfill` for browser support.

## Usage
```
var CancelablePromis = require('cancelable-promise');
var myPromise = new CancelablePromise((resolve, reject) => { ... });
myPromise.then((response) => { console.log('not canceled'); });
myPromise.cancel();
```
