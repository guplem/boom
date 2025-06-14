import React, { createContext } from 'react';

export interface CounterContextType {
	count: number;
	increment: () => void;
	decrement: () => void;
}

export const CounterContext: React.Context<CounterContextType> = createContext<CounterContextType>({
	count: 0,
	increment: (): void => {},
	decrement: (): void => {},
});
