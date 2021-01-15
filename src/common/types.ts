export interface State {
  // the object on which the jpex properties exist
  // i.e. [ 'jpex', 'ioc' ]
  identifier: string[],
  // the name of the currently-processed file
  filename: string,
  // a public path (if set) to use instead of a full file name
  publicPath: string,
  // aliases
  pathAlias: {
    [key: string]: string,
  },
}

export interface TypeSourceState {
  typeName: string,
  filename: string,
  publicPath: string,
  name: string,
  pathAlias: {
    [key: string]: string,
  },
}
