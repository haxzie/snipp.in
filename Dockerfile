FROM node:12-alpine as build-stage

# Create app directory
WORKDIR /app

COPY . /app

# Install app dependencies
RUN npm install

# build app for production with minification
RUN npm run build

# Bundle app source
COPY . .


# production stage
FROM nginx:stable-alpine as production-stage
COPY --from=build-stage /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]




