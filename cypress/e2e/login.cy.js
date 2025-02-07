describe('User Login', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.get('[data-block-name="woocommerce/customer-account"]').click();
    cy.location('pathname').should('eq', '/fiokom/');
  });

  it('should log in with valid credentials', () => {
    cy.get('#username').clear().type('becsei.ani98@gmail.com');
    cy.get('#password').type('Te$tuser15?4&');
    cy.get('button').contains('Belépés').click();
    cy.get('.woocommerce-MyAccount-content').contains('Üdv');
  });

  it('should show error message for invalid username', () => {
    cy.get('#username').clear().type('test@example.com');
    cy.get('#password').type('Te$tuser15?4&');
    cy.get('button').contains('Belépés').click();
    cy.get('.wc-block-components-notice-banner__content').contains('Ismeretlen email cím');
  });

  it('should show error message for incorrect password', () => {
    cy.get('#username').clear().type('becsei.ani98@gmail.com');
    cy.get('#password').type('123');
    cy.get('button').contains('Belépés').click();
    cy.get('.wc-block-components-notice-banner__content').contains('Hiba');
  });

  it('should show error message for missing credentials', () => {
    cy.get('button').contains('Belépés').click();
    cy.checkValidationMessage('#username');
    cy.checkValidationMessage('#password');
  });
});
