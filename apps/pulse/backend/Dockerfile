FROM node:20-alpine

WORKDIR /app

COPY package.json yarn.lock ./
COPY apps/pulse/backend/package.json ./apps/pulse/backend/

RUN yarn install

COPY . .

EXPOSE 3001

CMD ["yarn", "workspace", "@ject-hub/pulse-backend", "start:dev"]
