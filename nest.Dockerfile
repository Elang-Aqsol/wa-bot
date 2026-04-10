FROM node:20-alpine

# Install dependencies for sharp and canvas if needed
RUN apk add --no-cache libc6-compat ffmpeg libwebp libwebp-tools

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# We'll use this for development
CMD ["npm", "run", "start:dev"]
