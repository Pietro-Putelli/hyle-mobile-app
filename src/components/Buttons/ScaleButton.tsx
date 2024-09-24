import * as Haptic from 'expo-haptics';
import React, {useRef} from 'react';
import Animated, {useAnimatedStyle, withTiming} from 'react-native-reanimated';
import TouchableScale from 'react-native-touchable-scale';
import {ScaleButtonProps} from './types';

const ScaleButton = ({
  style,
  outerStyle,
  isHaptic,
  children,
  onPress,
  disabled,
  disableWithoutOpacity,
  activeScale,
  throttleValue = 500,
  ...props
}: ScaleButtonProps) => {
  const _disabled = disabled || disableWithoutOpacity;

  const isPressed = useRef(false);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: withTiming(disabled ? 0.5 : 1, {duration: 300}),
    };
  });

  const _onPress = () => {
    if (isPressed.current) {
      return;
    }

    isPressed.current = true;

    if (isHaptic) {
      Haptic.impactAsync(Haptic.ImpactFeedbackStyle.Medium);
    }

    onPress?.();

    setTimeout(() => {
      isPressed.current = false;
    }, throttleValue);
  };

  return (
    <TouchableScale
      onPress={_onPress}
      activeScale={activeScale}
      tension={1}
      friction={10}
      disabled={_disabled}
      style={outerStyle}
      {...props}>
      <Animated.View style={[animatedStyle, style]}>{children}</Animated.View>
    </TouchableScale>
    // <GestureDetector gesture={tapGesture}>
    //   <Animated.View style={[animatedStyle, style]}>{children}</Animated.View>
    // </GestureDetector>
  );
};

export default ScaleButton;
