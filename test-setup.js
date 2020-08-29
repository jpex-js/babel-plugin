const babel = require('@babel/register');

// babel({
//   extensions: [ '.js', '.ts' ],
// });
babel({
  extensions: [ '.js', '.ts' ],
  plugins: [
    [ '@babel/plugin-proposal-object-rest-spread', { useBuiltIns: true }],
    '@babel/plugin-proposal-class-properties',
  ],
  presets: [
    '@babel/preset-typescript',
    [
      '@babel/preset-env',
      {
        targets: {
          node: 'current',
        },
        modules: 'commonjs',
        useBuiltIns: false,
        loose: true,
      },
    ],
  ],
});
