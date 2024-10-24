FROM node:20-alpine

# Install netcat for wait script
RUN apk add --no-cache netcat-openbsd

WORKDIR /app

# Copy wait script
COPY wait-for.sh /wait-for.sh
RUN chmod +x /wait-for.sh

# Install dependencies
COPY package*.json ./
RUN npm install

# Bundle app source
COPY . .

# Build TypeScript code
RUN npm run build

# Start the service with wait script
CMD ["/bin/sh", "-c", "/wait-for.sh rabbitmq:5672 -- npm start"]