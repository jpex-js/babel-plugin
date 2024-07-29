import { NodePath, types as t, Visitor } from '@babel/core';
import { getConcreteTypeName, getTypeParameter, State } from '../common';

const importVisitor: Visitor<{
  found: boolean;
}> = {
  ImportSpecifier(path, state) {
    if (path.node.imported.name === 'useResolveWith') {
      if (path.node.local.name === 'useResolveWith') {
        if (
          // @ts-ignore
          path.parent.source.value === 'react-jpex' ||
          // @ts-ignore
          path.parent.source.value === '@jpex-js/vue'
        ) {
          state.found = true;
        }
      }
    }
  },
};

const useResolveWith = (
  programPath: NodePath<t.Program>,
  path: NodePath<any>,
  { filename, publicPath, pathAlias }: State
) => {
  const callee = path.node.callee;
  const args = path.node.arguments;

  if (callee?.name !== 'useResolveWith') {
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
  const name = getConcreteTypeName(
    type,
    filename,
    publicPath,
    pathAlias,
    programPath
  );
  if (name != null) {
    args.unshift(t.stringLiteral(name));
  } else if (t.isTSTypeLiteral(type) || t.isTSFunctionType(type)) {
    throw new Error('Currently resolving with a literal type is not supported');
  }

  if (!t.isArrayExpression(args[1])) {
    return;
  }

  const namedDependencies: t.ObjectProperty[] = [];
  let i = 1;
  let namedType = getTypeParameter(path, i);
  while (namedType) {
    const name = getConcreteTypeName(
      namedType,
      filename,
      publicPath,
      pathAlias,
      programPath
    );
    if (name != null) {
      const value = args[1].elements[i - 1];
      const key = t.stringLiteral(name);
      // @ts-ignore
      const prop = t.objectProperty(key, value);
      namedDependencies.push(prop);
    } else if (t.isTSTypeLiteral(type) || t.isTSFunctionType(type)) {
      throw new Error(
        'Currently resolving with a literal type is not supported'
      );
    }
    // eslint-disable-next-line no-plusplus
    namedType = getTypeParameter(path, ++i);
  }

  args.splice(1, 1, t.objectExpression(namedDependencies));
};

export default useResolveWith;
