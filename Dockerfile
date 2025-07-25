# Use Node.js base image
FROM node:20

# Set working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy source code
COPY . .

# Set environment variable (optional)
ENV PORT=3000

# Expose port
EXPOSE 3000

# Start the app
CMD ["node", "app.js"]
