const { assert, createServer, jsonRequest, resetTasks, runCases } = require('./helpers');

const runSecuritySuite = async () => {
  const server = await createServer();

  const cases = [
    {
      name: 'Script-like title payload is handled safely',
      run: async () => {
        resetTasks();
        const payload = { title: '<script>alert(1)</script>', notes: 'xss check' };
        const { response, body } = await jsonRequest(`${server.baseUrl}/tasks`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });

        assert.equal(response.status, 201);
        assert.equal(body.title, payload.title);
      }
    },
    {
      name: 'Very long title payload does not crash API',
      run: async () => {
        const longTitle = 'A'.repeat(5000);
        const { response } = await jsonRequest(`${server.baseUrl}/tasks`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ title: longTitle })
        });
        assert.equal(response.status, 201);
      }
    },
    {
      name: 'CORS header is returned for GET /tasks',
      run: async () => {
        const response = await fetch(`${server.baseUrl}/tasks`, {
          headers: { Origin: 'http://example.com' }
        });
        assert.equal(response.status, 200);
        assert.equal(response.headers.get('access-control-allow-origin'), '*');
      }
    }
  ];

  try {
    const result = await runCases('Security - Fuzz and Headers', cases);
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
  runSecuritySuite().catch((error) => {
    console.error(error.stack || error.message);
    process.exit(1);
  });
}

module.exports = { runSecuritySuite };

