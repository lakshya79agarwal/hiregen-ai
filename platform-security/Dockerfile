FROM node:24-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install --omit=dev

COPY src ./src
COPY scripts ./scripts
COPY migrations ./migrations

ENV NODE_ENV=production
EXPOSE 3000

CMD ["node", "src/server.js"]
