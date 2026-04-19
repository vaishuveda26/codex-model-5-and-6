const { runUnitSuite } = require('./unit.validate');
const { runIntegrationSuite } = require('./integration.api');
const { runSmokeSuite } = require('./smoke.api');
const { runApiContractSuite } = require('./api.contract');
const { runSecuritySuite } = require('./security.fuzz');
const { runPerformanceSuite } = require('./performance.basic');
const { runAcceptanceSuite } = require('./acceptance.flow');

const runAllSuites = async () => {
  const results = [];
  results.push(await runUnitSuite());
  results.push(await runIntegrationSuite());
  results.push(await runSmokeSuite());
  results.push(await runApiContractSuite());
  results.push(await runSecuritySuite());
  results.push(await runPerformanceSuite());
  results.push(await runAcceptanceSuite());

  const passed = results.reduce((sum, suite) => sum + suite.passed, 0);
  const failed = results.reduce((sum, suite) => sum + suite.failed, 0);

  console.log(`\nGlobal Summary: ${passed} passed, ${failed} failed`);
  if (failed > 0) {
    process.exitCode = 1;
  }
};

runAllSuites().catch((error) => {
  console.error(error.stack || error.message);
  process.exit(1);
});
