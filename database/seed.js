const { spawnSync } = require('child_process');

function run() {
  const result = spawnSync(
    process.platform === 'win32' ? 'npx.cmd' : 'npx',
    ['tsx', 'prisma/seed.ts'],
    {
      cwd: process.cwd(),
      stdio: 'inherit',
      shell: false,
    }
  );

  if (result.status !== 0) {
    process.exit(result.status || 1);
  }
}

run();
