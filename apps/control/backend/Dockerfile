FROM node:20-alpine

WORKDIR /app

COPY package.json yarn.lock ./
COPY apps/control/backend/package.json ./apps/control/backend/

RUN yarn install

COPY . .

EXPOSE 3003

CMD ["yarn", "workspace", "@ject-hub/control-backend", "start:dev"]
