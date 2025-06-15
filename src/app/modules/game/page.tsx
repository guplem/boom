import { addPlayer, PlayerContext, removePlayer } from '@/app/modules/player/manager';
import { Player } from '@/app/modules/player/model';
import PlayerPage from '@/app/modules/player/page';
import { RoomStore, RoomStoreType } from '@/app/modules/room/store';
import { useSyncState } from '@robojs/sync';
import { JSX } from 'react';

export default function GamePage(): JSX.Element {
	const { room, leave }: RoomStoreType = RoomStore();

	const [players, setPlayers] = useSyncState<Player[]>([], [room, 'players']);

	return (
		<div
			style={{
				minHeight: '100vh',
			}}
		>
			<PlayerContext.Provider
				value={{
					players,
					addPlayer: (player: Player) => addPlayer(setPlayers, player),
					removePlayer: (id: string) => removePlayer(setPlayers, id),
				}}
			>
				{/* TODO: Show PlayerPage or BoardPage depending on the game state. Turn > 0 means BoardPage */}
				<PlayerPage />
				{/* TODO: Show a "start" button */}
			</PlayerContext.Provider>
		</div>
	);
}
