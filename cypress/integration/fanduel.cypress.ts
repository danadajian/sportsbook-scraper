import {getParlays} from "../../src/getParlays";
import {BetType, SportsbookBet} from "../../types";

describe('Fanduel', () => {
    before(() => {
        cy.visit('/sports/navigation/6227.1/13348.3');
    });

    it('Collect Bet Data', () => {
        let betData: SportsbookBet[] = [];
        cy.get('[idfoevent]')
            .not('.LiveEventInfoComponent')
            .getAttributes('idfoevent')
            .each(eventId => {
                cy.visit(`/sports/event/${eventId}`);
                saveBetInformation('Alternate Spread');
                saveBetInformation('Alternate Total');
            })
            .then(() => {
                const parlays = getParlays(betData);
                cy.log(parlays);
            });

        const saveBetInformation = (betType: BetType) => {
            cy.findByRole('heading', {name: new RegExp(betType, 'i')})
                .click({force: true});
            cy.findAllByRole('button', {name: /See more/i})
                .last()
                .click({force: true})
                .get('.selections-container')
                .last()
                .find('.selections')
                .then($selections => {
                    let bets;
                    let odds;
                    cy.wrap($selections)
                        .find('.selectionname')
                        .then($stuff => {
                            bets = Array.from($stuff, el => el.innerText);
                        });
                    cy.wrap($selections)
                        .find('.selectionprice')
                        .then($stuff => {
                            odds = Array.from($stuff, el => el.innerText);
                        })
                        .then(() => {
                            const betsAndOdds = bets.map((bet, index) => ({
                                bet,
                                odds: odds[index]
                            }));
                            betData.push({
                                betType,
                                betsAndOdds
                            });
                        });
                });
        };
    });
});
