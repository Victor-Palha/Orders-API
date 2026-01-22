FROM node:24.7-alpine3.21

WORKDIR /usr/src/app

RUN npm i -g pnpm

COPY package.json ./

RUN pnpm install

COPY . .

ENV NODE_ENV=production

CMD ["node", "src/main.js"]
