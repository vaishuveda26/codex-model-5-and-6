import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '30s', target: 50 },
    { duration: '30s', target: 50 },
    { duration: '20s', target: 0 }
  ],
  thresholds: {
    http_req_failed: ['rate<0.01'],
    http_req_duration: ['p(95)<500']
  }
};

export default function () {
  const payload = JSON.stringify({
    title: `k6 task ${__VU}-${__ITER}`,
    notes: 'load test',
    due: null
  });

  const params = {
    headers: { 'Content-Type': 'application/json' }
  };

  const response = http.post('http://localhost:4000/tasks', payload, params);
  check(response, {
    'status is 201': (res) => res.status === 201
  });

  sleep(1);
}