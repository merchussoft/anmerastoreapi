FROM node:18-alpine

RUN npm install -g typescript

WORKDIR /app

#COPY package.json ./


COPY . .

RUN yarn install --frozen-lockfile

CMD ["yarn", "dev"]