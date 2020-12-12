import { types as t, NodePath, Visitor } from '@babel/core';
import getConcreteTypeName from './getConcreteTypeName';
import { State } from './types';

const visitor: Visitor<{
  name: string,
  typeName: string,
  filename: string,
  publicPath: string,
  programPath: NodePath<t.Program>,
}> = {
  Class(path, state) {
    if (path.node.id?.name === state.typeName) {
      state.name = getConcreteTypeName(
        path.node,
        state.filename,
        state.publicPath,
        state.programPath,
      );
    }
  },
};


export default function getTypeofNode(
  node: any,
  {
    filename,
    publicPath,
  }: State,
  programPath: NodePath<t.Program>,
): string {
  if (t.isIdentifier(node)) {
    const state = {
      name: <string>null,
      typeName: node.name,
      filename,
      publicPath,
      programPath,
    };
    programPath.traverse(visitor, state);
    return state.name;
  }
  if (t.isClassExpression(node)) {
    return getConcreteTypeName(node, filename, publicPath, programPath);
  }
}
