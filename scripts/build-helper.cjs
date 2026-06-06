const path = require('path');
const fs = require('fs');
const { execSync } = require('child_process');

function findServerRoot(dir, depth = 0) {
  if (depth > 5) return null;
  try {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      if (entry.name === 'server.js' && entry.isFile()) return dir;
      if (entry.isDirectory()) {
        const result = findServerRoot(path.join(dir, entry.name), depth + 1);
        if (result) return result;
      }
    }
  } catch (e) { /* ignore */ }
  return null;
}

const mode = process.argv[2];
const standaloneDir = path.join(process.cwd(), '.next', 'standalone');
const root = findServerRoot(standaloneDir) || standaloneDir;

if (mode === 'copy-static') {
  console.log('Copying static files to:', root);
  execSync('cp -r .next/static ' + path.join(root, '.next'), { stdio: 'inherit' });
  execSync('cp -r public ' + root, { stdio: 'inherit' });
  console.log('Done. Static files copied.');
} else if (mode === 'start') {
  const serverPath = path.join(root, 'server.js');
  if (fs.existsSync(serverPath)) {
    process.chdir(root);
    require(serverPath);
  } else {
    console.error('server.js not found in', root);
    process.exit(1);
  }
} else {
  console.error('Usage: node scripts/build-helper.cjs [copy-static|start]');
  process.exit(1);
}
