import AccumulatorCard from '@/app/modules/card/accumulator';
import { GamePlayer } from '@/app/modules/game/model';
import { remainingAccumulators } from '@/app/modules/game/utils';
import PlayerCard from '@/app/modules/player/card';
import { PlayerContext, PlayerContextType } from '@/app/modules/player/manager';
import { Player } from '@/app/modules/player/model';
import { JSX } from 'react';

interface PlayerTableParams {
	playerId: string;
	gamePlayer: GamePlayer;
}

export default function PlayerTable({ playerId, gamePlayer }: PlayerTableParams): JSX.Element {
	return (
		<>
			<PlayerContext.Consumer>
				{(playerProvider: PlayerContextType | null): JSX.Element => {
					if (!playerProvider) {
						return <div>Player context not available</div>;
					}
					const playerData: Player | null =
						playerProvider.players.find((p) => p.id === playerId) || null;
					if (!playerData) {
						return <div>Unknown player: {playerId}</div>;
					}

					return (
						<div
							style={{
								display: 'flex',
								flexDirection: 'row',
								gap: '10px',
							}}
						>
							<PlayerCard style={{ height: '100px' }} player={playerData} />
							{remainingAccumulators(gamePlayer.accumulators).map((accumulator, index) => (
								<AccumulatorCard
									style={{ height: '100px' }}
									key={index}
									accumulator={accumulator}
								/>
							))}
						</div>
					);
				}}
			</PlayerContext.Consumer>
		</>
	);
}
