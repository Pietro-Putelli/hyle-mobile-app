import React from 'react';
import {Dimensions} from 'react-native';
import Animated, {
  SlideInLeft,
  interpolate,
  useAnimatedStyle,
} from 'react-native-reanimated';

const {width, height} = Dimensions.get('window');
const CELL_HEIGHT = height * 0.8;

const AnimatedCellWrapper = ({selected, index, scrollX, children}: any) => {
  const animatedStyle = useAnimatedStyle(() => {
    const inputValue = [
      (index - 1) * width,
      index * width,
      (index + 1) * width,
    ];

    const scaleOutputValue = [0.9, 1, 0.9];

    return {
      transform: [
        {
          scale: interpolate(scrollX.value, inputValue, scaleOutputValue),
        },
      ],
    };
  });

  return (
    <Animated.View
      entering={
        selected == index ? SlideInLeft.springify().damping(16) : undefined
      }
      style={[
        {
          width,
          alignItems: 'center',
          justifyContent: 'center',
        },
        animatedStyle,
      ]}>
      {children}
    </Animated.View>
  );
};

export default AnimatedCellWrapper;
