import React from 'react';
import Animated, {
  useAnimatedKeyboard,
  useAnimatedStyle,
} from 'react-native-reanimated';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

const KeyboardAvoidingView = ({children}: any) => {
  const keyboard = useAnimatedKeyboard();
  const insets = useSafeAreaInsets();

  const translateStyle = useAnimatedStyle(() => {
    return {
      transform: [{translateY: -keyboard.height.value + insets.bottom}],
    };
  });

  return <Animated.View style={translateStyle}>{children}</Animated.View>;
};

export default KeyboardAvoidingView;
