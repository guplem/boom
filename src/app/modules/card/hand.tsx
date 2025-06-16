import React, { JSX } from 'react';

interface GameCardProps extends React.HTMLAttributes<HTMLDivElement> {
	originalValue: number;
	isSelected: boolean;
	isPlayerTurn: boolean;
}

export default function HandCard({
	originalValue,
	style,
	isSelected,
	isPlayerTurn,
	...props
}: GameCardProps): JSX.Element {
	return (
		<div
			style={{
				aspectRatio: '1 / 1',
				backgroundColor: 'var(--container)',
				display: 'flex',
				flexDirection: 'column',
				justifyContent: 'center',
				alignItems: 'center',
				textAlign: 'center',
				borderRadius: '10px',
				minHeight: 0,
				border: isSelected ? '2px solid blue' : 'none',
				opacity: isPlayerTurn ? 1 : 0.55,
				...style, // Merge provided styles with default styles
			}}
			{...props}
		>
			<h1>{originalValue}</h1>
		</div>
	);
}
