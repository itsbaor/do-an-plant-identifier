module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    [
      /** Plugin to use short import */
      'babel-plugin-root-import',
      {
        rootPathSuffix: './src',
        rootPathPrefix: '~/',
      },
    ],
    // '@babel/plugin-transform-optional-chaining',
    'react-native-reanimated/plugin',
  ],
  env: {
    production: {
      plugins: ['react-native-paper/babel', 'transform-remove-console'],
    },
  },
};
