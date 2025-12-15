FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

RUN npm clean install

COPY . .

EXPOSE 1201

CMD ["npm", "start"]
