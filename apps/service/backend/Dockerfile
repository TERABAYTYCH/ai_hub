FROM node:20-alpine

WORKDIR /app

COPY package.json yarn.lock ./
COPY apps/service/backend/package.json ./apps/service/backend/

RUN yarn install

COPY . .

EXPOSE 3002

CMD ["yarn", "workspace", "@ject-hub/service-backend", "start:dev"]
