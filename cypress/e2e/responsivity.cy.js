describe('Responsivity', () => {
  it('should work on desktop view', () => {
    cy.viewport('macbook-16');
    cy.visit('/');
    cy.get('[data-block-name="woocommerce/customer-account"]').invoke('attr', 'class').should('not.be.empty');
  });

  it('should work on mobile view', () => {
    cy.viewport('iphone-x');
    cy.visit('/');
    cy.get('[data-block-name="woocommerce/customer-account"]').invoke('attr', 'class').should('not.be.empty');
  });

  it('should work on tablet view', () => {
    cy.viewport('ipad-2');
    cy.visit('/');
    cy.get('[data-block-name="woocommerce/customer-account"]').invoke('attr', 'class').should('not.be.empty');
  });
});
