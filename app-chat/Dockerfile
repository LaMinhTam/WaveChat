# Application Docker file Configuration
# Visit https://docs.docker.com/engine/reference/builder/
# Using multi stage build

# Prepare the image when build
# also use to minimize the docker image
FROM node:18-alpine as builder

WORKDIR /app
COPY package*.json ./
COPY tsconfig.json ./
RUN npm install
COPY . .
RUN npm run build


# Build the image as production
# So we can minimize the size
FROM node:18-alpine

WORKDIR /app
COPY package*.json ./
COPY tsconfig.json ./

ENV PORT=3002
ENV SOCKET_PORT=4002
ENV JWT_SECRET=LOCSER
ENV MONGODB_HOST=mongodb://127.0.0.1:27017/
ENV MONGODB_DBNAME=app-chat
ENV MONGODB_OPTIONS=?retryWrites=true&w=majority
ENV TIME_TO_LIVE_TOKEN=86400000
ENV CONFIG_REDIS_PASSWORD=SzqlHnKxYxdY14x7gyxlSJaJwBA7IGN3
ENV CONFIG_REDIS_HOST=redis-17910.c1.asia-northeast1-1.gce.cloud.redislabs.com
ENV CONFIG_REDIS_PORT=12407
ENV CONFIG_REDIS_DB=1

RUN npm install
COPY --from=builder /app/dist ./dist
EXPOSE ${PORT}
EXPOSE ${SOCKET_PORT}

CMD ["npm", "run", "start"]