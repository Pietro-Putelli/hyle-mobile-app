module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    ['module:react-native-dotenv'],
    [
      'module-resolver',
      {
        alias: {
          '@/components': './src/components',
          '@/assets': './src/assets',
          '@/screens': './src/screens',
          '@/modals': './src/modals',
          '@/constants': './src/constants',
          '@/types': './src/types',
          '@/hooks': './src/hooks',
          '@/utils': './src/utils',
          '@/storage': './src/storage',
          '@/navigation': './src/navigation',
          '@/auth': './src/auth',
          '@/data': './src/data',
          '@/api': './src/api',
          '@/i18n': './src/i18n',
        },
      },
    ],
    'react-native-reanimated/plugin',
    '@babel/plugin-transform-export-namespace-from',
  ],
};
