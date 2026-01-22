FROM node:24.7-alpine3.21

WORKDIR /usr/src/app

COPY package.json ./

RUN npm install

COPY . .

ENV NODE_ENV=production

CMD ["node", "src/main.js"]
