# ========================
# Build stage
# ========================
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# 👇 ADD THIS LINE
ENV DATABASE_URL="postgresql://splash:splash@localhost:5432/stock_db"

RUN npx prisma generate
RUN npm run build



# ========================
# 2. Production stage
# ========================
    FROM node:20-alpine

WORKDIR /app

# Copy only necessary files
COPY package*.json ./
RUN npm install

# Copy built app + Prisma
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma

# Expose port (change if needed)
EXPOSE 3001

# Start app
CMD ["node", "dist/server.js"]
