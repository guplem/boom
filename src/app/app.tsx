import CounterPage from '@/app/modules/counter/page';
import RoomPage from '@/app/modules/room/page';
import { RoomStore, RoomStoreType } from '@/app/modules/room/store';
import { JSX } from 'react';

// The
export default function App(): JSX.Element {
	const { room }: RoomStoreType = RoomStore();

	return (
		<div
			className='noisyBackground'
			style={{
				backgroundColor: 'var(--background-for-noise)',
				overflow: 'auto',
				minHeight: '100vh',
			}}
		>
			{!room ? <RoomPage /> : <CounterPage />}
		</div>
	);
}
