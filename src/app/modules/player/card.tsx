import { GamePlayer } from '@/app/modules/game/model';
import { remainingAccumulatorsDefending } from '@/app/modules/game/utils';
import { Player } from '@/app/modules/player/model';
import { isPlayerOwned } from '@/app/modules/player/utils';
import React, { JSX } from 'react';

interface PlayerCardProps extends React.HTMLAttributes<HTMLDivElement> {
	player: Player;
	removePlayer?: (_id: string) => void | undefined; // Optional, if you want to handle player removal
	gamePlayer?: GamePlayer | undefined; // Optional, if you want to display game player info
}

export default function PlayerCard({
	player,
	removePlayer: onRemovePlayer,
	gamePlayer,
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
			{onRemovePlayer && (
				<button onClick={() => onRemovePlayer(player.id)} title={`Remove player ${player.name}`}>
					Remove
				</button>
			)}

			{/* Optional: Display game player info if available */}
			{gamePlayer && (
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
	);
}
