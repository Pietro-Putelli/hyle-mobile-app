import * as Localization from 'expo-localization';

export const supportedLanguages = ['en', 'it', 'es', 'fr'];

export const getSystemLanguage = () => {
  const locales = Localization.getLocales();
  let prefferedLanguage: string = locales[0].languageCode ?? 'en';

  return prefferedLanguage;
};
