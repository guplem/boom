# Boom - Discord Activity

A web app creacted with Vite.

## Prerequisites

- [Node.js](https://nodejs.org/) v22 or newer
- [npm](https://www.npmjs.com/)
- Google Cloud Platform account (for deployment)

## Setup

1. Clone this repository and navigate to the repository directory:
   ```bash
   git clone https://github.com/guplem/boom.git
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

## Development Mode

Start the development server with hot reloading:

> The command must be run from within the project directory: `/repoFolder/boom`.

> Make sure you have run the `npm install` command before running the development server.

```bash
npm run dev
```

After running the command:
- The server will be started on `http://localhost:5173/`.

## Production Deployment

### Using Google Cloud Build and Cloud Run

The project is set up to be automatically deployed to Google Cloud Run when changes are pushed to the main branch:

1. Ensure your GCP project has the following APIs enabled:
   - Cloud Build API
   - Cloud Run API

1. Connect a GitHub repository to your GCP project:
   - Go to the GCP Console
   - Navigate to Cloud Run > Connect Repo
      - Select your GitHub repository and authorize access
      - Select *Node.js* as the build type
      - Set `/boom` as the build directory
      - //Set the entrypoint to `npm run build`
   - Set the service name (e.g., `boom`)
   - Allow unauthenticated invocations for the service (optional, but recommended for public access)
   - Set the region for your Cloud Run service (e.g., `europe-southwest1`)
   - Set the minimum instances for the service to 0 to enable cold start.
   - Set the port to `5173`
   - Set the memory limit for the service (e.g., `1 GiB`)
   - Set the maximum instances for the service (e.g., `3` for small scaling)


## Working with the Codebase

### Synchronization of State between Clients

The project uses `@robojs/sync` for state synchronization. Use the `useSyncState` hook with proper TypeScript typing:

```typescript
import { useSyncState } from '@robojs/sync'

// For state shared across all clients
const [sharedState, setSharedState] = useSyncState<boolean>(false, ['uniqueId'])

// For state shared only within a room (group of clients)
const [channelState, setChannelState] = useSyncState<string>("", ['uniqueId', roomId])
```