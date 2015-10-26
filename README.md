# CancelablePromise
A simple Cancelable Promise

## Install

```
npm install --save git+https://github.com/alkemics/CancelablePromise.git
```

You need a browserify with babel build process.

## Usage
```
var myPromise = new CancelablePromise((resolve, reject) => { ... });
myPromise.then((response) => { console.log('not canceled'); });
myPromise.cancel();
```
