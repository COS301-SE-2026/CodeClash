
import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
vus: 100,
duration: '5m',
thresholds: {
http_req_duration: ['p(95)<500'],
http_req_failed: ['rate<0.01'],
},
};

const BASE_URL = 'http://localhost:3001';
const params = { headers: { Authorization: `Bearer ${__ENV.TOKEN}` } };

export default function () {
const matchRes = http.get(`${BASE_URL}/api/matches`, params);
check(matchRes, {
'status is 200': (r) => r.status === 200,
'response time < 500ms': (r) => r.timings.duration < 500,
});

const eloRes = http.get(`${BASE_URL}/api/leaderboard`, params);
check(eloRes, {
'status is 200': (r) => r.status === 200,
'response time < 500ms': (r) => r.timings.duration < 500,
});

sleep(1);
}