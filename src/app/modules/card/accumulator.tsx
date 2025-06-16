import { Accumulator } from '@/app/modules/game/model';
import React, { JSX } from 'react';

interface GameCardProps extends React.HTMLAttributes<HTMLDivElement> {
	accumulator: Accumulator;
}

export default function AccumulatorCard({
	accumulator,
	style,
	...props
}: GameCardProps): JSX.Element {
	let remainingHp: number = accumulator.originalValue;
	for (const attack of accumulator.attacks) {
		remainingHp -= attack;
	}
	if (remainingHp < 0) {
		remainingHp = 0;
	}

	return (
		<div
			style={{
				aspectRatio: '1 / 1',
				backgroundColor: 'var(--container)',
				display: 'flex',
				flexDirection: 'column',
				justifyContent: 'space-evenly',
				alignItems: 'center',
				textAlign: 'center',
				borderRadius: '10px',
				...style, // Merge provided styles with default styles
			}}
			{...props}
		>
			{remainingHp}
			{accumulator.attacks.length > 0 && (
				<div style={{ fontSize: '0.8em', color: 'white' }}>{accumulator.attacks.join(', ')}</div>
			)}
		</div>
	);
}
