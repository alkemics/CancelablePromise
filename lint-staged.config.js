module.exports = {
  '*.js': ['npm run prettier:rc', 'npm run lint:rc', 'npm run jest:rc'],
  '*.{md,yml,html}': ['npm run prettier:rc'],
};
