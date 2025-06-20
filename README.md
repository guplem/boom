# 🎴 Boom - Web Card Game

A real-time multiplayer web implementation of the **Boom** card game, built with [RoboJS](https://robojs.dev/) and React.

> **Boom** is a strategic card game where players eliminate opponents by destroying their life storage cards. The last player standing wins!

## 🚀 TL;DR - Quick Start for Non-Programmers

Want to just run the game? Here's the fastest way:

1. **Install Node.js**: Download from [nodejs.org](https://nodejs.org/) (choose the LTS version).
2. **Download this project**: Click the green "Code" button above → "Download ZIP" → Extract it.
3. **Open a terminal/command prompt** in the extracted folder.
4. **Run these commands**:
  ```bash
  npm install
  npm run dev
  ```
5. **Open your browser** and go to `http://localhost:3000`.
6. **Share the tunnel URL** (shown in your terminal) with friends to play together!

That's it! 🎉

---

## 🎮 Game Overview

**Boom** is a tactical card game for 2 or more players where the last one standing wins.

- **Goal**: Be the last player with life storage cards ("accumulators") remaining.
- **Setup**: Each player starts with 3 cards in hand and 3 accumulator cards on the board.
- **Gameplay**: On your turn, you can swap cards, attack opponents, use a powerful "Boom" ability, or discard.
- **Cards**: Numbered cards store life and deal damage, while special cards (value 0) enable the "Boom" action.

**📖 Full Rules**:
- [Digital Game Help Page](/help) _(in-game rules for the web version)_
- [Physical Version: English Rules](./rules/Physical%20Version/EN.md)
- [Physical Version: Spanish Rules](./rules/Physical%20Version/ES.md)

## 🛠️ Prerequisites for Development

- [Node.js](https://nodejs.org/) v22 or newer
- [npm](https://www.npmjs.com/) (comes with Node.js)
- A modern web browser
- *(Optional)* [Google Cloud Platform account](https://console.cloud.google.com/) for deployment

## 🏗️ Development Setup

1. **Clone the repository**:
  ```bash
  git clone https://github.com/guplem/boom.git
  cd boom
  ```

2. **Install dependencies**:
  ```bash
  npm install
  ```

3. **Start the development server**:
  ```bash
  npm run dev
  ```
  This will start the server at `http://localhost:3000/` and provide a public tunnel URL for multiplayer testing.

## 🏛️ Technology & Architecture

This project uses a modern web stack to create a real-time, interactive experience. The architecture is designed to clearly separate concerns between the client, the server, and the shared state.

### Technology Stack

- **Frontend**: React, TypeScript, Vite
- **Backend**: RoboJS Server, Node.js
- **Real-time State Sync**: `@robojs/sync`
- **Client-side State**: Zustand (for user/room persistence)
- **Backend Key-Value Store**: Flashcore
- **Styling**: Plain CSS with modern features
- **Code Quality**: ESLint, Prettier

### State Management Deep Dive

As an experimental project, a key goal was to explore different state management techniques. Here’s how they work together:

- **`@robojs/sync` (Real-time Multiplayer State):** This is the core of the multiplayer functionality. The `useSyncState` hook synchronizes the main `game` object and the lobby `players` array across all clients in the same room. When one client updates this state (e.g., by making a move), `@robojs/sync` broadcasts the change to all other clients automatically. This keeps everyone's game board perfectly in sync.

- **`Zustand` (Persistent Client State):** Used for simple, client-side state that needs to survive a page refresh. The `persist` middleware stores the data in `localStorage`. In this app, it's used for:
    - `UserStore`: To remember a user's unique ID.
    - `RoomStore`: To remember which room the user has joined, so they can be reconnected automatically.

- **`Flashcore` (Ephemeral Backend Storage):** This is a simple key-value store running on the backend. It's used by the `/api/room` endpoint to keep track of valid room names that have been created. In this project's current configuration (without a Keyv adapter), the data is **ephemeral** and will be lost if the server restarts. It demonstrates a simple way to share data on the backend without a full database.

- **`React Context` (Dependency Injection):** `GameContext` and `PlayerContext` are not used for state management themselves, but rather as a clean way to pass the synchronized state and core functions (`startGame`, `executeAction`, etc.) down the component tree, avoiding prop-drilling.

### Backend API

API endpoints are handled by `@robojs/server`. For example, the `src/api/room.ts` file manages room creation and validation. It exposes a `POST` endpoint to create a room and a `HEAD` endpoint to check if a room exists.

```typescript
// Example from src/api/room.ts - creating a room
const allRooms: string[] = (await Flashcore.get<string[]>('rooms')) ?? [];
if (allRooms.some((room) => room === providedName)) {
    return new Response(JSON.stringify({ message: 'Room already exists' }), { status: 409 });
}
await Flashcore.set<string[]>('rooms', [...allRooms, providedName]);
```

## 🚀 Deployment (Optional)

This project is pre-configured for deployment to **Google Cloud Run**.

1. **Update service name** in `cloudbuild.yaml`:
    ```yaml
    substitutions:
      _SERVICE_NAME: boom-card-game # Or your preferred service name
    ```
2. Follow the official [RoboJS Cloud Run deployment guide](https://robojs.dev/hosting/cloud-run).
3. Pushes to the `main` branch will trigger automatic deployments.

## 🤝 Contributing

Contributions are welcome! This is an evolving project with many opportunities for improvement.

### 🤖 Developing AI Strategies

The game includes a simple, extensible AI system. You can easily create and add your own strategies.

1. **Create a Strategy File**: Add a new file in `src/app/modules/ai/strategies/`.
2. **Define the Strategy Function**: Export a function that accepts a `Scenario` object and returns an `ActionConfig`. The `Scenario` gives you a complete snapshot of the game state.

    ```typescript
    // src/app/modules/ai/strategies/myCleverStrategy.ts
    import { Scenario } from '@/app/modules/ai/model';
    import { ActionConfig, ActionTypes } from '@/app/modules/game/model';

    export const myCleverStrategy = (gameScenario: Scenario): ActionConfig => {
      // TODO: Implement your brilliant AI logic here!
      // Analyze the board, hand, and history to make a decision.

      // Return the chosen action
      return {
        action: ActionTypes.Attack,
        params: { /* ... */ }
      };
    };
    ```

3. **Register Your Strategy**: Import and add your strategy to the `strategiesList` in `src/app/modules/ai/strategies.ts`.

    ```typescript
    // src/app/modules/ai/strategies.ts
    import { myCleverStrategy } from './strategies/myCleverStrategy';

    export const strategiesList = [
      // ... existing strategies
      {
        name: 'My Clever Strategy',
        description: 'A brief description of what your AI does.',
        getActionFunction: myCleverStrategy,
        maxAttempts: 20 // Optional: Retries if the AI returns an invalid move.
      },
    ];
    ```
4. **Test It**: Run `npm run dev` and select your new strategy from the dropdown in the game lobby.

**Note on Robustness**: The game manager will try to execute the action returned by your AI. If it's invalid, it will retry. The system also has a fallback mechanism (`executeFallbackAction` in `ai/manager.ts`) that will perform a safe "discard" action if the AI fails to produce a valid move after all attempts, ensuring the game never gets stuck.