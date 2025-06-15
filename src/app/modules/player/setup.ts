import { Player, PlayerConfig } from '@/app/modules/player/model';
import { UserStore } from '@/app/modules/user/store';

/**
 * Factory function to create a new Player data object.
 * @param config - Configuration options for the player
 * @returns A new Player data object
 */
export function createPlayer(config: PlayerConfig): Player {
	return {
		id: config.id ?? crypto.randomUUID(),
		name: config.name ?? getRandomName(),
		color: config.color ?? getRandomColor(),
		isBot: config.isBot,
		owner: config.owner ?? UserStore.getState().id!,
	};
}

export const predefinedColors: string[] = [
	'#FF0000', // red
	'#0000FF', // blue
	'#008000', // green
	'#FFFF00', // yellow
	'#800080', // purple
	'#FFA500', // orange
	'#FFC0CB', // pink
	'#00FFFF', // cyan
	'#FF00FF', // magenta
	'#00FF00', // lime
	'#4B0082', // indigo
	'#008080', // teal
	'#A52A2A', // brown
	'#000080', // navy
	'#800000', // maroon
	'#808000', // olive
	'#C0C0C0', // silver
	'#FFD700', // gold
	'#FF7F50', // coral
	'#DC143C', // crimson
];

export const predefinedNames: string[] = [
	'Igordo',
	'Polete',
	'Romesro',
	'La Juana',
	'Hinoko',
	'Saumelio',
	'Arandanos',
	'Bielo',
	'Paco',
	'Poya',
	'Alex',
	'Jordan',
	'Casey',
	'Morgan',
	'Taylor',
	'Riley',
	'Avery',
	'Quinn',
	'Blake',
	'Sage',
	'River',
	'Phoenix',
	'Rowan',
	'Emery',
	'Dakota',
	'Skyler',
	'Cameron',
	'Hayden',
	'Parker',
	'Reese',
];

/**
 * Utility function to get a random predefined name.
 * @returns A random name from the predefined names array
 */
function getRandomName(): string {
	return predefinedNames[Math.floor(Math.random() * predefinedNames.length)];
}

/**
 * Utility function to get a random predefined color.
 * @returns A random color from the predefined colors array
 */
function getRandomColor(): string {
	return predefinedColors[Math.floor(Math.random() * predefinedColors.length)];
}
