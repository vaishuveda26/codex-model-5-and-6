const { api } = require('../utils/backendTestUtils');
const { scriptLikeTask, longTask } = require('../utils/sampleData');

describe('Security fuzz tests', () => {
  test('TC-SEC-001: script-like payload handled safely', async () => {
    const response = await api.post('/tasks').send(scriptLikeTask);

    expect([201, 400]).toContain(response.status);
    if (response.status === 201) {
      expect(response.body.title).toContain('<script>');
      expect(response.body.title).not.toContain('&lt;script');
    }
  });

  test('TC-SEC-002: long input does not crash server', async () => {
    const response = await api.post('/tasks').send(longTask);

    expect([201, 400]).toContain(response.status);
    const getResponse = await api.get('/tasks');
    expect(getResponse.status).toBe(200);
  });
});