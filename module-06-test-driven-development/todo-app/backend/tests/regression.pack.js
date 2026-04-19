const { runUnitSuite } = require('./unit.validate');
const { runIntegrationSuite } = require('./integration.api');
const { runSmokeSuite } = require('./smoke.api');
const { runApiContractSuite } = require('./api.contract');

const runRegressionSuite = async () => {
  console.log('Suite: Regression - Core Create/Toggle Flows');
  const results = [];
  results.push(await runUnitSuite());
  results.push(await runIntegrationSuite());
  results.push(await runSmokeSuite());
  results.push(await runApiContractSuite());

  const passed = results.reduce((sum, suite) => sum + suite.passed, 0);
  const failed = results.reduce((sum, suite) => sum + suite.failed, 0);

  console.log(`Regression Summary: ${passed} passed, ${failed} failed`);
  if (failed > 0) {
    process.exitCode = 1;
  }
};

if (require.main === module) {
  runRegressionSuite().catch((error) => {
    console.error(error.stack || error.message);
    process.exit(1);
  });
}

module.exports = { runRegressionSuite };

