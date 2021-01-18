import {SportsbookBet} from '../types';

export const getParlays = (betData: SportsbookBet[]) => {
    return String(betData.length);
};
