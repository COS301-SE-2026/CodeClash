python3 getUserTestToken.py
mkdir -p reports
cd jwt_tool
chmod +x jwt_tool.py
ENDPOINTS=(
    "http://localhost:3000/api/leaderboard"
    "http://localhost:3000/api/matches"
    "http://localhost:3000/api/friends"
    "http://localhost:3000/api/friends/requests"
    "http://localhost:3000/api/friends/invite"
    "http://localhost:3000/api/friends/request"
    "http://localhost:3000/api/achievements"
    "http://localhost:3000/api/achievements/me"
    "http://localhost:3000/api/create-user"
    "http://localhost:3000/api/elo/elo-get"
    "http://localhost:3000/api/create-user"
    "http://localhost:3000/api/user/rank"
    "http://localhost:3000/api/user/search"
)


for url in "${ENDPOINTS[@]}"; do
    name=$(echo "$url" | sed 's|http://||;s|/|_|g') #NOSONAR - these are testing scripts and not production traffic which it flagged me for
    echo "Testing $url"
    python3 jwt_tool.py "$(cat ../token.txt)" -t "$url" -rh "Authorization: Bearer $(cat ../token.txt)" -M at -np 2>&1 | sed -n '/=====================/, $p' > "../reports/${name}.txt" 2>&1
    echo "Saved to reports/${name}.txt" #NOSONAR - testing script line and not production traffic
done

echo "Done. The following are rows that did not provide an expected 200 or correct rejection 401 response code (rows that need to be checked):"
grep -L "^\(.*Response Code: 401\)*$" ../reports/*.txt 2>/dev/null
grep -rn "Response Code: 200\|Response Code: 500" ../reports/*.txt \
 | grep -v "Prescan: original\|Persistence check\|repeat original\|jwttool_[a-f0-9]* Sending token Response Code:"
