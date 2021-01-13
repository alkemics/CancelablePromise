const fs = require('fs-extra');
const { execSync } = require('child_process');
const semver = require('semver');
const [cmd, arg] = process.argv.slice(2);

switch (cmd) {
  case 'clean':
    fs.removeSync('dist');
    break;
  case 'copy':
    fs.copySync('src/CancelablePromise.d.ts', 'dist/CancelablePromise.d.ts');
    break;
  case 'log_publish_version':
    logVersionToPublish();
    break;
  case 'prepare_release':
    prepareRelease();
    break;
  default:
    throw new Error('Invalid script');
}

function logVersionToPublish() {
  const changelog = fs
    .readFileSync('CHANGELOG.md', { encoding: 'utf8' })
    .toString();
  const match = /(?<version>\d+\.\d+\.\d+)/.exec(changelog);
  const { version } = match.groups;
  const currentVersion = execSync('npm view cancelable-promise version')
    .toString()
    .trim();
  if (semver.valid(version) && semver.gt(version, currentVersion)) {
    console.log(version);
  }
}

function prepareRelease() {
  const currentVersion = require('./package.json').version;
  const newVersion = semver.inc(currentVersion, arg || 'patch');
  const { date } = /(?<date>\d+-\d+-\d+)/.exec(new Date().toISOString()).groups;
  const url = `https://github.com/alkemics/CancelablePromise/releases/tag/${newVersion}`;
  const commits = execSync(
    `git log --oneline --pretty=format:'- %s' origin/master..HEAD`
  )
    .toString()
    .trim();
  let changelog = fs
    .readFileSync('CHANGELOG.md', { encoding: 'utf8' })
    .toString();
  changelog = `## [${newVersion}](${url}) (${date})

${commits}

${changelog}`;
  fs.writeFileSync('CHANGELOG.md', changelog, { encoding: 'utf8' });
  execSync('git add CHANGELOG.md');
  execSync(
    `git commit -m "[RELEASE] update changelog for v${newVersion}" --no-verify`
  );
  execSync(
    `npm version --no-commit-hooks ${newVersion} -m '[RELEASE] v${newVersion}'`
  );
}
