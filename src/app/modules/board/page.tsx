import PlayerTable from '@/app/modules/board/playerTable';
import HandCard from '@/app/modules/card/hand';
import { ActionTypes, GameContext, GameContextType } from '@/app/modules/game/manager';
import { GamePlayer } from '@/app/modules/game/model';
import { remainingAccumulators, remainingHp } from '@/app/modules/game/utils';
import { RoomStore, RoomStoreType } from '@/app/modules/room/store';
import { JSX, MouseEvent, useState } from 'react';

interface BoardPageParams {
	/** The id for the player that the user is controlling */
	userPlayerId: string;
}

export default function BoardPage({ userPlayerId }: BoardPageParams): JSX.Element {
	const { room, leave }: RoomStoreType = RoomStore();
	const [handSelected, setHandSelected] = useState<number | null>(null);

	return (
		<>
			<GameContext.Consumer>
				{(gameProvider: GameContextType | null): JSX.Element => {
					if (!gameProvider) {
						return <div>Game context not available</div>;
					}
					const userGamePlayer: GamePlayer | null =
						gameProvider.game?.players.find((player) => player.id === userPlayerId) || null;
					if (!userGamePlayer) {
						return (
							<div>
								Unknown Controlled player: {userPlayerId}. <br /> All (
								{gameProvider.game?.players.length}) players:{' '}
								{gameProvider.game?.players.map((player) => player.id).join(', ')}
							</div>
						);
					}

					function handleSelectHandCard(handCardIndex: number): void {
						setHandSelected((prevSelected) => {
							if (prevSelected === handCardIndex) {
								return null; // Deselect if already selected
							}
							return handCardIndex; // Select the new card
						});
					}

					return (
						<div
							style={{
								display: 'flex',
								height: '100vh',
								width: '100vw',
								flexDirection: 'row',
							}}
						>
							{/* ======= PLAYER HAND ======= */}
							<div
								style={{
									flex: 1,
									minWidth: '200px',
									backgroundColor: 'var(--container)',
									display: 'flex',
									flexDirection: 'column',
									justifyContent: 'space-between',
									padding: '10px',
								}}
							>
								<small
									style={{
										textAlign: 'center',
										display: 'block',
										margin: '10px',
									}}
								>
									<a
										href='#' // With this, the link will visually look like a link, but it won't redirect to anything
										onClick={(e: MouseEvent<HTMLAnchorElement>): void => {
											e.preventDefault();
											leave();
										}}
									>
										Leave Room
									</a>{' '}
									{room}
								</small>{' '}
								<div
									style={{
										display: 'flex',
										flexDirection: 'column',
										justifyContent: 'center',
										gap: '10px',
										minHeight: 0,
									}}
								>
									{userGamePlayer.hand.map((handCard, index) => (
										<HandCard
											onClick={() => handleSelectHandCard(index)}
											style={{
												cursor: 'pointer',
											}}
											key={index}
											originalValue={handCard}
											isSelected={handSelected === index}
										/>
									))}
								</div>
								<div
									style={{
										display: 'flex',
										flexDirection: 'row',
										justifyContent: 'space-evenly',
										alignItems: 'center',
										gap: '10px',
										margin: '10px',
									}}
								>
									<div>{remainingHp(userGamePlayer.accumulators)} HP</div>
									<div>{remainingAccumulators(userGamePlayer.accumulators).length} Acc</div>
								</div>
								<div>
									<button
										onClick={() =>
											gameProvider.executeAction(userGamePlayer.id, ActionTypes.Discard, {
												sourceHandIndex: handSelected!,
											})
										}
									>
										Discard Hand Card
									</button>
								</div>
							</div>

							{/* ======= PLAYERS BOARD ======= */}
							<div
								style={{
									flex: 7,
									display: 'flex',
									flexDirection: 'column',
									gap: '10px',
									padding: '10px',
								}}
							>
								{gameProvider.game?.players.map((player) => (
									<PlayerTable key={player.id} playerId={player.id} gamePlayer={player} />
								))}
							</div>
						</div>
					);
				}}
			</GameContext.Consumer>
		</>
	);
}
