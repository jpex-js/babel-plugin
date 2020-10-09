import test from 'ava';
import { transformAsync } from '@babel/core';

test('global', async(t) => {
  const code = `
    // transforms code
    import type fstype from 'fs';
    import jpex, { NodeModule } from 'jpex';
    
    const fs = jpex.resolve<NodeModule<'fs', typeof fstype>>();
    const path = jpex.resolve<NodeModule<'path'>>();
    const capra = jpex.resolve<NodeModule<'@team-griffin/capra'>>();
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
