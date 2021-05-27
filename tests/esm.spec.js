import { expectCancelablePromise } from './cancelable-promise.expect';

describe('ESM cancelable promise', () => {
  let cancelable;
  let CancelablePromise;

  it('should be loaded', () => {
    cy.intercept('/ok').as('ok');
    cy.visit('http://localhost:3000/esm.html');
    cy.wait('@ok');
    cy.window().its('CancelablePromise').should('be.ok');
    cy.window().its('cancelable').should('be.ok');
    cy.window().then((win) => {
      cancelable = win.cancelable;
      CancelablePromise = win.CancelablePromise;
    });
  });

  expectCancelablePromise(() => ({ cancelable, CancelablePromise }));
});
