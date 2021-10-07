FROM node:12

RUN apt-get update

RUN apt-get install -y postgresql-client

RUN mkdir -p /usr/src/app

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run-script build

EXPOSE 3001

