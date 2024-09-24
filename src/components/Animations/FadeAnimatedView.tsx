import React, {memo, useMemo} from 'react';
import {View} from 'react-native';
import Animated, {
  FadeIn,
  FadeInDown,
  FadeInUp,
  FadeOut,
  FadeOutDown,
  SlideInLeft,
  SlideInRight,
} from 'react-native-reanimated';

type FadeAnimatedViewProps = View['props'] & {
  children: React.ReactNode;
  mode?: 'fade-up' | 'fade-down' | 'fade-left' | 'fade-right' | 'fade';
  delay?: number;
  exitingDelay?: number;
  duration?: number;
  disabled?: boolean;
  damping?: number;
};

const FadeAnimatedView = ({
  children,
  mode,
  delay = 200,
  exitingDelay = 0,
  duration = 400,
  disabled,
  damping = 16,
  ...props
}: FadeAnimatedViewProps) => {
  const options = useMemo(() => {
    switch (mode) {
      case 'fade-up':
        return {
          entering: FadeInUp.damping(damping).delay(delay).springify(),
          exiting: FadeOut.damping(damping).delay(exitingDelay).springify(),
        };
      case 'fade-left':
        return {
          entering: SlideInRight.springify().damping(16),
          exiting: FadeOut.duration(0),
        };
      case 'fade-right':
        return {
          entering: SlideInLeft.springify().damping(16),
          exiting: FadeOut.duration(0),
        };
      case 'fade':
        return {
          entering: FadeIn.duration(duration).delay(delay),
          exiting: FadeOut.duration(duration).delay(exitingDelay),
        };
      default:
        return {
          entering: FadeInDown.damping(damping).delay(delay).springify(),
          exiting: FadeOutDown.damping(damping).delay(exitingDelay).springify(),
        };
    }
  }, [mode]);

  if (disabled) {
    return <View {...props}>{children}</View>;
  }

  return (
    <Animated.View {...options} {...props}>
      {children}
    </Animated.View>
  );
};

export default memo(FadeAnimatedView);
