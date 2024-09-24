import React from 'react';
import Animated, {
  FadeInDown,
  FadeOutDown,
  LinearTransition,
} from 'react-native-reanimated';

const AnimatedCell = ({children, ...props}: any) => {
  return (
    <Animated.View
      entering={FadeInDown.springify().damping(12)}
      exiting={FadeOutDown.springify().damping(12)}
      layout={LinearTransition.springify().damping(16)}
      {...props}>
      {children}
    </Animated.View>
  );
};

export default AnimatedCell;
