#!/bin/sh

# Navigate to the directory where the project is located
cd ~/LeetFood

# Pull the latest changes from the repository
git pull

# Rebuild the project
docker-compose up --build -d
