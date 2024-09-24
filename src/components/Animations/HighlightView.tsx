import React, {useEffect} from 'react';
import {StyleSheet, View, ViewProps} from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

interface HighlightViewProps extends ViewProps {
  isHighlighted: boolean;
  onEnd?: () => void;
}

const HighlightView = ({
  isHighlighted,
  children,
  style,
  onEnd,
  ...props
}: HighlightViewProps) => {
  const backgroundColor = useSharedValue('transparent');

  useEffect(() => {
    if (isHighlighted) {
      backgroundColor.value = withDelay(
        200,
        withSequence(
          withTiming('#D9D9D930', {
            duration: 400,
            easing: Easing.inOut(Easing.ease),
          }),
          withTiming('transparent', {
            duration: 400,
            easing: Easing.inOut(Easing.ease),
          }),
        ),
      );

      setTimeout(() => {
        onEnd?.();
      }, 800);
    }
  }, [isHighlighted]);

  const animatedStyle = useAnimatedStyle(() => {
    return {backgroundColor: backgroundColor.value};
  });

  return (
    <Animated.View style={style} {...props}>
      {children}

      {isHighlighted && (
        <Animated.View style={[StyleSheet.absoluteFillObject, animatedStyle]} />
      )}
    </Animated.View>
  );
};

export default HighlightView;
