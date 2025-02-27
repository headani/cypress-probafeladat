describe('Shopping', () => {
  // nagyon jo az email generalas, talan annyit csinaltam volna, hogy valamilyen olyan emailhez fűzök dummy adatot ami hozzád fűzhető
  const randomEmail = `test${Date.now()}@example.com`;

  beforeEach(() => {
    cy.visit('/');
    //regisztráció és/vagy a bejelentkezés, valamint a kosárbahelyezés minden függvényben ott van, így ezt lehetett volna ide szervezni

  });

  it('should require registration to shop', () => {
    cy.get('[data-product_id="66"]').click();
    // lehetne külön függvény a kosárba rakás, illetve a timeout nem szükséges, maximum utána egy ellenőrzés.
    cy.get('[data-block-name="woocommerce/mini-cart"]', { timeout: 1000 }).click();
    cy.get('a').contains('Tovább a pénztárhoz').click();
    cy.get('.wc-block-must-login-prompt').contains('A fizetéshez be kell jelentkezned');
  });

  it('should apply free shipping with valid promo code', () => {
    // nagyon jó hogy külön funkcióba kiszervezted, viszont a regisztráció tesztelésére van elvileg külön fájl, itt maximum egy bejelentkezés tudok elképzelni
    cy.registerNewAccount(randomEmail);

    // url alapjan jobb lenne, de ha mindenkepp menupontot tesztelunk akkor is valahogyan maskeppen (lehet hogy maga a kód nem tette lehetővé)
    cy.get('#modal-1-content').click();
    cy.get('[data-product_id="66"]').click();

    //itt két terméket rakunk a kosárba, de lehetne várni, hogy a művelet megtörténik-e, valamint inkább ciklusban elvégezni ha többet akarunk
    cy.get('[data-product_id="62"]').click().click();
    
    cy.get('[data-product_id="68"]').click();
    
    //timeout nem kell
    cy.get('[data-block-name="woocommerce/mini-cart"]', { timeout: 1000 }).click();

    //ezeket kérlek magyarázd el, hogy miért van szükség rájuk
    cy.get('.wp-block-woocommerce-mini-cart-title-items-counter-block').contains('4 termék');
    cy.get('[aria-label="Megjegyzés figyelmen kívül hagyása"]').click();
    
    
    cy.get('.wp-block-woocommerce-mini-cart-checkout-button-block').contains('Tovább a pénztárhoz').click();
    cy.location('pathname').should('eq', '/penztar/');
    
    // itt lehetne egy függvény a szállítási adatok kitöltésére
    cy.get('#shipping-country').select('Magyarország');
    cy.get('#shipping-last_name').type('Teszt');
    cy.get('#shipping-first_name').type('Teszt');
    cy.get('#shipping-postcode').type('1234');
    cy.get('#shipping-city').type('Tesztváros');
    cy.get('#shipping-address_1').type('Teszt utca 1.');
    cy.get('#shipping-phone').type('06301234567');
    cy.get('#shipping-option').contains('Házhoz szállítás');
    cy.get('.wc-block-components-panel__button').click();
    
    // timeout nem kell, de lehetne egy helper függvény
    cy.get('#wc-block-components-totals-coupon__input-coupon', { timeout: 1000 }).type('FREESHIPPING');
    cy.get('button').contains('Alkalmaz').click();

    //jó hogy ellenőrzöd a kupont is és a visszajelzést is a rendelésről
    cy.get('input[type="radio"][value="free_shipping:2"]').should('be.checked');
    cy.get('button').contains('Megrendelés').click();
    cy.location('pathname').should('include', '/penztar/order-received');
    cy.get('[data-block-name="woocommerce/order-confirmation-status"]').contains('Köszönjük! A rendelést megkaptuk.');
  });

  it('should not apply free shipping with invalid promo code', () => {
    // korábbiakban említettem, hogy elég a login, nagyon jó erre is a külön függvény
    cy.login(randomEmail);

    //shop oldalra elegánsabb átlépés
    cy.get('#modal-1-content').click();

    // itt jó hogy mindkettő módot tesztelted, de lehetne egy függvénybe szervezni
    cy.get('[data-wc-key="product-item-66"]').click();
    cy.get('button').contains('Kosárba teszem').click();
    
    // timeout nem kell
    cy.get('[data-block-name="woocommerce/mini-cart"]', { timeout: 1000 }).click();
    
    cy.get('a').contains('Tovább a pénztárhoz').click();
    cy.location('pathname').should('eq', '/penztar/');

    // itt lehetne egy külön függvény kupon alkalmazásra, valamint click mellett még az entert is ellenőrízni lehet
    cy.contains('Egy kupon hozzáadása').type('FREESHIPING');
    cy.get('button').contains('Alkalmaz').click();

    // jó az ellenőrzés
    cy.get('#validate-error-coupon').contains('kupon nem létezik').should('be.visible');
  });

  it('should deliver only to Hungary', () => {
    // nagyon jó a login, kérdés hogy miért van itt login másiknál register
    cy.login(randomEmail);

    // itt így nyitod meg a shop oldalt, erre azért lehetne egy url-t is nézni pl
    cy.get('#modal-1-content').click();

    // konzisztenst érdemes tartani, vagy a data-wc-key-t használni, vagy a data-product_id-t
    // illetve a szövegekre való szűrés helyett, valami szelektorokat lenne jó használni
    // többnyelvű oldalakat használunk, így ugye a szövegezés változik, ezzel borulhat a teszt is.
    cy.get('[data-wc-key="product-item-66"]').click();
    cy.get('button').contains('Kosárba teszem').click();

    //timeout ide sem kell
    cy.get('[data-block-name="woocommerce/mini-cart"]', { timeout: 1000 }).click();

    // lehetne részletesebb a szelektor, pl wc-block-components-button__text és ebből containts a szöveg
    // de ugyanennek a href a elemnek van több osztálya, amiből van amit lehet használni
    cy.get('a').contains('Tovább a pénztárhoz').click();
    cy.location('pathname').should('eq', '/penztar/');

    //itt nem mindig tartalmazza a szerkesztést, ellenőrízni kell hogy van-e és ha van, csak akkor kattintani
    cy.get('#shipping-fields').contains('Szerkesztés').click();

    // helper kitöltő függvény jó lehet ide is
    cy.get('#shipping-country').select('Románia');
    cy.get('#shipping-postcode').type('123456');
    cy.get('#shipping-state').select('Kolozsvár');

    // itt ezen kívül még lehetne azt is nézni, hogyha a megrendelés gombra kattintunk, 
    // akkor mi történik, dob-e hibát valóban, attól hogy ez megjelenik, lehet hogy leadható a rendelés
    cy.get('.wc-block-components-notice-banner__content').contains('No shipping options are available');
  });

  
});
