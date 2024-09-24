import NegativeDoneIcon from '@/assets/icons/NegativeDoneIcon.svg';
import NegativeErrorIcon from '@/assets/icons/NegativeErrorIcon.svg';
import useTheme from '@/hooks/useTheme';
import * as Haptic from 'expo-haptics';
import React, {useEffect} from 'react';
import {View} from 'react-native';
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import MainText from '../MainText';
import styles from './styles';
import {ToastViewProps} from './types';

const ToastView = ({
  title,
  setInfo,
  isSucceded = true,
  isVisible,
}: ToastViewProps) => {
  const theme = useTheme();
  const insets = useSafeAreaInsets();

  const translateY = useSharedValue(-300);

  useEffect(() => {
    if (isVisible) {
      setTimeout(() => {
        Haptic.impactAsync(Haptic.ImpactFeedbackStyle.Light);
      }, 0);

      translateY.value = withSequence(
        withSpring(0, {damping: 16}),
        withDelay(
          2000,
          withTiming(-300, {duration: 300}, () => {
            runOnJS(setInfo)({isVisible: false});
          }),
        ),
      );
    }
  }, [isVisible]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{translateY: translateY.value}],
    };
  });

  return (
    <Animated.View style={[styles.container, animatedStyle, {top: insets.top}]}>
      <View
        style={[styles.content, {backgroundColor: theme.colors.background3}]}>
        {isSucceded ? <NegativeDoneIcon /> : <NegativeErrorIcon />}

        <MainText uppercase weight="semiBold" size={15}>
          {title}
        </MainText>
      </View>
    </Animated.View>
  );
};

export default ToastView;
