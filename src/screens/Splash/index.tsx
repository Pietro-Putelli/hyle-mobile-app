import Logo from '@/assets/Logo.svg';
import {ManropeFontFamily} from '@/constants/fonts';
import useTheme from '@/hooks/useTheme';
import {useFonts} from 'expo-font';
import React, {useEffect, useState} from 'react';
import {Dimensions, StyleSheet} from 'react-native';
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

const {height} = Dimensions.get('window');
const LOGO_SIZE = 100;

const Splash = ({onEndLoading}: any) => {
  const theme = useTheme();
  const scale = useSharedValue(1);
  const translateY = useSharedValue(0);

  const [fontsLoaded, fontError] = useFonts(ManropeFontFamily);
  const [isAnimationDone, setIsAnimationDone] = useState(false);

  /* Effects */

  useEffect(() => {
    scale.value = withDelay(
      100,
      withSequence(
        withSpring(0.8, {damping: 2}),
        withSpring(1, {damping: 2}, isDone => {
          if (isDone) {
            translateY.value = withTiming(-height, {duration: 400});
          }
        }),
      ),
    );

    setTimeout(() => {
      setIsAnimationDone(true);
    }, 500);
  }, []);

  useEffect(() => {
    if (isAnimationDone && fontsLoaded && !fontError) {
      onEndLoading();
    }
  }, [fontsLoaded, fontError, isAnimationDone]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{scale: scale.value}, {translateY: translateY.value}],
    };
  });

  const backgroundStyle = useAnimatedStyle(() => {
    if (theme.colorScheme === 'dark') {
      return {
        backgroundColor: `rgba(0, 0, 0, ${interpolate(
          translateY.value,
          [0, -height / 2],
          [1, 0],
          Extrapolation.CLAMP,
        )})`,
      };
    }

    return {
      backgroundColor: `rgba(255, 255, 255, ${interpolate(
        translateY.value,
        [0, -height / 2],
        [1, 0],
        Extrapolation.CLAMP,
      )})`,
    };
  });

  return (
    <Animated.View style={[styles.container, backgroundStyle]}>
      <Animated.View style={[animatedStyle, styles.logo]}>
        <Logo />
      </Animated.View>
    </Animated.View>
  );
};

export default Splash;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    ...StyleSheet.absoluteFillObject,
  },
  logo: {
    width: LOGO_SIZE,
    height: LOGO_SIZE,
  },
});
