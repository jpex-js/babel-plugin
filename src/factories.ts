import { types as t, NodePath } from '@babel/core';
import {
  extractFunctionParameterTypes,
  getConcreteTypeName,
  isJpexCall,
  State,
  getTypeParameter,
  getTypeofNode,
  getImplements,
} from './common';

const FACTORY_METHODS = [
  'factory',
  'service',
  'constant',
];

const factories = (
  programPath: NodePath<t.Program>,
  path: NodePath<any>,
  {
    identifier,
    filename,
    publicPath,
    pathAlias,
  }: State,
) => {
  const callee = path.node.callee;
  const args = path.node.arguments;

  if (!isJpexCall(path, identifier, FACTORY_METHODS)) {
    return;
  }

  if (args.length > 2) {
    return;
  }

  // do we have an interface to use as the registrant name?
  // if there is only 1 arg then we can't possibly have been given the name
  // if the first arg isn't a string, then we also don't have a name
  const type = getTypeParameter(path);
  let name: string;
  let aliases: string[];

  if (type == null) {
    name = getTypeofNode(args[0], {
      filename,
      publicPath,
      identifier,
      pathAlias,
    }, programPath);
    if (name) {
      aliases = getImplements(
        args[0],
        filename,
        publicPath,
        pathAlias,
        programPath,
      );
    }
  } else {
    name = getConcreteTypeName(type, filename, publicPath, pathAlias, programPath);
    if (name) {
      aliases = getImplements(
        type,
        filename,
        publicPath,
        pathAlias,
        programPath,
      );
    }
  }

  if (name != null) {
    args.unshift(t.stringLiteral(name));
  }

  // do we need to infer the dependencies?
  // ignore constants as there are no dependencies
  // if the second parameter isn't an array of dependencies, it means it's inferred
  if (callee.property.name !== 'constant') {
    const arg = path.get('arguments.1') as NodePath<any>;
    const deps = extractFunctionParameterTypes(programPath, arg, filename, publicPath, pathAlias);
    path.node.arguments.splice(1, 0, t.arrayExpression(deps.map((dep) => t.stringLiteral(dep))));

    if (aliases != null) {
      const property = t.objectProperty(
        t.stringLiteral('alias'),
        t.arrayExpression(
          aliases.map((alias) => t.stringLiteral(alias)),
        ),
      );
      const arg = args[3];
      if (arg == null) {
        args.push(t.objectExpression([ property ]));
      } else {
        arg.properties.push(property);
      }
    }
  }
};

export default factories;
