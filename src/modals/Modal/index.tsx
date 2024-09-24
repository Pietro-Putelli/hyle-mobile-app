import CloseIcon from '@/assets/icons/CloseIcon.svg';
import {IconButton} from '@/components/Buttons';
import useTheme from '@/hooks/useTheme';
import React, {memo, useCallback, useEffect, useState} from 'react';
import {
  Dimensions,
  Modal as NativeModal,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import {Gesture, GestureDetector} from 'react-native-gesture-handler';
import Animated, {
  Extrapolation,
  interpolate,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import styles from './styles';
import {ModalProps} from './types';

const {width, height} = Dimensions.get('window');
const CURSOR_WIDTH = width * 0.2;
const MAX_OPACITY = 0.7;

const HIDDEN_Y = height;

const Modal = ({
  isCursorVisible,
  isCloseButtonVisible,
  isOpen,
  setIsOpen,
  onShow,
  onDismiss,
  children,
  contentStyle,
}: ModalProps) => {
  const [containerHeight, setContainerHeight] = useState(HIDDEN_Y);

  const [_isOpen, _setIsOpen] = useState(isOpen);

  const cursorWidth = useSharedValue(0);
  const translateY = useSharedValue(height);

  const insets = useSafeAreaInsets();
  const theme = useTheme();

  useEffect(() => {
    if (isOpen) {
      _setIsOpen(true);

      setTimeout(() => {
        onShow?.();
      }, 800);

      translateY.value = withDelay(300, withSpring(0, {damping: 16}));

      cursorWidth.value = withDelay(
        250,
        withSpring(CURSOR_WIDTH, {damping: 12}),
      );
    } else {
      translateY.value = withTiming(HIDDEN_Y, {duration: 400});

      setTimeout(() => {
        _setIsOpen(false);

        cursorWidth.value = 0;
      }, 200);
    }
  }, [isOpen]);

  // === METHODS

  const onContainerHeight = useCallback(({nativeEvent: {layout}}: any) => {
    setContainerHeight(layout.height);
  }, []);

  const dismiss = () => {
    setTimeout(() => {
      onDismiss?.();
    }, 1000);

    setIsOpen(false);
  };
  // === STYLES

  const animatedBackdropStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      translateY.value,
      [0, containerHeight],
      [MAX_OPACITY, 0],
      Extrapolation.CLAMP,
    );
    return {opacity};
  });

  const animatedContainerStyle = useAnimatedStyle(() => {
    return {
      transform: [{translateY: translateY.value}],
    };
  });

  const panGesture = Gesture.Pan()
    .onChange(({translationY}) => {
      if (translationY > 0) {
        translateY.value = translationY / 1.5;
      } else {
        translateY.value = translationY / 16;
      }
    })
    .onEnd(({translationY}) => {
      if (translationY > height / 10) {
        runOnJS(dismiss)();
      } else {
        translateY.value = withSpring(0);
      }
    });

  const cursorAnimationStyle = useAnimatedStyle(() => {
    return {width: cursorWidth.value};
  }, []);

  if (!_isOpen) {
    return null;
  }

  return (
    <NativeModal
      transparent
      presentationStyle="overFullScreen"
      visible={_isOpen}>
      <View style={styles.container}>
        <TouchableWithoutFeedback onPress={dismiss}>
          <Animated.View style={[styles.backdrop, animatedBackdropStyle]} />
        </TouchableWithoutFeedback>

        <GestureDetector gesture={panGesture}>
          <Animated.View
            style={[
              {
                marginBottom: insets.bottom + 8,
                backgroundColor: theme.colors.secondaryBackground,
                borderRadius: 24,
              },
              animatedContainerStyle,
            ]}
            onLayout={onContainerHeight}>
            {isCursorVisible && (
              <Animated.View
                style={[
                  styles.cursor,
                  {
                    backgroundColor: theme.colors.lightText,
                  },
                  cursorAnimationStyle,
                ]}
              />
            )}

            {isCloseButtonVisible && (
              <View style={styles.closeButton}>
                <IconButton icon={CloseIcon} onPress={dismiss} />
              </View>
            )}

            <Animated.View style={[styles.content, contentStyle]}>
              {children}
            </Animated.View>
          </Animated.View>
        </GestureDetector>
      </View>
    </NativeModal>
  );
};
export default memo(Modal);
