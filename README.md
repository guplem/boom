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

The project is set up to be automatically deployed to Google Cloud Run using a custom build process defined in `cloudbuild.yaml`:

1. Ensure your GCP project has the following APIs enabled:
   - Cloud Build API
   - Cloud Run API
   - Artifact Registry API

2. Create a repository in Artifact Registry:
   ```bash
   gcloud artifacts repositories create cloud-run-source-deploy --repository-format=docker --location=europe-southwest1 --description="Docker repository for Cloud Run deployments"
   ```

3. Create a Cloud Build trigger:
   - Go to the GCP Console > Cloud Build > Triggers
   - Click "Create Trigger"
   - Set a name for your trigger (e.g., "boom-deploy")
   - Choose your source repository
   - Select the branch you want to trigger builds from
   - Under "Configuration", choose "Cloud Build configuration file (yaml or json)"
   - Set the location to "Repository" and the path to `cloudbuild.yaml`
   - Click "Create"

4. Enable public access to the Cloud Run service:
   - Go to the GCP Console > Cloud Run
   - Select your service
   - Click on Security
   - Under "Authentication", select "Allow unauthenticated invocations"
   - Click "Save"

> Manual deployment can be triggered with `gcloud builds submit --config=cloudbuild.yaml`

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