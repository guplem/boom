import GameAccumulatorCard from '@/app/modules/game/accumulatorCard';
import { GamePlayer } from '@/app/modules/game/model';
import { remainingAccumulators } from '@/app/modules/game/utils';
import PlayerCard from '@/app/modules/player/card';
import { PlayerContext, PlayerContextType } from '@/app/modules/player/manager';
import { Player } from '@/app/modules/player/model';
import React, { JSX } from 'react';

interface GamePlayerZoneProps extends React.HTMLAttributes<HTMLDivElement> {
	playerId: string;
	gamePlayer: GamePlayer;
	canSelectAccumulator: boolean;
	onSelectAccumulator: (_index: number) => void;
	isThisPlayerTurn?: boolean;
	isUserPlayer: boolean;
}

export default function GamePlayerZone({
	playerId,
	gamePlayer,
	canSelectAccumulator,
	onSelectAccumulator,
	isThisPlayerTurn,
	isUserPlayer,
	style,
	...props
}: GamePlayerZoneProps): JSX.Element {
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
								backgroundColor: isUserPlayer ? playerData.color : '',
								borderTopRightRadius: isUserPlayer ? '12px' : '0',
								borderBottomRightRadius: isUserPlayer ? '12px' : '0',
								...style,
							}}
							{...props}
						>
							<div
								style={{
									marginLeft: '10px',
									padding: '3px',
									background: !isThisPlayerTurn
										? ''
										: isUserPlayer
											? 'linear-gradient(to left, #3d4749, transparent)'
											: ' #3d4749',
									borderRadius: '12px',
								}}
							>
								<div
									style={{
										display: 'flex',
										flexDirection: 'row',
										alignItems: 'center',
										gap: '10px',
										backgroundColor: playerData.color || 'var(--container)',
										padding: '10px',
										borderTopRightRadius: '10px',
										borderBottomRightRadius: '10px',
										borderTopLeftRadius: isUserPlayer ? '0px' : '10px',
										borderBottomLeftRadius: isUserPlayer ? '0px' : '10px',
										// borderTop: isThisPlayerTurn ? '3px solid black' : 'none',
										// borderRight: isThisPlayerTurn ? '3px solid black' : 'none',
										// borderBottom: isThisPlayerTurn ? '3px solid black' : 'none',
										// borderLeft: isThisPlayerTurn && !isUserPlayer ? '3px solid black' : 'none',
										overflow: 'visible', // <-- Add this line
										...style,
									}}
								>
									<PlayerCard
										showOwnedIndicator={!isUserPlayer}
										style={{ height: '100px' }}
										player={playerData}
										gamePlayer={gamePlayer}
									/>
									{remainingAccumulators(gamePlayer.accumulators).map((accumulator, index) => (
										<GameAccumulatorCard
											onClick={
												canSelectAccumulator ? (): void => onSelectAccumulator(index) : undefined
											}
											style={{
												height: '100px',
												// cursor is now handled by CSS class
											}}
											key={index}
											accumulator={accumulator}
										/>
									))}
								</div>
							</div>
						</div>
					);
				}}
			</PlayerContext.Consumer>
		</>
	);
}
