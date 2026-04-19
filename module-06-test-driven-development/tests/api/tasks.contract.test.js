const { api, createTask } = require('../utils/backendTestUtils');
const { validTask } = require('../utils/sampleData');

describe('API contract tests', () => {
  test('TC-API-001: GET /tasks returns array', async () => {
    const response = await api.get('/tasks');
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  test('TC-API-002: POST /tasks rejects missing title', async () => {
    const response = await api.post('/tasks').send({ notes: 'No title' });
    expect(response.status).toBe(400);
    expect(response.body.error).toBe('Task title is required.');
  });

  test('TC-API-003: PATCH /tasks/:id/complete unknown id', async () => {
    const response = await api.patch('/tasks/does-not-exist/complete');
    expect(response.status).toBe(404);
    expect(response.body).toEqual(expect.objectContaining({ error: expect.any(String) }));
  });

  test('TC-API-004: POST /tasks created schema', async () => {
    const response = await api.post('/tasks').send(validTask);

    expect(response.status).toBe(201);
    expect(response.body).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        title: validTask.title,
        notes: validTask.notes,
        due: validTask.due,
        completed: false,
        createdAt: expect.any(String)
      })
    );
  });

  test('POST trims title and notes', async () => {
    const response = await createTask({ title: '  Trim me  ', notes: '  note  ' });
    expect(response.body.title).toBe('Trim me');
    expect(response.body.notes).toBe('note');
  });
});