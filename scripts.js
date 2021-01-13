const fs = require('fs-extra');
const { execSync } = require('child_process');
const semver = require('semver');
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
  const currentVersion = execSync('npm view cancelable-promise version')
    .toString()
    .trim();
  if (semver.valid(version) && semver.gt(version, currentVersion)) {
    console.log(version);
  }
}
