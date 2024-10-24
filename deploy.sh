#!/bin/bash

# Exit on error
set -e

echo "Starting deployment process..."

# Function to check if a service is healthy
check_service_health() {
    local service=$1
    local max_attempts=30
    local attempt=1

    echo "Checking health of $service..."
    while [ $attempt -le $max_attempts ]; do
        if docker-compose ps $service | grep -q "Up"; then
            echo "$service is healthy!"
            return 0
        fi
        echo "Attempt $attempt/$max_attempts: $service is not ready yet..."
        sleep 10
        ((attempt++))
    done
    echo "$service failed to become healthy"
    return 1
}

# Stop existing containers
echo "Stopping existing containers..."
docker-compose down

# Start core services first
echo "Starting core services..."
docker-compose up -d rabbitmq auth-db ticket-db

# Wait for core services
echo "Waiting for core services to be healthy..."
check_service_health rabbitmq
check_service_health auth-db
check_service_health ticket-db

# Start remaining services
echo "Starting application services..."
docker-compose up -d auth-service ticket-service notification-service frontend

# Check all services
echo "Checking service health..."
check_service_health auth-service
check_service_health ticket-service
check_service_health notification-service
check_service_health frontend

# Clean up old images
echo "Cleaning up old images..."
docker image prune -f

# Remove the images archive
rm -rf images

# Show status
echo "Deployment status:"
docker-compose ps

# Show recent logs
echo "Recent logs:"
docker-compose logs --tail=50

echo "Deployment completed!"