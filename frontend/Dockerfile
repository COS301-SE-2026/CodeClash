FROM node:22-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

ARG VITE_COGNITO_USER_POOL_ID
ARG VITE_COGNITO_CLIENT_ID

ENV VITE_COGNITO_USER_POOL_ID=${VITE_COGNITO_USER_POOL_ID}
ENV VITE_COGNITO_CLIENT_ID=${VITE_COGNITO_CLIENT_ID}


RUN npm run build

FROM nginx:alpine

COPY nginx.conf /etc/nginx/nginx.conf.d/default.conf
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
