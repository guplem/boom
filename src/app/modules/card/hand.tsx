import React, { JSX } from 'react';

interface GameCardProps extends React.HTMLAttributes<HTMLDivElement> {
	originalValue: number;
	isSelected?: boolean;
}

export default function HandCard({
	originalValue,
	style,
	isSelected,
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
				...style, // Merge provided styles with default styles
			}}
			{...props}
		>
			{originalValue}
		</div>
	);
}
