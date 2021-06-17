module.exports = {
  '*.ts': () => 'npm run types',
  '*.{js,ts}': ['npm run prettier:rc', 'npm run lint:rc', 'npm run jest:rc'],
  '*.{md,yml,html}': ['npm run prettier:rc'],
};
