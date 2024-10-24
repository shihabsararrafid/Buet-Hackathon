FROM node:20-alpine

# Create app directory
WORKDIR /app

# Install app dependencies
COPY package*.json ./
RUN npm install
# Copy the Prisma schema
COPY prisma ./prisma
# Install Prisma Client
RUN npx prisma generate

# Bundle app source
COPY . .

# Build TypeScript code
RUN npm run build

# Expose port
EXPOSE 3000

# Run migrations and start the service
CMD ["sh", "-c", "npx prisma migrate deploy && npm start"]
