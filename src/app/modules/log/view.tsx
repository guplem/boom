import {
	ActionTypes,
	AttackActionHistory,
	BoomActionHistory,
	DiscardActionHistory,
	HistoryElement,
	SwapActionHistory,
} from '@/app/modules/game/model';
import { PlayerContext, PlayerContextType } from '@/app/modules/player/manager';
import { Player } from '@/app/modules/player/model';
import React from 'react';

/**
 * Processed log entry for display purposes
 */
interface ProcessedLogEntry {
	id: string;
	turn: number;
	action: string;
	player: string;
	playerColor?: string;
	details: string;
	type: 'info' | 'warning' | 'error' | 'success';
}

/**
 * Props for the GameLog component
 */
interface GameLogProps {
	history: HistoryElement[];
	maxEntries?: number;
	isLoading?: boolean;
	onClear?: () => void;
}

/**
 * Grouped log entries by turn
 */
interface GroupedLogEntries {
	turn: number;
	entries: ProcessedLogEntry[];
}

/**
 * GameLog component that displays a chronological list of game events
 * @param history - Array of history elements from the game
 * @param maxEntries - Maximum number of entries to show (default: 50)
 * @param isLoading - Whether the log is currently loading
 * @param onClear - Callback function to clear the log
 */
export const GameLog: React.FC<GameLogProps> = ({
	history,
	maxEntries = 50,
	isLoading = false,
	onClear,
}: GameLogProps) => {
	return (
		<PlayerContext.Consumer>
			{(playerProvider: PlayerContextType | null) => {
				if (!playerProvider) {
					return <div>Player context not available</div>;
				}

				/**
				 * Get display name and color for a player
				 */
				const getPlayerInfo = (playerId: string): { name: string; color?: string } => {
					const player: Player | undefined = playerProvider.players.find((p) => p.id === playerId);
					return {
						name: player?.name || `Player ${playerId.slice(-4)}`,
						color: player?.color,
					};
				};

				/**
				 * Convert HistoryElement to ProcessedLogEntry for display
				 */
				const processHistoryElement = (
					element: HistoryElement,
					index: number,
				): ProcessedLogEntry => {
					const playerInfo: {
						name: string;
						color?: string;
					} = getPlayerInfo(element.sourcePlayerId);
					const baseId: string = `${element.turn}-${element.action}-${index}`;

					switch (element.action) {
						case ActionTypes.Attack: {
							const data: AttackActionHistory = element.data as AttackActionHistory;
							const targetInfo = getPlayerInfo(data.targetPlayerId);
							return {
								id: baseId,
								turn: element.turn,
								action: 'Attack',
								player: playerInfo.name,
								playerColor: playerInfo.color,
								details: `attacked ${targetInfo.name} with card ${data.sourceHandValue} against accumulator ${data.targetAccumulatorValue}`,
								type: 'warning',
							};
						}

						case ActionTypes.Swap: {
							const data: SwapActionHistory = element.data as SwapActionHistory;
							return {
								id: baseId,
								turn: element.turn,
								action: 'Swap',
								player: playerInfo.name,
								playerColor: playerInfo.color,
								details: `swapped hand card ${data.sourceHandValue} with accumulator ${data.targetAccumulatorValue}`,
								type: 'info',
							};
						}

						case ActionTypes.Discard: {
							const data: DiscardActionHistory = element.data as DiscardActionHistory;
							return {
								id: baseId,
								turn: element.turn,
								action: 'Discard',
								player: playerInfo.name,
								playerColor: playerInfo.color,
								details: `discarded hand card with value ${data.sourceHandValue}`,
								type: 'info',
							};
						}

						case ActionTypes.Boom: {
							const data: BoomActionHistory = element.data as BoomActionHistory;
							const successType: 'success' | 'error' =
								data.accumulatorsDestroyedQuantity > 0 ? 'success' : 'error';
							return {
								id: baseId,
								turn: element.turn,
								action: 'Boom',
								player: playerInfo.name,
								playerColor: playerInfo.color,
								details: `targeted value ${data.targetValue}, destroyed ${data.accumulatorsDestroyedQuantity} accumulator(s)`,
								type: successType,
							};
						}

						default:
							return {
								id: baseId,
								turn: element.turn,
								action: 'Unknown',
								player: playerInfo.name,
								playerColor: playerInfo.color,
								details: 'performed an unknown action',
								type: 'info',
							};
					}
				};

				// Process and sort entries (oldest first) and limit to maxEntries
				const processedEntries: ProcessedLogEntry[] = history
					.map((element: HistoryElement, index: number) => processHistoryElement(element, index))
					.slice(0, maxEntries);

				/**
				 * Group entries by turn number
				 */
				const groupEntriesByTurn = (entries: ProcessedLogEntry[]): GroupedLogEntries[] => {
					const grouped: Map<number, ProcessedLogEntry[]> = new Map();

					entries.forEach((entry: ProcessedLogEntry) => {
						if (!grouped.has(entry.turn)) {
							grouped.set(entry.turn, []);
						}
						grouped.get(entry.turn)!.push(entry);
					});

					return Array.from(grouped.entries())
						.map(([turn, entries]: [number, ProcessedLogEntry[]]) => ({ turn, entries }))
						.sort((a: GroupedLogEntries, b: GroupedLogEntries) => a.turn - b.turn);
				};

				const groupedEntries: GroupedLogEntries[] = groupEntriesByTurn(processedEntries);

				/**
				 * Get CSS class based on log entry type
				 */
				const getEntryTypeClass = (type: ProcessedLogEntry['type']): string => {
					const baseClass: string = 'log-entry';
					switch (type) {
						case 'error':
							return `${baseClass} log-entry--error`;
						case 'warning':
							return `${baseClass} log-entry--warning`;
						case 'success':
							return `${baseClass} log-entry--success`;
						default:
							return `${baseClass} log-entry--info`;
					}
				};

				/**
				 * Generate background style for log entry based on player color
				 */
				const getPlayerBackgroundStyle = (playerColor?: string): React.CSSProperties => {
					if (!playerColor) {
						return {};
					}

					// Apply player color with opacity for better readability
					return {
						backgroundColor: `${playerColor}40`, // 25% opacity
						border: `2px solid ${playerColor}`,
						borderRadius: '6px',
						margin: '4px 0',
						padding: '8px',
						boxShadow: `0 1px 3px ${playerColor}20`, // Subtle shadow with player color
					};
				};

				if (isLoading) {
					return (
						<div className='game-log game-log--loading'>
							<div className='game-log__header'>
								<h3>Game Log</h3>
							</div>
							<div className='game-log__content'>
								<p>Loading game history...</p>
							</div>
						</div>
					);
				}

				return (
					<div className='game-log'>
						<div className='game-log__header'>
							<h3>Game Log</h3>
							{onClear && history.length > 0 && (
								<button
									className='game-log__clear-btn'
									onClick={onClear}
									type='button'
									aria-label='Clear game log'
								>
									Clear Log
								</button>
							)}
						</div>

						<div className='game-log__content'>
							{groupedEntries.length === 0 ? (
								<div className='game-log__empty'>
									<p>No game history available.</p>
								</div>
							) : (
								<div className='game-log__list' role='log' aria-label='Game history'>
									{groupedEntries.map((group: GroupedLogEntries) => (
										<div key={`turn-${group.turn}`} className='game-log__turn-group'>
											<h4 className='game-log__turn-header'>Turn {group.turn}</h4>
											<div className='game-log__turn-entries'>
												{group.entries.map((entry: ProcessedLogEntry) => (
													<div
														key={entry.id}
														className={getEntryTypeClass(entry.type)}
														role='listitem'
														style={getPlayerBackgroundStyle(entry.playerColor)}
													>
														<div className='log-entry__content'>
															<div className='log-entry__details'>
																<span className='log-entry__action'>{entry.action}</span>

																<span className='log-entry__player'> by {entry.player}</span>

																<span className='log-entry__description'>- {entry.details}</span>
															</div>
														</div>
													</div>
												))}
											</div>
										</div>
									))}
								</div>
							)}
						</div>
					</div>
				);
			}}
		</PlayerContext.Consumer>
	);
};

export default GameLog;
export type { GameLogProps, GroupedLogEntries, ProcessedLogEntry };
