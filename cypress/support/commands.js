Cypress.Commands.add('checkValidationMessage', (selector) => {
  cy.get(selector).then(($input) => {
    expect($input[0].validationMessage).to.not.be.empty;
  });
});

Cypress.Commands.add('login', (randomEmail) => {
  cy.get('[data-block-name="woocommerce/customer-account"]').click();
  cy.location('pathname').should('eq', '/fiokom/');
  cy.get('#username').clear().type(randomEmail);
  cy.get('#password').type('Te$tuser15?4&');
  cy.get('button').contains('Belépés').click();
  cy.get('.woocommerce-MyAccount-content').contains('Üdv');
});

Cypress.Commands.add('registerNewAccount', (randomEmail) => {
  cy.get('[data-block-name="woocommerce/customer-account"]').click();
  cy.location('pathname').should('eq', '/fiokom/');
  cy.get('#reg_email').clear().type(randomEmail);
  cy.get('#reg_password').type('Te$tuser15?4&');
  cy.get('button').contains('Regisztráció').click();
});
