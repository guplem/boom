import { CounterContext, CounterContextType } from '@/app/modules/counter/context';
import { JSX } from 'react';

export default function CounterControls(): JSX.Element {
	return (
		<CounterContext.Consumer>
			{({ count, increment, decrement }: CounterContextType): JSX.Element => (
				<div style={{ display: 'flex', gap: '10px' }}>
					<button style={{ marginTop: '10px' }} onClick={decrement}>
						{`Decrease to ${count + -1}`}
					</button>
					<button style={{ marginTop: '10px' }} onClick={increment}>
						{`Increase to ${count + 1}`}
					</button>
				</div>
			)}
		</CounterContext.Consumer>
	);
}
