import { cancelablePromise, makeCancelable } from '../../dist';

const { expect } = global;

describe('cancelable promise', () => {
  const indexHtml = 'cypress/fixtures/index.html';

  it('should be resolved', () => {
    const stub = cy.stub();
    cancelablePromise((resolve) => {
      resolve(42);
    }).then(stub);
    cy.wait(1).then(() => {
      expect(stub).to.be.calledOnce;
      expect(stub).to.be.calledWith(42);
    });
  });

  it('should be canceled', () => {
    const stub = cy.stub();
    const promise = cancelablePromise((resolve) => {
      resolve(42);
    }).then(stub);
    promise.cancel();
    cy.wait(1).then(() => {
      expect(stub).not.to.be.called;
    });
  });

  it('should aborted by controller', () => {
    const onAbort = cy.stub();
    const callback = cy.stub();
    const controller = new AbortController();
    const fetchPromise = fetch(indexHtml, {
      signal: controller.signal,
    });
    fetchPromise.catch(onAbort);
    const promise = makeCancelable(fetchPromise, { signal: controller.signal });
    promise.then(callback).catch(callback);
    const onCancel = cy.spy(promise, 'cancel');
    controller.abort();
    cy.wait(1).then(() => {
      expect(onAbort).to.be.calledOnce;
      expect(onCancel).to.be.calledOnce;
      expect(callback).not.to.be.called;
    });
  });
});
