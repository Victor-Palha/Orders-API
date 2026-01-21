FROM node:24.7-alpine3.21 AS base

WORKDIR /usr/src/app

RUN npm i -g pnpm

FROM base AS build

WORKDIR /usr/src/app

COPY package.json pnpm-lock.yaml ./

RUN pnpm install --frozen-lockfile

COPY . .

RUN pnpm build
RUN ls -la dist/infra/database/knex/migrations/ || echo "Migrations directory not found"

FROM base AS release

WORKDIR /usr/src/app

COPY package.json pnpm-lock.yaml ./

RUN pnpm install --prod --frozen-lockfile

COPY --from=build /usr/src/app/dist ./dist
COPY knexfile.js ./

EXPOSE 3333

ENV PORT=3333
ENV NODE_ENV=production
ENV HOST="0.0.0.0"

CMD ["sh", "-c", "pnpm start:prod"]
