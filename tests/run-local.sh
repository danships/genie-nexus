#!/bin/bash

set -e

PORT=$(( ( RANDOM % 16383 )  + 49152 ))
TEST_IDENTIFIER=$(tr -dc A-Za-z0-9 </dev/urandom | head -c 12)
AUTH_METHOD="${AUTH_METHOD:-credentials}"

export TEST_BASE_URL="http://localhost:${PORT}"
echo "TEST_BASE_URL: ${TEST_BASE_URL}"

CURRENT_DIR=$(pwd)

cd ${CURRENT_DIR}/packages/management
LOG_LEVEL=debug AUTH_METHOD=${AUTH_METHOD} PORT=${PORT} DB=sqlite:///tmp/${TEST_IDENTIFIER}.db pnpm run dev &
MGMT_PID=$!

echo "Management server started ${MGMT_PID}"

sleep 5 # give the server a chance to start

cd ${CURRENT_DIR}

cleanup() {
  echo "Cleaning up background processes..."
  kill $MGMT_PID 2>/dev/null || true
  wait $MGMT_PID 2>/dev/null || true
  echo "Cleanup complete"
}
trap cleanup EXIT

echo "Running tests..."
if [ -n "$PUI" ]; then
  pnpm exec playwright test --ui
else
  pnpm exec playwright test
fi
pnpm exec vitest --run
