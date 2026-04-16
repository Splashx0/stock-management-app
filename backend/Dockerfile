FROM node:20-alpine

WORKDIR /app


ENV DATABASE_URL="postgresql://splash:splash@localhost:5432/stock_db"

COPY package*.json ./
RUN npm install

COPY . .

RUN npx prisma generate
RUN npm run build

EXPOSE 3001

CMD ["node", "dist/server.js"]

