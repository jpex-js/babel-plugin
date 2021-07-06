import { NodePath, types as t } from '@babel/core';
import { State } from '../common';
import encase from './encase';
import resolve from './resolve';

const node = (
  programPath: NodePath<t.Program>,
  path: NodePath<any>,
  state: State,
) => {
  encase(programPath, path, state);
  resolve(programPath, path, state);
};

export default node;
