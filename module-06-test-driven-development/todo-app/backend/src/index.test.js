const test = require('node:test');
const assert = require('node:assert/strict');
const { validateTaskPayload } = require('./index');

test('validateTaskPayload returns null for valid title', () => {
  const result = validateTaskPayload({ title: 'Buy milk' });
  assert.equal(result, null);
});

test('validateTaskPayload rejects missing title', () => {
  const result = validateTaskPayload({});
  assert.equal(result, 'Task title is required.');
});

test('validateTaskPayload rejects whitespace-only title', () => {
  const result = validateTaskPayload({ title: '   ' });
  assert.equal(result, 'Task title is required.');
});
