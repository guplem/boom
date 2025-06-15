import { Game } from '@/app/modules/game/model';
import { Player } from '@/app/modules/player/model';
import React, { createContext, Dispatch, SetStateAction } from 'react';

export interface GameContextType {
	game: Game | null; // The current game state, can be null if no game is set
	startGame: (_players: Player[]) => void;
	nextTurn: () => void;
}

export const GameContext: React.Context<GameContextType | null> =
	createContext<GameContextType | null>(null);

/**
 * Ensures the game is an instance of Game.
 * Converts plain objects to Game instances if needed
 */
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any
export const ensureGameInstance = (game: any): Game | null => {
	if (!game) return null;

	if (game instanceof Game) {
		return game;
	}
	return new Game(game);
};

export const startGame = async (
	setGame: Dispatch<SetStateAction<Game | null>>,
	players: Player[],
): Promise<void> => {
	setGame((): Game | null => {
		if (!players || players.length === 0) {
			console.error('Cannot start game without players');
			return null;
		}
		console.log(`Starting game with players: ${players.map((p) => p.name).join(', ')}`);
		return new Game({ players });
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
