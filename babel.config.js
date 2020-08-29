module.exports = {
  presets: [
    '@babel/preset-typescript',
    [
      '@babel/preset-env',
      {
        targets: {
          node: 'current',
        },
        modules: false,
        useBuiltIns: false,
        loose: true,
      },
    ],
  ],
  plugins: [
    [ '@babel/plugin-proposal-nullish-coalescing-operator', { loose: true }],
    [ '@babel/plugin-proposal-optional-chaining', { loose: true }],
    '@babel/plugin-proposal-class-properties',
  ],
};
