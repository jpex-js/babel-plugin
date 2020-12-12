import { types as t, NodePath, Visitor } from '@babel/core';
import { getConcreteTypeName } from '.';

const visitor: Visitor<{
  aliases: string[],
  typeName: string,
  filename: string,
  publicPath: string,
  programPath: any,
}> = {
  Class(path, state) {
    if (path.node.id?.name === state.typeName) {
      const aliases = path.node.implements?.map((node: any) => {
        return getConcreteTypeName(
          node,
          state.filename,
          state.publicPath,
          state.programPath,
        );
      })
        .filter(Boolean);
      if (aliases?.length) {
        state.aliases = aliases;
      }
    }
  },
};

export default function getImplements(
  node: any,
  filename: string,
  publicPath: string,
  programPath: NodePath<t.Program>,
): string[] {
  if (t.isIdentifier(node)) {
    const state = {
      aliases: <string[]>null,
      typeName: node.name,
      filename,
      publicPath,
      programPath,
    };
    programPath.traverse(visitor, state);
    return state.aliases;
  }
  if (t.isClassExpression(node)) {
    const aliases = node.implements?.map((node: any) => {
      return getConcreteTypeName(
        node,
        filename,
        publicPath,
        programPath,
      );
    }).filter(Boolean);
    return aliases?.length ? aliases : null;
  }
}
