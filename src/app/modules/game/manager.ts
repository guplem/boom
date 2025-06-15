import { createGame } from '@/app/modules/game/setup';
import { Game, GamePlayer } from '@/app/modules/game/model';
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
