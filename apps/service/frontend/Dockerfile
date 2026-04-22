FROM node:20-alpine
WORKDIR /app

COPY package.json yarn.lock ./
COPY apps/service/frontend/package.json ./apps/service/frontend/
COPY libs/contracts/package.json ./libs/contracts/
COPY libs/ui-kit/package.json ./libs/ui-kit/
COPY tsconfig.base.json ./

RUN yarn install

COPY apps/service/frontend ./apps/service/frontend
COPY libs/contracts ./libs/contracts
COPY libs/ui-kit ./libs/ui-kit
COPY tsconfig.base.json ./

EXPOSE 5175

CMD ["yarn", "workspace", "@ject-hub/service-frontend", "dev"]
