describe('Registration', () => {
  const randomEmail = `test-${Date.now()}@example.com`;

  beforeEach(() => {
    cy.visit('/');
  });

  it('should register new account with valid email address', () => {
    cy.registerNewAccount(randomEmail);
  });

  it('should show an error message when registering with an invalid email', () => {
    cy.get('[data-block-name="woocommerce/customer-account"]').click();
    cy.location('pathname').should('eq', '/fiokom/');
    cy.get('#reg_email').clear().type('abc-example.com');
    cy.get('#reg_password').type('Te$tuser15?4&');
    cy.get('button').contains('Regisztráció').click();
    cy.checkValidationMessage('#reg_email');
  });
});
