FROM node:14
WORKDIR /usr/src/app
COPY package*.json ./
COPY lerna*.json ./
COPY . .
RUN yarn
WORKDIR /usr/src/app/packages/server
RUN npx knex migrate:up --esm
EXPOSE 8080
WORKDIR /usr/src/app
CMD ["yarn", "build"]
CMD ["yarn", "start"]