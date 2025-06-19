import { Accumulator, HistoryElement } from '@/app/modules/game/model';

export interface Scenario {
	readonly board: Board[];
	readonly turn: number;
	readonly playerId: string;
	readonly playerHand: number[];
	readonly history: HistoryElement[];
}

export interface Board {
	readonly playerId: string;
	readonly accumulators: Accumulator[];
}
