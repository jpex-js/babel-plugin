import test from 'ava';
import { transformAsync } from '@babel/core';
import { resolve } from 'path';

test('path-alias', async(t) => {
  const code = `
    // transforms code
    import jpex from 'jpex';
    import { Foo } from 'types/foo';
    import { Bar } from '@/bar';
    import { Baz } from 'baz';
    
    jpex.factory<Foo>(() => 'foo');
    jpex.constant<Bar>(44);
    jpex.factory<Baz>((foo: Foo, bar: Bar) => () => \`\${foo}\${bar}\`);
    
    const result = jpex.resolve<Baz>();    
  `;
  const { code: actual } = await transformAsync(code, {
    filename: './src/code.ts',
    babelrc: false,
    configFile: false,
    presets: [
      '@babel/preset-typescript',
    ],
    plugins: [
      [
        './dist',
        {
          pathAlias: {
            'types': '/src/types',
            '@': '/src',
            'baz': '/src/baz',
          },
        },
      ],
    ],
  });

  t.snapshot(actual);
});
