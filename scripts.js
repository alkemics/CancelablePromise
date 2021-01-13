const fs = require('fs-extra');
const arg = process.argv.slice(2)[0];

switch (arg) {
  case 'clean':
    fs.removeSync('dist');
    break;
  case 'copy':
    fs.copySync('src/CancelablePromise.d.ts', 'dist/CancelablePromise.d.ts');
    break;
  case 'log_publish_version':
    logVersionToPublish();
    break;
  default:
    throw new Error('Invalid script');
}

function logVersionToPublish() {
  const changelog = fs.readFileSync('CHANGELOG.md').toString();
  const match = /(?<version>\d+\.\d+\.\d+)/.exec(changelog);
  const { version } = match.groups;
  if (!version) {
    throw new Error(`Invalid version to publish: ${version}`);
  }
  const currentVersion = require('./package.json').version;
  if (version === currentVersion) {
    throw new Error(
      `Version to publish is equal to current package version: ${version}`
    );
  }
  console.log(version);
}
