import CounterControls from '@/app/modules/counter/controls';
import { CounterContext, decrement, increment, setTo } from '@/app/modules/counter/manager';
import { RoomStore, RoomStoreType } from '@/app/modules/room/store';
import { useSyncState } from '@robojs/sync';
import { JSX, MouseEvent } from 'react';

export default function CounterPage(): JSX.Element {
	const { room, leave }: RoomStoreType = RoomStore();

	const [count, setCount] = useSyncState<number>(0, [room, 'count']);

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
				<CounterContext.Provider
					value={{
						count,
						increment: () => increment(setCount),
						decrement: () => decrement(setCount),
						setTo: (value: number) => setTo(setCount, value),
					}}
				>
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
