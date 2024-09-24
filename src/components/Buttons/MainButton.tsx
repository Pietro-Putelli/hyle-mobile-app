import useTheme from '@/hooks/useTheme';
import {MotiView} from 'moti';
import React, {useEffect, useMemo, useState} from 'react';
import {StyleSheet} from 'react-native';
import IconProvider from '../IconProvider';
import Loader from '../Loader';
import MainText from '../MainText';
import ScaleButton from './ScaleButton';
import {MainButtonProps} from './types';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

const BUTTON_HEIGHT = 52;

const MainButton = ({
  title,
  type,
  leftIcon: LeftIcon,
  rightIcon: RightIcon,
  style,
  backgroundColor,
  isLoading,
  fullLoadingDuration = 0,
  loadingText,
  ...props
}: MainButtonProps) => {
  const theme = useTheme();
  const animatedLoaderWidth = useSharedValue(0);
  const [buttonWidth, setButtonWidth] = useState(0);

  const {_backgroundColor, _iconColor} = useMemo(() => {
    let backgroundColor = theme.colors.secondaryBackground;
    let iconColor = theme.colors.text;

    if (type === 'primary') {
      backgroundColor = theme.colors.accent;
      iconColor = '#fff';
    }

    if (type == 'tertiary') {
      backgroundColor = theme.colors.tertiaryBackground;
    }

    return {_backgroundColor: backgroundColor, _iconColor: iconColor};
  }, [type, style, backgroundColor]);

  const loadingAnimationStyle = useMemo(() => {
    if (loadingText != undefined) {
      return {
        opacity: isLoading ? 1 : 0,
      };
    }

    return {
      opacity: isLoading ? 1 : 0,
      scale: isLoading ? 1 : 0,
    };
  }, [loadingText, isLoading]);

  const animatedLoadingStyle = useAnimatedStyle(() => {
    return {
      width: animatedLoaderWidth.value,
    };
  });

  useEffect(() => {
    if (isLoading && fullLoadingDuration != 0 && buttonWidth != 0) {
      animatedLoaderWidth.value = withTiming(buttonWidth, {
        duration: fullLoadingDuration,
      });
    }
  }, [isLoading, buttonWidth]);

  return (
    <ScaleButton
      onLayout={(event: any) => {
        setButtonWidth(event.nativeEvent.layout.width);
      }}
      style={[{backgroundColor: _backgroundColor}, styles.container, style]}
      {...props}>
      {LeftIcon && <IconProvider Icon={LeftIcon} color={_iconColor} />}

      {title != undefined && (
        <MotiView
          animate={{
            opacity: isLoading ? 0 : 1,
          }}>
          <MainText uppercase weight="semiBold" color={_iconColor}>
            {title}
          </MainText>
        </MotiView>
      )}

      <MotiView animate={loadingAnimationStyle} style={styles.loader}>
        {fullLoadingDuration == 0 && (
          <Loader isActive size={loadingText ? 24 : 28} />
        )}
        {loadingText && (
          <MainText weight="semiBold" color={_iconColor}>
            {loadingText}
          </MainText>
        )}
      </MotiView>

      {RightIcon && (
        <MotiView
          animate={{
            opacity: isLoading ? 0 : 1,
          }}>
          <IconProvider Icon={RightIcon} color={_iconColor} />
        </MotiView>
      )}

      <Animated.View style={[styles.fullLoader, animatedLoadingStyle]} />
    </ScaleButton>
  );
};

export default MainButton;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    gap: 12,
    borderRadius: BUTTON_HEIGHT * 0.4,
    minHeight: BUTTON_HEIGHT,
    overflow: 'hidden',
  },
  loader: {
    position: 'absolute',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  fullLoader: {
    // backgroundColor: 'rgba(255,255,255, 0.1)',
    backgroundColor: '#35165e',
    ...StyleSheet.absoluteFillObject,
    zIndex: -1,
  },
});
