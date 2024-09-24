import useTheme from '@/hooks/useTheme';
import {BlurView} from 'expo-blur';
import {MotiView} from 'moti';
import React, {useMemo} from 'react';
import {View} from 'react-native';
import {useAnimatedStyle, withTiming} from 'react-native-reanimated';
import IconProvider from '../IconProvider';
import ScaleButton from './ScaleButton';
import {IconButtonProps} from './types';
import Loader from '../Loader';

const BUTTON_SIDE = 45;

const IconButton = ({
  icon: Icon,
  iconScale = 1,
  iconName,
  type,
  style,
  opacity,
  states,
  isActive,
  isLoading,
  isTransparent,
  isBlurred,
  side = BUTTON_SIDE,
  forceDarkTheme,
  ...props
}: IconButtonProps) => {
  const theme = useTheme();

  const selectedState = useMemo(() => {
    if (states) {
      if (isActive) {
        return states.find(state => state.type === 'primary');
      }

      return states.find(state => state.type !== 'primary');
    }

    return null;
  }, [states, isActive]);

  const {PrimaryStateIcon, SecondStateIcon} = useMemo(() => {
    if (!states) return {};

    return {
      PrimaryStateIcon: states.find(state => state.type === 'primary')?.icon,
      SecondStateIcon: states.find(state => state.type !== 'primary')?.icon,
    };
  }, [states]);

  const {backgroundColor, iconColor, blurTint} = useMemo(() => {
    const _type = type ?? selectedState?.type;

    let backgroundColor = 'transparent';
    let iconColor = theme.colors.text;
    let blurTint = theme.colorScheme == 'dark' ? 'dark' : 'light';

    if (_type != undefined) {
      if (_type === 'primary') {
        backgroundColor = theme.colors.accent;
        iconColor = '#fff';
      } else if (_type === 'secondary') {
        backgroundColor = theme.colors.secondaryBackground;
      } else if (_type === 'tertiary') {
        backgroundColor = theme.colors.background;
      }
    }

    if (forceDarkTheme) {
      iconColor = '#fff';
      blurTint = 'dark';
    }

    return {
      backgroundColor,
      iconColor,
      blurTint,
    };
  }, [type, theme, forceDarkTheme, selectedState]);

  const animatedStyle = useAnimatedStyle(() => {
    return {backgroundColor: withTiming(backgroundColor)};
  }, [backgroundColor]);

  const customStyle = useMemo(() => {
    if (backgroundColor == 'transparent') {
      return {};
    }

    return {
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 0,
      },
      shadowOpacity: 0.3,
    };
  }, [backgroundColor]);

  const ContainerView = isBlurred ? BlurView : View;

  return (
    <ScaleButton
      style={[
        {
          width: side,
          height: side,
          borderRadius: side * 0.45,
          overflow: 'hidden',
        },
        customStyle,
        animatedStyle,
        style,
      ]}
      {...props}>
      <ContainerView
        tint={blurTint}
        intensity={100}
        style={{
          width: '100%',
          height: '100%',
          alignItems: 'center',
          justifyContent: 'center',
          opacity,
        }}>
        <MotiView
          animate={{opacity: isLoading ? 0 : 1, scale: isLoading ? 0 : 1}}
          style={{
            transform: [{scale: side / BUTTON_SIDE}],
          }}>
          {Icon && (
            <IconProvider Icon={Icon} color={iconColor} scale={iconScale} />
          )}
        </MotiView>

        {!isLoading && PrimaryStateIcon && (
          <MotiView
            transition={{damping: 12}}
            from={{opacity: 0, scale: 0}}
            animate={{opacity: isActive ? 1 : 0, scale: isActive ? 1 : 0}}>
            <IconProvider Icon={PrimaryStateIcon} color={iconColor} />
          </MotiView>
        )}

        {SecondStateIcon && (
          <MotiView
            transition={{damping: 16}}
            style={{position: 'absolute'}}
            from={{opacity: 0, scale: 0}}
            animate={{opacity: !isActive ? 1 : 0, scale: !isActive ? 1 : 0}}>
            <IconProvider Icon={SecondStateIcon} color={iconColor} />
          </MotiView>
        )}

        {isLoading && (
          <MotiView
            transition={{damping: 16}}
            style={{position: 'absolute'}}
            from={{opacity: 0, scale: 0}}
            animate={{opacity: 1, scale: 1}}>
            <Loader size={24} isActive />
          </MotiView>
        )}
      </ContainerView>
    </ScaleButton>
  );
};

export default IconButton;
