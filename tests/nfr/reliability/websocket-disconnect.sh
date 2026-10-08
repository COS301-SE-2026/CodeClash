#!/usr/bin/env bash
NET=pgnetwork
CTR=codeclash-test-backend-1

echo "[1] Disconnecting backend from network..."
docker network disconnect $NET $CTR || exit 1
echo "[2] Waiting 30 seconds..."
sleep 30
echo "[3] Reconnecting backend..."
docker network connect $NET $CTR || exit 1
sleep 5
echo "[4] Checking backend health..."
curl -s http://localhost:3001/health && echo && echo "Backend recovered after network interruption."