import test from 'ava';
import { transformAsync } from '@babel/core';

test('publicPath for node_modules', async(t) => {
  const code = `
    // publicPath for imports
    import jpex from 'jpex';
    import { Foo, Bar, Zeb as Baz } from 'some-lib';
    
    jpex.factory<Foo>(() => 'foo');
    jpex.constant<Bar>(44);
    jpex.factory<Baz>((foo: Foo, bar: Bar) => () => \`\${foo}\${bar}\`);
    
    const result = jpex.resolve<Baz>();    
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
        {
          publicPath: 'mylib',
        },
      ],
    ],
  });

  t.snapshot(actual);
});
