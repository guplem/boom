import { UserStore } from '@/app/modules/user/store';

/**
 * Player class representing a game player with unique ID, name, and color
 */
export class Player {
	public readonly id: string;
	public readonly name: string;
	public readonly color: string;
	public readonly isBot: boolean;
	public readonly owner: string;

	public constructor(data: Partial<Player> & { isBot: boolean }) {
		this.id = data.id ?? crypto.randomUUID();
		this.name = data.name ?? predefinedNames[Math.floor(Math.random() * predefinedNames.length)];
		this.color =
			data.color ?? predefinedColors[Math.floor(Math.random() * predefinedColors.length)];
		this.isBot = data.isBot;
		this.owner = data.owner ?? UserStore.getState().id!;
	}

	public isOwned(): boolean {
		return this.owner === UserStore.getState().id;
	}
}

const predefinedColors: string[] = [
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

const predefinedNames: string[] = [
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
