import React, {useEffect} from 'react';
import {Dimensions} from 'react-native';
import {Gesture, GestureDetector} from 'react-native-gesture-handler';
import Animated, {
  runOnJS,
  useAnimatedKeyboard,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

type ModalGestureProps = {
  isVisible: boolean;
  avoidKeyboard?: boolean;
  children: React.ReactNode;
  onClose: () => void;
};

const {height} = Dimensions.get('window');

const HIDDEN_Y = height;

const ModalGesture = ({
  avoidKeyboard,
  isVisible,
  children,
  onClose,
}: ModalGestureProps) => {
  const keyboard = useAnimatedKeyboard();
  const yVisibleKeyboard = -keyboard.height.value;

  const translateY = useSharedValue(HIDDEN_Y);

  const yOrigin = avoidKeyboard ? yVisibleKeyboard : 0;

  const _onClose = () => {
    translateY.value = withTiming(HIDDEN_Y, {duration: 400});

    setTimeout(() => {
      onClose();
    }, 100);
  };

  const panGesture = Gesture.Pan()
    .onChange(({translationY}) => {
      if (translationY > 0) {
        translateY.value = yOrigin + translationY / 1.5;
      } else {
        translateY.value = yOrigin + translationY / 16;
      }
    })
    .onEnd(({translationY}) => {
      if (translationY > 50) {
        runOnJS(_onClose)();
      } else {
        translateY.value = withSpring(yOrigin);
      }
    });

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{translateY: translateY.value}],
    };
  });

  useEffect(() => {
    if (isVisible) {
      translateY.value = withSpring(yOrigin, {
        damping: 16,
      });
    } else {
      translateY.value = withTiming(HIDDEN_Y, {duration: 400});
    }
  }, [isVisible]);

  return (
    <GestureDetector gesture={panGesture}>
      <Animated.View style={[animatedStyle, {zIndex: 1}]}>
        {children}
      </Animated.View>
    </GestureDetector>
  );
};

export default ModalGesture;
