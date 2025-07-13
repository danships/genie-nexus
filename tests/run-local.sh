#!/bin/bash

set -e

PORT_MANAGEMENT=$(( ( RANDOM % 16383 )  + 49152 ))
PORT_ROUTER=$(( ( RANDOM % 16383 )  + 49152 ))
TEST_IDENTIFIER=$(tr -dc A-Za-z0-9 </dev/urandom | head -c 12)
AUTH_METHOD="${AUTH_METHOD:-credentials}"

export TEST_BASE_URL="http://localhost:${PORT_MANAGEMENT}"
echo "TEST_BASE_URL: ${TEST_BASE_URL}"

CURRENT_DIR=$(pwd)

cd ${CURRENT_DIR}/packages/router
LOG_LEVEL=debug DEBUG=true AUTH_METHOD=${AUTH_METHOD} PORT=${PORT_ROUTER} DB=sqlite:///tmp/${TEST_IDENTIFIER}.db pnpm start & 
ROUTER_PID=$!

echo "Router started ${ROUTER_PID}"

cd ${CURRENT_DIR}/packages/management
AUTH_METHOD=${AUTH_METHOD} PORT=${PORT_MANAGEMENT} PORT_ROUTER=${PORT_ROUTER} DB=sqlite:///tmp/${TEST_IDENTIFIER}.db pnpm run dev &
MGMT_PID=$!

sleep 3 # give the servers a chance to start

cd ${CURRENT_DIR}

cleanup() {
  # Todo manual cleanup, run:
  # ps aux | grep router | grep tsc-watch | awk '{print $2}' | xargs kill
  # ps aux | grep next-server | awk '{print $2}' | xargs kill
  echo "Cleaning up background processes..."
  kill $MGMT_PID $ROUTER_PID 2>/dev/null || true
  wait $MGMT_PID $MGMT_PID 2>/dev/null || true
  echo "Cleanup complete, might be some background processes left..."
}
trap cleanup EXIT

echo "Running tests..."
if [ -n "$PUI" ]; then
  playwright test --ui
else
  playwright test
fi
vitest --run