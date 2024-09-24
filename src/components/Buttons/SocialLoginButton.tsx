import AppleIcon from '@/assets/icons/AppleIcon.svg';
import GoogleIcon from '@/assets/icons/GoogleIcon.svg';
import React, {useMemo} from 'react';
import {StyleSheet, View} from 'react-native';
import IconProvider from '../IconProvider';
import MainText from '../MainText';
import ScaleButton from './ScaleButton';
import {SocialButtonProps} from './types';

const SocialLoginButton = ({type, onPress}: SocialButtonProps) => {
  const Icon = useMemo(() => {
    if (type == 'google') {
      return GoogleIcon;
    }

    return AppleIcon;
  }, [type]);

  return (
    <ScaleButton
      onPress={() => onPress(type)}
      isHaptic
      activeScale={0.98}
      style={styles.container}>
      <IconProvider Icon={Icon} scale={type == 'google' ? 0.85 : 0.9} />

      <View style={{alignItems: 'center'}}>
        <MainText color="#fff" size={16.6} weight="semiBold">
          {type == 'google' ? 'Sigin with Google' : 'Sigin with Apple'}
        </MainText>
      </View>
    </ScaleButton>
  );
};

export default SocialLoginButton;

const styles = StyleSheet.create({
  container: {
    height: 52,
    paddingHorizontal: 20,
    flexDirection: 'row',
    borderRadius: 20,
    borderWidth: 1.1,
    borderColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
});
