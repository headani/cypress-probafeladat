describe('Shopping', () => {
  const randomEmail = `test${Date.now()}@example.com`;

  beforeEach(() => {
    cy.visit('/');
  });

  it('should require registration to shop', () => {
    cy.get('[data-product_id="66"]').click();
    cy.get('[data-block-name="woocommerce/mini-cart"]', { timeout: 1000 }).click();
    cy.get('a').contains('Tovább a pénztárhoz').click();
    cy.get('.wc-block-must-login-prompt').contains('A fizetéshez be kell jelentkezned');
  });

  it('should apply free shipping with valid promo code', () => {
    cy.registerNewAccount(randomEmail);
    cy.get('#modal-1-content').click();
    cy.get('[data-product_id="66"]').click();
    cy.get('[data-product_id="62"]').click().click();
    cy.get('[data-product_id="68"]').click();
    cy.get('[data-block-name="woocommerce/mini-cart"]', { timeout: 1000 }).click();
    cy.get('.wp-block-woocommerce-mini-cart-title-items-counter-block').contains('4 termék');
    cy.get('[aria-label="Megjegyzés figyelmen kívül hagyása"]').click();
    cy.get('.wp-block-woocommerce-mini-cart-checkout-button-block').contains('Tovább a pénztárhoz').click();
    cy.location('pathname').should('eq', '/penztar/');
    cy.get('#shipping-country').select('Magyarország');
    cy.get('#shipping-last_name').type('Teszt');
    cy.get('#shipping-first_name').type('Teszt');
    cy.get('#shipping-postcode').type('1234');
    cy.get('#shipping-city').type('Tesztváros');
    cy.get('#shipping-address_1').type('Teszt utca 1.');
    cy.get('#shipping-phone').type('06301234567');
    cy.get('#shipping-option').contains('Házhoz szállítás');
    cy.get('.wc-block-components-panel__button').click();
    cy.get('#wc-block-components-totals-coupon__input-coupon', { timeout: 1000 }).type('FREESHIPPING');
    cy.get('button').contains('Alkalmaz').click();
    cy.get('input[type="radio"][value="free_shipping:2"]').should('be.checked');
    cy.get('button').contains('Megrendelés').click();
    cy.location('pathname').should('include', '/penztar/order-received');
    cy.get('[data-block-name="woocommerce/order-confirmation-status"]').contains('Köszönjük! A rendelést megkaptuk.');
  });

  it('should not apply free shipping with invalid promo code', () => {
    cy.login(randomEmail);
    cy.get('#modal-1-content').click();
    cy.get('[data-wc-key="product-item-66"]').click();
    cy.get('button').contains('Kosárba teszem').click();
    cy.get('[data-block-name="woocommerce/mini-cart"]', { timeout: 1000 }).click();
    cy.get('a').contains('Tovább a pénztárhoz').click();
    cy.location('pathname').should('eq', '/penztar/');
    cy.contains('Egy kupon hozzáadása').type('FREESHIPING');
    cy.get('button').contains('Alkalmaz').click();
    cy.get('#validate-error-coupon').contains('kupon nem létezik').should('be.visible');
  });

  it('should deliver only to Hungary', () => {
    cy.login(randomEmail);
    cy.get('#modal-1-content').click();
    cy.get('[data-wc-key="product-item-66"]').click();
    cy.get('button').contains('Kosárba teszem').click();
    cy.get('[data-block-name="woocommerce/mini-cart"]', { timeout: 1000 }).click();
    cy.get('a').contains('Tovább a pénztárhoz').click();
    cy.location('pathname').should('eq', '/penztar/');
    cy.get('#shipping-fields').contains('Szerkesztés').click();
    cy.get('#shipping-country').select('Románia');
    cy.get('#shipping-postcode').type('123456');
    cy.get('#shipping-state').select('Kolozsvár');
    cy.get('.wc-block-components-notice-banner__content').contains('No shipping options are available');
  });
});
