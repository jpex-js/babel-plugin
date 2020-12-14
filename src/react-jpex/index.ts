import { NodePath, types as t } from '@babel/core';
import { State } from '../common';
import encase from './encase';
import useResolve from './useResolve';

const reactJpex = (
  programPath: NodePath<t.Program>,
  path: NodePath<any>,
  state: State,
) => {
  encase(programPath, path, state);
  useResolve(programPath, path, state);
};

export default reactJpex;
