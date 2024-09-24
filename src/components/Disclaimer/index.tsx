import InfoIcon from '@/assets/icons/InfoIcon.svg';
import useTheme from '@/hooks/useTheme';
import React from 'react';
import {View} from 'react-native';
import MainText from '../MainText';
import IconProvider from '../IconProvider';

const Disclaimer = ({content, style}: any) => {
  const theme = useTheme();

  return (
    <View
      style={{flexDirection: 'row', gap: 8, alignItems: 'center', ...style}}>
      <IconProvider
        Icon={InfoIcon}
        color={theme.colors.lightText}
        scale={0.8}
      />

      <MainText size={10} style={{color: theme.colors.lightText, flex: 1}}>
        {content}
      </MainText>
    </View>
  );
};

export default Disclaimer;
