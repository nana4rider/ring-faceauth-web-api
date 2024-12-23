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

USER node
EXPOSE 3000

RUN mkdir /app/snapshot

ENTRYPOINT ["node", "/app/dist/main"]
