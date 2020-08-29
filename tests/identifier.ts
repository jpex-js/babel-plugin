import test from 'ava';
import { transformAsync } from '@babel/core';

test('identifier', async(t) => {
  const code = `
    // transforms code
    import jpex from 'jpex';
    
    type Foo = string;
    type Baz = () => string;
    type Bar = number;

    const jpex2 = jpex.extend();
    
    jpex.factory<Foo>(() => 'foo');
    jpex2.constant<Bar>(44);
    jpex2.factory<Baz>((foo: Foo, bar: Bar) => () => \`\${foo}\${bar}\`);
    
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
          identifier: 'jpex2',
        },
      ],
    ],
  });

  t.snapshot(actual);
});
