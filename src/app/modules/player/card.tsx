import { Player } from '@/app/modules/player/model';
import { JSX } from 'react';

interface PlayerCardProps {
	player: Player;
	removePlayer?: (_id: string) => void | undefined; // Optional, if you want to handle player removal
}

export default function PlayerCard({ player, removePlayer }: PlayerCardProps): JSX.Element {
	return (
		<div
			key={player.id}
			style={{
				display: 'flex',
				flexDirection: 'column',
				aspectRatio: '1 / 1',
				backgroundColor: player.color,
			}}
		>
			{/* Top section with ownership indicator, name, and bot indicator */}
			<div
				style={{
					display: 'flex',
					flexWrap: 'wrap',
					// flexDirection: 'column',
					justifyContent: 'center',
					alignItems: 'center',
					gap: '8px',
					flex: 1,
				}}
			>
				{player.isOwned() && <span>Owned</span>}
				<span
					style={{
						overflow: 'hidden',
						textOverflow: 'ellipsis',
						display: '-webkit-box',
						WebkitLineClamp: 2,
						WebkitBoxOrient: 'vertical',
					}}
				>
					{player.name}
				</span>
				{player.isBot && <span>BOT</span>}
			</div>

			{/* Remove button at the bottom */}
			{removePlayer && (
				<button onClick={() => removePlayer(player.id)} title={`Remove player ${player.name}`}>
					Remove
				</button>
			)}
		</div>
	);
}
