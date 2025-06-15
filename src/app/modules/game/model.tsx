import { Player } from '@/app/modules/player/model';

/**
 * Game class representing the current state of the game.
 */
export class Game {
	public readonly playerOrder: string[];
	public turn: number;

	public constructor(data: Partial<Game> & { players?: Player[] | undefined }) {
		this.playerOrder = data.playerOrder ?? data.players!.map((player) => player.id);
		this.turn = data.turn ?? 0;
	}

	public getCurrentPlayer(): string {
		return this.playerOrder[this.turn % this.playerOrder.length];
	}
}
