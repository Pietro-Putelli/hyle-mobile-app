import React, {useMemo} from 'react';
import styles from './styles';
import LoaderKit from 'react-native-loader-kit';
import {LoadeProps} from './types';
import {View} from 'react-native';
import {MotiView} from 'moti';
import useAnimatedVisibility from '@/hooks/useAnimatedVisibility';
import useTheme from '@/hooks/useTheme';

const Loader = ({isActive, size = 30, fill, style}: LoadeProps) => {
  const theme = useTheme();

  const _style = useMemo(() => {
    if (fill) {
      return styles.fillStyle;
    }

    return {};
  }, [style, fill]);

  const _isActive = useAnimatedVisibility({isVisible: isActive});

  if (!_isActive) {
    return null;
  }

  return (
    <MotiView
      from={{
        opacity: 0,
      }}
      animate={{
        opacity: isActive ? 1 : 0,
      }}
      style={[_style, style]}>
      <LoaderKit
        style={{width: size, height: size}}
        name={'BallPulse'}
        color={'#fff'}
      />
    </MotiView>
  );
};

export default Loader;
