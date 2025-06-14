import { CounterContext } from '@/app/modules/counter/context';
import CounterControls from '@/app/modules/counter/controls';
import { RoomStore, RoomStoreType } from '@/app/modules/room/store';
import { useSyncState } from '@robojs/sync';
import { JSX, MouseEvent } from 'react';

export default function CounterPage(): JSX.Element {
	const { room, leave }: RoomStoreType = RoomStore();

	const [count, setCount] = useSyncState<number>(0, [room, 'count']);

	const increment = async (): Promise<void> => {
		setCount((prevCount: number): number => {
			const newCount: number = prevCount + 1;
			console.log(`Incrementing count in room "${room}" from ${prevCount} to ${newCount}`);
			return newCount;
		});
	};

	const decrement = async (): Promise<void> => {
		setCount((prevCount: number): number => {
			const newCount: number = prevCount - 1;
			console.log(`Decrementing count in room "${room}" from ${prevCount} to ${newCount}`);
			return newCount;
		});
	};

	return (
		<div
			// Div (container) that centers its child at its center
			className='centeredChildren'
			style={{
				minHeight: '100vh',
				minWidth: '100vw',
				flexDirection: 'column',
			}}
		>
			<div
				// The centered div (element)
				style={{
					backgroundColor: 'var(--container)',
					borderRadius: '10px',
					padding: '20px',
					display: 'flex',
					flexDirection: 'column',
					alignItems: 'center',
				}}
			>
				<h1>Current count</h1>
				<p style={{ fontSize: '2rem', fontWeight: 'bold', margin: '0' }}>{count}</p>
				{/* Demonstration of the context API */}
				<CounterContext.Provider value={{ count, increment, decrement }}>
					<CounterControls />
				</CounterContext.Provider>
			</div>
			<small style={{ marginTop: '5px' }}>
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
		</div>
	);
}
