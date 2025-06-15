import { Player } from '@/app/modules/player/model';

/**
 * Game class representing the current state of the game.
 */
export class Game {
	public readonly players: GamePlayer[];
	public turn: number;
	public readonly handCardsCount: number;

	public constructor(
		players: Player[],
		{
			initialAccumulatorsCount = 3,
			handCardsCount = 3,
		}: {
			initialAccumulatorsCount?: number;
			handCardsCount?: number;
		} = {},
	) {
		this.turn = 0;
		this.handCardsCount = handCardsCount;

		if (players.length <= 1) throw new Error('Game must have at least two players');
		const playerOrder: string[] = [];
		const playerIds: string[] = players.map((player: Player) => player.id);
		// Fisher-Yates shuffle algorithm to randomize player order
		for (let i: number = playerIds.length - 1; i > 0; i--) {
			const j: number = Math.floor(Math.random() * (i + 1));
			[playerIds[i], playerIds[j]] = [playerIds[j], playerIds[i]];
		}
		playerOrder.push(...playerIds);

		this.players = playerOrder.map(
			(id: string) => new GamePlayer(id, { initialAccumulatorsCount, handCardsCount }),
		);
	}

	/**
	 * Generates a random card number (0-9) based on weighted probabilities.
	 * Uses a weighted random selection algorithm where each card can have different chances of being selected.
	 *
	 * @param chances - Record where keys are card numbers (0-9) and values are their weights.
	 *                  Higher weights increase the probability of selection.
	 *                  Cards not specified in the record default to weight 1.
	 *                  Setting weight to 0 excludes a card from selection.
	 * @returns A random card number between 0 and 9 (inclusive)
	 *
	 * @example
	 * // Equal probability for all cards (default behavior)
	 * getRandomCard()
	 *
	 * // Card 5 is twice as likely, card 0 is excluded
	 * getRandomCard({ 0: 0, 5: 2 })
	 */
	public static getRandomCard(chances: Record<number, number> = {}): number {
		const cardsPool: number[] = [];

		// Build weighted pool by adding each card multiple times based on its weight
		for (let cardNumber: number = 0; cardNumber < 10; cardNumber++) {
			const cardWeight: number = chances[cardNumber] ?? 1; // Default weight is 1 if not specified

			// Add the card to the pool 'cardWeight' number of times
			for (let weightIndex: number = 0; weightIndex < cardWeight; weightIndex++) {
				cardsPool.push(cardNumber);
			}
		}

		// Select random card from the weighted pool
		return cardsPool[Math.floor(Math.random() * cardsPool.length)];
	}

	public getCurrentPlayer(): GamePlayer {
		return this.players[this.turn % this.players.length];
	}
}

export class GamePlayer {
	public readonly id: string;
	public hand: number[];
	public accumulators: Accumulator[];

	public constructor(
		id: string,
		{
			initialAccumulatorsCount = 3,
			handCardsCount = 3,
		}: {
			initialAccumulatorsCount?: number;
			handCardsCount?: number;
		} = {},
	) {
		this.id = id;
		this.hand = [];
		for (let i: number = 0; i < handCardsCount; i++) {
			this.hand.push(Game.getRandomCard());
		}
		this.accumulators = [];
		for (let i: number = 0; i < initialAccumulatorsCount; i++) {
			this.accumulators.push(
				new Accumulator(
					Game.getRandomCard({
						0: 0, // Exclude card with value 0 from initial accumulators
					}),
				),
			);
		}
	}
}

export class Accumulator {
	public readonly originalValue: number;
	public attacks: number[];

	public constructor(value: number) {
		this.originalValue = value;
		this.attacks = [];
	}
}
