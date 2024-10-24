#!/bin/sh

# Exit on error
set -e

echo "Waiting for database..."
/wait-for.sh ${DB_HOST:-postgres} ${DB_PORT:-5432}

echo "Running database migrations..."
npx prisma migrate deploy

echo "Running database seed..."
npx prisma db seed

echo "Starting the application..."
npm start