FROM node:10

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install --production

COPY . .

RUN npm run-script build

EXPOSE 3001

CMD [ "node", "dist/index.js"]
