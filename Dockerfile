FROM node:20-alpine3.17

WORKDIR /tesis-nicolasdelgado

COPY . .

EXPOSE 4001

RUN npm install
CMD ["npm", "start"]