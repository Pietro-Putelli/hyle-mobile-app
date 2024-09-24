const {getDefaultConfig: getExpoDefaultConfig} = require('expo/metro-config');
const {getDefaultConfig, mergeConfig} = require('@react-native/metro-config');

const config = getExpoDefaultConfig(__dirname);

const {transformer, resolver} = config;

config.transformer = {
  ...transformer,
  babelTransformerPath: require.resolve('react-native-svg-transformer'),
  assetPlugins: ['expo-asset/tools/hashAssetFiles'],
};

config.resolver = {
  ...resolver,
  assetExts: resolver.assetExts.filter(ext => ext !== 'svg'),
  sourceExts: [...resolver.sourceExts, 'svg'],
};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);

// const {getDefaultConfig: getExpoDefaultConfig} = require('expo/metro-config');
// const {getDefaultConfig, mergeConfig} = require('@react-native/metro-config');

// /**
//  * Metro configuration
//  * https://facebook.github.io/metro/docs/configuration
//  *
//  * @type {import('metro-config').MetroConfig}
//  */

// const expoConfig = getExpoDefaultConfig(__dirname);

// const config = {
//   transformer: {
//     babelTransformerPath: require.resolve('react-native-svg-transformer'),
//   },
//   resolver: {
//     assetExts: expoConfig.resolver.assetExts.filter(ext => ext !== 'svg'),
//     sourceExts: [...resolver.sourceExts, 'svg'],
//   },
// };

// module.exports = mergeConfig(
//   getDefaultConfig(__dirname),
//   getExpoDefaultConfig(__dirname),
//   config,
// );
