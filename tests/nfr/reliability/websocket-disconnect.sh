# Disconnect backend from network  temporarily
docker network disconnet codeclash_pgnetwork cocdeclash-backend-1
sleep 10
docker network connect codeclash_pgnetwork codeclash-backend-1