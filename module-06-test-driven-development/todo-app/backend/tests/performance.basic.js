const { assert, createServer, jsonRequest, resetTasks, runCases } = require('./helpers');

const percentile = (values, p) => {
  if (values.length === 0) {
    return 0;
  }
  const sorted = [...values].sort((a, b) => a - b);
  const idx = Math.ceil((p / 100) * sorted.length) - 1;
  return sorted[Math.max(0, idx)];
};

const runPerformanceSuite = async () => {
  const server = await createServer();

  const cases = [
    {
      name: 'POST /tasks baseline p95 latency under 250ms for 50 requests',
      run: async () => {
        resetTasks();
        const durations = [];
        for (let i = 0; i < 50; i += 1) {
          const start = Date.now();
          const { response } = await jsonRequest(`${server.baseUrl}/tasks`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title: `Perf task ${i}` })
          });
          durations.push(Date.now() - start);
          assert.equal(response.status, 201);
        }
        const p95 = percentile(durations, 95);
        assert.equal(p95 < 250, true, `Expected p95 < 250ms but got ${p95}ms`);
      }
    },
    {
      name: 'GET /tasks median latency under 150ms for 200 requests',
      run: async () => {
        const durations = [];
        for (let i = 0; i < 200; i += 1) {
          const start = Date.now();
          const { response } = await jsonRequest(`${server.baseUrl}/tasks`);
          durations.push(Date.now() - start);
          assert.equal(response.status, 200);
        }
        const p50 = percentile(durations, 50);
        assert.equal(p50 < 150, true, `Expected median < 150ms but got ${p50}ms`);
      }
    }
  ];

  try {
    const result = await runCases('Performance - Baseline Throughput', cases);
    console.log(result.text);
    if (result.failed > 0) {
      process.exitCode = 1;
    }
    return result;
  } finally {
    await server.close();
  }
};

if (require.main === module) {
  runPerformanceSuite().catch((error) => {
    console.error(error.stack || error.message);
    process.exit(1);
  });
}

module.exports = { runPerformanceSuite };

