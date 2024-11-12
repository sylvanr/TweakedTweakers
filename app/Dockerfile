# React App Dockerfile
FROM node:16 AS builder

ARG REACT_APP_API_HOST
ARG REACT_APP_API_PORT
ENV REACT_APP_API_HOST=$REACT_APP_API_HOST
ENV REACT_APP_API_PORT=$REACT_APP_API_PORT

WORKDIR /app
COPY ./app /app
RUN npm install
RUN npm run build

# Use nginx to serve the static files
FROM nginx:alpine

# Install bash
RUN apk add --no-cache bash

# Setup nginx
COPY --from=builder /app/build /usr/share/nginx/html
COPY ./app/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 3000
CMD ["nginx", "-g", "daemon off;"]
