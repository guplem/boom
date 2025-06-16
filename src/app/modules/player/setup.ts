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
	// Warm earth tones (browns, oranges)
	// '#714E2D',
	'#A38D4E',
	'#A38B67',
	// '#D8944C',
	'#DC9E54',
	// '#F6DAB7',
	// Neutral warm tones (beiges, tans)
	// '#E5D2A4',
	'#C3C5A9',
	// '#F6E5C5',
	// '#FFF1D3',
	// Cool dark tones (greys, dark greens)
	// '#616D66',
	// '#4A6C68',
	// Cool medium tones (greens, teals)
	// '#719488',
	'#7BA5A5',
	'#A8B6A9',
	// Cool light tones (blues, light greens)
	'#92B8BE',
	'#85C6E0',
	'#B7CCC4',
	'#D4DFD3',
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
