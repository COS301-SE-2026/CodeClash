FROM node:22-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --ignore-scripts

COPY . .

#RUN npm run build

EXPOSE 3000

CMD ["npx","--no-install","ts-node@10.9.2","-r","tsconfig-paths/register", "src/frameworks-drivers/server.ts"]