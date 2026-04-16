FROM node:20-alpine
WORKDIR /app

COPY package.json yarn.lock ./
COPY apps/hub/backend/package.json ./apps/hub/backend/
COPY apps/hub/frontend/package.json ./apps/hub/frontend/
COPY libs/contracts/package.json ./libs/contracts/
COPY libs/ui-kit/package.json ./libs/ui-kit/
COPY tsconfig.base.json ./

RUN yarn install

COPY apps/hub/backend ./apps/hub/backend
COPY apps/hub/frontend ./apps/hub/frontend
COPY libs/contracts ./libs/contracts
COPY libs/ui-kit ./libs/ui-kit
COPY tsconfig.base.json ./

EXPOSE 5173
