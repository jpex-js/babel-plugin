import test from 'ava';
import { transformAsync } from '@babel/core';

test('index', async (t) => {
  const code = `
    // transforms code
    import jpex from 'jpex';
    
    type Foo = string;
    type Baz = () => string;
    type Bar = number;
    type AsyncFactory = string;
    
    jpex.factory<Foo>(() => 'foo');
    jpex.constant<Bar>(44);
    jpex.factory<Baz>((foo: Foo, bar: Bar) => () => \`\${foo}\${bar}\`);
    jpex.factoryAsync<AsyncFactory>(async(foo: Foo) => 'async');
    

    const result = jpex.resolve<Baz>();    
    const result2 = jpex.resolveAsync<AsyncFactory>();
    const result3 = jpex.resolveWith<Baz, Foo>([ 'oof' ]);
    const result4 = jpex.resolveWithAsync<AsyncFactory, Foo>([ 'oof' ]);
  `;
  const { code: actual } = await transformAsync(code, {
    filename: './code/index.ts',
    babelrc: false,
    configFile: false,
    presets: ['@babel/preset-typescript'],
    plugins: [
      [
        './dist',
        {
          omitIndex: true,
        },
      ],
    ],
  });

  t.snapshot(actual);
});
