import RightArrowIcon from '@/assets/icons/RightArrowIcon.svg';
import RouteNames from '@/constants/routeNames';
import {useNavigation} from '@react-navigation/native';
import React from 'react';
import {useTranslation} from 'react-i18next';
import {FlatList, StyleSheet, useWindowDimensions} from 'react-native';
import Animated, {
  AnimatedRef,
  SharedValue,
  interpolateColor,
  useAnimatedStyle,
  withDelay,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import {ScaleButton} from '../Buttons';
import IconProvider from '../IconProvider';
import MainText from '../MainText';

type Props = {
  dataLength: number;
  flatListIndex: SharedValue<number>;
  flatListRef: AnimatedRef<FlatList<any>>;
  x: SharedValue<number>;
};

const CustomButton = ({flatListRef, flatListIndex, dataLength, x}: Props) => {
  const {t} = useTranslation();
  const {width: SCREEN_WIDTH} = useWindowDimensions();
  const navigation = useNavigation<any>();

  const buttonAnimationStyle = useAnimatedStyle(() => {
    return {
      width:
        flatListIndex.value === dataLength - 1
          ? withSpring(160, {damping: 16})
          : withSpring(60, {damping: 16}),
      height: 60,
    };
  });

  const arrowAnimationStyle = useAnimatedStyle(() => {
    return {
      width: 30,
      height: 30,
      opacity:
        flatListIndex.value === dataLength - 1 ? withTiming(0) : withTiming(1),
      transform: [
        {
          translateX:
            flatListIndex.value === dataLength - 1
              ? withTiming(100)
              : withTiming(0),
        },
      ],
    };
  });

  const textAnimationStyle = useAnimatedStyle(() => {
    return {
      opacity:
        flatListIndex.value === dataLength - 1
          ? withDelay(200, withTiming(1))
          : 0,
      transform: [
        {
          translateX:
            flatListIndex.value === dataLength - 1
              ? withTiming(0)
              : withTiming(-100),
        },
      ],
    };
  });
  const animatedColor = useAnimatedStyle(() => {
    const backgroundColor = interpolateColor(
      x.value,
      [0, SCREEN_WIDTH, 2 * SCREEN_WIDTH],
      ['#1e2169', '#E33946', '#3B755F'],
    );

    return {
      backgroundColor: backgroundColor,
    };
  });

  return (
    <ScaleButton
      isHaptic
      onPress={() => {
        if (flatListIndex.value < dataLength - 1) {
          flatListRef.current?.scrollToIndex({index: flatListIndex.value + 1});
        } else {
          navigation.replace(RouteNames.Root);
        }
      }}>
      <Animated.View
        style={[styles.container, buttonAnimationStyle, animatedColor]}>
        <Animated.View style={[styles.textButton, textAnimationStyle]}>
          <MainText weight="semiBold" uppercase>
            {t('Actions:getStarted')}
          </MainText>
        </Animated.View>

        <Animated.View style={[styles.arrow, arrowAnimationStyle]}>
          <IconProvider Icon={RightArrowIcon} color="#fff" />
        </Animated.View>
      </Animated.View>
    </ScaleButton>
  );
};

export default CustomButton;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#1e2169',
    padding: 10,
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  arrow: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  textButton: {color: 'white', fontSize: 16, position: 'absolute'},
});
