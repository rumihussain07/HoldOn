const fs = require('node:fs');
const path = require('node:path');
const { spawnSync } = require('node:child_process');
const root = path.resolve(__dirname, '..');
for (const file of ['dist/app.js', 'server.cjs', 'scripts/check.cjs']) {
  const result = spawnSync(process.execPath, ['--check', path.join(root, file)], { stdio: 'inherit' });
  if (result.status !== 0) process.exit(1);
}
const html = fs.readFileSync(path.join(root, 'dist/index.html'), 'utf8');
for (const match of html.matchAll(/(?:src|href)="([^"]+)"/g)) {
  const asset = match[1];
  if (/^(?:[a-z]+:|#|\/\/)/i.test(asset)) continue;
  if (!fs.existsSync(path.resolve(root, 'dist', asset))) throw new Error(`Missing asset: ${asset}`);
}
for (const file of ['package.json', '.openai/hosting.json']) JSON.parse(fs.readFileSync(path.join(root, file), 'utf8'));
console.log('Passed: JavaScript syntax, local HTML assets, and JSON configuration.');
