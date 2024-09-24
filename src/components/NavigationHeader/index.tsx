import React from 'react';
import {View} from 'react-native';
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedStyle,
} from 'react-native-reanimated';
import {ScaleButton} from '../Buttons';
import IconProvider from '../IconProvider';
import MainText from '../MainText';
import styles from './styles';
import {NavigationHeaderProps} from './types';
import Logo from '@/assets/Logo.svg';
import ChevronDownIcon from '@/assets/icons/ChevronDownIcon.svg';
import {TouchableWithoutFeedback} from 'react-native-gesture-handler';

const NavigationHeader = ({
  title,
  showLogo,
  scrollY,
  leftIcon: LeftIcon,
  isLeftDisabled,
  isLeftHaptic,
  rightIcon: RightIcon,
  isRightHaptic,
  isRightDisabled,
  onLeftPress,
  onRightPress,
  RightComponent,
  isModal,
  onPress,
}: NavigationHeaderProps) => {
  const animatedStyle = useAnimatedStyle(() => {
    if (scrollY) {
      return {
        opacity: interpolate(
          scrollY.value,
          [0, 100],
          [0, 1],
          Extrapolation.CLAMP,
        ),
        transform: [
          {
            translateY: interpolate(
              scrollY.value,
              [0, 100],
              [4, 0],
              Extrapolation.CLAMP,
            ),
          },
        ],
      };
    }

    return {
      opacity: 1,
    };
  });

  return (
    <View style={styles.container}>
      <ScaleButton
        onPress={onLeftPress}
        isHaptic={isLeftHaptic}
        style={styles.iconContainer}
        disabled={isLeftDisabled}>
        {LeftIcon && !isModal && <IconProvider Icon={LeftIcon} />}
        {isModal && <IconProvider Icon={ChevronDownIcon} />}
      </ScaleButton>

      {title && (
        <Animated.View style={[animatedStyle, {flex: 1}]}>
          <TouchableWithoutFeedback onPress={onPress}>
            <MainText align="center" size={18} numberOfLines={1}>
              {title}
            </MainText>
          </TouchableWithoutFeedback>
        </Animated.View>
      )}

      {showLogo && (
        <Animated.View style={styles.logo}>
          <Logo />
        </Animated.View>
      )}
      {RightComponent ? (
        <View style={[styles.iconContainer, {alignItems: 'flex-end'}]}>
          {RightComponent}
        </View>
      ) : (
        <ScaleButton
          disabled={isRightDisabled}
          onPress={onRightPress}
          isHaptic={isRightHaptic}
          style={[styles.iconContainer, {alignItems: 'flex-end'}]}>
          {RightIcon && <IconProvider Icon={RightIcon} />}
        </ScaleButton>
      )}
    </View>
  );
};

export default NavigationHeader;
