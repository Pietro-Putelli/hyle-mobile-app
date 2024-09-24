import {MainButton} from '@/components/Buttons';
import {ModalContainer} from '@/components/Containers';
import MainText from '@/components/MainText';
import React from 'react';
import {useTranslation} from 'react-i18next';
import {Image, View} from 'react-native';

const Help = () => {
  const {t} = useTranslation();

  return (
    <ModalContainer title="Help">
      <View style={{alignItems: 'center', marginTop: 24}}>
        <Image
          source={require('@/assets/pictures/help.png')}
          style={{width: 200, height: 200, resizeMode: 'contain'}}
        />
      </View>

      <View style={{marginTop: 32, marginHorizontal: 16, gap: 24}}>
        <MainText align="center">{t('Help:main')}</MainText>

        <MainButton
          type="primary"
          title={t('Actions:contactUs')}
          onPress={() => {}}
        />
      </View>
    </ModalContainer>
  );
};

export default Help;
