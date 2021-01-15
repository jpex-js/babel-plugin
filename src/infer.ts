import { types as t, NodePath } from '@babel/core';
import {
  getConcreteTypeName,
  isJpexCall,
  State,
  getTypeParameter,
} from './common';

const infer = (
  programPath: NodePath<t.Program>,
  path: NodePath<any>,
  {
    identifier,
    filename,
    publicPath,
    pathAlias,
  }: State,
) => {
  if (!isJpexCall(path, identifier, 'infer')) {
    return;
  }

  const type = getTypeParameter(path);
  const name = getConcreteTypeName(type, filename, publicPath, pathAlias, programPath);

  if (name != null) {
    path.replaceWith(
      t.stringLiteral(name)
    );
  }
};

export default infer;
