import { types as t, NodePath } from '@babel/core';

export default function getTypeParameter(path: NodePath<any>, i = 0): t.Node {
  return path.node?.typeParameters?.params?.[i];
}
