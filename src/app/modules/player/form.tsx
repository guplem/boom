import { PlayerContext, PlayerContextType } from '@/app/modules/player/manager';
import { Player } from '@/app/modules/player/model';
import { createPlayer } from '@/app/modules/player/setup';
import { FormEvent, JSX, useContext, useState } from 'react';

export default function PlayerForm(): JSX.Element {
	const [playerName, setPlayerName] = useState<string>('');
	const [isBot, setIsBot] = useState<boolean>(false);
	const [playerColor, setPlayerColor] = useState<string>('');
	const playerContext: PlayerContextType | null = useContext(PlayerContext);

	const isValidHexColor = (color: string): boolean => {
		const hexColorRegex: RegExp = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
		return hexColorRegex.test(color);
	};

	const handleSubmit = (e: FormEvent<HTMLFormElement>): void => {
		e.preventDefault();

		if (!playerContext) {
			console.error('Player context not available');
			return;
		}

		// Validate color if provided
		if (playerColor.trim() && !isValidHexColor(playerColor.trim())) {
			alert('Please enter a valid hex color (e.g., #FF0000 or #F00)');
			return;
		}

		const newPlayer: Player = createPlayer({
			name: playerName.trim() || undefined,
			color: playerColor.trim() || undefined,
			isBot: isBot,
		});

		playerContext.addPlayer(newPlayer);

		// Reset form
		setPlayerName('');
		setIsBot(false);
		setPlayerColor('');
	};

	return (
		<form onSubmit={handleSubmit}>
			<div
				style={{
					display: 'flex',
					flexDirection: 'column',
					gap: '10px',
				}}
			>
				<div>
					<label htmlFor='playerName'>Player Name: </label>
					<input
						type='text'
						id='playerName'
						value={playerName}
						onChange={(e) => setPlayerName(e.target.value)}
						placeholder='Leave empty for random name'
					/>
				</div>

				<div style={{ display: 'flex', alignItems: 'center' }}>
					<label htmlFor='playerColor' style={{ marginRight: '4px' }}>
						Color:{' '}
					</label>
					<input
						type='text'
						id='playerColor'
						value={playerColor}
						onChange={(e) => setPlayerColor(e.target.value)}
						placeholder='Leave empty for random color'
						style={{ verticalAlign: 'middle' }}
					/>
					<span
						style={{
							width: '20px',
							height: '20px',
							backgroundColor:
								playerColor && isValidHexColor(playerColor.trim())
									? playerColor.trim()
									: 'transparent',
							marginLeft: '10px',
							borderRadius: '5px',
							verticalAlign: 'middle',
							border:
								playerColor && isValidHexColor(playerColor.trim())
									? ''
									: '1px solid var(--border, #719488)',
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
							// fontWeight: 'bold',
							fontSize: '11px',
							color: '#719488',
						}}
					>
						{!playerColor.trim() || !isValidHexColor(playerColor.trim()) ? '?' : ''}
					</span>
				</div>
				{playerColor.trim() && !isValidHexColor(playerColor.trim()) && (
					<div style={{ color: 'red', marginLeft: '0', fontSize: '12px', marginTop: '2px' }}>
						Invalid hex color format
					</div>
				)}
			</div>
			<button
				type='submit'
				style={{
					width: '100%',
					marginTop: '10px',
				}}
			>
				Add Player
			</button>
		</form>
	);
}
