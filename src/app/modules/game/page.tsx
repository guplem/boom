import BoardPage from '@/app/modules/board/page';
import { ensureGameInstance, GameContext, nextTurn, startGame } from '@/app/modules/game/manager';
import { Game } from '@/app/modules/game/model';
import {
	addPlayer,
	ensurePlayerInstances,
	PlayerContext,
	removePlayer,
} from '@/app/modules/player/manager';
import { Player } from '@/app/modules/player/model';
import PlayerPage from '@/app/modules/player/page';
import { RoomStore, RoomStoreType } from '@/app/modules/room/store';
import { useSyncState } from '@robojs/sync';
import { JSX } from 'react';

export default function GamePage(): JSX.Element {
	const { room }: RoomStoreType = RoomStore();

	const [players, setPlayers] = useSyncState<Player[]>([], [room, 'players']);
	const [game, setGame] = useSyncState<Game | null>(null, [room, 'game']);

	return (
		<div
			style={{
				minHeight: '100vh',
			}}
		>
			<GameContext.Provider
				value={{
					game: ensureGameInstance(game), // Because this comes from the network, it is not an object but plain data, so we need to ensure it is an instance of Game
					startGame: (players: Player[]) => startGame(setGame, players),
					nextTurn: () => nextTurn(setGame),
				}}
			>
				<PlayerContext.Provider
					value={{
						players: ensurePlayerInstances(players), // Because this comes from the network, they are not objects but plain data, so we need to ensure they are instances of Player
						addPlayer: (player: Player) => addPlayer(setPlayers, player),
						removePlayer: (id: string) => removePlayer(setPlayers, id),
					}}
				>
					{game ? <BoardPage /> : <PlayerPage />}
				</PlayerContext.Provider>
			</GameContext.Provider>
		</div>
	);
}
