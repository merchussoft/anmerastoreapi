FROM node:18-alpine


WORKDIR /app

COPY package.json yarn.lock ./

RUN yarn install --frozen-lockfile

RUN yarn add -D typescript ts-node ts-node-dev

COPY . .

CMD ["yarn", "start"]