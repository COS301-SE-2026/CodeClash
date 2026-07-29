# Build stage
FROM node:22-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# Production stage
FROM node:22-alpine
WORKDIR /app
# force fresh build

# Installing dumb-init
RUN apk add --no-cache dumb-init

# Making non root user
RUN addgroup -g 1001 -S nodejs && adduser -S nodejs -u 1001

COPY --from=builder /app/package*.json ./
RUN npm ci --omit=dev

COPY --from=builder --chown=nodejs:nodejs /app/dist ./

USER nodejs

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 CMD node -e "require('http').get('http://localhost:3000/health', (r) => {if (r.statusCode !== 200) throw new Error(r.statusCode)})"

ENTRYPOINT [ "dumb-init", "--" ]
CMD ["node", "dist/server.js"]