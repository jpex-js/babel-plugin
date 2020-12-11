import { types as t, NodePath } from '@babel/core';

export default function isJpexCall(
  path: NodePath<any>,
  identifier: string[],
  key: string | string[],
) {
  const callee = path.node.callee;
  // must be a member expression i.e. jpex.whatever()
  if (!t.isMemberExpression(callee)) {
    return false;
  }
  // must be a valid identifier i.e. jpex
  // @ts-ignore
  if (!identifier.includes(callee.object.name)) {
    return false;
  }

  if (Array.isArray(key)) {
    // @ts-ignore
    return key.includes(callee.property.name);
  }
  // @ts-ignore
  return callee.property.name === key;
}
