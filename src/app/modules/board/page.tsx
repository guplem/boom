import HandCard from '@/app/modules/card/hand';
import { GameContext, GameContextType } from '@/app/modules/game/manager';
import { GamePlayer } from '@/app/modules/game/model';
import { RoomStore, RoomStoreType } from '@/app/modules/room/store';
import { JSX, MouseEvent } from 'react';

interface BoardPageParams {
	/** The id for the player that the user is controlling */
	userPlayerId: string;
}

export default function BoardPage({ userPlayerId }: BoardPageParams): JSX.Element {
	const { room, leave }: RoomStoreType = RoomStore();
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
					// return (
					// 	<div>
					// 		{JSON.stringify(gameProvider)}
					// 		<button
					// 			onClick={(e: MouseEvent<HTMLButtonElement>): void => {
					// 				e.preventDefault();
					// 				gameProvider.nextTurn();
					// 			}}
					// 		>
					// 			Next Turn
					// 		</button>
					// 	</div>
					// );
					return (
						<div
							style={{
								display: 'flex',
								height: '100vh',
								width: '100vw',
								flexDirection: 'row',
							}}
						>
							<div
								style={{
									flex: 1,
									minWidth: '220px',
									backgroundColor: 'var(--container)',
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
								</small>
								{userGamePlayer.hand.map((handCard, index) => (
									<HandCard key={index} originalValue={handCard}></HandCard>
								))}
							</div>
							<div
								style={{
									flex: 6,
									backgroundColor: 'red',
								}}
							></div>
						</div>
					);
				}}
			</GameContext.Consumer>
		</>
	);
}
