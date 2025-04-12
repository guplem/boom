# Use official Node.js image as a parent image
FROM node:22

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# This seems to be necessary lately to make NPM install not take forever: https://forums.docker.com/t/npm-install-in-docker-tutorial-is-taking-forever/139328/14
RUN npm config set strict-ssl false

# Install dependencies
RUN npm ci --loglevel verbose

# Copy the rest of the application
COPY . .

# Expose the port the app runs on
EXPOSE 3000

# Run the app
CMD ["npm", "run", "dev"]
