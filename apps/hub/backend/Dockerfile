FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN yarn install --frozen-lockfile
COPY . .

WORKDIR /app/apps/hub/backend
EXPOSE 3000
CMD ["yarn", "start"]