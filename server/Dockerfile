FROM node:20-alpine

WORKDIR /app

RUN apk add --no-cache openssl

COPY package*.json ./

COPY prisma ./prisma

RUN npm install

COPY src ./src
COPY server.js ./

RUN npx prisma generate

EXPOSE 4000
CMD ["npm", "start"]
