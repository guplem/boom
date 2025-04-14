# Use official Node.js image as a parent image
FROM node:22

# Set the working directory
WORKDIR /app

# Copy package.json, not package-lock.json, to avoid installing wrong version of dependencies
COPY package.json ./

# This seems to be necessary lately to make NPM install not take forever: https://forums.docker.com/t/npm-install-in-docker-tutorial-is-taking-forever/139328/14
RUN npm config set strict-ssl false

# Create a package-lock.json file so that npm ci works
RUN npm install --package-lock-only

# Install dependencies
RUN npm ci --loglevel verbose

# Copy the rest of the application
COPY . .

# Build the application for production
RUN npm run build

# Expose the port the app runs on
EXPOSE 8080

# Run the app in production mode
CMD ["npm", "run", "start"]