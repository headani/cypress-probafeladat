describe('Shopping', () => {
  const randomEmail = `test${Date.now()}@example.com`;
  
  beforeEach(() => {
    cy.visit('/');
    cy.registerNewAccount(randomEmail); // vagy ide inkabb csak a lgoin kellene
    closeWelcomeModal();
    addItemsToCart([66, 62, 62, 68]);
    openMiniCart();
    proceedToCheckout();
  });

  it('should require registration to shop', () => {
    cy.logout();
    cy.visit('/penztar/');
    cy.get('.wc-block-must-login-prompt').should('contain', 'A fizetéshez be kell jelentkezned');
  });

  it('should apply free shipping with valid promo code', () => {
    fillShippingInfo();
    applyCoupon('FREESHIPPING');
    cy.get('input[type="radio"][value="free_shipping:2"]').should('be.checked');
    confirmOrder();
    cy.get('[data-block-name="woocommerce/order-confirmation-status"]').should('contain', 'Köszönjük! A rendelést megkaptuk.');
  });

  it('should not apply free shipping with invalid promo code', () => {
    applyCoupon('FREESHIPING'); // Hibás kupon
    cy.get('#validate-error-coupon').should('be.visible').and('contain', 'kupon nem létezik');
  });

  it('should deliver only to Hungary', () => {
    cy.get('#shipping-country').select('Románia');
    cy.get('#shipping-postcode').type('123456');
    cy.get('#shipping-option').should('not.exist'); // Nincs elérhető szállítás
  });
});
