const { validateTaskPayload } = require('../src/index');
const { assert, runCases } = require('./helpers');

const cases = [
  {
    name: 'validateTaskPayload accepts valid title',
    run: () => {
      const result = validateTaskPayload({ title: 'Buy groceries' });
      assert.equal(result, null);
    }
  },
  {
    name: 'validateTaskPayload rejects missing title',
    run: () => {
      const result = validateTaskPayload({});
      assert.equal(result, 'Task title is required.');
    }
  },
  {
    name: 'validateTaskPayload rejects whitespace-only title',
    run: () => {
      const result = validateTaskPayload({ title: '   ' });
      assert.equal(result, 'Task title is required.');
    }
  }
];

const runUnitSuite = async () => {
  const result = await runCases('Unit - Payload Validation', cases);
  console.log(result.text);
  if (result.failed > 0) {
    process.exitCode = 1;
  }
  return result;
};

if (require.main === module) {
  runUnitSuite().catch((error) => {
    console.error(error.stack || error.message);
    process.exit(1);
  });
}

module.exports = { runUnitSuite };

