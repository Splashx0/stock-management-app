# Use official Node.js image to build the app
FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy project files
COPY . .

# Expose port
EXPOSE 8080

# Start the application
CMD [ "npm", "run", "dev" ]