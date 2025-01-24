FROM node:18-alpine


WORKDIR /app

# Antes de instalar dependencias
RUN ls -l /app

COPY package.json ./

# Antes de instalar dependencias
RUN ls -l /app

RUN yarn install --frozen-lockfile

COPY . .

# Antes de instalar dependencias
RUN ls -l /app

CMD ["yarn", "dev"]