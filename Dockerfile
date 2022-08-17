FROM node:16 as builder
WORKDIR /app

COPY ./package*.json ./
COPY ./yarn.lock ./
COPY ./tsconfig.json ./
COPY ./.env ./

RUN yarn install
COPY . .

## compile typescript
RUN yarn build

## remove packages of devDependencies
RUN yarn install --production --ignore-scripts --prefer-offline
## npm prune --production

# ===================================================
FROM node:16-slim as runtime
WORKDIR /app

# ENV NODE_ENV="development"
# ENV DOCKER_ENV="development"
# ENV PORT=80

## Copy the necessary files form builder
COPY --from=builder "/app/dist/" "/app/dist/"
COPY --from=builder "/app/node_modules/" "/app/node_modules/"
COPY --from=builder "/app/package.json" "/app/package.json"
COPY --from=builder "/app/.env" "/app/.env"

EXPOSE 80
CMD ["yarn", "start", "--verbose"]
