import { Accumulator } from '@/app/modules/game/model';

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
export const getRandomCard = (chances: Record<number, number> = {}): number => {
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
};

export const remainingAccumulators = (accumulators: Accumulator[]): Accumulator[] => {
	const activeAccumulators: Accumulator[] = [];
	for (const accumulator of accumulators) {
		let remaining: number = accumulator.originalValue;
		for (const attack of accumulator.attacks) {
			remaining -= attack;
		}
		if (remaining > 0) {
			activeAccumulators.push(accumulator);
		}
	}
	return activeAccumulators;
};

export const remainingHp = (accumulators: Accumulator[]): number => {
	let totalHp: number = 0;
	for (const accumulator of remainingAccumulators(accumulators)) {
		let remaining: number = accumulator.originalValue;
		for (const attack of accumulator.attacks) {
			remaining -= attack;
		}
		totalHp += Math.max(remaining, 0); // Ensure we don't count negative HP
	}
	return totalHp;
};
