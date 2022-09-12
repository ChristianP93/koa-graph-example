FROM --platform=linux/amd64 node:14-slim

WORKDIR /usr/src/app

RUN apt-get update && apt-get install openssl -y

COPY package*.json ./

COPY prisma ./prisma/

COPY .env ./

RUN yarn install

COPY . .

EXPOSE 3000

CMD [ "yarn", "dev"]

