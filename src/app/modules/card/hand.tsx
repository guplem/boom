import { JSX } from 'react';

interface GameCardProps {
	originalValue: number;
}

export default function HandCard({ originalValue }: GameCardProps): JSX.Element {
	return (
		<div
			style={{
				aspectRatio: '1 / 1',
				backgroundColor: 'brown',
				display: 'flex',
				flexDirection: 'column',
				justifyContent: 'center',
				alignItems: 'center',
				textAlign: 'center',
				borderRadius: '10px',
				margin: '10px',
			}}
		>
			{originalValue}
		</div>
	);
}
