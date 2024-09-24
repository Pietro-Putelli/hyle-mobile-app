// list main languages locales, at least 10

import {getFlagEmoji} from '@/utils/strings';

type LocaleProps = {
  code: string;
  name?: string;
  flag?: string;
  locale: string;
};

const getAvailableLanguages = (t: any): LocaleProps[] => {
  return [
    {
      locale: 'en',
      code: 'en-GB',
      name: t('Common:languages.en'),
    },
    {
      locale: 'it',
      code: 'it-IT',
      name: t('Common:languages.it'),
    },
    {
      locale: 'es',
      code: 'es-ES',
      name: t('Common:languages.es'),
    },
  ].map(language => {
    return {
      ...language,
      locale: language.code.split('-')[0],
      code: language.code,
      flag: getFlagEmoji(language.code.split('-')[1]),
    };
  });
};

export default getAvailableLanguages;
