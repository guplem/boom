import React, { createContext, Dispatch, SetStateAction } from 'react';

export interface CounterContextType {
	count: number;
	increment: () => void;
	decrement: () => void;
	setTo: (_value: number) => void;
}

export const CounterContext: React.Context<CounterContextType | null> =
	createContext<CounterContextType | null>(null);

export const increment = async (setCount: Dispatch<SetStateAction<number>>): Promise<void> => {
	setCount((prevCount: number): number => {
		const newCount: number = prevCount + 1;
		console.log(`Incrementing count from ${prevCount} to ${newCount}`);
		return newCount;
	});
};

export const decrement = async (setCount: Dispatch<SetStateAction<number>>): Promise<void> => {
	setCount((prevCount: number): number => {
		const newCount: number = prevCount - 1;
		console.log(`Decrementing count from ${prevCount} to ${newCount}`);
		return newCount;
	});
};

export const setTo = async (
	setCount: Dispatch<SetStateAction<number>>,
	value: number,
): Promise<void> => {
	setCount((prevCount: number): number => {
		console.log(`Setting count from ${prevCount} to ${value}`);
		return value;
	});
};
