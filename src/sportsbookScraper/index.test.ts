import {sportsbookScraperHandler} from "./index";
import {run} from 'cypress';
import {jest, expect, describe, beforeEach} from '@jest/globals';

jest.mock('cypress');

describe('sportsbookScraperHandler', () => {
    let result: any;

    beforeEach(() => {
       result = sportsbookScraperHandler();
    });

    it('should return expected result', () => {
        expect(run).toHaveBeenCalledWith({browser: 'chrome'});
    });
});
