FROM node:14-alpine
WORKDIR /usr/src/gamera
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build:prod
