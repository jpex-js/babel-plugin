import { types as t, Visitor, NodePath } from '@babel/core';
import getConcreteTypeName from './getConcreteTypeName';

const tsTypeAnnotationVisitor: Visitor<{
  key: string,
  filename: string,
  publicPath: string,
  pathAlias: { [key: string]: string },
  programPath: NodePath<t.Program>
}> = {
  TSTypeAnnotation(path, state) {
    const name = getConcreteTypeName(
      path.node.typeAnnotation,
      state.filename,
      state.publicPath,
      state.pathAlias,
      state.programPath,
    );
    state.key = name == null ? 'unknown' : name;
  },
};

const getFunctionParams = (
  // eslint-disable-next-line max-len
  path: NodePath<t.ClassMethod> | NodePath<t.ArrowFunctionExpression> | NodePath<t.FunctionDeclaration> | NodePath<t.FunctionExpression>,
  deps: string[],
  filename: string,
  publicPath: string,
  pathAlias: { [key: string]: string },
  programPath: NodePath<t.Program>,
) => {
  [].concat(path.get('params')).forEach((path) => {
    const ctx = {
      key: path.node.name,
      filename,
      programPath,
      publicPath,
      pathAlias,
    };
    path.traverse(tsTypeAnnotationVisitor, ctx);
    deps.push(ctx.key);
  });
};

const classConstructorVisitor: Visitor<{
  deps: string[],
  filename: string,
  programPath: NodePath<t.Program>,
  publicPath: string,
  pathAlias: { [key: string]: string },
}> = {
  ClassMethod(path, state) {
    const { deps, filename, programPath, publicPath, pathAlias } = state;
    // @ts-ignore
    if (path.node.key.name === 'constructor') {
      getFunctionParams(path, deps, filename, publicPath, pathAlias, programPath);
    }
  },
};

const linkedVariableVisitor: Visitor<{
  deps: string[],
  name: string,
  filename: string,
  publicPath: string,
  pathAlias: { [key: string]: string },
  programPath: NodePath<t.Program>,
}> = {
  Class(path, state) {
    const {
      deps,
      name,
      filename,
      programPath,
      publicPath,
      pathAlias,
    } = state;
    if (path.node.id?.name === name) {
      path.traverse(classConstructorVisitor, {
        deps,
        filename,
        programPath,
        publicPath,
        pathAlias,
      });
    }
  },
  ArrowFunctionExpression(path, state) {
    const { deps, name, filename, programPath, publicPath, pathAlias } = state;
    const { parent } = path;
    // @ts-ignore
    if (parent?.id?.name === name) {
      getFunctionParams(path, deps, filename, publicPath, pathAlias, programPath);
    }
  },
  FunctionDeclaration(path, state) {
    const { deps, name, filename, programPath, publicPath, pathAlias } = state;
    const { node } = path;
    if (node && node.id && node.id.name === name) {
      getFunctionParams(path, deps, filename, publicPath, pathAlias, programPath);
    }
  },
  FunctionExpression(path, state) {
    const { deps, name, filename, programPath, publicPath, pathAlias } = state;
    const { parent } = path;
    // @ts-ignore
    if (parent?.id?.name === name) {
      getFunctionParams(path, deps, filename, publicPath, pathAlias, programPath);
    }
  },
};

export default function extractFunctionParameterTypes(
  programPath: NodePath<t.Program>,
  arg: NodePath<any>,
  filename: string,
  publicPath: string,
  pathAlias: { [key: string]: string },
) {
  const deps: string[] = [];
  const state = {
    deps,
    programPath,
    filename,
    publicPath,
    pathAlias,
  };
  if (t.isIdentifier(arg)) {
    programPath.traverse(linkedVariableVisitor, Object.assign({ name: arg.node.name }, state));
  } else if (t.isClass(arg)) {
    arg.traverse(classConstructorVisitor, state);
  } else if (t.isArrowFunctionExpression(arg)) {
    getFunctionParams(arg, deps, filename, publicPath, pathAlias, programPath);
  } else if (t.isFunctionExpression(arg)) {
    getFunctionParams(arg, deps, filename, publicPath, pathAlias, programPath);
  }
  return deps;
}
