FROM node:20-alpine
WORKDIR /app

COPY package.json yarn.lock ./
COPY apps/control/frontend/package.json ./apps/control/frontend/
COPY libs/contracts/package.json ./libs/contracts/
COPY libs/ui-kit/package.json ./libs/ui-kit/
COPY tsconfig.base.json ./

RUN yarn install

COPY apps/control/frontend ./apps/control/frontend
COPY libs/contracts ./libs/contracts
COPY libs/ui-kit ./libs/ui-kit
COPY tsconfig.base.json ./

EXPOSE 5176

CMD ["yarn", "workspace", "@ject-hub/control-frontend", "dev"]
