import { Player } from '@/app/modules/player/model';
import React, { createContext, Dispatch, SetStateAction } from 'react';

export interface PlayerContextType {
	players: Player[];
	addPlayer: (_player: Player) => void;
	removePlayer: (_id: string) => void;
}

export const PlayerContext: React.Context<PlayerContextType | null> =
	createContext<PlayerContextType | null>(null);

export const addPlayer = async (
	setPlayers: Dispatch<SetStateAction<Player[]>>,
	player: Player,
): Promise<void> => {
	setPlayers((prevPlayers: Player[]): Player[] => {
		console.log(`Adding player: ${player.name}`);
		return [...prevPlayers, player];
	});
};

export const removePlayer = async (
	setPlayers: Dispatch<SetStateAction<Player[]>>,
	id: string,
): Promise<void> => {
	setPlayers((prevPlayers: Player[]): Player[] => {
		if (prevPlayers.length === 0) return prevPlayers;
		const newPlayers: Player[] = prevPlayers.filter((player) => player.id !== id);
		console.log(`Removing player: ${prevPlayers.find((player) => player.id === id)?.name}`);
		return newPlayers;
	});
};
