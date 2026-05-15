# Build stage
FROM node:22-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci

# Build the app
COPY . .
RUN npm run build

# Production stage
FROM node:22-alpine
WORKDIR /app

# Install dumb-init for proper signal handling
RUN apk add --no-cache dumb-init

# Create non-root user
RUN addgroup -g 1001 -S nodejs && adduser -S nodejs -u 1001

# Copy built assets from builder
COPY --from=builder --chown=nodejs:nodejs /app/dist ./dist

# Copy package files for preview server
COPY --chown=nodejs:nodejs package*.json ./

# Switch to non-root user
USER nodejs

EXPOSE 5173

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost:5173 || exit 1

# Use dumb-init to handle signals properly
ENTRYPOINT ["dumb-init", "--"]
CMD ["npm", "run", "preview"]
