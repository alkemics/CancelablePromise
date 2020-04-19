module.exports = {
  '*.js': ['npm run prettier:rc', 'npm run lint:rc', 'npm run jest:rc'],
  '*.{md,yml}': ['npm run prettier:rc'],
};
