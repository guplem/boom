import { Scenario } from '@/app/modules/ai/model';
import { randomAttackStrategy } from '@/app/modules/ai/strategies/random';
import { ActionConfig } from '@/app/modules/game/model';

export const strategiesList: {
	name: string;
	description: string;
	getActionFunction: (_gameScenario: Scenario) => ActionConfig;
	maxAttempts?: number; // Optional property to limit the number of attempts for the strategy
}[] = [
	// Add your strategies here. Example:
	// {
	// 	name: 'Strategy name',
	// 	description: 'Short description of the strategy.',
	// 	function: functionWithLogic,
	// },
	{
		name: 'Random attack',
		description:
			'Attacks with the tactical genius of an Iggy: completely random, occasionally brilliant, mostly chaos.',
		getActionFunction: randomAttackStrategy,
		maxAttempts: 50, // Optional: limit the number of attempts for this strategy. By default, it will try 10 times, but since this is a random strategy, we can increase it to allow more attempts to find a valid action.
	},
];
