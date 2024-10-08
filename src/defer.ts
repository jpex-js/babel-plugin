import { types as t, NodePath } from '@babel/core';
import {
  getConcreteTypeName,
  isJpexCall,
  getTypeParameter,
  State,
} from './common';

const defer = (
  programPath: NodePath<t.Program>,
  path: NodePath<any>,
  { identifier, filename, publicPath, pathAlias }: State
) => {
  const args = path.node.arguments;

  if (!isJpexCall(path, identifier, [ 'defer' ])) {
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
};

export default defer;
