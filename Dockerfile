FROM node:14.16.0-alpine3.13

WORKDIR /usr/src/app
COPY package*.json ./ 
COPY tsconfig.json ./

RUN npm install
RUN npm install pm2 -g
COPY . .
RUN npm run build

EXPOSE 8080


CMD ["pm2-runtime", "./dist/index.js"]