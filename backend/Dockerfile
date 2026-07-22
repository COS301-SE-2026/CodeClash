# Build stage
FROM node:22-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run builder

# Production stage
FROM node:22-alpine
WORKDIR /app

# Installing dumb-init
RUN apk add --no-cache dumb-init

# Making non root user
RUN addgroup -g 1001 -S nodejs && adduser -S nodejs -u 1001

COPY --from=builder /app/package*.json ./
RUN npm ci --omit=dev

COPY --from=builder --chown=nodejs:nodejs /app/dist ./

USER nodejs

EXPOSE 3000

ENTRYPOINT [ "dumb-init", "--" ]
CMD ["node", "dist/server.js"]