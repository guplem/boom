import { Player } from '@/app/modules/player/model';
import { isPlayerOwned } from '@/app/modules/player/utils';
import React, { JSX } from 'react';

interface PlayerCardProps extends React.HTMLAttributes<HTMLDivElement> {
	player: Player;
	removePlayer?: (_id: string) => void | undefined; // Optional, if you want to handle player removal
}

export default function PlayerCard({
	player,
	removePlayer,
	style,
	...props
}: PlayerCardProps): JSX.Element {
	return (
		<div
			style={{
				display: 'flex',
				flexDirection: 'column',
				aspectRatio: '1 / 1',
				backgroundColor: player.color,
				...style, // Merge provided styles with default styles
			}}
			{...props}
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
				{isPlayerOwned(player) && <span>Owned</span>}
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
