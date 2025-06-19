import GameBoardPage from '@/app/modules/game/boardPage';
import {
	executeAction,
	finishGame,
	GameContext,
	getCurrentPlayer,
	startGame,
} from '@/app/modules/game/manager';
import { ActionConfig, Game } from '@/app/modules/game/model';
import GameOverPage from '@/app/modules/game/overPage';
import { addPlayer, PlayerContext, removePlayer } from '@/app/modules/player/manager';
import { Player } from '@/app/modules/player/model';
import PlayerPage from '@/app/modules/player/page';
import { RoomStore, RoomStoreType } from '@/app/modules/room/store';
import { UserStore, UserStoreType } from '@/app/modules/user/store';
import { useSyncState } from '@robojs/sync';
import { JSX } from 'react';

export default function GamePage(): JSX.Element {
	const { room }: RoomStoreType = RoomStore();
	const { id: userId }: UserStoreType = UserStore();

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
					game: game,
					startGame: (players: Player[]) => startGame(setGame, players),
					finishGame: () => finishGame(setGame),
					getCurrentPlayer: (game: Game) => getCurrentPlayer(game),
					executeAction: (playerId: string, actionDefinition: ActionConfig) =>
						executeAction(setGame, playerId, actionDefinition),
				}}
			>
				<PlayerContext.Provider
					value={{
						players: players,
						addPlayer: (player: Player) => addPlayer(setPlayers, player),
						removePlayer: (id: string) => removePlayer(setPlayers, id),
					}}
				>
					{game ? (
						// Check if game has ended (has a winnerId defined)
						game.winnerId !== undefined ? (
							<GameOverPage />
						) : (
							<GameBoardPage
								userPlayerId={
									players.find((player: Player) => player.owner === userId && !player.isBot)?.id ||
									'not-found'
								}
							/>
						)
					) : (
						<PlayerPage />
					)}
				</PlayerContext.Provider>
			</GameContext.Provider>
		</div>
	);
}
