const { api, createTask } = require('../utils/backendTestUtils');

describe('Integration tests', () => {
  test('TC-INT-001: POST then GET task', async () => {
    const postResponse = await createTask({ title: 'Integration task' });
    expect(postResponse.status).toBe(201);

    const getResponse = await api.get('/tasks');
    expect(getResponse.status).toBe(200);
    expect(getResponse.body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ title: 'Integration task', completed: false })
      ])
    );
  });

  test('TC-INT-002: POST then PATCH completion', async () => {
    const created = await createTask({ title: 'Toggle me' });

    const patchResponse = await api.patch(`/tasks/${created.body.id}/complete`);
    expect(patchResponse.status).toBe(200);
    expect(patchResponse.body.completed).toBe(true);

    const getResponse = await api.get('/tasks');
    const task = getResponse.body.find((item) => item.id === created.body.id);
    expect(task.completed).toBe(true);
  });
});