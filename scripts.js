const fs = require('fs-extra');
const arg = process.argv.slice(2)[0];

switch (arg) {
  case 'clean':
    fs.removeSync('dist');
    break;
  case 'copy':
    fs.copySync('src/index.d.ts', 'dist/index.d.ts');
    break;
  default:
    throw new Error('Invalid script');
}
