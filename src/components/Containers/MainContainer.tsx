import ChevronLeftIcon from '@/assets/icons/ChevronLeftIcon.svg';
import {useNavigation} from '@react-navigation/native';
import React, {useMemo} from 'react';
import {View} from 'react-native';
import {Gesture, GestureDetector} from 'react-native-gesture-handler';
import {runOnJS} from 'react-native-reanimated';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import NavigationHeader from '../NavigationHeader';
import {EdgeBackGestureView} from '../Views';
import {MainContainerProps} from './types';
import useTheme from '@/hooks/useTheme';

const MainContainer = ({
  children,
  enableDismissGesture = false,
  headerProps,
  style,
  rightGesture,
  showStackHeader,
  disableSafeArea,
  onDismissAttempted,
  isModal,
}: MainContainerProps) => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const theme = useTheme();

  const hasCustomRightGesture = rightGesture != undefined;
  const rightActiveOffsetX = rightGesture?.activeOffsetX ?? -10;

  const onStart = () => {
    if (onDismissAttempted) {
      onDismissAttempted();
    } else {
      navigation.goBack();
    }
  };

  const leftPanGesture = Gesture.Pan()
    .onStart(onStart)
    .activeOffsetX(10)
    .enabled(enableDismissGesture);

  const rightPanGesture = Gesture.Pan()
    .onStart(() => {
      if (hasCustomRightGesture) {
        runOnJS(rightGesture.onStart)();
      } else {
        runOnJS(onStart)();
      }
    })
    .activeOffsetX(rightActiveOffsetX)
    .enabled(enableDismissGesture || hasCustomRightGesture);

  const _headerProps = useMemo(() => {
    if (showStackHeader) {
      return {
        ...headerProps,
        leftIcon: ChevronLeftIcon,
        onLeftPress: () => {
          navigation.goBack();
        },
      };
    }

    return headerProps;
  }, [headerProps, showStackHeader]);

  const customStyle = useMemo(() => {
    if (disableSafeArea) {
      return {};
    }
    return {
      paddingTop: isModal ? 16 : insets.top,
      paddingBottom: insets.bottom,
    };
  }, [isModal, disableSafeArea]);

  return (
    <View
      style={[
        {flex: 1, backgroundColor: theme.colors.background},
        customStyle,
        style,
      ]}>
      <GestureDetector gesture={leftPanGesture}>
        <EdgeBackGestureView />
      </GestureDetector>

      {_headerProps && <NavigationHeader isModal={isModal} {..._headerProps} />}

      {children}

      <GestureDetector gesture={rightPanGesture}>
        <EdgeBackGestureView right />
      </GestureDetector>
    </View>
  );
};

export default MainContainer;
