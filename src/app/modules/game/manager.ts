import { Accumulator, Game, GamePlayer } from '@/app/modules/game/model';
import { createAccumulator, createGame } from '@/app/modules/game/setup';
import { getRandomCard } from '@/app/modules/game/utils';
import { Player } from '@/app/modules/player/model';
import React, { createContext, Dispatch, SetStateAction } from 'react';

export interface GameContextType {
	game: Game | null; // The current game state, can be null if no game is set
	startGame: (_players: Player[]) => void;
	nextTurn: () => void;
	getCurrentPlayer: (_game: Game) => GamePlayer;
}

export const GameContext: React.Context<GameContextType | null> =
	createContext<GameContextType | null>(null);

export const startGame = async (
	setGame: Dispatch<SetStateAction<Game | null>>,
	players: Player[],
): Promise<void> => {
	setGame((): Game | null => {
		console.log(`Starting game with players: ${players.map((p) => p.name).join(', ')}`);
		return createGame(players, { initialAccumulatorsCount: 3, handCardsCount: 3 });
	});
};

export const nextTurn = async (setGame: Dispatch<SetStateAction<Game | null>>): Promise<void> => {
	setGame((prevGame: Game | null): Game | null => {
		if (!prevGame) {
			console.error('No game to advance turn');
			return null;
		}

		prevGame.turn += 1;
		return prevGame;
	});
};

export const getCurrentPlayer = (game: Game): GamePlayer => {
	return game.players[game.turn % game.players.length];
};

export enum ActionTypes {
	Attack = 'attack',
	Swap = 'swap',
	Discard = 'discard',
	Boom = 'boom',
}

export interface AttackActionParams {
	targetPlayerId: string;
	sourceHandIndex: number;
	targetAccumulatorIndex: number;
}

export interface SwapActionParams {
	sourceHandIndex: number;
	targetAccumulatorIndex: number;
}

export interface DiscardActionParams {
	sourceHandIndex: number;
}

export interface BoomActionParams {
	targetValue: number;
}

export const executeAction = (
	setGame: Dispatch<SetStateAction<Game | null>>,
	playerId: string,
	action: ActionTypes,
	actionParams: AttackActionParams | SwapActionParams | DiscardActionParams | BoomActionParams,
): void => {
	setGame((prevGame: Game | null): Game | null => {
		if (!prevGame) {
			console.error('No game to execute action');
			return null;
		}

		let newGame: Game | null = null;
		switch (action) {
			case ActionTypes.Attack: {
				newGame = attack(prevGame, playerId, actionParams as AttackActionParams);
				break;
			}
			case ActionTypes.Swap: {
				newGame = swap(prevGame, playerId, actionParams as SwapActionParams);
				break;
			}
			case ActionTypes.Discard: {
				newGame = discard(prevGame, playerId, actionParams as DiscardActionParams);
				break;
			}
			case ActionTypes.Boom: {
				newGame = boom(prevGame, playerId, actionParams as BoomActionParams);
				break;
			}
			default: {
				console.error(`Unknown action type: ${action}`);
				break;
			}
		}

		if (newGame) {
			// Ensure all players have full hands after action
			for (const player of newGame.players) {
				while (player.hand.length < newGame.handCardsCount) {
					console.warn(
						`Player ${player.id} has ${player.hand.length} cards, which is less than ${newGame.handCardsCount}. This happened after action ${action}. Adding a random card.`,
					);
					player.hand.push(getRandomCard());
				}
			}
		}
		return newGame || prevGame;
	});
};

const attack = (
	game: Game,
	playerId: string,
	{ targetPlayerId, sourceHandIndex, targetAccumulatorIndex }: AttackActionParams,
): Game | null => {
	game = { ...game };
	const sourcePlayer: GamePlayer | undefined = game.players.find((p) => p.id === playerId);
	const targetPlayer: GamePlayer | undefined = game.players.find((p) => p.id === targetPlayerId);

	if (!sourcePlayer) {
		console.error('Invalid source player for attack action');
		return null;
	}

	if (!targetPlayer) {
		console.error('Invalid target player for attack action');
		return null;
	}

	if (sourceHandIndex < 0 || sourceHandIndex >= sourcePlayer.hand.length) {
		console.error('Invalid hand index for attack action');
		return null;
	}

	if (targetAccumulatorIndex < 0 || targetAccumulatorIndex >= targetPlayer.accumulators.length) {
		console.error('Invalid accumulator index for attack action');
		return null;
	}

	const sourceCard: number = sourcePlayer.hand[sourceHandIndex];
	const targetAccumulator: Accumulator | undefined =
		targetPlayer.accumulators[targetAccumulatorIndex];

	if (!targetAccumulator) {
		console.error('Target accumulator does not exist');
		return null;
	}

	if (targetAccumulator.originalValue == 0) {
		console.error('Cannot attack an accumulator with original value 0');
		return null;
	}

	if (
		targetAccumulator.attacks.reduce((sum, attack) => sum + attack, 0) + sourceCard >
		targetAccumulator.originalValue
	) {
		console.error("Cannot decrease an accumulator's value below zero");
		return null;
	}

	if (targetAccumulator.originalValue === sourceCard && targetAccumulator.attacks.length === 0) {
		sourcePlayer.accumulators.push(createAccumulator(getRandomCard())); // Add a new accumulator
	}
	targetAccumulator.attacks.push(sourceCard);
	sourcePlayer.hand[sourceHandIndex] = getRandomCard(); // Replace the used card with a new random card
	game.turn += 1;

	return game;
};

const swap = (
	game: Game,
	playerId: string,
	{ sourceHandIndex, targetAccumulatorIndex }: SwapActionParams,
): Game | null => {
	game = { ...game };
	const sourcePlayer: GamePlayer | undefined = game.players.find((p) => p.id === playerId);

	if (!sourcePlayer) {
		console.error('Invalid source player for swap action');
		return null;
	}

	if (sourceHandIndex < 0 || sourceHandIndex >= sourcePlayer.hand.length) {
		console.error('Invalid hand index for swap action');
		return null;
	}

	if (targetAccumulatorIndex < 0 || targetAccumulatorIndex >= sourcePlayer.accumulators.length) {
		console.error('Invalid accumulator index for swap action');
		return null;
	}

	const sourceCard: number = sourcePlayer.hand[sourceHandIndex];
	const targetAccumulator: Accumulator | undefined =
		sourcePlayer.accumulators[targetAccumulatorIndex];

	if (!targetAccumulator) {
		console.error('Target accumulator does not exist');
		return null;
	}

	if (targetAccumulator.attacks.length > 0) {
		console.error('Cannot swap with an accumulator that has attacks');
		return null;
	}

	// Swap the card with the accumulator's original value
	sourcePlayer.accumulators[targetAccumulatorIndex] = createAccumulator(sourceCard);
	sourcePlayer.hand[sourceHandIndex] = targetAccumulator.originalValue;

	return game;
};

const discard = (
	game: Game,
	playerId: string,
	{ sourceHandIndex }: DiscardActionParams,
): Game | null => {
	game = { ...game };
	const sourcePlayer: GamePlayer | undefined = game.players.find((p) => p.id === playerId);

	if (!sourcePlayer) {
		console.error('Invalid source player for discard action');
		return null;
	}

	if (sourceHandIndex < 0 || sourceHandIndex >= sourcePlayer.hand.length) {
		console.error('Invalid hand index for discard action');
		return null;
	}

	sourcePlayer.hand[sourceHandIndex] = getRandomCard(); // Replace the discarded card with a new random card
	game.turn += 1;

	return game;
};

const boom = (game: Game, playerId: string, { targetValue }: BoomActionParams): Game | null => {
	game = { ...game };
	const sourcePlayer: GamePlayer | undefined = game.players.find((p) => p.id === playerId);

	if (!sourcePlayer) {
		console.error('Invalid source player for boom action');
		return null;
	}

	if (targetValue <= 0) {
		console.error('Invalid target value for boom action');
		return null;
	}

	if (!sourcePlayer.hand.every((card: number) => card === 0)) {
		console.error('Player must have all hand cards with value 0 to execute boom action');
		return null;
	}

	// Loop through all players and their accumulators to find matching target values
	for (const player of game.players) {
		for (let accIndex: number = 0; accIndex < player.accumulators.length; accIndex++) {
			const accumulator: Accumulator = player.accumulators[accIndex];
			const currentValue: number =
				accumulator.originalValue -
				accumulator.attacks.reduce((sum: number, attack: number) => sum + attack, 0);

			// If the accumulator's current value matches the target value, destroy it
			if (currentValue === targetValue) {
				player.accumulators[accIndex].attacks.push(targetValue); // Add the target value as an attack to destroy it
			}
		}
	}

	// Replace all hand cards with new random cards
	sourcePlayer.hand = sourcePlayer.hand.map(() => getRandomCard());
	game.turn += 1;

	return game;
};
