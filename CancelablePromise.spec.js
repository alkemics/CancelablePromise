import {
  assert,
  expect
} from 'chai';
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

    const resolvedPromise = CancelablePromise.resolve(new Promise((resolve, reject) => {
      reject('bad static resolve');
    }));
    resolvedPromise.cancel();
    resolvedPromise.then(() => {
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

    const allPromise = CancelablePromise.all([new Promise((resolve, reject) => {
      resolve('good all resolve');
    })]);
    allPromise.cancel();
    allPromise.then(() => {
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

    const racedPromise = CancelablePromise.race([new Promise((resolve, reject) => {
      resolve('good raced resolve');
    })]);
    racedPromise.cancel();
    racedPromise.then(() => {
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


    const staticRejectedPromise = CancelablePromise.reject(new Promise((resolve, reject) => {
      resolve('good static reject');
    }));
    staticRejectedPromise.cancel();
    staticRejectedPromise.then(() => {
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

  it('should reject the promise when the success callback throws an error', (done) => {
    const promise = new CancelablePromise((resolve, reject) => {
      resolve('test123');
    });
    let hasFailed = true;

    promise.then((value) => {
      throw new Error('The callback threw an error');
    }).catch((error) => {
      hasFailed = false;
    });

    const end = () => {
      done(hasFailed ? new Error('Promise should be rejected when the success callback throws an error') : undefined);
    };
    setTimeout(end, 0);
  });

  it('should reject the promise when the error callback throws an error', (done) => {
    const promise = new CancelablePromise((resolve, reject) => {
      reject(new Error('test123'));
    });
    let hasFailed = true;

    promise.catch((error) => {
      throw new Error('The callback threw an error');
    }).catch((error) => {
      hasFailed = false;
    });

    const end = () => {
      done(hasFailed ? new Error('Promise should be rejected when the error callback throws an error') : undefined);
    };
    setTimeout(end, 0);
  });
});
