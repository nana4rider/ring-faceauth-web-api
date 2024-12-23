FROM node:22-alpine AS build

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM node:22-alpine AS runtime

WORKDIR /app

COPY package*.json ./
RUN npm install --omit=dev
COPY --chown=node:node --from=build /app/dist ./dist
RUN mkdir /app/snapshot && chown node:node /app/snapshot

USER node
EXPOSE 3000

ENTRYPOINT ["node", "/app/dist/main"]
