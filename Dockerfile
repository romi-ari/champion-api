FROM node:19-alpine

WORKDIR /app

COPY package*.json /app
COPY . .

RUN npm install 

EXPOSE 8000

CMD ["npm", "start"]

