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
			<div>
				<label htmlFor='playerName'>Player Name:</label>
				<input
					type='text'
					id='playerName'
					value={playerName}
					onChange={(e) => setPlayerName(e.target.value)}
					placeholder='Leave empty for random name'
				/>
			</div>

			<div>
				<label htmlFor='playerColor'>Color:</label>
				<input
					type='text'
					id='playerColor'
					value={playerColor}
					onChange={(e) => setPlayerColor(e.target.value)}
					placeholder='Leave empty for random color'
				/>
				{playerColor && isValidHexColor(playerColor.trim()) && (
					<span
						style={{
							display: 'inline-block',
							width: '20px',
							height: '20px',
							backgroundColor: playerColor.trim(),
							marginLeft: '10px',
							border: '1px solid #ccc',
							verticalAlign: 'middle',
						}}
					></span>
				)}
				{playerColor.trim() && !isValidHexColor(playerColor.trim()) && (
					<span style={{ color: 'red', marginLeft: '10px', fontSize: '12px' }}>
						Invalid hex color format
					</span>
				)}
			</div>

			<div>
				<label htmlFor='isBot'>
					<input
						type='checkbox'
						id='isBot'
						checked={isBot}
						onChange={(e) => setIsBot(e.target.checked)}
					/>
					Is Bot
				</label>
			</div>
			<button type='submit'>Add Player</button>
		</form>
	);
}
