const { assert, createServer, jsonRequest, resetTasks, runCases } = require('./helpers');

const runAcceptanceSuite = async () => {
  const server = await createServer();

  const cases = [
    {
      name: 'User can add a task and see it in backend list',
      run: async () => {
        resetTasks();
        const create = await jsonRequest(`${server.baseUrl}/tasks`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ title: 'Acceptance task', notes: 'business flow' })
        });
        assert.equal(create.response.status, 201);

        const list = await jsonRequest(`${server.baseUrl}/tasks`);
        assert.equal(list.response.status, 200);
        assert.equal(list.body.length >= 1, true);
        assert.equal(list.body[0].title, 'Acceptance task');
      }
    },
    {
      name: 'User can mark task complete and then undo',
      run: async () => {
        const create = await jsonRequest(`${server.baseUrl}/tasks`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ title: 'Toggle acceptance' })
        });
        const taskId = create.body.id;

        const completed = await jsonRequest(`${server.baseUrl}/tasks/${taskId}/complete`, {
          method: 'PATCH'
        });
        assert.equal(completed.response.status, 200);
        assert.equal(completed.body.completed, true);

        const undone = await jsonRequest(`${server.baseUrl}/tasks/${taskId}/complete`, {
          method: 'PATCH'
        });
        assert.equal(undone.response.status, 200);
        assert.equal(undone.body.completed, false);
      }
    }
  ];

  try {
    const result = await runCases('Acceptance - Business Flow', cases);
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
  runAcceptanceSuite().catch((error) => {
    console.error(error.stack || error.message);
    process.exit(1);
  });
}

module.exports = { runAcceptanceSuite };

