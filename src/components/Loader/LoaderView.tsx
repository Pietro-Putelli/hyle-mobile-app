import useAnimatedVisibility from '@/hooks/useAnimatedVisibility';
import {MotiView} from 'moti';
import React from 'react';
import {StyleSheet} from 'react-native';
import Loader from '.';

const LoaderOverlayView = ({isVisible}: any) => {
  const _isVisible = useAnimatedVisibility({isVisible});

  if (!_isVisible) {
    return null;
  }

  return (
    <MotiView
      from={{opacity: 0}}
      animate={{opacity: isVisible ? 1 : 0}}
      style={[
        StyleSheet.absoluteFillObject,
        {
          backgroundColor: 'rgba(0,0,0,0.7)',
          justifyContent: 'center',
          alignItems: 'center',
          paddingBottom: 25,
        },
      ]}>
      <Loader isActive size={50} />
    </MotiView>
  );
};

export default LoaderOverlayView;
