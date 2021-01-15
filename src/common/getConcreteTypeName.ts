import { types as t, Visitor, NodePath } from '@babel/core';
import { join, dirname } from 'path';
import cache from '../cache';
import { TypeSourceState } from './types';

const shouldUsePublicPath = (state: TypeSourceState, parent: any) => {
  if (!state.publicPath) {
    return false;
  }
  const src = parent?.source?.value?.[0];

  return src === '.' || src === '/' || src == null;
};

const typeSourceVisitor: Visitor<TypeSourceState> = {
  Class(path, state) {
    if (state.name) {
      return;
    }
    const name = path.node.id?.name;
    if (name !== state.typeName) {
      return;
    }
    const key = `${state.filename}/${state.typeName}`;
    if (!cache[key]) {
      const usePublicPath = shouldUsePublicPath(state, null);
      const value = `${usePublicPath ? state.publicPath : state.filename}/${state.typeName}`;
      cache[key] = value;
    }
    state.name = cache[key];
  },
  TSType(path, state) {
    if (state.name) {
      return;
    }
    const parent = path.parent as any;
    const parentName: string = parent?.id?.name;
    if (parentName !== state.typeName) {
      return;
    }
    const key = `${state.filename}/${state.typeName}`;
    if (!cache[key]) {
      const usePublicPath = shouldUsePublicPath(state, parent);
      const value = `${usePublicPath ? state.publicPath : state.filename}/${state.typeName}`;
      cache[key] = value;
    }
    state.name = cache[key];
  },
  TSInterfaceDeclaration(path, state) {
    if (state.name) {
      return;
    }
    if (path.node.id.name !== state.typeName) {
      return;
    }
    // FIXME: not sure what type of node parent is
    const parent = path.parent as any;
    const key = `${state.filename}/${state.typeName}`;
    if (!cache[key]) {
      const usePublicPath = shouldUsePublicPath(state, parent);
      const value = `${usePublicPath ? state.publicPath : state.filename}/${state.typeName}`;
      cache[key] = value;
    }
    state.name = cache[key];
  },
  ImportSpecifier(path, state) {
    if (state.name) {
      return;
    }
    if (path.node.local.name !== state.typeName) {
      return;
    }
    const parent = path.parent as any;
    let source: string = parent.source.value;
    Object.keys(state.pathAlias).forEach((key) => {
      if (source.startsWith(key)) {
        source = source.replace(key, state.pathAlias[key]);
      }
    });
    if (source.charAt(0) === '.') {
      source = join(dirname(state.filename), source);
    }
    const key = `${source}/${path.node.imported.name}`;
    if (!cache[key]) {
      const usePublicPath = shouldUsePublicPath(state, parent);
      const value = usePublicPath ? `${state.publicPath}/${path.node.imported.name}` : key;
      cache[key] = value;
    }
    state.name = cache[key];
  },
};

// given a ts type, we try to find the "actual" name of it, including an appropriate prefix
export default function getConcreteTypeName(
  typeNode: t.Node,
  filename: string,
  publicPath: string,
  pathAlias: { [key: string]: string },
  programPath: NodePath<t.Program>,
) {
  // for a type reference we need to find where it is declared first
  if (t.isTSTypeReference(typeNode) || t.isTSExpressionWithTypeArguments(typeNode)) {
    // @ts-ignore
    const name: string = typeNode.typeName?.name ?? typeNode.expression?.name;
    if (name == null) {
      return null;
    }

    // if we're dealing with a node module or global type, we can resolve it right here
    if (name === 'NodeModule' || name === 'Global') {
      const param: any = typeNode.typeParameters?.params?.[0];
      const value = param?.literal?.value;
      if (value) {
        if (name === 'Global') {
          return `type:global:${value}`;
        }
        return value;
      }
    }

    // we need to traverse the file to find the type declaration
    const state: TypeSourceState = {
      filename,
      publicPath,
      pathAlias,
      typeName: name,
      name: <string>null,
    };
    programPath.traverse(typeSourceVisitor, state);
    if (state.name) {
      return `type:${state.name}`;
    }
    // we have an actual type but we can't find it in the file
    // presumably it's a global type...
    return `type:global:${name}`;
  }
  // classes are like magic snowflakes that can be used as both concretes and types
  if (t.isClass(typeNode) || t.isClassExpression(typeNode)) {
    const name = typeNode.id.name;
    const key = `${filename}/${name}`;
    if (!cache[key]) {
      const usePublicPath = shouldUsePublicPath({
        publicPath,
        pathAlias,
        filename: null,
        typeName: null,
        name: null,
      }, null);
      const value = `${usePublicPath ? publicPath : filename}/${name}`;
      cache[key] = value;
    }
    return `type:${cache[key]}`;
  }
  if (t.isTSTypeLiteral(typeNode) || t.isTSFunctionType(typeNode)) {
    throw new Error('Currently registering with a literal type is not supported');
  }
}
