import i18n from 'i18next';
import {initReactI18next} from 'react-i18next';

import {getSystemLanguage, supportedLanguages} from './config';
import en from './locales/en.json';
import es from './locales/es.json';
import it from './locales/it.json';

const resources = {en: en, it: it, es: es};

let prefferedLanguage: string = getSystemLanguage();

if (!supportedLanguages.includes(prefferedLanguage)) {
  prefferedLanguage = 'en';
}

i18n.use(initReactI18next).init({
  compatibilityJSON: 'v3',
  resources,
  lng: prefferedLanguage,
});

export default i18n;
