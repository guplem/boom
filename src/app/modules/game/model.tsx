export interface Game {
	readonly players: GamePlayer[];
	readonly handCardsCount: number;
	turn: number;
}

export interface GamePlayer {
	readonly id: string;
	hand: number[];
	accumulators: Accumulator[];
}

export interface Accumulator {
	readonly originalValue: number;
	attacks: number[];
}

export interface GameConfig {
	initialAccumulatorsCount?: number;
	handCardsCount?: number;
}
