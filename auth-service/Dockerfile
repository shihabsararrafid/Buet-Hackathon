# Use an official Node.js runtime as the base image
FROM node:18

# Set the working directory to /app
WORKDIR /app

# Copy the package*.json files to the working directory
COPY package*.json ./

# Install the dependencies
RUN npm install

# Copy the Prisma schema
COPY prisma ./prisma
# Copy the rest of the application code to the working directory
COPY . .

# Generate the Prisma client code
RUN npx prisma generate

# Expose the port that your application will run on
EXPOSE 3000

# Run Prisma migrations and start the application
CMD ["sh", "-c", "npx prisma migrate deploy && node server.js"]
