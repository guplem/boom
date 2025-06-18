import { JSX } from 'react';

/**
 * HelpPage renders the digital rules and interface guide for Boom.
 * This page is accessible via /help and is intended for new and returning players.
 */
export default function HelpPage(): JSX.Element {
	return (
		<div
			className='centeredChildren'
			style={{
				minHeight: '100vh',
				minWidth: '100vw',
				flexDirection: 'column',
				padding: '20px 0',
			}}
		>
			<div
				style={{
					backgroundColor: 'var(--container)',
					borderRadius: '10px',
					padding: '20px 40px',
					maxWidth: '800px',
					textAlign: 'justify',
				}}
			>
				<h1>🎴 How to Play Boom</h1>
				<p>
					Welcome to the digital version of Boom! Here’s everything you need to know to play the
					game.
				</p>

				<h2>🎯 Objective</h2>
				<p>
					The goal is to be the <strong>last player standing</strong> by eliminating others. You do
					this by destroying all of their life storage cards (called "accumulators").
				</p>

				<h2>🔢 Card Values</h2>
				<ul>
					<li>
						<strong>0 to 10:</strong> Cards have a value from 0 to 10.
					</li>
				</ul>
				<p>
					A card's value represents its attack strength when played from your hand, or the maximum
					life an accumulator can hold when on the board.
				</p>
				<p>
					Cards with a value of 0 are special cards (representing face cards like J, Q, K) and are
					required for the "Boom" action.
				</p>

				<h2>🕹️ Game Interface</h2>
				<ul>
					<li>
						<strong>Player Control Panel (Left):</strong> This is your area. It shows your hand,
						your current HP and accumulator count, and action buttons (Discard, Boom).
					</li>
					<li>
						<strong>Game Board (Center):</strong> Displays all players and their accumulators. Your
						row is highlighted with your color.
					</li>
					<li>
						<strong>Game Log (Right):</strong> Shows a history of all actions taken in the game,
						turn by turn.
					</li>
				</ul>

				<h2>🔄 Game Turn</h2>
				<p>
					On your turn, you must perform <strong>exactly one action</strong>. The game will
					automatically progress to the next player after your action. The main actions are: Swap,
					Attack, Boom, or Discard.
				</p>

				<h3>1. Swap</h3>
				<ul>
					<li>
						<strong>How to do it:</strong> First, click a card in your hand to select it. Then,
						click one of your own accumulator cards on the board.
					</li>
					<li>
						<strong>Rules:</strong> You can only swap with accumulators that have not been attacked
						yet. This is an optional first step in your turn, but if you do it, you cannot perform
						any other action.
					</li>
				</ul>

				<h3>2. Attack</h3>
				<ul>
					<li>
						<strong>How to do it:</strong> Select a card from your hand by clicking it. Then, click
						an opponent's accumulator card on the board.
					</li>
					<li>
						<strong>Rules:</strong> The value of your attacking card cannot be higher than the
						accumulator's current HP. You cannot attack accumulators with an original value of 0
						(face cards). The attack happens automatically.
					</li>
					<li>
						<strong>Extra Life:</strong> If you destroy an accumulator with a single attack, and
						your attacking card's value is the same as the accumulator's original value, you get a
						new random accumulator card on your board.
					</li>
				</ul>

				<h3>3. Boom</h3>
				<ul>
					<li>
						<strong>How to do it:</strong> You can only use Boom if your entire hand consists of
						cards with value 0 (special cards). Enter a number from 1-9 in the input field in your
						control panel and click the "Boom" button.
					</li>
					<li>
						<strong>Effect:</strong> All accumulators on the board (including your own!) with a
						current HP exactly matching the number you entered are instantly destroyed.
					</li>
				</ul>

				<h3>4. Discard</h3>
				<ul>
					<li>
						<strong>How to do it:</strong> If you can't or don't want to attack, swap, or use Boom,
						you must discard. Select a card from your hand and click the "Discard Hand Card" button.
					</li>
				</ul>

				<h2>🔚 End of Turn</h2>
				<p>
					After you perform an action, the game automatically handles drawing cards for you to
					replenish your hand, and play passes to the next player.
				</p>

				<h2>🚨 End of Game</h2>
				<ul>
					<li>
						<strong>Elimination:</strong> A player is eliminated when all their accumulators are
						destroyed (total HP is 0).
					</li>
					<li>
						<strong>Victory:</strong> The last player with HP remaining wins the game!
					</li>
				</ul>
				<div style={{ textAlign: 'center', marginTop: '20px' }}>
					<button onClick={(): void => window.close()}>Close Tab</button>
				</div>
			</div>
		</div>
	);
}
