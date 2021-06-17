module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        targets: { ie: '11' },
        modules: 'umd',
      },
    ],
    '@babel/preset-typescript',
  ],
  env: {
    esm: {
      presets: [
        [
          '@babel/preset-env',
          {
            targets: { esmodules: true },
            modules: false,
          },
        ],
      ],
    },
    test: {
      presets: [
        [
          '@babel/preset-env',
          {
            targets: { node: 12 },
            modules: 'commonjs',
          },
        ],
      ],
    },
  },
};
