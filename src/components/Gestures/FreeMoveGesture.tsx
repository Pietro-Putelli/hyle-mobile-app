import React from 'react';
import {Dimensions} from 'react-native';
import {Gesture, GestureDetector} from 'react-native-gesture-handler';
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSpring,
} from 'react-native-reanimated';
import {snapPoint} from 'react-native-redash';

const {width, height} = Dimensions.get('window');

const DISMISS_SNAP_POINT = height * 0.6;

const FreeMoveGesture = ({children, onDismiss, ...props}: any) => {
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);

  const _onDismiss = () => {
    setTimeout(() => {
      onDismiss();
    }, 200);
  };

  const panGesture = Gesture.Pan()
    .onUpdate(({translationX, translationY}) => {
      translateX.value = translationX;
      translateY.value = translationY;
    })
    .onEnd(({translationY, velocityY, velocityX}) => {
      const goBackY =
        snapPoint(translationY, velocityY, [0, DISMISS_SNAP_POINT]) ===
        DISMISS_SNAP_POINT;

      if (goBackY) {
        runOnJS(_onDismiss)();

        translateY.value = withSpring(height, {
          damping: 16,
          velocity: velocityY,
        });

        const velocityXSign = Math.sign(velocityX);

        translateX.value = withSpring(velocityXSign * width, {
          damping: 16,
          velocity: velocityX,
        });
      } else {
        translateX.value = withSpring(0, {damping: 16, velocity: velocityX});
        translateY.value = withSpring(0, {damping: 16, velocity: velocityY});
      }
    });

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {translateX: translateX.value},
        {translateY: translateY.value},
      ],
    };
  });

  return (
    <GestureDetector gesture={panGesture}>
      <Animated.View {...props} style={animatedStyle}>
        {children}
      </Animated.View>
    </GestureDetector>
  );
};

export default FreeMoveGesture;
