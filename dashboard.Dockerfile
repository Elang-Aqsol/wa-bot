# Use Node 20 LTS
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the files
COPY . .

# Expose Vite dev port
EXPOSE 5173

# Start Vite in dev mode with --host to allow external access
CMD ["npm", "run", "dev", "--", "--host"]
