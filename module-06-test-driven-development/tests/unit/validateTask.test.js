const { validateTaskPayload } = require('../../todo-app/backend/src/index');

describe('validateTaskPayload', () => {
  test('TC-UNIT-001: accepts valid title', () => {
    expect(validateTaskPayload({ title: 'Buy groceries' })).toBeNull();
  });

  test('TC-UNIT-002: rejects missing title', () => {
    expect(validateTaskPayload({})).toBe('Task title is required.');
  });

  test('TC-UNIT-003: rejects whitespace-only title', () => {
    expect(validateTaskPayload({ title: '   ' })).toBe('Task title is required.');
  });
});