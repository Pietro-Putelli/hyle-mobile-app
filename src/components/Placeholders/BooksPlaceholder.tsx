import React from 'react';
import {Dimensions, Image, StyleSheet} from 'react-native';
import {FadeAnimatedView} from '../Animations';
import MainText from '../MainText';
import {useTranslation} from 'react-i18next';

const {height} = Dimensions.get('window');

const BooksPlaceholder = () => {
  const {t} = useTranslation('Placeholders');

  return (
    <FadeAnimatedView style={styles.container}>
      <Image
        style={styles.picture}
        source={require('@/assets/pictures/pic-4.png')}
      />

      <MainText align="center" size={18}>
        {t('books')}
      </MainText>
    </FadeAnimatedView>
  );
};

export default BooksPlaceholder;

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginHorizontal: 32,
    gap: 16,
    height: height * 0.7,
    justifyContent: 'center',
  },
  picture: {
    width: 210,
    height: 210,
    resizeMode: 'contain',
  },
});
