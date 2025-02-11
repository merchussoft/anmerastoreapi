FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

RUN rm -rf node_modules yarn.lock && yarn install --frozen-lockfile

COPY . .


RUN test -d node_modules || (echo "❌ ERROR: node_modules no fue instalado correctamente" && exit 1)

# Expone el puerto que la aplicación usa
EXPOSE 3055

CMD ["yarn", "dev"]