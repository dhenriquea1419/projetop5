# Use a Node 20 base image for Expo and React Native dependencies
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 19006

CMD ["npm", "run", "web"]