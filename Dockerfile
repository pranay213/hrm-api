# Dockerfile
FROM node:18 AS builder

# Set working directory
WORKDIR /app

# Copy only the package.json and package-lock.json to avoid rebuilding on every file change
COPY package.json package-lock.json ./

# Install dependencies
RUN npm ci

# Copy the rest of the application source code
COPY . ./

# Build the application
RUN npm run build

# Prepare production build
FROM node:18-slim AS production

# Set working directory
WORKDIR /app

# Copy necessary files from the builder stage
COPY --from=builder /app/build /app
COPY --from=builder /app/package.json /app
COPY --from=builder /app/.env /app

# Install production dependencies only
RUN npm ci --only=production

# Expose application port
EXPOSE 8000

# Command to run the application
CMD ["node", "server.js"]
