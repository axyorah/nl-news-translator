FROM node:16-alpine

RUN mkdir /frontend
WORKDIR /frontend
COPY . /frontend

RUN npm install

EXPOSE 3000
CMD npm start