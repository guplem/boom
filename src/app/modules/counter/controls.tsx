import { CounterContext, CounterContextType } from '@/app/modules/counter/manager';
import React, { JSX } from 'react';

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface CounterControlsProps extends React.HTMLAttributes<HTMLDivElement> {}

export default function CounterControls({ style, ...props }: CounterControlsProps): JSX.Element {
	return (
		<CounterContext.Consumer>
			{(counterProvider: CounterContextType | null): JSX.Element => {
				// Handle case where context is not available
				if (!counterProvider) {
					return <p>Counter context not available</p>;
				}
				return (
					<div
						style={{
							display: 'flex',
							gap: '10px',
							...style,
						}}
						{...props}
					>
						<button style={{ marginTop: '10px' }} onClick={counterProvider.decrement}>
							{`Decrease to ${counterProvider.count + -1}`}
						</button>
						<button style={{ marginTop: '10px' }} onClick={() => counterProvider.setTo(0)}>
							Reset to 0
						</button>
						<button style={{ marginTop: '10px' }} onClick={counterProvider.increment}>
							{`Increase to ${counterProvider.count + 1}`}
						</button>
					</div>
				);
			}}
		</CounterContext.Consumer>
	);
}
