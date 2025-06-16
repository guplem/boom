import PlayerTable from '@/app/modules/board/playerTable';
import HandCard from '@/app/modules/card/hand';
import { ActionTypes, GameContext, GameContextType } from '@/app/modules/game/manager';
import { GamePlayer } from '@/app/modules/game/model';
import {
	remainingAccumulators,
	remainingAccumulatorsDefending,
	remainingHp,
} from '@/app/modules/game/utils';
import { PlayerContext, PlayerContextType } from '@/app/modules/player/manager';
import { Player } from '@/app/modules/player/model';
import { RoomStore, RoomStoreType } from '@/app/modules/room/store';
import React, { JSX, MouseEvent, useState } from 'react';

interface BoardPageParams {
	/** The id for the player that the user is controlling */
	userPlayerId: string;
}

export default function BoardPage({ userPlayerId }: BoardPageParams): JSX.Element {
	const { leave }: RoomStoreType = RoomStore();
	const [handSelected, setHandSelected] = useState<number | null>(null);
	const [boomValue, setBoomValue] = useState<string>('');

	return (
		<>
			<GameContext.Consumer>
				{(gameProvider: GameContextType | null): JSX.Element => {
					if (!gameProvider) {
						return <div>Game context not available</div>;
					}
					const userGamePlayer: GamePlayer | null =
						gameProvider.game?.players.find((player) => player.id === userPlayerId) || null;

					const currentPlayerId: string | null = gameProvider.getCurrentPlayer(
						gameProvider.game!,
					).id;
					const isThisPlayerTurn: boolean = !!(
						userGamePlayer && currentPlayerId === userGamePlayer.id
					);
					const canBoom: boolean =
						userGamePlayer?.hand.length === 3 &&
						userGamePlayer?.hand.reduce((sum: number, value: number) => sum + value, 0) === 0;

					function handleSelectHandCard(handCardIndex: number): void {
						setHandSelected((prevSelected) => {
							if (prevSelected === handCardIndex) {
								return null; // Deselect if already selected
							}
							return handCardIndex; // Select the new card
						});
					}

					return (
						<PlayerContext.Consumer>
							{(playerProvider: PlayerContextType | null): JSX.Element => {
								if (!playerProvider) {
									return <div>Player context not available</div>;
								}
								const playerData: Player | null =
									playerProvider.players.find((p) => p.id === userPlayerId) || null;

								return (
									<div
										style={{
											display: 'flex',
											height: '100vh',
											width: '100vw',
											flexDirection: 'row',
										}}
									>
										{/* ======= PLAYER CONTROLS ======= */}
										<div
											style={{
												flex: 1,
												minWidth: '200px',
												backgroundColor: playerData?.color ?? 'var(--container)',
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
												</a>
												{' - '}
												<a
													href='#' // With this, the link will visually look like a link, but it won't redirect to anything
													onClick={(e: MouseEvent<HTMLAnchorElement>): void => {
														e.preventDefault();
														gameProvider.finishGame();
													}}
												>
													Finish Game
												</a>{' '}
											</small>{' '}
											{!userGamePlayer && (
												<div>
													Unknown Controlled player: {userPlayerId}. <br /> All (
													{gameProvider.game?.players.length}) players:{' '}
													{gameProvider.game?.players.map((player) => player.id).join(', ')}
												</div>
											)}
											{/* {isThisPlayerTurn && <div style={{ textAlign: 'center' }}>Your Turn</div>} */}
											{userGamePlayer && (
												<>
													<div
														style={{
															display: 'flex',
															flexDirection: 'column',
															justifyContent: 'center',
															gap: '10px',
															minHeight: 0,
															padding: '10px',
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
																isPlayerTurn={isThisPlayerTurn}
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
														<div style={{ textAlign: 'center' }}>
															<h2>
																{
																	remainingAccumulatorsDefending(userGamePlayer.accumulators).length
																}{' '}
															</h2>
															<p>Defenses</p>
														</div>
														<div>
															<p>{remainingHp(userGamePlayer.accumulators)} HP</p>
															<p>{remainingAccumulators(userGamePlayer.accumulators).length} Acc</p>
														</div>
													</div>
													<div
														style={{
															display: 'flex',
															flexDirection: 'column',
															justifyContent: 'center',
															gap: '10px',
														}}
													>
														<div
															style={{
																display: 'flex',
																flexDirection: 'row',
																alignItems: 'center',
																justifyContent: 'center',
																gap: '10px',
															}}
														>
															<input
																style={{ flex: 1 }}
																type='number'
																min='1'
																max='9'
																value={boomValue}
																onChange={(e: React.ChangeEvent<HTMLInputElement>): void => {
																	const value: string = e.target.value;
																	if (value === '' || (Number(value) >= 1 && Number(value) <= 9)) {
																		setBoomValue(value);
																	}
																}}
																placeholder='Target'
																disabled={!isThisPlayerTurn || !canBoom}
															/>
															<button
																style={{ flex: 1 }}
																disabled={boomValue === '' || !isThisPlayerTurn || !canBoom}
																onClick={() => {
																	const numValue: number = Number(boomValue);
																	if (numValue >= 1 && numValue <= 9) {
																		const success: boolean = gameProvider.executeAction(
																			userGamePlayer.id,
																			ActionTypes.Boom,
																			{
																				targetValue: numValue,
																			},
																		);
																		if (success) {
																			setBoomValue(''); // Reset input after action
																		}
																	}
																}}
															>
																Boom
															</button>
														</div>

														<button
															disabled={handSelected === null || !isThisPlayerTurn}
															onClick={() => {
																let success: boolean = false;
																success = gameProvider.executeAction(
																	userGamePlayer.id,
																	ActionTypes.Discard,
																	{
																		sourceHandIndex: handSelected!,
																	},
																);
																if (success) {
																	setHandSelected(null); // Reset selection after action
																}
															}}
														>
															Discard Hand Card
														</button>
													</div>
												</>
											)}
										</div>

										{/* ======= PLAYERS BOARD ======= */}
										<div
											style={{
												flex: 7,
												display: 'flex',
												flexDirection: 'column',
												gap: '10px',
												paddingTop: '10px',
												paddingBottom: '10px',
												paddingRight: '10px',
											}}
										>
											{gameProvider.game?.players.map((player) => (
												<PlayerTable
													isThisPlayerTurn={currentPlayerId === player.id}
													key={player.id}
													isUserPlayer={userGamePlayer?.id === player.id}
													playerId={player.id}
													gamePlayer={player}
													canSelectAccumulator={handSelected !== null}
													onSelectAccumulator={(index: number) => {
														if (!userGamePlayer) return;
														let success: boolean = false;
														if (player.id === userGamePlayer.id) {
															success = gameProvider.executeAction(player.id, ActionTypes.Swap, {
																sourceHandIndex: handSelected!,
																targetRemainingAccumulatorIndex: index,
															});
														} else {
															success = gameProvider.executeAction(
																userGamePlayer.id,
																ActionTypes.Attack,
																{
																	targetPlayerId: player.id,
																	sourceHandIndex: handSelected!,
																	targetRemainingAccumulatorIndex: index,
																},
															);
														}
														if (success) {
															setHandSelected(null); // Reset selection after action
														}
													}}
												/>
											))}
										</div>
									</div>
								);
							}}
						</PlayerContext.Consumer>
					);
				}}
			</GameContext.Consumer>
		</>
	);
}
