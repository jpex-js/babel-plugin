import { NodePath, types as t, Visitor } from '@babel/core';
import {
  extractFunctionParameterTypes,
  State,
} from '../common';

const importVisitor: Visitor<{
  found: boolean,
}> = {
  ImportSpecifier(path, state) {
    if (path.node.imported.name === 'encase') {
      if (path.node.local.name === 'encase') {
        // @ts-ignore
        if (path.parent.source.value === 'react-jpex') {
          state.found = true;
        }
      }
    }
  },
};

const encase = (
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

  if (callee?.name !== 'encase') {
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

  const arg = path.get('arguments.0') as NodePath<any>;
  const deps = extractFunctionParameterTypes(programPath, arg, filename, publicPath, pathAlias);
  path.node.arguments.splice(0, 0, t.arrayExpression(deps.map((dep) => t.stringLiteral(dep))));
};

export default encase;
