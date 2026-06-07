const fs = require('fs');
const path = require('path');

for (const dir of ['.next', '.vercel/output']) {
  const target = path.join(__dirname, '..', dir);
  if (fs.existsSync(target)) {
    fs.rmSync(target, { recursive: true, force: true });
    console.log('Removed ' + target);
  }
}
