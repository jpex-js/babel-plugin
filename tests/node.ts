import test from 'ava';
import { transformAsync } from '@babel/core';

test('basic', async(t) => {
  const code = `
    // transforms code
    import { encase, resolve } from '@jpex-js/node';
    
    type Foo = string;
    type Bar = number;
    type Baz = () => string;
    
    const a = resolve<Foo>();
    const b = resolve<Bar>({});
    const c = encase((baz: Baz) => () => {});
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
