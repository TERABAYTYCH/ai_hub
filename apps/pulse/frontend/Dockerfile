FROM node:20-alpine
WORKDIR /app

COPY package.json yarn.lock ./
COPY apps/pulse/backend/package.json ./apps/pulse/backend/
COPY apps/pulse/frontend/package.json ./apps/pulse/frontend/
COPY libs/contracts/package.json ./libs/contracts/
COPY libs/ui-kit/package.json ./libs/ui-kit/
COPY tsconfig.base.json ./

RUN yarn install

COPY apps/pulse/backend ./apps/pulse/backend
COPY apps/pulse/frontend ./apps/pulse/frontend
COPY libs/contracts ./libs/contracts
COPY libs/ui-kit ./libs/ui-kit
COPY tsconfig.base.json ./

EXPOSE 5174

CMD ["yarn", "workspace", "@ject-hub/pulse-frontend", "dev"]
