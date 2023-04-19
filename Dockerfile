FROM node:19-alpine

WORKDIR /champion-api-ca

COPY package*.json /champion-api-ca 
COPY . .

RUN npm install 

EXPOSE 8000

CMD ["npm", "start"]

