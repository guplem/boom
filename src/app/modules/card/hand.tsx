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
				backgroundColor: isSelected ? 'lightblue' : 'brown',
				display: 'flex',
				flexDirection: 'column',
				justifyContent: 'center',
				alignItems: 'center',
				textAlign: 'center',
				borderRadius: '10px',
				minHeight: 0,
				...style, // Merge provided styles with default styles
			}}
			{...props}
		>
			{originalValue}
		</div>
	);
}
