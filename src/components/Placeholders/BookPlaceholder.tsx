import React from 'react';
import {useTranslation} from 'react-i18next';
import {Image, StyleSheet} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {FadeAnimatedView} from '../Animations';
import Loader from '../Loader';
import MainText from '../MainText';

const BookPlaceholder = () => {
  const insets = useSafeAreaInsets();
  const {t} = useTranslation('Placeholders');

  return (
    <FadeAnimatedView
      style={[styles.container, {paddingBottom: insets.bottom + 24}]}>
      <Image
        style={styles.picture}
        source={require('@/assets/pictures/pic-5.png')}
      />
      <MainText
        style={{marginBottom: 20}}
        align="center"
        size={20}
        weight="semiBold">
        {t('book')}
      </MainText>

      <Loader isActive size={32} />
    </FadeAnimatedView>
  );
};

export default BookPlaceholder;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 48,
  },
  picture: {
    width: 250,
    resizeMode: 'contain',
  },
});
