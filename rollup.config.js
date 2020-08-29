import babel from 'rollup-plugin-babel';
import localResolve from 'rollup-plugin-node-resolve';

export default {
  input: 'src/index.ts',
  output: {
    file: 'dist/index.js',
    format: 'cjs',
    exports: 'default',
  },
  plugins: [
    localResolve({
      extensions: [ '.js', '.ts' ],
    }),
    babel({
      exclude: 'node_modules/**',
      extensions: [ '.js', '.ts' ],
    }),
  ],
  external: [
    '@babel/core',
    '@babel/helper-plugin-utils',
    'path',
  ],
};
