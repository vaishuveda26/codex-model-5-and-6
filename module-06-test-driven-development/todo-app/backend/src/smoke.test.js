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

test('smoke: GET /tasks responds 200 with JSON array', async () => {
  const response = await fetch(`${baseUrl}/tasks`);
  assert.equal(response.status, 200);
  const payload = await response.json();
  assert.equal(Array.isArray(payload), true);
});

test('smoke: POST /tasks valid payload returns 201', async () => {
  const response = await fetch(`${baseUrl}/tasks`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title: 'Smoke task' })
  });
  assert.equal(response.status, 201);
});

test('smoke: PATCH /tasks/:id/complete toggles saved task', async () => {
  const createResponse = await fetch(`${baseUrl}/tasks`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title: 'Smoke toggle' })
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

