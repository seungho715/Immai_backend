FROM alpine:3



WORKDIR /usr/app

RUN apk upgrade --no-cache
RUN apk add curl gpg nodejs npm bash

RUN npm install -g yarn

COPY package*.json ./
COPY webpack.config.js ./
COPY jsconfig.json ./
COPY .babelrc.js ./
COPY docker_entrypoint.sh ./
COPY src ./src

CMD ["bash", "-c", "./docker_entrypoint.sh"]

EXPOSE 8080
