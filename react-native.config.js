// react-native.config.js
module.exports = {
  project: {
    ios: {},
    android: {},
  },
  assets: ['./src/assets/fonts/'],
  dependencies: {
    'local-rn-library': {
      root: '/root/libraries',
    },
  },
};
