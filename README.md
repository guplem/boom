# 🎴 Boom - Web Card Game

A real-time multiplayer web implementation of the **Boom** card game, built with [RoboJS](https://robojs.dev/) and React.

> **Boom** is a strategic card game where players eliminate opponents by destroying their life storage cards. The last player standing wins!

## 🚀 TL;DR - Quick Start for Non-Programmers

Want to just run the game? Here's the fastest way:

1. **Install Node.js**: Download from [nodejs.org](https://nodejs.org/) (choose the LTS version)
2. **Download this project**: Click the green "Code" button above → "Download ZIP" → Extract it
3. **Open terminal/command prompt** in the extracted folder
4. **Run these commands**:
   ```bash
   npm install
   npm run dev
   ```
5. **Open your browser** and go to `http://localhost:3000`
6. **Share the tunnel URL** (shown in terminal) with friends to play together!

That's it! 🎉

---

## 🎮 Game Overview

**Boom** is a tactical card game where 2-6 players battle using a standard deck of cards:

- **Goal**: Be the last player with life storage cards remaining
- **Setup**: Each player starts with 3 cards in hand + 3 life storage cards on the board
- **Gameplay**: Take turns to swap cards, attack opponents, or use special "Boom" abilities
- **Cards**: Numbers (1-10) store life and deal damage, Face cards (J,Q,K) enable special abilities

**📖 Full Rules**: 
- [Spanish Rules](./rules/Physical%20Version/ES.md) 
- [English Rules](./rules/Physical%20Version/EN.md)
- [Digital Game Help Page](/help) _(in-game rules for the web version)_

## 🛠️ Prerequisites for Development

- [Node.js](https://nodejs.org/) v22 or newer
- [npm](https://www.npmjs.com/) (comes with Node.js)
- A modern web browser
- *(Optional)* [Google Cloud Platform account](https://console.cloud.google.com/) for deployment

## 🏗️ Development Setup

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd boom
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Create environment file** (optional):

  Create a `.env` file in the root directory to customize settings. This is optional but recommended for development.
   
   Default contents:
   ```dotenv
   # Enable source maps for easier debugging
   NODE_OPTIONS="--enable-source-maps"
   
   # Development server port
   PORT="3000"
   ```

## 🎯 Development

**Start development server**:
```bash
npm run dev
```

This will:
- Start the game server at `http://localhost:3000/`
- Create an external tunnel for remote testing (URL shown in console)
- Enable hot reloading for development
- Allow multiple players to join from different devices

**Docker alternative**:
```bash
docker build -t boom-game .
docker run -p 3000:3000 boom-game
```


## 🔧 Technology Stack

- **Frontend**: React + TypeScript + Vite
- **Backend**: RoboJS Server + Node.js
- **Real-time Communication**: [@robojs/sync](https://robojs.dev/plugins/sync)
- **State Management**: React Context + RoboJS Sync + Zustand (local state)
- **Development**: Hot reloading, TypeScript, ESLint, Prettier
- **Database**: Flashcore (for game state persistence)

## 🏛️ Application Architecture & Logic Flow

This section outlines the application's structure, from the user's entry to the gameplay loop.

### High-Level Flow

1.  **Entry & Room Selection (`App.tsx`, `RoomPage.tsx`)**:
    - A new user lands on the app, and a unique user ID is generated and stored locally using a Zustand store (`UserStore`).
    - The `App.tsx` component checks if the user is already in a room (via `RoomStore`). If not, it renders `RoomPage.tsx`.
    - On the `RoomPage`, the user can create a new room or join an existing one. This interacts with the `/api/room` endpoint to validate and persist room names using Flashcore.

2.  **Pre-Game Lobby (`GamePage.tsx`, `PlayerPage.tsx`)**:
    - Once a room is joined, `GamePage.tsx` takes over. Since the `game` state is initially `null`, it renders the `PlayerPage.tsx` lobby.
    - Here, players in the room can add, configure (name, color, AI strategy), and remove player profiles.
    - All player data is synchronized in real-time across all clients in the room using `@robojs/sync`.

3.  **Game Start (`manager.ts`, `setup.ts`)**:
    - Clicking "Start Game" calls the `startGame` function from `GameContext`.
    - This initializes the shared `game` state object by calling `createGame()` in `src/app/modules/game/setup.ts`.
    - The new `game` object, containing player hands, accumulators, and turn info, is broadcast to all clients, transitioning them from the lobby to the game board.

4.  **Gameplay Loop (`GameBoardPage.tsx`, `manager.ts`)**:
    - The `GameBoardPage.tsx` renders the main game interface: player controls, the board with all players (`GamePlayerZone`), and the game log (`GameLogPanel`).
    - The UI determines whose turn it is based on the shared `game.turn` state.
    - **Human Player**: When a human player performs an action (e.g., clicks a card and a target), the UI calls `executeAction`.
    - **AI Player**: A `useEffect` in `GamePage.tsx` listens for changes to the `game` state. If it's an AI's turn, it triggers `executeAiStrategy`, which selects an action and also calls `executeAction`.
    - `executeAction` validates the move and, if valid, updates the shared `game` state. This update automatically syncs to all players, and the UI re-renders to show the result.
    - The turn advances, and the loop continues.

5.  **Game End (`manager.ts`, `GameOverPage.tsx`)**:
    - After each turn, `advanceToNextTurn` in `manager.ts` checks for win conditions (e.g., only one player left with HP).
    - If a winner is found, the `game.winnerId` property is set.
    - This change in the shared state causes `GamePage.tsx` to render the `GameOverPage.tsx` for all players.

### State Management

The app uses a three-tiered approach to state management:

- **`@robojs/sync`**: The core of the multiplayer experience. The `useSyncState` hook synchronizes critical game state like `players` and the main `game` object across all clients in the same room. When one client updates this state, all others receive the changes in real-time.
- **React Context (`GameContext`, `PlayerContext`)**: Used for clean dependency injection. It passes the synced state and core functions (`startGame`, `executeAction`) down the component tree, avoiding prop-drilling.
- **Zustand (`RoomStore`, `UserStore`)**: Used for client-side state that needs to persist across page reloads (stored in `localStorage`). This includes the user's unique ID and the current room they are in, but not the game state itself.

### Turn and Action Handling

The game logic is centralized in `src/app/modules/game/manager.ts`, ensuring consistent rule enforcement for both human and AI players.

1.  **Turn Tracking**: The `game.turn` property is a simple integer. The current player is calculated via `game.turn % game.players.length`. The `getCurrentPlayer()` utility handles this.
2.  **Action Execution**: All game moves flow through `executeAction(game, setGame, playerId, actionConfig)`.
3.  **Validation**: `executeAction` calls `getNextGameState()`, which acts as the single source of truth for all game rules. It checks if a move is valid (e.g., "Is it the player's turn?", "Is the attack value legal?").
4.  **State Update**: If `getNextGameState()` confirms the move is valid, it returns a new, updated game state object. `executeAction` then uses the `setGame` function (from `useSyncState`) to broadcast this new state to all clients.
5.  **Turn Advancement**: For actions that end a turn, `advanceToNextTurn()` is called. It finds the next living player and increments `game.turn`, keeping the game moving.

## 🚀 Deployment (Optional)

> **Note**: Deployment is completely optional. The game runs perfectly locally for development and private games.

### Google Cloud Run

Pre-configured for easy cloud deployment:

1. **Update service name** in `cloudbuild.yaml`:
   ```yaml
   substitutions:
     _SERVICE_NAME: boom-card-game
   ```

2. **Follow GCP setup**: See [detailed deployment guide](https://robojs.dev/hosting/cloud-run)

3. **Auto-deploy**: Pushes to main branch automatically deploy

**Manual deployment**:
```bash
gcloud builds submit --config=cloudbuild.yaml
```

## 🤝 Contributing

Contributions are welcome! This is an evolving project with many opportunities:

### Development Areas
- **Game Logic**: Implementing card game rules and mechanics
- **UI/UX**: Improving the visual game experience  
- **AI System**: Designing and implementing computer opponents
- **Performance**: Optimizing real-time synchronization
- **Testing**: Game logic validation and edge cases

### How to Contribute
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/card-animations`)
3. Implement your changes with tests
4. Commit with clear messages (`git commit -m 'Add card flip animations'`)
5. Push and create a Pull Request

### 🤖 Developing AI Strategies

The game includes a simple AI system that allows for different computer-controlled player behaviors. You can easily create and add your own strategies. Here’s a step-by-step guide using the existing "Random Attack" strategy as an example.

An AI strategy is essentially a function that receives the current state of the game and decides which action to take.

#### Step 1: Create a New Strategy File

First, create a new TypeScript file for your strategy inside the `src/app/modules/ai/strategies/` directory. For example, let's call our new file `myCleverStrategy.ts`. This convention keeps all AI logic organized in one place.

#### Step 2: Define the Strategy Function

Inside your new file, you'll define and export a function that takes the game scenario as an argument and returns an `ActionConfig` object.

```typescript
// src/app/modules/ai/strategies/myCleverStrategy.ts
import { Scenario } from '@/app/modules/ai/model';
import { ActionConfig, ActionTypes } from '@/app/modules/game/model';

export const myCleverStrategy = (gameScenario: Scenario): ActionConfig => {
  // Your strategy logic goes here...

  // For now, let's just return a placeholder
  return {
    action: ActionTypes.Discard, // A safe fallback action
    params: {
      sourceHandIndex: 0
    }
  };
};
```

**Understanding the `gameScenario` Parameter:**

The `gameScenario` object provides a snapshot of the game from the AI player's perspective. It contains:
*   `board`: An array of all players' boards, including their `playerId` and their array of `accumulators`.
*   `playerHand`: An array of numbers representing the cards in the AI's own hand.
*   `playerId`: The ID of the current AI player.
*   `turn`: The current turn number.
*   `history`: An array of all actions taken in the game so far.

**Understanding the `ActionConfig` Return Value:**

Your function *must* return an `ActionConfig` object, which tells the game manager what to do. It has two parts:
*   `action`: The type of action to perform (e.g., `ActionTypes.Attack`, `ActionTypes.Swap`).
*   `params`: An object containing the specific details for that action (e.g., who to attack, with which card).

#### Step 3: Implement the Strategy Logic

This is where you'll implement the brain of your AI. Let's analyze the `randomAttackStrategy` from `src/app/modules/ai/strategies/random.ts` to see how it works.

```typescript
// src/app/modules/ai/strategies/random.ts
import { Scenario } from '@/app/modules/ai/model';
import { ActionConfig, ActionTypes } from '@/app/modules/game/model';

export const randomAttackStrategy = (gameScenario: Scenario): ActionConfig => {
  // 1. Pick a random player to attack from the board.
  const targetPlayerId: string =
    gameScenario.board[Math.floor(Math.random() * gameScenario.board.length)].playerId;

  // 2. Find the board of the target player to get their accumulators.
  const targetBoardEntry = gameScenario.board.find(
    (b) => b.playerId === targetPlayerId,
  );

  // 3. Pick a random accumulator to attack from the target's board.
  const accumulatorsLength: number = targetBoardEntry ? targetBoardEntry.accumulators.length : 0;
  const accumulatorIndex: number = Math.floor(Math.random() * accumulatorsLength);

  // 4. Assemble and return the final ActionConfig object.
  return {
    action: ActionTypes.Attack,
    params: {
      targetPlayerId: targetPlayerId, // Who to attack
      sourceHandIndex: Math.floor(Math.random() * gameScenario.playerHand.length), // Which card to use
      targetAccumulatorIndex: accumulatorIndex, // Which accumulator to hit
    },
  };
};
```

**Important Note on Validity:** The game manager will attempt to execute the action you return. If the action is invalid (e.g., attacking an accumulator with a card value higher than its remaining HP), the attempt will fail. The system will retry by calling your function again, up to a configured `maxAttempts`. While this provides some fault tolerance, it's best to write logic that tries to produce valid actions. You can infer validation rules by looking at the logic in `src/app/modules/game/manager.ts`.

#### Step 4: Register Your Strategy

To make your strategy available in the game, you need to register it in `src/app/modules/ai/strategies.ts`.

1.  Import your new strategy function at the top of the file.
    ```typescript
    import { myCleverStrategy } from './strategies/myCleverStrategy';
    ```
2.  Add a new entry to the `strategiesList` array.
    ```typescript
    export const strategiesList: { /*...*/ }[] = [
      // ... existing strategies
      {
        name: 'My Clever Strategy', // This name will appear in the UI dropdown.
        description: 'This AI analyzes the board and makes a smart move.',
        getActionFunction: myCleverStrategy, // The function you just created.
        maxAttempts: 20, // Optional: Increase if your strategy might fail often.
      },
    ];
    ```

#### Step 5: Test Your AI

You're all set! Now you can test your new AI.

1.  Run the game with `npm run dev`.
2.  In the lobby, create a new player.
3.  In the "Strategy" dropdown, you should now see "My Clever Strategy". Select it.
4.  Start the game and watch your AI in action! Check the Game Log on the right to see the moves it makes.
> You can also see the console logs by opening the browser's developer tools (F12 or right-click → Inspect).

### Code Standards
- Follow existing TypeScript patterns
- Include type annotations for all functions
- Add comments for complex game logic
- Test multiplayer scenarios thoroughly

## 📚 Resources

- **Game Rules**: [Spanish](./rules/Physical%20Version/ES.md) | [English](./rules/Physical%20Version/EN.md)
- **RoboJS Documentation**: [robojs.dev](https://robojs.dev/)
- **Real-time Sync**: [@robojs/sync plugin](https://robojs.dev/plugins/sync)
- **React Development**: [React docs](https://react.dev/)

---

**🎮 Ready to play Boom?** 

Run `npm run dev` and challenge your friends to a strategic card battle! Share the tunnel URL for instant multiplayer action. 🃏⚡

*Questions? Issues? Ideas for the AI system? Open an issue or start a discussion!*
For other backend state or features, create API endpoints in `src/api` and fetch them from your frontend. See the [Playground Demo](https://robojs.dev/playground) for examples.

> As discussed [here](https://discord.com/channels/1087134933908193330/1365947805180629022/1366169583198670951), this avoids bundling Node-specific code into the browser build.

### API
Robo comes bundled with [@robojs/server](https://robojs.dev/plugins/server), a simple server for creating and managing API endpoints.

Creating a new endpoint is as simple as creating a new file in the `src/api` directory. The file name will be used as the endpoint path, and the exported function will handle incoming requests:
```typescript
export default async (request: Request): Promise<Response> => {
    const urlParams: URLSearchParams = new URLSearchParams(request.url.split('?')[1] ?? '');
    const userId: string | null = urlParams.get('userId');

    return new Response(
        JSON.stringify({
            message: 'This is a JSON response',
            userId: userId,
        }),
        {
            status: 200,
        },
    );
};
```

> Multiple example implementations of this feature can be found [here](https://github.com/guplem/robo-base/tree/sync-web-app/src/api).

### Database
Robo comes bundled with [Flashcore Database](https://robojs.dev/robojs/flashcore), a key-value pair database. It is a simple and fast database for storing data accessible from all clients. While not a full-fledged database, it is useful for small amounts of data.

```typescript
import { Flashcore } from 'robo.js';
import type { CommandInteraction } from 'discord.js';

export default async (interaction: CommandInteraction): Promise<string> => {
    const userId: string = interaction.user.id;

    const score: number | undefined = await Flashcore.get<number>(userId);
    return score
        ? `High score is: ${score}!`
        : 'No high score yet! 🎮';
};
```
> An example implementation of this feature can be found [here](https://github.com/guplem/robo-base/blob/sync-web-app/src/api/room.ts).

> **Note:** Flashcore does not persist data outside the container. If the container restarts (e.g., due to cold-boot), all data is lost. To persist, use a Keyv adapter (MySQL, MongoDB, etc.).

Flashcore also allows [watching for changes](https://robojs.dev/robojs/flashcore#watching-for-changes) in the database with the `Flashcore.on(...)` method, and you can stop watching with `Flashcore.off(...)`.

If it is desired to persist data, Flashcore accepts [Keyv Adapters](https://robojs.dev/robojs/flashcore#using-keyv-adapters), allowing you to use, for instance [MySQL](https://github.com/jaredwray/keyv/tree/main/packages/mysql) or [MongoDB](https://github.com/jaredwray/keyv/tree/main/packages/mongo).

### State Management
Use [Robo's state management](https://robojs.dev/robojs/state) to temporarily store data in server (backend) memory. This is useful for storing data that doesn't need to persist across server restarts.

> Alternatively, you can use Flashcore without a Keyv adapter to store data in memory.

#### Client-side State Management
If you need client-side state management you can also use [Zustand](https://github.com/pmndrs/zustand) (or any other state management library like Redux, MobX, etc. or simply React's built-in state management: `useState` and `useReducer`).

This is an example of a simple Zustand *store* that manages a counter:
```typescript
import { create } from 'zustand';

type CounterStore = {
  count: number;
  increment: () => void;
};

export const useCounterStore = create<CounterStore>((set): CounterStore => ({
  count: 0,
  increment: (): void => set((state) => ({ count: state.count + 1 })),
}));
```

> Tip: To persist your store across page reloads, use Zustand's `persist` middleware:

> An example implementation of the store can be found [here](https://github.com/guplem/robo-base/blob/sync-web-app/src/app/modules/room/store.ts) and its usage can be found in many places such as [here](https://github.com/guplem/robo-base/blob/sync-web-app/src/app/modules/room/Page.tsx).

## Other Features
Check out the [RoboJS documentation](https://robojs.dev/) for more information on available [plugins](https://robojs.dev/plugins) and [core features](https://robojs.dev/robojs/overview).

Another useful feature is [Running Mode](https://robojs.dev/robojs/mode), which lets you select the `.env` file to use. This helps separate development, testing, and production configurations.

And many more! **Be sure to explore the available [plugins](https://robojs.dev/plugins) and [features](https://robojs.dev/robojs/overview) in RoboJS.**