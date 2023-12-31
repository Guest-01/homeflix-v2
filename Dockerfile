# build stage
FROM node:lts-alpine as build-stage
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
ENV NODE_ENV production
RUN npm run build

# production stage
FROM alpine:latest as production-stage
ARG PB_VERSION=0.18.6
RUN apk add --no-cache \
    unzip \
    ca-certificates

ADD https://github.com/pocketbase/pocketbase/releases/download/v${PB_VERSION}/pocketbase_${PB_VERSION}_linux_amd64.zip /tmp/pb.zip
RUN unzip /tmp/pb.zip -d /pb/

# 프론트엔드 빌드 결과물 복사하기
COPY --from=build-stage /app/dist /pb/pb_public

EXPOSE 8080

CMD ["/pb/pocketbase", "serve", "--http=0.0.0.0:8080"]