FROM node:19.2.0-alpine3.15 AS base

WORKDIR /app

COPY package.json .
COPY yarn.lock .

RUN --mount=type=cache,target=/root/.yarn yarn install

ARG PORT
ENV PORT $PORT
EXPOSE $PORT

FROM base AS build
COPY . .
RUN yarn build

FROM nginx:1.23.2-alpine AS bin

COPY --from=build /app/build/ /usr/share/nginx/html/

COPY nginx.conf /etc/nginx/conf.d/default.conf

ARG PORT
RUN sed -i "s/%PORT%/$PORT/" /etc/nginx/conf.d/default.conf

