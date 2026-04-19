const { api, createTask } = require('../utils/backendTestUtils');

describe('Smoke tests', () => {
  test('TC-SMOKE-001: backend endpoints sanity', async () => {
    const getResponse = await api.get('/tasks');
    expect(getResponse.status).toBe(200);

    const postResponse = await createTask({ title: 'Smoke task' });
    expect(postResponse.status).toBe(201);

    const patchResponse = await api.patch(`/tasks/${postResponse.body.id}/complete`);
    expect(patchResponse.status).toBe(200);
  });
});