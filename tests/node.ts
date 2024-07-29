import test from 'ava';
import { transformAsync } from '@babel/core';

test('basic', async (t) => {
  const code = `
    // transforms code
    import { encase, resolve, resolveWith, resolveAsync, resolveWithAsync } from '@jpex-js/node';
    
    type Foo = string;
    type Bar = number;
    type Baz = () => string;
    
    const a = resolve<Foo>();
    const b = resolve<Bar>({});
    const c = encase((baz: Baz) => () => {});
    const d = resolveWith<Foo, Bar>(['bar']);
    const e = resolveAsync<Foo>();
    const f = resolveWithAsync<Foo, Bar>(['bar']);
  `;
  const { code: actual } = await transformAsync(code, {
    filename: './code.ts',
    babelrc: false,
    configFile: false,
    presets: ['@babel/preset-typescript'],
    plugins: [['./dist']],
  });

  t.snapshot(actual);
});
