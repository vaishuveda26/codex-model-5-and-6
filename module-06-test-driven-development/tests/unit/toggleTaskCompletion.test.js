const { toggleTaskCompletion } = require('../../todo-app/backend/src/index');

describe('toggleTaskCompletion', () => {
  test('TC-UNIT-004: flips completion each time', () => {
    const task = { completed: false };

    expect(toggleTaskCompletion(task).completed).toBe(true);
    expect(toggleTaskCompletion(task).completed).toBe(false);
  });
});