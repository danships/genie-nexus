#!/bin/bash

set -e

if [ -z "$1" ]; then
  echo "Usage: $0 <version>"
  exit 1
fi

VERSION="$1"
export CI=1

echo "Building Docker image for version: $VERSION"
docker build --build-arg VERSION="$VERSION" -t ghcr.io/danships/genie-nexus:${VERSION} .

export TEST_BASE_URL=http://localhost:3000
for database in sqlite mysql; do
  echo "Running tests, DB: $database"
  if [ "$database" = "mysql" ]; then    
    docker run --rm -d \
      --name mysql-test \
      -e MYSQL_ROOT_PASSWORD=testpassword \
      -e MYSQL_DATABASE=testdb \
      -p 3306:3306 \
      mariadb:11.7.2

    docker exec mysql-test mariadb-admin ping -h localhost -u root -ptestpassword --wait=30

    export AUTH_METHOD=none
    export DB="mysql://root:testpassword@host.docker.internal:3306/testdb"    
    docker run --rm -d -p 3000:3000 -e DB="$DB" -e AUTH_METHOD=none -e DEBUG=true --add-host=host.docker.internal:host-gateway --name genie-nexus-ui ghcr.io/danships/genie-nexus:${VERSION}    

    sleep 3 # give it a chance to start
    if ! docker ps --format '{{.Names}}' | grep -q '^genie-nexus-ui$'; then
      echo "genie-nexus-ui container is not running"
      docker logs genie-nexus-ui || true
      docker stop mysql-test
      exit 1
    fi
    pnpm test:ui:ci

    docker stop genie-nexus-ui    
    docker stop mysql-test    
  else    
    export AUTH_METHOD=none
    export DB=sqlite:///gnxs-data/gnxs.db 
    docker run --rm -d -p 3000:3000 -e DB="$DB" -e AUTH_METHOD=none -e DEBUG=true --name genie-nexus-ui ghcr.io/danships/genie-nexus:${VERSION}

    sleep 3 # give it a chance to start
    if ! docker ps --format '{{.Names}}' | grep -q '^genie-nexus-ui$'; then
      echo "genie-nexus-ui container is not running"
      docker logs genie-nexus-ui || true      
      exit 1
    fi
    pnpm test:ui:ci

    docker stop genie-nexus-ui
  fi
done

if [ $? -eq 0 ]; then
  echo "All tests passed. Continuing with release process..."
else
  echo "Tests failed. Aborting release."
  exit 1
fi

# Run the container, zip and copy the /app folder, disabled for now, zip is not working
#CONTAINER_ID=$(docker create ghcr.io/danships/genie-nexus:$VERSION)
#docker cp $CONTAINER_ID:/app ./app-release
#docker rm $CONTAINER_ID

#cd ./app-release
#zip -r ../genie-nexus-${VERSION}.zip .
#cd ..

# Publish the image
docker push ghcr.io/danships/genie-nexus:${VERSION}

# Create GitHub Release
echo "Creating GitHub Release for version: $VERSION"

# Check if gh CLI is installed
if ! command -v gh &> /dev/null; then
    echo "GitHub CLI (gh) is not installed. Please install it to create releases."
    echo "Visit: https://cli.github.com/"
    exit 1
fi

# Check if user is authenticated
if ! gh auth status &> /dev/null; then
    echo "Not authenticated with GitHub CLI. Please run 'gh auth login' first."
    exit 1
fi

# Create the release
gh release create ${VERSION} \    
    --title "Release ${VERSION}" \
    --notes "## What's Changed

This release includes:
- Docker image: \`ghcr.io/danships/genie-nexus:${VERSION}\`

## Installation

\`\`\`bash
docker pull ghcr.io/danships/genie-nexus:${VERSION}
\`\`\`" \
    --draft

echo "GitHub Release created successfully!"
