import {
	Accumulator,
	ActionConfig,
	ActionTypes,
	AttackActionHistory,
	AttackActionParams,
	BoomActionHistory,
	BoomActionParams,
	DiscardActionHistory,
	DiscardActionParams,
	Game,
	GamePlayer,
	SwapActionHistory,
	SwapActionParams,
} from '@/app/modules/game/model';
import { createAccumulator, createGame } from '@/app/modules/game/setup';
import { getIndexOfAccumulator, getRandomCard, remainingHp } from '@/app/modules/game/utils';
import { Player } from '@/app/modules/player/model';
import React, { createContext, Dispatch, SetStateAction } from 'react';

export interface GameContextType {
	game: Game | null; // The current game state, can be null if no game is set
	startGame: (_players: Player[]) => void;
	finishGame: () => void;
	getCurrentPlayer: (_game: Game) => GamePlayer;
	executeAction: (_playerId: string, _actionDefinition: ActionConfig) => boolean;
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

export const finishGame = (setGame: Dispatch<SetStateAction<Game | null>>): void => {
	setGame((): Game | null => {
		console.log('Finishing game');
		return null; // Reset the game state
	});
};

/**
 * Advances the game to the next player with more than 0 HP.
 * Sets winnerId if only one player remains alive or if no players remain.
 *
 * @param game - The current game state
 * @returns Updated game state with new turn and winnerId
 */
const advanceToNextTurn = (game: Game): Game => {
	const alivePlayers: GamePlayer[] = game.players.filter(
		(player: GamePlayer) => remainingHp(player.accumulators) > 0,
	);

	// Check win conditions
	if (alivePlayers.length === 0) {
		// No players alive - draw
		return { ...game, winnerId: null };
	} else if (alivePlayers.length === 1) {
		// Only one player alive - winner
		return { ...game, winnerId: alivePlayers[0].id };
	}

	// Game continues - find next alive player
	const maxAttempts: number = game.players.length;

	for (let attempt: number = 1; attempt <= maxAttempts; attempt++) {
		const nextTurn: number = game.turn + attempt;
		const nextPlayer: GamePlayer = game.players[nextTurn % game.players.length];
		if (remainingHp(nextPlayer.accumulators) > 0) {
			return { ...game, turn: nextTurn };
		}
	}

	console.error('No players with HP found after maximum attempts. This should not be possible.');
	return { ...game };
};

export const getCurrentPlayer = (game: Game): GamePlayer => {
	return game.players[game.turn % game.players.length];
};

export const executeAction = (
	setGame: Dispatch<SetStateAction<Game | null>>,
	playerId: string,
	actionConfig: ActionConfig,
): boolean => {
	let actionSuccess: boolean = false;
	console.log(
		`Executing action: ${actionConfig.action} for player ${playerId} with params: ${JSON.stringify(actionConfig.params)}`,
	);
	setGame((prevGame: Game | null): Game | null => {
		// Ensure game exists
		if (!prevGame) {
			console.error('No game to execute action');
			return null;
		}

		// Ensure game is running
		if (prevGame.winnerId !== undefined) {
			console.error('Game has already ended, cannot execute actions');
			return null;
		} // Ensure is player's turn
		if (getCurrentPlayer(prevGame).id !== playerId) {
			console.error(`It's not player ${playerId}'s turn to act`);
			return prevGame;
		}

		if (!actionConfig.params) {
			console.error(`Action parameters cannot be null for action: ${actionConfig.action}`);
			return prevGame;
		}

		let result: {
			newGame: Game | null;
			historyData:
				| AttackActionHistory
				| SwapActionHistory
				| DiscardActionHistory
				| BoomActionHistory
				| null;
		} | null = null;

		// Global checks are OK, execute action:
		switch (actionConfig.action) {
			case ActionTypes.Attack: {
				result = attack({ ...prevGame }, playerId, actionConfig.params as AttackActionParams);
				break;
			}
			case ActionTypes.Swap: {
				result = swap({ ...prevGame }, playerId, actionConfig.params as SwapActionParams);
				break;
			}
			case ActionTypes.Discard: {
				result = discard({ ...prevGame }, playerId, actionConfig.params as DiscardActionParams);
				break;
			}
			case ActionTypes.Boom: {
				result = boom({ ...prevGame }, playerId, actionConfig.params as BoomActionParams);
				break;
			}
			default: {
				console.error(`Unknown action type: ${actionConfig.action}`);
				break;
			}
		}

		// Post action success checks
		if (result?.newGame) {
			console.log(`Action ${actionConfig.action} executed successfully for player ${playerId}.`);
			// Mark action as successful
			actionSuccess = true;
			// Ensure all players have full hands after action
			for (const player of result.newGame.players) {
				while (player.hand.length < result.newGame.handCardsCount) {
					console.warn(
						`Player ${player.id} has ${player.hand.length} cards, which is less than ${result.newGame.handCardsCount}. This happened after action ${actionConfig.action}. Adding a random card.`,
					);
					player.hand.push(getRandomCard());
				}
			}

			// Register action in history
			if (result.historyData)
				result.newGame.history.push({
					turn: prevGame.turn,
					action: actionConfig.action,
					sourcePlayerId: playerId,
					data: result.historyData,
				});
			else
				console.error(
					`No history data available for action ${actionConfig.action} executed by player ${playerId}.`,
				);
		}

		return result?.newGame || prevGame;
	});

	return actionSuccess;
};

const attack = (
	game: Game,
	playerId: string,
	{ targetPlayerId, sourceHandIndex, targetRemainingAccumulatorIndex }: AttackActionParams,
): { newGame: Game | null; historyData: AttackActionHistory | null } => {
	if (
		!targetPlayerId ||
		sourceHandIndex === null ||
		sourceHandIndex === undefined ||
		targetRemainingAccumulatorIndex === null ||
		targetRemainingAccumulatorIndex === undefined
	) {
		console.error('Invalid parameters for attack action');
		return { newGame: null, historyData: null };
	}

	game = { ...game };
	const sourcePlayer: GamePlayer | undefined = game.players.find((p) => p.id === playerId);
	const targetPlayer: GamePlayer | undefined = game.players.find((p) => p.id === targetPlayerId);

	if (!sourcePlayer) {
		console.error('Invalid source player for attack action');
		return { newGame: null, historyData: null };
	}

	if (!targetPlayer) {
		console.error('Invalid target player for attack action');
		return { newGame: null, historyData: null };
	}

	if (sourceHandIndex < 0 || sourceHandIndex >= sourcePlayer.hand.length) {
		console.error('Invalid hand index for attack action');
		return { newGame: null, historyData: null };
	}

	const realAccumulatorIndex: number = getIndexOfAccumulator(
		targetPlayer.accumulators,
		targetRemainingAccumulatorIndex,
	);

	if (realAccumulatorIndex < 0 || realAccumulatorIndex >= targetPlayer.accumulators.length) {
		console.error('Invalid accumulator index for attack action');
		return { newGame: null, historyData: null };
	}

	const sourceCard: number = sourcePlayer.hand[sourceHandIndex];
	const targetAccumulator: Accumulator | undefined =
		targetPlayer.accumulators[realAccumulatorIndex];

	if (!targetAccumulator) {
		console.error('Target accumulator does not exist');
		return { newGame: null, historyData: null };
	}

	if (targetAccumulator.originalValue == 0) {
		console.error('Cannot attack an accumulator with original value 0');
		return { newGame: null, historyData: null };
	}

	const targetAccumulatorRemainingHealth: number = remainingHp([targetAccumulator]);

	if (targetAccumulatorRemainingHealth < sourceCard) {
		console.error("Cannot decrease an accumulator's value below zero");
		return { newGame: null, historyData: null };
	}

	// STORE STATE IN HISTORY before performing the action
	const historyEntry: AttackActionHistory = {
		targetPlayerId: targetPlayerId,
		sourceHandValue: sourceCard,
		targetAccumulatorValue: targetAccumulatorRemainingHealth,
	};

	// PERFORM THE ACTION
	if (targetAccumulator.originalValue === sourceCard && targetAccumulator.attacks.length === 0) {
		sourcePlayer.accumulators.push(createAccumulator(getRandomCard())); // Add a new accumulator
	}
	targetAccumulator.attacks.push(sourceCard);
	sourcePlayer.hand[sourceHandIndex] = getRandomCard(); // Replace the used card with a new random card
	game = advanceToNextTurn(game);

	return { newGame: game, historyData: historyEntry };
};

const swap = (
	game: Game,
	playerId: string,
	{ sourceHandIndex, targetRemainingAccumulatorIndex }: SwapActionParams,
): { newGame: Game | null; historyData: SwapActionHistory | null } => {
	if (
		sourceHandIndex === null ||
		sourceHandIndex === undefined ||
		targetRemainingAccumulatorIndex === null ||
		targetRemainingAccumulatorIndex === undefined
	) {
		console.error('Invalid parameters for swap action');
		return { newGame: null, historyData: null };
	}

	game = { ...game };
	const sourcePlayer: GamePlayer | undefined = game.players.find((p) => p.id === playerId);

	if (!sourcePlayer) {
		console.error('Invalid source player for swap action');
		return { newGame: null, historyData: null };
	}

	if (sourceHandIndex < 0 || sourceHandIndex >= sourcePlayer.hand.length) {
		console.error('Invalid hand index for swap action');
		return { newGame: null, historyData: null };
	}

	const realAccumulatorIndex: number = getIndexOfAccumulator(
		sourcePlayer.accumulators,
		targetRemainingAccumulatorIndex,
	);

	if (realAccumulatorIndex < 0 || realAccumulatorIndex >= sourcePlayer.accumulators.length) {
		console.error('Invalid accumulator index for swap action');
		return { newGame: null, historyData: null };
	}

	const sourceCard: number = sourcePlayer.hand[sourceHandIndex];
	const targetAccumulator: Accumulator | undefined =
		sourcePlayer.accumulators[realAccumulatorIndex];

	if (!targetAccumulator) {
		console.error('Target accumulator does not exist');
		return { newGame: null, historyData: null };
	}

	if (targetAccumulator.attacks.length > 0) {
		console.error('Cannot swap with an accumulator that has attacks');
		return { newGame: null, historyData: null };
	}

	// STORE STATE IN HISTORY before performing the action
	const historyEntry: SwapActionHistory = {
		sourceHandValue: sourceCard,
		targetAccumulatorValue: targetAccumulator.originalValue,
	};

	// PERFORM THE ACTION
	sourcePlayer.accumulators[realAccumulatorIndex] = createAccumulator(sourceCard);
	sourcePlayer.hand[sourceHandIndex] = targetAccumulator.originalValue;

	return { newGame: game, historyData: historyEntry };
};

const discard = (
	game: Game,
	playerId: string,
	{ sourceHandIndex }: DiscardActionParams,
): { newGame: Game | null; historyData: DiscardActionHistory | null } => {
	if (sourceHandIndex === null || sourceHandIndex === undefined) {
		console.error('Invalid parameters for discard action');
		return { newGame: null, historyData: null };
	}

	game = { ...game };
	const sourcePlayer: GamePlayer | undefined = game.players.find((p) => p.id === playerId);

	if (!sourcePlayer) {
		console.error('Invalid source player for discard action');
		return { newGame: null, historyData: null };
	}

	if (sourceHandIndex < 0 || sourceHandIndex >= sourcePlayer.hand.length) {
		console.error('Invalid hand index for discard action');
		return { newGame: null, historyData: null };
	}

	const sourceCard: number = sourcePlayer.hand[sourceHandIndex];

	// STORE STATE IN HISTORY before performing the action
	const historyEntry: DiscardActionHistory = {
		sourceHandValue: sourceCard,
	};

	// PERFORM THE ACTION
	sourcePlayer.hand[sourceHandIndex] = getRandomCard();
	game = advanceToNextTurn(game);

	return { newGame: game, historyData: historyEntry };
};

const boom = (
	game: Game,
	playerId: string,
	{ targetValue }: BoomActionParams,
): { newGame: Game | null; historyData: BoomActionHistory | null } => {
	if (targetValue === null || targetValue === undefined) {
		console.error('Invalid parameters for boom action');
		return { newGame: null, historyData: null };
	}

	game = { ...game };
	const sourcePlayer: GamePlayer | undefined = game.players.find((p) => p.id === playerId);

	if (!sourcePlayer) {
		console.error('Invalid source player for boom action');
		return { newGame: null, historyData: null };
	}

	if (targetValue <= 0) {
		console.error('Invalid target value for boom action');
		return { newGame: null, historyData: null };
	}

	if (!sourcePlayer.hand.every((card: number) => card === 0)) {
		console.error('Player must have all hand cards with value 0 to execute boom action');
		return { newGame: null, historyData: null };
	}

	let accumulatorsDestroyed: number = 0;

	// PERFORM THE ACTION and count destroyed accumulators
	for (const player of game.players) {
		for (let accIndex: number = 0; accIndex < player.accumulators.length; accIndex++) {
			const accumulator: Accumulator = player.accumulators[accIndex];
			const currentValue: number = remainingHp([accumulator]);

			// If the accumulator's current value matches the target value, destroy it
			if (currentValue === targetValue) {
				player.accumulators[accIndex].attacks.push(targetValue);
				accumulatorsDestroyed++;
			}
		}
	}

	// STORE STATE IN HISTORY after performing the action to capture results
	const historyEntry: BoomActionHistory = {
		targetValue: targetValue,
		accumulatorsDestroyedQuantity: accumulatorsDestroyed,
	};

	// Replace all hand cards with new random cards
	sourcePlayer.hand = sourcePlayer.hand.map(() => getRandomCard());
	game = advanceToNextTurn(game);

	return { newGame: game, historyData: historyEntry };
};
