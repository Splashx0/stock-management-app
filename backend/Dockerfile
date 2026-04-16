# Use official Node.js image
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy project files
COPY . . 

# Expose API port
EXPOSE 3001

# Start the application
CMD [ "npm", "run", "dev" ]