import * as esbuild from 'esbuild';
import { spawn } from 'child_process';

console.log('⚡ Bundling test suites with esbuild...');

// Bundle both unit and acceptance test suites
await Promise.all([
  esbuild.build({
    entryPoints: ['src/tests/unit.test.ts'],
    outfile: 'dist/unit.test.mjs',
    bundle: true,
    platform: 'node',
    format: 'esm'
  }),
  esbuild.build({
    entryPoints: ['src/tests/acceptance.test.ts'],
    outfile: 'dist/acceptance.test.mjs',
    bundle: true,
    platform: 'node',
    format: 'esm'
  })
]);

function runStep(scriptPath) {
  return new Promise((resolve, reject) => {
    const child = spawn(process.execPath, [scriptPath], { stdio: 'inherit' });
    child.on('close', (code) => {
      if (code === 0) resolve();
      else reject(new Error(`Process ${scriptPath} exited with code ${code}`));
    });
  });
}

try {
  console.log('\n========================================');
  console.log('1. RUNNING SERVICE UNIT & BOUNDARY TESTS');
  console.log('========================================');
  await runStep('dist/unit.test.mjs');

  console.log('\n========================================');
  console.log('2. RUNNING DOMAIN ACCEPTANCE TESTS');
  console.log('========================================');
  await runStep('dist/acceptance.test.mjs');

  console.log('\n========================================');
  console.log('3. RUNNING BACKEND API INTEGRATION TESTS');
  console.log('========================================');
  await runStep('test-backend-api.mjs');

  console.log('\n🎉 ALL TEST SUITES PASSED SUCCESSFULLY!\n');
} catch (err) {
  console.error('\n❌ Test suite execution failed:', err.message);
  process.exit(1);
}

