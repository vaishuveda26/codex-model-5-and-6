const { assert, createServer, jsonRequest, resetTasks, runCases } = require('./helpers');

const runIntegrationSuite = async () => {
  const server = await createServer();

  const cases = [
    {
      name: 'POST /tasks then GET /tasks returns created task',
      run: async () => {
        resetTasks();
        const create = await jsonRequest(`${server.baseUrl}/tasks`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ title: 'Integration task', due: '2026-06-01', notes: 'from test' })
        });

        assert.equal(create.response.status, 201);
        assert.ok(create.body.id);
        assert.equal(create.body.completed, false);

        const list = await jsonRequest(`${server.baseUrl}/tasks`);
        assert.equal(list.response.status, 200);
        assert.equal(Array.isArray(list.body), true);
        assert.equal(list.body.length, 1);
        assert.equal(list.body[0].id, create.body.id);
      }
    },
    {
      name: 'PATCH /tasks/:id/complete toggles task',
      run: async () => {
        resetTasks();
        const create = await jsonRequest(`${server.baseUrl}/tasks`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ title: 'Toggle me' })
        });
        const taskId = create.body.id;

        const patch = await jsonRequest(`${server.baseUrl}/tasks/${taskId}/complete`, {
          method: 'PATCH'
        });
        assert.equal(patch.response.status, 200);
        assert.equal(patch.body.completed, true);
      }
    },
    {
      name: 'PATCH /tasks/:id/complete returns 404 for missing ID',
      run: async () => {
        resetTasks();
        const patch = await jsonRequest(`${server.baseUrl}/tasks/does-not-exist/complete`, {
          method: 'PATCH'
        });
        assert.equal(patch.response.status, 404);
        assert.equal(patch.body.error, 'Task not found.');
      }
    }
  ];

  try {
    const result = await runCases('Integration - API Routes', cases);
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
  runIntegrationSuite().catch((error) => {
    console.error(error.stack || error.message);
    process.exit(1);
  });
}

module.exports = { runIntegrationSuite };

