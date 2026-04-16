# ========================
# 1. Build stage
# ========================
FROM node:20 AS builder

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy source code
COPY . .

# Generate Prisma client (safe without DB connection)
RUN npx prisma generate

# Build project (TypeScript → JS)
RUN npm run build


# ========================
# 2. Production stage
# ========================
FROM node:20

WORKDIR /app

# Copy only necessary files
COPY package*.json ./
RUN npm install --only=production

# Copy built app + Prisma
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma

# Expose port (change if needed)
EXPOSE 3001

# Start app
CMD ["node", "dist/server.js"]
