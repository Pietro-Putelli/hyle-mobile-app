import React from 'react';
import {FadeAnimatedView} from '../Animations';
import MainText from '../MainText';
import {useTranslation} from 'react-i18next';

const SearchPlaceholder = () => {
  const {t} = useTranslation('Placeholders');

  return (
    <FadeAnimatedView
      style={{
        marginTop: 32,
        alignItems: 'center',
        marginHorizontal: 16,
      }}>
      <MainText align="center">{t('search')}</MainText>
    </FadeAnimatedView>
  );
};

export default SearchPlaceholder;
