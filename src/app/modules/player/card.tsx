import { GamePlayer } from '@/app/modules/game/model';
import { remainingAccumulatorsDefending } from '@/app/modules/game/utils';
import { Player } from '@/app/modules/player/model';
import { isPlayerOwned } from '@/app/modules/player/utils';
import React, { JSX, useState } from 'react';

interface PlayerCardProps extends React.HTMLAttributes<HTMLDivElement> {
	player: Player;
	removePlayer?: (_id: string) => void | undefined; // Optional, if you want to handle player removal
	gamePlayer?: GamePlayer | undefined; // Optional, if you want to display game player info
	showOwnedIndicator?: boolean; // Optional prop to show owned indicator
}

export default function PlayerCard({
	player,
	removePlayer: onRemovePlayer,
	gamePlayer,
	style,
	showOwnedIndicator = true, // Optional prop to show owned indicator
	...props
}: PlayerCardProps): JSX.Element {
	const [isHovered, setIsHovered] = useState<boolean>(false);

	// Determine if there's content to show in the hover section
	const hasHoverContent: boolean = player.isBot || (showOwnedIndicator && isPlayerOwned(player));

	return (
		<div
			style={{
				display: 'flex',
				flexDirection: 'column',
				aspectRatio: '1 / 1',
				backgroundColor: player.color,
				alignItems: 'center',
				...style, // Merge provided styles with default styles
			}}
			onMouseEnter={() => setIsHovered(true)}
			onMouseLeave={() => setIsHovered(false)}
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
			</div>
			<div
				style={{
					display: 'flex',
					flexDirection: 'column',
					justifyContent: 'center',
					alignItems: 'center',
					gap: '8px',
					flex: 1,
				}}
			>
				{/* Show CPU and ownership indicators only on hover and if there's content */}
				{isHovered && hasHoverContent && (
					<p style={{ textAlign: 'center' }}>
						{player.isBot && <span>CPU</span>}
						<br />
						{showOwnedIndicator && isPlayerOwned(player) && <span>(Hosted)</span>}
					</p>
				)}

				{/* Remove button at the bottom */}
				{onRemovePlayer && (
					<button onClick={() => onRemovePlayer(player.id)} title={`Remove player ${player.name}`}>
						Remove
					</button>
				)}

				{/* Optional: Display game player info if available */}
				{gamePlayer && !(isHovered && hasHoverContent) && (
					<div
						style={{
							display: 'flex',
							flexDirection: 'row',
							justifyContent: 'space-evenly',
							gap: '4px',
						}}
					>
						{/* <div>{remainingHp(gamePlayer.accumulators)} HP</div>
					<div>{remainingAccumulators(gamePlayer.accumulators).length} Acc</div> */}
						<h2>{remainingAccumulatorsDefending(gamePlayer.accumulators).length}</h2>
					</div>
				)}
			</div>
		</div>
	);
}
