/bin/bash

# Ensure script fails on errors
set -e

# Define the container name
CONTAINER_NAME="my-app"

# Load environment variables from .env file
export $(grep -v '^#' .env | xargs)

# Build the Docker image
docker build -t $CONTAINER_NAME .

# Stop and remove any existing container with the same name
docker stop $CONTAINER_NAME || true
docker rm $CONTAINER_NAME || true

# Run the container with environment variables and expose port 3000
docker run -d --name $CONTAINER_NAME -p 3000:3000 \
  --env-file .env \
  $CONTAINER_NAME
