import { transformAsync } from '@babel/core';
import test from 'ava';

test('encase', async (t) => {
  const code = `
    import { useResolve, encase, useResolveWith } from 'react-jpex';
    
    type Foo = string;
    type Bar = number;
    type Baz = string;

    const Component = encase((foo: Foo, bar: Bar) => (props: {}) => {
      const baz = useResolve<Baz>();
      const baz2 = useResolveWith<Baz, Foo, Bar>([ 'oof', 'rab' ]);

      return foo + bar + baz;
    })
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
