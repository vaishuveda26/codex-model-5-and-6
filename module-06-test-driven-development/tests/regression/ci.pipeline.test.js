const fs = require('fs');
const path = require('path');

describe('CI pipeline hooks', () => {
  test('TC-REG-002: required npm scripts for CI are present', () => {
    const packageJsonPath = path.resolve(__dirname, '../package.json');
    const pkg = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

    expect(pkg.scripts).toEqual(
      expect.objectContaining({
        test: expect.any(String),
        'test:unit': expect.any(String),
        'test:integration': expect.any(String),
        'test:api': expect.any(String),
        'test:frontend': expect.any(String),
        'test:smoke': expect.any(String),
        'test:regression': expect.any(String),
        'test:e2e': expect.any(String),
        'test:acceptance': expect.any(String)
      })
    );
  });
});