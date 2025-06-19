import { Scenario } from '@/app/modules/ai/model';
import { strategiesList } from '@/app/modules/ai/strategies';
import { executeAction } from '@/app/modules/game/manager';
import { ActionConfig, ActionTypes, Game } from '@/app/modules/game/model';
import { getCurrentPlayer } from '@/app/modules/game/utils';
import { Player } from '@/app/modules/player/model';
import { Dispatch, SetStateAction } from 'react';

const delay = (ms: number): Promise<void> => {
	return new Promise((resolve) => setTimeout(resolve, ms));
};

export const executeAiStrategy = async (
	userId: string,
	game: Game,
	players: Player[],
	setGame: Dispatch<SetStateAction<Game | null>>,
): Promise<void> => {
	const currentPlayerId: string = getCurrentPlayer(game).id;
	const currentPlayer: Player | undefined = players.find((p) => p.id === currentPlayerId);

	// Exit if the current player is not an AI or does not belong to the user
	if (
		!currentPlayer ||
		!currentPlayer.aiStrategy ||
		currentPlayer.owner !== userId ||
		game.winnerId
	) {
		return;
	}

	console.log(
		`Executing AI strategy for player ${currentPlayer.name} with strategy "${currentPlayer.aiStrategy}".`,
	);

	const scenario: Scenario = {
		board: game.players.map((player) => ({
			playerId: player.id,
			accumulators: player.accumulators,
		})),
		playerHand: game.players.find((p) => p.id === currentPlayerId)?.hand || [],
		turn: game.turn,
		playerId: currentPlayerId,
		history: game.history,
	};

	await delay(game.aiDelay || 500);

	// eslint-disable-next-line @typescript-eslint/typedef
	const strategy = strategiesList.find((s) => s.name === currentPlayer.aiStrategy);
	if (!strategy) {
		console.error(`AI strategy "${currentPlayer.aiStrategy}" not found.`);
		return executeFallbackAction(game, scenario, setGame, currentPlayer);
	}

	const maxAttempts: number = strategy.maxAttempts || 10;
	for (let attempt: number = 0; attempt < maxAttempts; attempt++) {
		const action: ActionConfig = strategy.getActionFunction(scenario);
		const success: boolean = executeAction(game, setGame, currentPlayer.id, action);
		if (success) {
			return;
		}
		// If the action was not valid, wait a bit and try again
		await delay(100);
		console.log(`Attempt ${attempt + 1} failed for player ${currentPlayer.id}. Retrying...`);
	}

	console.warn(`AI strategy could not produce a valid action after ${maxAttempts} attempts.`);
	return executeFallbackAction(game, scenario, setGame, currentPlayer);
};

// Executes a discard action as a fallback since this action is always valid (with the proper params)
const executeFallbackAction = (
	game: Game,
	scenario: Scenario,
	setGame: Dispatch<SetStateAction<Game | null>>,
	currentPlayer: Player,
): void => {
	console.log(`Executing fallback action (discarding a card) for player ${currentPlayer.id}.`);

	const fallbackAction: ActionConfig = {
		action: ActionTypes.Discard,
		params: {
			sourceHandIndex: Math.floor(Math.random() * scenario.playerHand.length),
		},
	};

	executeAction(game, setGame, currentPlayer.id, fallbackAction);
};
