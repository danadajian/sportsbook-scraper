export interface SportsbookBet {
    betType: BetType,
    betsAndOdds: BetsAndOdds
}

export type BetType = 'Alternate Spread' | 'Alternate Total';
export interface BetsAndOdds {
    betName: string;
    odds: number;
}
