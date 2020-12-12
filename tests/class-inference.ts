import test from 'ava';
import { transformAsync } from '@babel/core';

test('class-inference', async(t) => {
  const code = `
    import jpex from 'jpex';

    interface IFoo {}

    class Foo implements IFoo {
      constructor(window: Window) {
        this.window = window;
      }
    }

    jpex.service(Foo);
    jpex.service(Foo, {});

    jpex.service(class Bah implements IFoo {
      constructor(window: Window) {
        this.window = window;
      }
    });
    jpex.service(class Baz implements IFoo {}, {});

    class NoInterfaces {
      constructor(window: Window) {
        this.window = window;
      }
    }

    jpex.service(NoInterfaces);

    class ExplicityTyping {}

    jpex.service<ExplicityTyping>(ExplicitTyping);

    const result = jpex.resolve<IFoo>();
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
