import useTheme from '@/hooks/useTheme';
import React, {memo, useMemo} from 'react';
import {Dimensions, StyleSheet, View} from 'react-native';
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedStyle,
} from 'react-native-reanimated';

const DOT_SIDE = 10;
const {width} = Dimensions.get('window');

const ScrollDotsIndicator = ({scrollX, count}: any) => {
  const theme = useTheme();

  const circleStyle = useMemo(() => {
    return {
      ...styles.circle,
      backgroundColor: 'rgba(255,255,255,0.1)',
    };
  }, []);

  const selectorStyle = useMemo(() => {
    return {
      ...styles.circle,
      position: 'absolute',
      backgroundColor: theme.colors.accent,
    };
  }, []);

  const selectorAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateX: interpolate(
            scrollX.value,
            [0, width * count],
            [0, (8 + DOT_SIDE) * count],
            Extrapolation.CLAMP,
          ),
        },
      ],
    };
  });

  return (
    <View style={styles.container}>
      {count > 1 && (
        <>
          {Array.from(Array(count).keys()).map(index => {
            return <View style={circleStyle} key={index} />;
          })}

          <Animated.View style={[selectorStyle, selectorAnimatedStyle]} />
        </>
      )}
    </View>
  );
};

export default memo(ScrollDotsIndicator);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
  },
  circle: {
    width: DOT_SIDE,
    height: DOT_SIDE,
    marginHorizontal: 4,
    borderRadius: DOT_SIDE / 2,
  },
});
