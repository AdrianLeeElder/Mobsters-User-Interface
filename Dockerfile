# Create the container from the alpine linux image
FROM alpine:3.7

# Add nginx and nodejs
RUN apk add --update nginx nodejs

# Create the directories we will need
RUN mkdir -p /tmp/nginx/mobsters
RUN mkdir -p /var/log/nginx
RUN mkdir -p /var/www/html

# Copy the respective nginx configuration files
COPY nginx.conf /etc/nginx/nginx.conf
COPY default.conf /etc/nginx/conf.d/default.conf

# Set the directory we want to run the next commands for
WORKDIR /tmp/nginx/mobsters
# Copy our source code into the container
COPY . .
# Install the dependencies, can be commented out if you're running the same node version
RUN npm install

ARG MODE

# run webpack and the vue-loader
RUN npm run build -- --mode $MODE

# copy the built app to our served directory
RUN cp -r dist/* /var/www/html

# make all files belong to the nginx user
RUN chown nginx:nginx /var/www/html

EXPOSE 8082

# start nginx and keep the process from backgrounding and the container from quitting
CMD ["nginx", "-g", "daemon off;"]