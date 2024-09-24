import * as Haptic from 'expo-haptics';
import {isUndefined} from 'lodash';
import React, {memo} from 'react';
import {Dimensions, View} from 'react-native';
import {Gesture, GestureDetector} from 'react-native-gesture-handler';
import Animated, {
  Extrapolation,
  interpolate,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import styles from './styles';
import {SwipeableContainerProps} from './types';
import IconProvider from '../IconProvider';

const {width} = Dimensions.get('window');

const X_LIMIT = width * 0.3;
const MAX_ICON_SIDE = 48;
const MAX_X_SWIPE = width / 6;

const SwipeableContainer = ({
  onSwipeLeft,
  onSwipeRight,
  style,
  disabled,
  children,
  activeOffsetX = [-10],
  Icon,
}: SwipeableContainerProps) => {
  const translateX = useSharedValue(0);
  const halfTriggered = useSharedValue(false);

  const _onSwiped = (isLeft: boolean) => {
    Haptic.impactAsync(Haptic.ImpactFeedbackStyle.Light);

    if (isLeft) {
      onSwipeLeft?.();
    } else {
      onSwipeRight?.();
    }
  };

  const isSwipeLeftAllowed = !isUndefined(onSwipeLeft);
  const isSwipeRightAllowed = !isUndefined(onSwipeRight);

  const panGesture = Gesture.Pan()
    .onChange(({translationX}) => {
      if (translationX > 0 && !isSwipeRightAllowed) {
        return;
      }

      translateX.value = translationX / 2;

      if (!halfTriggered.value) {
        if (translationX <= -X_LIMIT && isSwipeLeftAllowed) {
          halfTriggered.value = true;

          runOnJS(_onSwiped)(true);
        }

        if (translationX >= X_LIMIT && isSwipeRightAllowed) {
          halfTriggered.value = true;

          runOnJS(_onSwiped)(false);
        }
      }
    })
    .onEnd(() => {
      halfTriggered.value = false;
      translateX.value = withSpring(0, {damping: 14});
    })
    .activeOffsetX(activeOffsetX)
    .maxPointers(1)
    .enabled(!disabled);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{translateX: translateX.value}],
    };
  }, []);

  const animatedLeftIconStyle = useAnimatedStyle(() => {
    const inputRange = [0, MAX_X_SWIPE];

    const scale = interpolate(
      translateX.value,
      inputRange,
      [0, 1],
      Extrapolation.CLAMP,
    );

    const rotate = interpolate(
      translateX.value,
      inputRange,
      [60, 0],
      Extrapolation.CLAMP,
    );

    return {
      transform: [{scale}, {rotate: `${rotate}deg`}],
      zIndex: -1,
      position: 'absolute',
      left: 16,
    };
  });

  const animatedRightIconStyle = useAnimatedStyle(() => {
    const inputRange = [-MAX_X_SWIPE, 0];

    const scale = interpolate(
      translateX.value,
      inputRange,
      [1, 0],
      Extrapolation.CLAMP,
    );

    const rotate = interpolate(
      translateX.value,
      inputRange,
      [0, 60],
      Extrapolation.CLAMP,
    );

    return {
      transform: [{scale}, {rotate: `${rotate}deg`}],
      zIndex: -1,
      position: 'absolute',
      right: 16,
    };
  });

  return (
    <GestureDetector gesture={panGesture}>
      <View style={styles.container}>
        <Animated.View style={[animatedStyle, style]}>{children}</Animated.View>

        <Animated.View style={animatedRightIconStyle}>
          {Icon && <IconProvider Icon={Icon} />}
        </Animated.View>

        <Animated.View style={animatedLeftIconStyle}></Animated.View>
      </View>
    </GestureDetector>
  );
};

export default memo(SwipeableContainer);
