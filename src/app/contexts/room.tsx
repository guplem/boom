import React, { createContext } from 'react';

export const RoomContext: React.Context<
	[string | null, React.Dispatch<React.SetStateAction<string | null>>]
> = createContext<[string | null, React.Dispatch<React.SetStateAction<string | null>>]>([
	null,
	(): void => {},
]);
