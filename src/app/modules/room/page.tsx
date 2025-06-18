import RoomCreator from '@/app/modules/room/creator';
import RoomPicker from '@/app/modules/room/picker';
import { RoomStore, RoomStoreType } from '@/app/modules/room/store';
import { JSX, useState } from 'react';

export default function RoomPage(): JSX.Element {
	const [joiningRoom, setJoiningRoom] = useState<boolean>(true);

	const { room, leave }: RoomStoreType = RoomStore();

	// This should not be possible, but just in case
	if (room) {
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
						gap: '10px',
					}}
				>
					<h1>Room already selected</h1>
					<p>The room you selected is: {room}</p>
					<button
						onClick={(): void => {
							leave();
						}}
					>
						Leave Room
					</button>
				</div>
			</div>
		);
	}

	// Show the room picker or creator form, passing toggle handler as prop
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
			<img
				src='/logo.png'
				alt='Logo'
				style={{
					maxWidth: '250px',
					marginBottom: '20px',
				}}
			/>
			<div
				// The centered div (element)
				style={{
					backgroundColor: 'var(--container)',
					borderRadius: '10px',
					padding: '20px',
				}}
			>
				<h1>Room Menu</h1>
				<div style={{ marginTop: '10px' }}>
					{joiningRoom ? (
						<RoomPicker onSwitchToCreator={(): void => setJoiningRoom(false)} />
					) : (
						<RoomCreator onSwitchToPicker={(): void => setJoiningRoom(true)} />
					)}
				</div>
			</div>
			{/* <p>User ID: {UserStore.getState().id}</p> */}
			{/* <button
				onClick={(): void => {
					UserStore.getState().setId();
				}}
			>
				Regenerate User ID
			</button> */}
		</div>
	);
}
