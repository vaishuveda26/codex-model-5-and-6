const { assert, createServer, jsonRequest, resetTasks, runCases } = require('./helpers');

const runApiContractSuite = async () => {
  const server = await createServer();

  const cases = [
    {
      name: 'GET /tasks returns JSON array',
      run: async () => {
        resetTasks();
        const { response, body } = await jsonRequest(`${server.baseUrl}/tasks`);
        assert.equal(response.status, 200);
        assert.equal(response.headers.get('content-type').includes('application/json'), true);
        assert.equal(Array.isArray(body), true);
      }
    },
    {
      name: 'POST /tasks requires title',
      run: async () => {
        const { response, body } = await jsonRequest(`${server.baseUrl}/tasks`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ notes: 'missing title' })
        });
        assert.equal(response.status, 400);
        assert.equal(body.error, 'Task title is required.');
      }
    },
    {
      name: 'POST /tasks returns required schema fields',
      run: async () => {
        const { response, body } = await jsonRequest(`${server.baseUrl}/tasks`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ title: 'Schema check', notes: 'api contract' })
        });
        assert.equal(response.status, 201);
        for (const field of ['id', 'title', 'notes', 'due', 'completed', 'createdAt']) {
          assert.equal(Object.hasOwn(body, field), true);
        }
      }
    },
    {
      name: 'PATCH /tasks/:id/complete returns 404 for unknown ID',
      run: async () => {
        const { response, body } = await jsonRequest(`${server.baseUrl}/tasks/unknown-id/complete`, {
          method: 'PATCH'
        });
        assert.equal(response.status, 404);
        assert.equal(body.error, 'Task not found.');
      }
    }
  ];

  try {
    const result = await runCases('API Contract - Endpoint Behavior', cases);
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
  runApiContractSuite().catch((error) => {
    console.error(error.stack || error.message);
    process.exit(1);
  });
}

module.exports = { runApiContractSuite };

