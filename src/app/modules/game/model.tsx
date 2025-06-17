export interface Game {
	readonly players: GamePlayer[];
	readonly handCardsCount: number;
	turn: number;
	winnerId?: string | null | undefined; // null if no one won, undefined if game is still ongoing
	history: HistoryElement[];
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

/// === ACTIONS === ///

export interface ActionConfig {
	action: ActionTypes;
	params: AttackActionParams | SwapActionParams | DiscardActionParams | BoomActionParams;
}

/* eslint-disable no-unused-vars */
export enum ActionTypes {
	Attack = 'attack',
	Swap = 'swap',
	Discard = 'discard',
	Boom = 'boom',
}
/* eslint-enable no-unused-vars */

export interface AttackActionParams {
	targetPlayerId: string;
	sourceHandIndex: number;
	targetRemainingAccumulatorIndex: number;
}

export interface SwapActionParams {
	sourceHandIndex: number;
	targetRemainingAccumulatorIndex: number;
}

export interface DiscardActionParams {
	sourceHandIndex: number;
}

export interface BoomActionParams {
	targetValue: number;
}

/// === HISTORY === ///

export interface HistoryElement {
	turn: number;
	action: ActionTypes;
	sourcePlayerId: string;
	data: AttackActionHistory | SwapActionHistory | DiscardActionHistory | BoomActionHistory;
}

export interface AttackActionHistory {
	targetPlayerId: string;
	sourceHandValue: number;
	targetAccumulatorValue: number;
	obtainedExtraAccumulator: number | null;
}

export interface SwapActionHistory {
	sourceHandValue: number;
	targetAccumulatorValue: number;
}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface DiscardActionHistory {}

export interface BoomActionHistory {
	targetValue: number;
	accumulatorsDestroyedQuantity: number;
}
