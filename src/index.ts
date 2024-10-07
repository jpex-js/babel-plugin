import { NodePath, Visitor } from '@babel/core';
import { declare } from '@babel/helper-plugin-utils';
import { resolve } from 'path';
import handleAliasCall from './alias';
import handleClearCache from './clearCache';
import handleEncaseCall from './encase';
import handleDeferredCall from './defer';
import handleFactoryCalls from './factories';
import handleInferCall from './infer';
import handleRawCall from './raw';
import handleResolveCall from './resolve';
import handleResolveWithCall from './resolveWith';
import reactJpex from './react-jpex';
import node from './node';

declare const require: any;
declare const process: any;

const mainVisitor: Visitor<{
  programPath: NodePath<any>;
  filename: string;
  opts: {
    identifier: string[];
    publicPath: string | boolean;
    omitIndex: boolean;
    pathAlias: {
      [key: string]: string;
    };
  };
}> = {
  CallExpression(path, state) {
    const { programPath } = this;
    let {
      opts: {
        identifier = 'jpex',
        publicPath,
        // eslint-disable-next-line prefer-const
        pathAlias = {},
        // eslint-disable-next-line prefer-const
        omitIndex,
      } = {},
    } = state;
    let filename = this.filename
      .split('.')
      .slice(0, -1)
      .join('.')
      .replace(process.cwd(), '');
    if (omitIndex && filename.endsWith('/index')) {
      filename = filename.replace('/index', '');
    }
    identifier = [].concat(identifier);
    if (publicPath === true) {
      publicPath = require(resolve('./package.json')).name;
    }
    const opts = {
      identifier,
      filename,
      pathAlias,
      publicPath: publicPath as string,
    };
    handleFactoryCalls(programPath, path, opts);
    handleResolveCall(programPath, path, opts);
    handleResolveWithCall(programPath, path, opts);
    handleEncaseCall(programPath, path, opts);
    handleDeferredCall(programPath, path, opts);
    handleAliasCall(programPath, path, opts);
    handleInferCall(programPath, path, opts);
    handleRawCall(programPath, path, opts);
    handleClearCache(programPath, path, opts);
    reactJpex(programPath, path, opts);
    node(programPath, path, opts);
  },
};

export default declare((api: any) => {
  api.assertVersion(7);

  return {
    visitor: {
      Program(programPath: NodePath<any>, state: any) {
        programPath.traverse(mainVisitor, {
          programPath,
          opts: state.opts,
          filename: state.file.opts.filename,
        });
      },
    },
  };
});
