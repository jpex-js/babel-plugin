import { transformAsync } from '@babel/core';
import test from 'ava';

test('encase', async (t) => {
  const code = `
    import jpex from 'jpex';
    
    type Foo = string;
    type Bar = number;
    
    const fn = jpex.encase((foo: Foo, bar: Bar) => (seed: string) => {
      return seed + foo + bar;
    }); 
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

test('defer', async (t) => {
  const code = `
    import jpex from 'jpex';

    type Foo = () => string;
    
    const fn = jpex.defer<Foo>();
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
