const { api, createTask } = require('../utils/backendTestUtils');
const { validateTaskPayload } = require('../../todo-app/backend/src/index');

describe('Regression critical flows', () => {
  test('TC-REG-001: create + toggle end-to-end backend flow', async () => {
    expect(validateTaskPayload({ title: 'Regression task' })).toBeNull();

    const created = await createTask({ title: 'Regression task' });
    expect(created.status).toBe(201);

    const toggled = await api.patch(`/tasks/${created.body.id}/complete`);
    expect(toggled.status).toBe(200);
    expect(toggled.body.completed).toBe(true);
  });
});