#!/bin/bash
# TODO can only be tested when judge0 is up with the rest or programming
echo "Killing Judge0..."
docker stop codeclash-judge0-1
sleep 5
echo "Checking backend is still alive..."
curl -f http://localhost:3000/health && echo "Backend still up ✓" || echo "Backend crashed ✗"
docker start codeclash-judge0-1