# Use the official Node.js 22 image as the base image
FROM node:22-alpine as builder

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

# Production stage
FROM node:22-alpine

WORKDIR /app

# Install production dependencies only
COPY package*.json ./
RUN npm install --omit=dev

# Copy the built application and server code from the builder stage
COPY --from=builder /app/dist /app/dist
COPY --from=builder /app/src/server /app/dist/server

ENV PORT=8080
EXPOSE 8080

# Run the Node.js server (Express + Socket.io)
CMD ["node", "dist/server/server.js"]
