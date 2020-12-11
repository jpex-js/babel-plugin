import test from 'ava';
import { transformAsync } from '@babel/core';

test('class-inference', async(t) => {
  const code = `
    import jpex from 'jpex';

    class Foo {
      constructor(window: Window) {
        this.window = window;
      }
    }

    jpex.service(Foo);

    jpex.service(class Bah {
      constructor(window: Window) {
        this.window = window;
      }
    });

    const result = jpex.resolve<Foo>();
  `;
  const { code: actual } = await transformAsync(code, {
    filename: './code.ts',
    babelrc: false,
    configFile: false,
    presets: [ '@babel/preset-typescript' ],
    plugins: [ [ './dist', { identifier: 'jpex' }] ],
  });

  t.snapshot(actual);
});
