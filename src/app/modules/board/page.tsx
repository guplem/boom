import { GameContext, GameContextType } from '@/app/modules/game/manager';
import { RoomStore, RoomStoreType } from '@/app/modules/room/store';
import { JSX, MouseEvent } from 'react';

export default function BoardPage(): JSX.Element {
	const { room, leave }: RoomStoreType = RoomStore();
	return (
		<>
			<GameContext.Consumer>
				{(gameProvider: GameContextType | null): JSX.Element => {
					if (!gameProvider) {
						return <div>Game context not available</div>;
					}
					return (
						<div>
							{JSON.stringify(gameProvider)}
							<button
								onClick={(e: MouseEvent<HTMLButtonElement>): void => {
									e.preventDefault();
									gameProvider.nextTurn();
								}}
							>
								Next Turn
							</button>
						</div>
					);
				}}
			</GameContext.Consumer>
			<small style={{ marginTop: '15px', textAlign: 'center', display: 'block', padding: '20px' }}>
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
		</>
	);
}
