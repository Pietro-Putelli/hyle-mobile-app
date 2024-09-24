import useTheme from '@/hooks/useTheme';
import React from 'react';
import Animated, {FadeIn, FadeOut, ZoomIn} from 'react-native-reanimated';
import Loader from '../Loader';
import MainText from '../MainText';
import styles from './styles';
import {LoadingViewProps} from './types';

const LoadingView = ({title, isVisible}: LoadingViewProps) => {
  const theme = useTheme();

  if (!isVisible) return null;

  return (
    <Animated.View style={styles.container} entering={FadeIn} exiting={FadeOut}>
      <Animated.View
        entering={ZoomIn}
        style={{
          padding: 32,
          backgroundColor: theme.colors.secondaryBackground,
          borderRadius: 24,
          alignItems: 'center',
          justifyContent: 'center',
          gap: 12,
          width: 200,
          height: 150,
        }}>
        <Loader isActive size={40} />
        <MainText align="center">{title}</MainText>
      </Animated.View>
    </Animated.View>
  );
};

export default LoadingView;
