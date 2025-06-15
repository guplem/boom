import GamePage from '@/app/modules/game/page';
import RoomPage from '@/app/modules/room/page';
import { RoomStore, RoomStoreType } from '@/app/modules/room/store';
import { JSX, useEffect } from 'react';

export default function App(): JSX.Element {
	const { room, join }: RoomStoreType = RoomStore();

	// Handle URL parameters on app initialization
	useEffect((): void => {
		const urlParams: URLSearchParams = new URLSearchParams(window.location.search);
		const roomParam: string | null = urlParams.get('room');

		// If there's a room parameter and we're not already in a room, try to join
		if (roomParam && !room) {
			const tryJoinFromUrl = async (): Promise<void> => {
				try {
					const params: URLSearchParams = new URLSearchParams({ roomName: roomParam });
					const response: Response = await fetch(`/api/room?${params.toString()}`, {
						method: 'HEAD',
					});

					if (response.ok) {
						join(roomParam);
						// URL will be updated by the room change effect below
					} else {
						// Room doesn't exist, clear the URL parameter
						const newUrl: URL = new URL(window.location.href);
						newUrl.searchParams.delete('room');
						window.history.replaceState({}, '', newUrl.toString());
					}
				} catch (error) {
					console.error('Error checking room existence:', error);
					// Clear the URL parameter on error
					const newUrl: URL = new URL(window.location.href);
					newUrl.searchParams.delete('room');
					window.history.replaceState({}, '', newUrl.toString());
				}
			};

			tryJoinFromUrl();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []); // Only run on mount

	// Update URL when room changes
	useEffect((): void => {
		const newUrl: URL = new URL(window.location.href);

		if (room) {
			// Add or update room parameter
			newUrl.searchParams.set('room', room);
		} else {
			// Remove room parameter
			newUrl.searchParams.delete('room');
		}

		window.history.replaceState({}, '', newUrl.toString());
	}, [room]);

	return (
		<div
			className='noisyBackground'
			style={{
				backgroundColor: 'var(--background-for-noise)',
				overflow: 'auto',
				minHeight: '100vh',
			}}
		>
			{!room ? <RoomPage /> : <GamePage />}
		</div>
	);
}
