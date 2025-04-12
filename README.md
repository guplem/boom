# Boom - Discord Activity

A Discord Activity project built with [Robo.js](https://robojs.dev), TypeScript, and React.

## Prerequisites

- [Node.js](https://nodejs.org/) v16 or newer
- [npm](https://www.npmjs.com/) v7 or newer
- A [Discord Developer Portal](https://discord.com/developers/applications) account

## Setup

1. Clone this repository and navigate to the repository directory:
   ```bash
   git clone https://github.com/guplem/boom.git
   cd boom
   ```

1. Navigate to the project directory:
   ```bash
   cd boom
   ```
> The project directory is the root folder where the `package.json` file is located. It is inside the cloned repository folder: `\repoFolder\boom`.

1. Install dependencies:
   ```bash
   npm install
   ```

1. Create a new Discord application in the [Discord Developer Portal](https://discord.com/developers/applications):
   - Create a new application
   - Go to the "OAuth2" section and add a redirect URL (e.g., `http://localhost:3000`)
   - Copy your Client ID and Client Secret

1. Create a `.env` file in the project directory with the following content:
   ```properties
   # Enable source maps for easier debugging
   NODE_OPTIONS="--enable-source-maps"

   # Find your credentials in the Discord Developer portal - https://discord.com/developers/applications
   DISCORD_CLIENT_ID="your_client_id"
   DISCORD_CLIENT_SECRET="your_client_secret"
   VITE_DISCORD_CLIENT_ID="your_client_id"

   # Change this port number if needed
   PORT="3000"
   ```

## Discord OAuth2 Configuration

For authentication to work properly within Discord, you need to configure OAuth2 redirects:

1. Go to the [Discord Developer Portal](https://discord.com/developers/applications)
2. Select your application and navigate to the "OAuth2" section
3. In the "Redirects" section, add your tunnel URL (e.g., `https://your-random-name.trycloudflare.com`)
4. This is separate from the URL Mappings configuration and is required for authentication to work properly

## Running Locally

Start the development server:

```bash
npm run dev
```

This will:
- Start the Discord Activity server
- Create a temporary Cloudflare tunnel for testing
- Display a URL you can use to access your application from Discord

Copy the tunnel URL (looks like `https://your-random-name.trycloudflare.com`) and add it to your Discord application:
1. Go to your application in the [Discord Developer Portal](https://discord.com/developers/applications)
2. Navigate to "Activities" (formerly Rich Presence) > "URL Mappings"
3. Add an entry with the following:
   - Name: "Development"
   - URL: Your tunnel URL
   - Status: "Enabled"

## Accessing in Discord

1. Join a voice channel in a server where you have added your Discord application bot
2. Click the "Rocket" button (Activities)
3. Find your application in the list and click on it

## Project Structure

- `/src/app` - React frontend code
- `/src/api` - Backend API endpoints
- `/src/components` - Reusable React components
- `/src/hooks` - Custom React hooks
- `/public` - Static assets

## Working with the Codebase

### Available Scripts

- `npm run dev`: Start the development server with hot reloading and tunnel
- `npm run build`: Build the project for production
- `npm run start`: Start the production server
- `npm run lint`: Run ESLint and Prettier
- `npm run lint:eslint`: Run ESLint checks
- `npm run lint:style`: Run Prettier formatting
- `npm run tunnel`: Create a Cloudflare tunnel manually
- `npm run invite`: Generate an invite link for Discord
- `npm run doctor`: Run diagnostics on your project
- `npm run upgrade`: Upgrade Robo.js dependencies

### API Development

Create new files in the `/src/api` directory. The filename becomes the API route.

```typescript
// src/api/example.ts
export default (): { message: string } => {
  return { message: "This is an example endpoint" };
}
```

### Using the Sync State

The project uses `@robojs/sync` for state synchronization. Use the `useSyncState` hook with proper TypeScript typing:

```typescript
import { useSyncState } from '@robojs/sync'

// For state shared across all clients
const [sharedState, setSharedState] = useSyncState<boolean>(false, ['uniqueId'])

// For state shared only within a channel
const [channelState, setChannelState] = useSyncState<string>("", ['uniqueId', discordSdk.channelId])
```

### Discord SDK Integration

The project includes a custom hook for integrating with the Discord SDK:

```typescript
import { useDiscordSdk } from '../hooks/useDiscordSdk'

export const MyComponent = (): JSX.Element => {
  const { 
    authenticated, 
    discordSdk, 
    session, 
    status 
  }: {
    authenticated: boolean;
    discordSdk: DiscordSDK | DiscordSDKMock;
    session: {
      user: {
        id: string;
        username: string;
        discriminator: string;
        avatar: string | null;
        public_flags: number;
      };
      access_token: string;
      scopes: string[];
      expires: string;
      application: {
        rpc_origins?: string[];
        id: string;
        name: string;
        icon: string | null;
        description: string;
      };
    } | null;
    status: 'authenticating' | 'error' | 'loading' | 'pending' | 'ready';
  } = useDiscordSdk();
  
  // Your component logic here
  return (
    <div>
      {/* Component JSX */}
    </div>
  );
}
```

## Configuration

Key configuration files:
- `config/robo.ts`: Robo.js configuration
- `config/vite.mjs`: Vite build configuration
- `config/plugins/`: Plugin-specific configuration files
- `tsconfig.json`: TypeScript configuration

## Resources

- [Robo.js Documentation](https://robojs.dev/discord-activities)
- [Discord Activity Development Guide](https://discord.com/developers/docs/activities/overview)
- [Tutorial on Creating Discord Activities](https://dev.to/waveplay/how-to-add-multiplayer-to-your-discord-activity-lo1)
- [Join Robo.js Discord](https://roboplay.dev/discord) for community support
