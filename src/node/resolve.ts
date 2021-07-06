import { NodePath, types as t, Visitor } from '@babel/core';
import {
  getConcreteTypeName,
  getTypeParameter,
  State,
} from '../common';

const importVisitor: Visitor<{
  found: boolean,
}> = {
  ImportSpecifier(path, state) {
    if (path.node.imported.name === 'resolve') {
      if (path.node.local.name === 'resolve') {
        // @ts-ignore
        if (path.parent.source.value === '@jpex-js/node') {
          state.found = true;
        }
      }
    }
  },
};

const resolve = (
  programPath: NodePath<t.Program>,
  path: NodePath<any>,
  {
    filename,
    publicPath,
    pathAlias,
  }: State,
) => {
  const callee = path.node.callee;
  const args = path.node.arguments;

  if (callee?.name !== 'resolve') {
    return;
  }
  const state = { found: false };
  programPath.traverse(importVisitor, state);

  if (!state.found) {
    return;
  }

  if (args.length > 0 && t.isStringLiteral(args[0])) {
    return;
  }

  const type = getTypeParameter(path);
  const name = getConcreteTypeName(type, filename, publicPath, pathAlias, programPath);
  if (name != null) {
    args.unshift(t.stringLiteral(name));
  } else if (t.isTSTypeLiteral(type) || t.isTSFunctionType(type)) {
    throw new Error('Currently resolving with a literal type is not supported');
  }
};

export default resolve;
