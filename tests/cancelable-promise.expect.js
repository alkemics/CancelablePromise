export const expectCancelablePromise = ({
  html,
  cancelablePath,
  CancelablePromisePath,
}) => {
  const done = () => cy.window().its('done');

  beforeEach('should be loaded', () => {
    cy.intercept('/ok').as('ok');
    cy.visit(`http://localhost:3000/${html}.html`, {
      onBeforeLoad(win) {
        win.done = cy.stub();
      },
    });
    cy.wait('@ok');
    cy.window().its(cancelablePath).should('be.ok');
    cy.window().its(CancelablePromisePath).should('be.ok');
    const stub = cy.stub();
    cy.window().then((win) => {
      win.done = stub;
    });
    cy.window()
      .its(cancelablePath)
      .then((cancelable) => {
        cancelable.done = stub;
      });
    cy.window()
      .its(CancelablePromisePath)
      .then((CancelablePromise) => {
        CancelablePromise.done = stub;
      });
  });

  it('should be fulfilled', () => {
    cy.window()
      .its(cancelablePath)
      .then((cancelable) => {
        cancelable(
          new Promise((resolve) => {
            resolve(42);
          })
        ).then(cancelable.done);
      });
    done().should('be.calledOnce');
    done().should('be.calledWith', 42);
  });

  it('should be rejected', () => {
    cy.window()
      .its(cancelablePath)
      .then((cancelable) => {
        cancelable(
          new Promise((_, reject) => {
            reject(42);
          })
        ).catch(cancelable.done);
      });
    done().should('be.calledOnce');
    done().should('be.calledWith', 42);
  });

  it('should cancel fulfilled promise', () => {
    cy.window()
      .its(CancelablePromisePath)
      .then((CancelablePromise) => {
        const promise = new CancelablePromise((resolve) => {
          resolve(42);
        }).then(CancelablePromise.done);
        promise.cancel();
      });
    cy.wait(10);
    done().should('not.be.called');
  });

  it('should cancel rejected promise', () => {
    cy.window()
      .its(CancelablePromisePath)
      .then((CancelablePromise) => {
        const promise = new CancelablePromise((resolve, reject) => {
          reject(42);
        }).catch(CancelablePromise.done);
        promise.cancel();
      });
    cy.wait(10);
    done().should('not.be.called');
  });

  it('should cancel and not execute finally', () => {
    cy.window()
      .its(CancelablePromisePath)
      .then((CancelablePromise) => {
        const promise = new CancelablePromise((resolve) => {
          setTimeout(() => {
            resolve(42);
          }, 5);
        })
          .then(CancelablePromise.done)
          .finally(CancelablePromise.done);
        promise.cancel();
      });
    cy.wait(10);
    done().should('not.be.called');
  });

  it('should cancel and still execute finally', () => {
    cy.window()
      .its(CancelablePromisePath)
      .then((CancelablePromise) => {
        const promise = new CancelablePromise((resolve) => {
          setTimeout(() => resolve(42), 5);
        })
          .then(CancelablePromise.done)
          .finally(CancelablePromise.done, true);
        promise.cancel();
      });
    cy.wait(10);
    done().should('be.calledOnce');
  });

  it('should cancel all promises', () => {
    cy.window()
      .its(CancelablePromisePath)
      .then((CancelablePromise) => {
        const promise = CancelablePromise.all([
          new CancelablePromise((resolve) => {
            setTimeout(() => resolve(42), 10);
          }).then(CancelablePromise.done),
          new CancelablePromise((resolve) => {
            setTimeout(() => resolve(42), 10);
          }).then(CancelablePromise.done),
          new CancelablePromise((resolve) => {
            setTimeout(() => resolve(42), 10);
          }).then(CancelablePromise.done),
        ]);
        setTimeout(() => {
          promise.cancel();
        }, 5);
      });
    cy.wait(10);
    done().should('not.be.called');
  });
};
