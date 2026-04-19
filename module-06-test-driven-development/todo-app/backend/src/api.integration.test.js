const test = require('node:test');
const assert = require('node:assert/strict');
const { app, resetTasks } = require('./index');

let server;
let baseUrl;

test.before(async () => {
  server = app.listen(0);
  await new Promise((resolve) => server.once('listening', resolve));
  const { port } = server.address();
  baseUrl = `http://127.0.0.1:${port}`;
});

test.after(async () => {
  await new Promise((resolve, reject) => {
    server.close((error) => {
      if (error) {
        reject(error);
        return;
      }
      resolve();
    });
  });
});

test.beforeEach(() => {
  resetTasks();
});

test('POST /tasks then GET /tasks returns created task with completed=false', async () => {
  const createResponse = await fetch(`${baseUrl}/tasks`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title: 'Integration Task', due: '2026-05-01', notes: 'verify create/get' })
  });

  assert.equal(createResponse.status, 201);
  const created = await createResponse.json();
  assert.ok(created.id);
  assert.equal(created.title, 'Integration Task');
  assert.equal(created.completed, false);

  const listResponse = await fetch(`${baseUrl}/tasks`);
  assert.equal(listResponse.status, 200);

  const tasks = await listResponse.json();
  assert.equal(Array.isArray(tasks), true);
  assert.equal(tasks.length, 1);
  assert.equal(tasks[0].id, created.id);
  assert.equal(tasks[0].completed, false);
});

test('PATCH /tasks/:id/complete toggles completion to true', async () => {
  const createResponse = await fetch(`${baseUrl}/tasks`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title: 'Toggle Task' })
  });

  assert.equal(createResponse.status, 201);
  const created = await createResponse.json();

  const patchResponse = await fetch(`${baseUrl}/tasks/${created.id}/complete`, {
    method: 'PATCH'
  });
  assert.equal(patchResponse.status, 200);
  const updated = await patchResponse.json();
  assert.equal(updated.completed, true);
});

test('PATCH /tasks/:id/complete returns 404 for unknown ID', async () => {
  const patchResponse = await fetch(`${baseUrl}/tasks/non-existent-id/complete`, {
    method: 'PATCH'
  });
  assert.equal(patchResponse.status, 404);

  const payload = await patchResponse.json();
  assert.equal(payload.error, 'Task not found.');
});

