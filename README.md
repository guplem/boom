# 🎴 Boom - Web Card Game

A real-time multiplayer web implementation of the **Boom** card game, built with [RoboJS](https://robojs.dev/) and React.

> **Boom** is a strategic card game where players eliminate opponents by destroying their life storage cards. The last player standing wins!

> **⚠️ Development Status**: This is currently a skeleton implementation being built up progressively. Core multiplayer functionality and game mechanics are being developed incrementally.

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
