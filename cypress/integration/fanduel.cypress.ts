describe('Collect Alternate Spreads and Total Data', () => {
    before(() => {
        cy.visit('https://il.sportsbook.fanduel.com/sports/navigation/6227.1/13348.3');
    });

    it('Selects events', () => {
        cy.get('[idfoevent]')
            .first()
            .find('section')
            .contains('MORE WAGERS')
            .click();
        cy.findByRole('heading', { name: /Alternate Spread/i })
            .click({ force: true });
        cy.findAllByRole('button', { name: /See more/i })
            .eq(1)
            .click({ force: true });
        cy.get('[class="selections-container"]')
            .eq(1)
            .find('[class="selections"]')
            .then($selections => {
                let bets;
                let prices;
                cy.wrap($selections)
                    .find('[class*="selectionname"]')
                    .then($stuff => {
                        bets = Array.from($stuff, el => el.innerText);
                    });
                cy.wrap($selections)
                    .find('[class*="selectionprice"]')
                    .then($stuff => {
                        prices = Array.from($stuff, el => el.innerText);
                    })
                    .then(() => {
                        // @ts-ignore
                        const result = Object.assign(...bets.map((k, i) => ({[k]: prices[i]})));
                        console.log(result);
                    });
            });
    });
});
