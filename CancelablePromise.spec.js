import { assert, expect } from 'chai';
import CancelablePromise from './CancelablePromise'

const createEnd = (done, total) => {
  let runned = 0;
  return () => {
    runned++;
    if (runned >= total) done();
  };
};

describe(__filename, () => {
  it('should handle errors', (done) => {
    const end = createEnd(done, 2);
    const promise = new CancelablePromise((resolve, reject) => {
      reject('eagle');
    });
    const promise2 = promise.then(() => {
      done(new Error('Success callback should not be executed'));
    }, (reason) => {
      expect(reason).to.be.equal('eagle');
      end();
      return 'rabbit';
    });

    promise2.then((reason) => {
      expect(reason).to.be.equal('rabbit');
      end();
    });
  });

  it('should return new value to the next then', (done) => {
    const end = createEnd(done, 2);
    const promise = new CancelablePromise((resolve, reject) => {
      resolve(5);
    });
    promise.then((value) => {
      expect(value).to.be.equal(5);
      end();
      return value + 10;
    }).then((value) => {
      expect(value).to.be.equal(15)
      end();
    });
  });

  it('should work like a tree', (done) => {
    const end = createEnd(done, 2);
    const promise = new CancelablePromise((resolve, reject) => {
      resolve('test123');
    });

    const promise2 = promise.then((value) => {
      return 'duck';
    });

    const promise3 = promise.then((value) => {
      return 'dog';
    });

    promise2.then((value) => {
      expect(value).to.be.equal('duck');
      end();
    });

    promise3.then((value) => {
      expect(value).to.be.equal('dog');
      end();
    });
  });

  it('should work also when then is added in a then', (done) => {
    const end = createEnd(done, 2);
    const promise = new CancelablePromise((resolve, reject) => {
      resolve('test123');
    });

    const promise2 = promise.then((value) => {
      expect(value).to.be.equal('test123');
      promise2.then((v) => {
        expect(v).to.be.equal('fox');
        end();
      });
      return 'rabbit';
    }).then((value) => {
      expect(value).to.be.equal('rabbit');
      end();
      return 'fox';
    });
  });

  it('should work when empty or partial then', (done) => {
    const end = createEnd(done, 2);
    const promise = new CancelablePromise((resolve, reject) => {
      resolve('test123');
    });

    const promise2 = promise.then();
    promise2.then((value) => {
      console.log(value);
      expect(value).to.be.equal('test123');
      end();
      return 'fox';
    }).then((value) => {
      console.log(value);
      expect(value).to.be.equal('fox');
      end();
    });
  });

  it('should not execute callbacks if canceled', (done) => {
    let hasFailed = false;
    const successfulPromise = new CancelablePromise((resolve, reject) => {
      resolve('good');
    });
    successfulPromise.cancel();
    successfulPromise.then(() => {
      hasFailed = true;
      done(new Error('Callback should not be executed'));
    }, (reason) => {
      hasFailed = true;
      done(new Error('Callback should not be executed'));
    });

    const rejectedPromise = new CancelablePromise((resolve, reject) => {
      reject('bad');
    });
    rejectedPromise.cancel();
    rejectedPromise.then(() => {
      hasFailed = true;
      done(new Error('Success callback should not be executed'));
    }, (reason) => {
      hasFailed = true;
      done(new Error('Error callback should not be executed'));
    }).then(() => {
      hasFailed = true;
      done(new Error('Promise\'s children success callback should not be executed'));
    }, (reason) => {
      hasFailed = true;
      done(new Error('Promise\'s children error callback should not be executed'));
    });

    const end = () => {
      if (!hasFailed) done();
    };
    setTimeout(end, 0);
  });
});
