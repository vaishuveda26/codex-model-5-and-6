const { assert, createServer, jsonRequest, runCases } = require('./helpers');

const runSmokeSuite = async () => {
  const server = await createServer();

  const cases = [
    {
      name: 'GET /tasks returns 200 and array',
      run: async () => {
        const res = await jsonRequest(`${server.baseUrl}/tasks`);
        assert.equal(res.response.status, 200);
        assert.equal(Array.isArray(res.body), true);
      }
    },
    {
      name: 'POST /tasks with valid title returns 201',
      run: async () => {
        const res = await jsonRequest(`${server.baseUrl}/tasks`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ title: 'Smoke add' })
        });
        assert.equal(res.response.status, 201);
      }
    },
    {
      name: 'PATCH /tasks/:id/complete works for saved task',
      run: async () => {
        const created = await jsonRequest(`${server.baseUrl}/tasks`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ title: 'Smoke toggle' })
        });
        const res = await jsonRequest(`${server.baseUrl}/tasks/${created.body.id}/complete`, {
          method: 'PATCH'
        });
        assert.equal(res.response.status, 200);
        assert.equal(res.body.completed, true);
      }
    }
  ];

  try {
    const result = await runCases('Smoke - Service Health', cases);
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
  runSmokeSuite().catch((error) => {
    console.error(error.stack || error.message);
    process.exit(1);
  });
}

module.exports = { runSmokeSuite };

