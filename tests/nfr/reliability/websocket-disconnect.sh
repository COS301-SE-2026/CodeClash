# Disconnect backend from network  temporarily
docker network disconnect codeclash_pgnetwork codeclash-backend-1
sleep 10
docker network connect codeclash_pgnetwork codeclash-backend-1