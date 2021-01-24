import * as cypress from 'cypress';

export const sportsbookScraperHandler = () => {
    return cypress.run({
        browser: 'chrome'
    });
};
