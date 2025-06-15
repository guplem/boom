/**
 * Player interface representing a game player with unique ID, name, and color
 */
export interface Player {
	readonly id: string;
	readonly name: string;
	readonly color: string;
	readonly isBot: boolean;
	readonly owner: string;
}

export interface PlayerConfig {
	id?: string;
	name?: string;
	color?: string;
	isBot: boolean;
	owner?: string;
}
