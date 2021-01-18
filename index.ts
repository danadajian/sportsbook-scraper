import * as cypress from 'cypress';

export const scrapeSportsbookHandler = () => {
    return cypress.run({
        browser: 'chrome'
    });
};
