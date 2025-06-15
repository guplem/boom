import { Player } from '@/app/modules/player/model';
import { UserStore } from '@/app/modules/user/store';

/**
 * Checks if a player is owned by the current user.
 * @param player - The player to check ownership for
 * @returns True if the player is owned by the current user
 */
export function isPlayerOwned(player: Player): boolean {
	return player.owner === UserStore.getState().id;
}
