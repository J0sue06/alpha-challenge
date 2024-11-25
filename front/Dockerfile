FROM node:alpine

WORKDIR /app

COPY ./front/package.json /app/package.json
COPY ./front/package-lock.json /app/package-lock.json

RUN npm install -g @angular/cli

RUN npm install

COPY ./front /app

EXPOSE 4200

CMD ["ng", "serve", "--host", "0.0.0.0"]
