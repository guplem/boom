# Use the official Node.js 22 image as the base image
FROM node:22-alpine as builder

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application
COPY . .

# Build the application
RUN npm run build

# Production stage
FROM node:22-alpine

WORKDIR /app

# Install serve to run the application
RUN npm install -g serve

# Copy the built application from the builder stage
COPY --from=builder /app/dist /app/dist

# Expose the port the app runs on
EXPOSE 5173

# Command to run the application
CMD ["serve", "-s", "dist", "-l", "5173"]
