FROM node:lts-alpine as build-stage
WORKDIR /mobsters
COPY package*.json ./
RUN npm install
COPY . .
ARG MODE
RUN npm run build --mode $MODE

FROM nginx:stable-alpine as production-stage
COPY --from=build-stage /mobsters/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]