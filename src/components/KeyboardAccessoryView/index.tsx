import React, {useEffect, useMemo, useRef} from 'react';
import {Animated, StyleSheet} from 'react-native';
import {default as ReAnimated} from 'react-native-reanimated';
import {SafeAreaView, useSafeAreaInsets} from 'react-native-safe-area-context';

import {ScrollView} from 'react-native-gesture-handler';
import {
  useComponentSize,
  useKeyboardDimensions,
  usePanResponder,
} from './hooks';

interface Props {
  children?: React.ReactNode;
  isVisible?: boolean;
  renderAccessoryView: () => React.ReactNode;
  renderCustomInputView?: () => React.ReactNode;
  onKeyboardLoaded?: () => void;
}

export const KeyboardAccessoryView = React.memo(
  ({
    children,
    isVisible,
    renderAccessoryView,
    renderCustomInputView,
    onKeyboardLoaded,
  }: Props) => {
    const {onLayout, size} = useComponentSize();
    const {keyboardEndPositionY, keyboardHeight} = useKeyboardDimensions();
    const {panHandlers, positionY} = usePanResponder();
    const {bottom} = useSafeAreaInsets();

    const isKeyboardVisible = keyboardHeight > 0;

    const [_keyboardHeight, setKeyboardHeight] = React.useState(0);

    const scrollRef = React.useRef<ScrollView>(null);

    const prevIsVisible = useRef(isVisible);

    useEffect(() => {
      if (keyboardHeight > 0) {
        setKeyboardHeight(keyboardHeight + 36);

        setTimeout(() => {
          onKeyboardLoaded?.();
        }, 550);
      }
    }, [keyboardHeight]);

    useEffect(() => {
      /* Scroll to the end everytime the isVisible state changes */
      scrollRef.current?.scrollToEnd({animated: true});

      prevIsVisible.current = !isVisible;
    }, [isVisible]);

    const deltaY = Animated.subtract(
      positionY,
      keyboardEndPositionY,
    ).interpolate({
      inputRange: [0, Number.MAX_SAFE_INTEGER],
      outputRange: [0, Number.MAX_SAFE_INTEGER],
      extrapolate: 'clamp',
    });

    const offset = React.useMemo(() => {
      let offset = size.height + _keyboardHeight;

      return offset;
    }, [size, isVisible, keyboardHeight, bottom, _keyboardHeight]);

    const accessoryViewMarginBottom = useMemo(() => {
      let marginBottom = 0;

      if (!isKeyboardVisible) {
        marginBottom = _keyboardHeight;
      }

      if (!isVisible && !isKeyboardVisible && prevIsVisible.current) {
        marginBottom = bottom;
      }

      return marginBottom;
    }, [isKeyboardVisible, isVisible, bottom]);

    return (
      <>
        <Animated.View
          style={{
            flex: 1,
            paddingBottom: Animated.subtract(offset, deltaY),
          }}>
          <ScrollView
            ref={scrollRef}
            contentContainerStyle={{paddingBottom: 32}}
            keyboardDismissMode="interactive"
            {...panHandlers}>
            {children}
          </ScrollView>
        </Animated.View>
        <Animated.View
          style={[
            {
              bottom: Animated.subtract(
                keyboardHeight > 0 ? _keyboardHeight : 0,
                deltaY,
              ),
            },
            styles.container,
          ]}
          testID="container">
          <ReAnimated.View
            onLayout={onLayout}
            style={{marginBottom: accessoryViewMarginBottom}}>
            {renderAccessoryView()}
          </ReAnimated.View>
        </Animated.View>

        {/* Custom Input  */}
        {renderCustomInputView?.()}
      </>
    );
  },
);

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 0,
    right: 0,
  },
});
