function addItemsToCart(productIds) {
    productIds.forEach(id => cy.get(`[data-product_id="${id}"]`).click());
  }
  
  function openMiniCart() {
    cy.get('[data-block-name="woocommerce/mini-cart"]').click();
  }
  
  function proceedToCheckout() {
    cy.get('a').contains('Tovább a pénztárhoz').click();
    cy.location('pathname').should('eq', '/penztar/');
  }
  
  function closeWelcomeModal() {
    cy.get('#modal-1-content').click();
  }
  
  function fillShippingInfo() {
    cy.get('#shipping-country').select('Magyarország');
    cy.get('#shipping-last_name').type('Teszt');
    cy.get('#shipping-first_name').type('Teszt');
    cy.get('#shipping-postcode').type('1234');
    cy.get('#shipping-city').type('Tesztváros');
    cy.get('#shipping-address_1').type('Teszt utca 1.');
    cy.get('#shipping-phone').type('06301234567');
    cy.get('#shipping-option').should('contain', 'Házhoz szállítás');
  }
  
  function applyCoupon(code) {
    cy.get('#wc-block-components-totals-coupon__input-coupon').type(code);
    cy.get('button').contains('Alkalmaz').click();
  }
  
  function confirmOrder() {
    cy.get('button').contains('Megrendelés').click();
    cy.location('pathname').should('include', '/penztar/order-received');
  }
  
  function cy.logout() {
    cy.visit('/logout'); // Feltételezve, hogy van egy kijelentkezési URL
  }
  