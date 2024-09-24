import useTheme from '@/hooks/useTheme';
import {MotiView} from 'moti';
import React, {useEffect, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from 'react-native-reanimated';
import IconProvider from '../IconProvider';
import MainText from '../MainText';
import ScaleButton from './ScaleButton';
import {ActionButtonProps} from './types';

const ActionButton = ({
  action,
  style,
  underline,
  isLoading,
  onPress,
  startLoadingWhenPressed,
  fullLoadingDuration,
  loadingText,
  ...props
}: ActionButtonProps) => {
  const theme = useTheme();
  const [_isLoading, setIsLoading] = useState(isLoading);

  const animatedLoaderWidth = useSharedValue(0);
  const animatedLoderOpacity = useSharedValue(0);
  const [buttonWidth, setButtonWidth] = useState(0);

  const Icon = action?.icon;

  const _onPress = (actionKey: string) => {
    onPress(actionKey);

    if (startLoadingWhenPressed) {
      setIsLoading(true);
    }
  };

  const animatedLoadingStyle = useAnimatedStyle(() => {
    return {
      width: animatedLoaderWidth.value,
      opacity: animatedLoderOpacity.value,
    };
  });

  const resetAnimatedValues = () => {
    animatedLoderOpacity.value = withTiming(0);
    animatedLoaderWidth.value = withDelay(200, withTiming(0, {duration: 100}));
  };

  /* Effects */

  useEffect(() => {
    setIsLoading(isLoading);
  }, [isLoading]);

  useEffect(() => {
    if (_isLoading && fullLoadingDuration != 0 && buttonWidth != 0) {
      animatedLoderOpacity.value = 1;

      animatedLoaderWidth.value = withTiming(
        buttonWidth,
        {duration: fullLoadingDuration},
        isFinished => {
          if (isFinished) {
            runOnJS(setIsLoading)(false);
            runOnJS(resetAnimatedValues)();
          }
        },
      );
    }

    if (!_isLoading) {
      resetAnimatedValues();
    }
  }, [_isLoading, buttonWidth]);

  return (
    <ScaleButton
      isHaptic
      activeScale={0.96}
      onPress={() => _onPress(action.key)}
      style={[theme.styles.cell, styles.container, {marginRight: 12}, style]}
      onLayout={(event: any) => {
        setButtonWidth(event.nativeEvent.layout.width);
      }}
      {...props}>
      {/* <MotiView
        animate={{
          opacity: _isLoading ? 1 : 0,
          scale: _isLoading ? 1 : 0,
        }}
        style={styles.loader}>
        <Loader isActive size={28} />
      </MotiView> */}

      <MotiView
        style={{flexDirection: 'row', alignItems: 'center', gap: 12}}
        animate={
          {
            // opacity: _isLoading ? 0 : 1,
          }
        }>
        <View>{Icon && <IconProvider Icon={Icon} />}</View>

        <View>
          <MotiView
            animate={{
              opacity: _isLoading ? 0 : 1,
            }}>
            <MainText
              weight="semiBold"
              uppercase
              size={14}
              numberOfLines={1}
              underline={underline}>
              {action.title}
            </MainText>
          </MotiView>

          <MotiView
            style={{
              width: '100%',
              position: 'absolute',
              // alignItems: 'center',
            }}
            animate={{
              opacity: _isLoading ? 1 : 0,
            }}>
            <MainText uppercase size={14} weight="semiBold">
              {loadingText}
            </MainText>
          </MotiView>
        </View>
      </MotiView>

      <Animated.View style={[styles.fullLoader, animatedLoadingStyle]} />
    </ScaleButton>
  );
};

export default ActionButton;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    alignItems: 'center',
    flexDirection: 'row',
    borderRadius: 18,
    height: 48,
    overflow: 'hidden',
  },
  loader: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullLoader: {
    backgroundColor: '#1E1E1E',
    ...StyleSheet.absoluteFillObject,
    zIndex: -1,
  },
});
