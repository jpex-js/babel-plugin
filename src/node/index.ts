import { NodePath, types as t } from '@babel/core';
import { State } from '../common';
import encase from './encase';
import resolve from './resolve';
import resolveWith from './resolveWith';
import defer from './defer';

const node = (
  programPath: NodePath<t.Program>,
  path: NodePath<any>,
  state: State
) => {
  encase(programPath, path, state);
  defer(programPath, path, state);
  resolve(programPath, path, state);
  resolveWith(programPath, path, state);
};

export default node;
