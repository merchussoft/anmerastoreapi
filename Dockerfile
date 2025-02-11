FROM node:18-alpine

RUN mkdir -p /app/node_modules && chown -R node:node /app

WORKDIR /app

COPY package*.json tsconfig.json ./

USER node

RUN rm -rf node_modules yarn.lock && yarn install --frozen-lockfile

COPY --chown=node:node . .

RUN yarn global add typescript

RUN test -d node_modules || (echo "❌ ERROR: node_modules no fue instalado correctamente" && exit 1)

# Expone el puerto que la aplicación usa
EXPOSE 3055

CMD ["yarn", "start"]