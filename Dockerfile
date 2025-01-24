FROM node:18-alpine

RUN npm install -g typescript

WORKDIR /app

COPY package.json ./

RUN yarn install --frozen-lockfile

COPY . .

CMD ["yarn", "start"]