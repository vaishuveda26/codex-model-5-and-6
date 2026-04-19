const assert = require('node:assert/strict');
const { app, resetTasks } = require('../src/index');

const formatResult = (name, error) => {
  if (!error) {
    return `PASS ${name}`;
  }
  return `FAIL ${name}\n${error.stack || error.message}`;
};

const runCases = async (suiteName, cases) => {
  let passed = 0;
  let failed = 0;
  const lines = [`Suite: ${suiteName}`];

  for (const testCase of cases) {
    try {
      await testCase.run();
      passed += 1;
      lines.push(formatResult(testCase.name));
    } catch (error) {
      failed += 1;
      lines.push(formatResult(testCase.name, error));
    }
  }

  lines.push(`Summary: ${passed} passed, ${failed} failed`);
  return { passed, failed, text: lines.join('\n') };
};

const createServer = async () => {
  resetTasks();
  const server = app.listen(0);
  await new Promise((resolve) => server.once('listening', resolve));
  const { port } = server.address();

  return {
    baseUrl: `http://127.0.0.1:${port}`,
    close: () =>
      new Promise((resolve, reject) => {
        server.close((error) => {
          if (error) {
            reject(error);
            return;
          }
          resolve();
        });
      })
  };
};

const jsonRequest = async (url, options = {}) => {
  const response = await fetch(url, options);
  const body = await response.json().catch(() => ({}));
  return { response, body };
};

module.exports = {
  assert,
  createServer,
  jsonRequest,
  resetTasks,
  runCases
};

