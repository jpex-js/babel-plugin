export default {
  files: [ 'tests/*.ts' ],
  extensions: [ 'ts' ],
  require: [ './test-setup.js' ],
  verbose: true,
  babel: {
    compileEnhancements: false,
  },
};
