# Stage 1: Build
FROM node:20 AS builder

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci

# Copy source code
COPY . .

# Build the app
RUN npm run build


# Stage 2: Production
FROM node:20-slim

WORKDIR /app

# Install only required system deps
RUN apt-get update && apt-get install -y --no-install-recommends \
    openssl \
    && rm -rf /var/lib/apt/lists/*

# Copy only production essentials
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/dist ./dist

# Install ONLY production dependencies
RUN npm ci --omit=dev

# Create data directory for SQLite
RUN mkdir -p /app/data && chown node:node /app/data

# Use non-root user
USER node

# Environment
ENV NODE_ENV=production
ENV PORT=3000

# Expose port
EXPOSE 3000

# Start app (compiled JS, not TS)
CMD ["node", "dist/server.js"]