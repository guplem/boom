# Real-Time Counter Demo (Vite + React + Express + Socket.io)

This project is a real-time synchronized counter demo using Vite (React) for the frontend and Express/Socket.io for the backend, all deployed as a single service (suitable for Google Cloud Run).

## Features
- Real-time counter: All connected clients see the same counter value, updated instantly when any client increments or decrements.
- Single service: Both frontend and backend are served from one Node.js/Express server.
- Ready for deployment to Google Cloud Run.
- **The real-time counter is the default page.**

## Project Structure
- `src/client/` — Vite React frontend (entrypoint: `src/client/main.tsx`)
- `src/server/` — Express + Socket.io backend

## Local Development

1. **Install dependencies:**
   ```bash
   npm install
   ```
2. **Run both frontend and backend in development mode:**
   ```bash
   npx concurrently "vite --config vite.config.ts" "ts-node src/server/server.ts"
   ```
   - The Vite dev server runs on its default port (usually 5173).
   - The backend runs on port 3000 by default.
   - Adjust ports as needed in your configuration.

3. **Open multiple browser windows at `http://localhost:5173` to test real-time sync.**
   - The real-time counter page is loaded by default.

## Production Build & Deployment

1. **Build the frontend:**
   ```bash
   npm run build
   ```
   This outputs the static files to `dist/`.

2. **Start the server (serves static files and websocket):**
   ```bash
   node dist/server/server.js
   ```
   - The server listens on the port defined by the `PORT` environment variable (default: 3000).

3. **Deploy to Cloud Run:**
   - Ensure your Dockerfile copies both the frontend build and server code.
   - Expose the correct port (Cloud Run expects `$PORT`).
   - Websockets are supported by Cloud Run out of the box.

## Environment Variables
- `PORT` — The port the server listens on (Cloud Run sets this automatically).

## Notes
- All code uses explicit TypeScript type annotations for clarity and maintainability.
- For troubleshooting, the server logs client connection and disconnection events.
- The default entrypoint is `src/client/main.tsx` (real-time counter).

---

For further customization or questions, see the code comments or contact the maintainer.
