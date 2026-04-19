const { app, resetTasks } = require('../../todo-app/backend/src/index');
const request = require('supertest');

const api = request(app);

const createTask = async (overrides = {}) => {
  const payload = {
    title: 'Seeded task',
    due: '2030-01-01',
    notes: 'Sample note',
    ...overrides
  };

  return api.post('/tasks').send(payload);
};

beforeEach(() => {
  resetTasks();
});

module.exports = {
  api,
  createTask
};