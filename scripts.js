const childProcess = require('child_process');
const fs = require('fs-extra');
const semver = require('semver');
const util = require('util');

const exec = util.promisify(childProcess.exec);
const [cmd, arg] = process.argv.slice(2);

async function runScript() {
  switch (cmd) {
    case 'clean':
      await clean();
      break;
    case 'copy':
      await copy();
      break;
    case 'log_publish_version':
      await logVersionToPublish();
      break;
    case 'prepare_release':
      await prepareRelease();
      break;
    default:
      throw new Error(`Invalid script: "${cmd}"`);
  }
}

async function clean() {
  await fs.remove('umd');
  await fs.remove('esm');
}

async function copy() {
  await fs.copy('src/CancelablePromise.d.ts', 'umd/CancelablePromise.d.ts');
  await fs.copy('src/CancelablePromise.js', 'esm/CancelablePromise.mjs');
  await fs.copy('src/CancelablePromise.d.ts', 'esm/CancelablePromise.d.ts');
}

async function logVersionToPublish() {
  const changelog = await fs.readFile('CHANGELOG.md', { encoding: 'utf8' });
  const match = /(?<version>\d+\.\d+\.\d+)/.exec(changelog);
  const { version } = match.groups;
  let { stdout } = await exec('npm view cancelable-promise version');
  const currentVersion = stdout.toString().trim();
  if (semver.valid(version) && semver.gt(version, currentVersion)) {
    console.log(version);
  }
}

async function prepareRelease() {
  const currentVersion = require('./package.json').version;
  const newVersion = semver.inc(currentVersion, arg || 'patch');
  const { date } = /(?<date>\d+-\d+-\d+)/.exec(new Date().toISOString()).groups;
  const url = `https://github.com/alkemics/CancelablePromise/releases/tag/v${newVersion}`;
  const { stdout } = await exec(
    `git log --oneline --pretty=format:'- %s' origin/master..HEAD`
  );
  const commits = stdout.toString().trim();
  let changelog = await fs.readFile('CHANGELOG.md', { encoding: 'utf8' });
  changelog = `## [${newVersion}](${url}) (${date})

${commits}

${changelog}`;
  await fs.writeFile('CHANGELOG.md', changelog, { encoding: 'utf8' });
  if (!process.argv.includes('--no-commit')) {
    await exec('git add CHANGELOG.md');
    await exec(
      `git commit -m "[RELEASE] update changelog for v${newVersion}" --no-verify`
    );
    await exec(
      `npm version --no-commit-hooks ${newVersion} -m '[RELEASE] v${newVersion}'`
    );
  }
}

runScript().catch((err) => {
  console.error(err);
  process.exit(1);
});
