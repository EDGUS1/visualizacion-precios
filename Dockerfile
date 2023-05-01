ARG PORT=443

FROM node:14-alpine

WORKDIR /app
COPY . .

RUN npm i

CMD npm start --host 0.0.0.0 --port $PORT