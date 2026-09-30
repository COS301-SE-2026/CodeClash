python3 getUserTestToken.py
mkdir -p reports
cd jwt_tool
TOKEN=$(cat ../token.txt)
ENDPOINTS=(
    "https://localhost:3000/api/leaderboard",
    "https://localhost:3000/api/matches",
    "https://localhost:3000/api/friends",
    "https://localhost:3000/api/friends/requests",
    "https://localhost:3000/api/friends/invite",
    "https://localhost:3000/api/friends/request",
    "https://localhost:3000/api/achievements",
    "https://localhost:3000/api/achievements/me",
    "https://localhost:3000/api/create-user",
    "https://localhost:3000/api/elo/elo-get",
    "https://localhost:3000/api/create-user",
    "https://localhost:3000/api/user/rank",
    "https://localhost:3000/api/user/search",
)


for url in "${ENDPOINTS[@]}"; do
    name=$(echo "$url" | sed 's|http://||;s|/|_|g')
    echo "Testing $url"
    python3 jwt_tool.py "$TOKEN" -t "url" -rh "Authorization: Bearer $TOKEN" -M at -np > "../reports/${name}.txt" 2>&1
    echo "Saved to reports/${name}.txt"
done

echo "Done. The following are rows that did not provide an expected 200 or correct rejection 401 response code (rows that failed):"
grep -L "^\(.*Response Code: 401\)*$" ../reports/*.txt 2>/dev/null
grep -rn "Response Code: 200\|Response Code: 500" ../reports/*.txt | grep -v "Prescan: original\|Persistence check\|repeat original"
