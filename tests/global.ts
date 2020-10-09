import test from 'ava';
import { transformAsync } from '@babel/core';

test('global', async(t) => {
  const code = `
    // transforms code
    import jpex, { Global } from 'jpex';
    
    const window = jpex.resolve<Window>();
    const navigator = jpex.resolve<Navigator>();
    const ga = jpex.resolve<Global<'ga'>>();
    const foo = jpex.resolve<Global<'foo', string>>();
  `;
  const { code: actual } = await transformAsync(code, {
    filename: './code.ts',
    babelrc: false,
    configFile: false,
    presets: [
      '@babel/preset-typescript',
    ],
    plugins: [
      [
        './dist',
      ],
    ],
  });

  t.snapshot(actual);
});
