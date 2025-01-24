FROM node:18-alpine


WORKDIR /app


COPY package.json ./

RUN yarn install --frozen-lockfile

COPY . .


# Expone el puerto que la aplicación usa
EXPOSE 3000
EXPOSE 3055

CMD ["yarn", "dev"]