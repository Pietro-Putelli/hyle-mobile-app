import NextTrackIcon from '@/assets/icons/NextTrackIcon.svg';
import useAudioPlayer from '@/hooks/useAudioPlayer';
import useTheme from '@/hooks/useTheme';
import {generateMenuOptions} from '@/utils/menuOptions';
import {MotiView} from 'moti';
import React, {useEffect, useMemo} from 'react';
import {View} from 'react-native';
import {Gesture, GestureDetector} from 'react-native-gesture-handler';
import {ContextMenuButton} from 'react-native-ios-context-menu';
import Animated, {
  FadeInDown,
  FadeOut,
  cancelAnimation,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {Event, useTrackPlayerEvents} from 'react-native-track-player';
import {ScaleButton} from '../Buttons';
import IconProvider from '../IconProvider';
import Loader from '../Loader';
import MainText from '../MainText';
import AudioButton from './AudioButton';
import styles from './styles';
import {AudioPlayerProps} from './types';

const AudioPlayer = ({
  isPrevDisabled,
  isNextDisabled,
  onSkipPress,
}: AudioPlayerProps) => {
  const {
    track,
    progress,
    formattedDuration,
    playAudio,
    pauseAudio,
    stopAudio,
    seekToPosition,
    skipForValue,
    prevForValue,
    hasTrack,
    isPlaying,
    isDownloading,
  } = useAudioPlayer();

  const theme = useTheme();
  const insets = useSafeAreaInsets();

  const playerWidthAnimation = useSharedValue(0);

  const [playerWidth, setPlayerWidth] = React.useState(0);

  const audioMenuOptions = useMemo(() => {
    return generateMenuOptions({
      options: [
        {title: 'Skip 10 Seconds', icon: 'RatoNext'},
        {title: 'Back 10 Seconds', icon: 'RatoPrev'},
        {title: 'Stop', icon: 'StopAudio', isDestructive: true},
      ],
    });
  }, []);

  const onAudioButtonPress = (action: string) => {
    if (action === 'play') {
      playAudio();
    } else {
      pauseAudio();
    }
  };

  const onPressMenuItem = ({nativeEvent}: any) => {
    const actionKey = nativeEvent.actionKey;

    if (actionKey == 'stop') {
      stopAudio();
    } else if (actionKey == 'skip') {
      skipForValue(newTiming => {
        handleTrackWithTiming(newTiming);
      });
    } else if (actionKey == 'prev') {
      prevForValue(newTiming => {
        handleTrackWithTiming(newTiming);
      });
    }
  };

  /* Track Animation */

  const startAnimation = (position?: number) => {
    const duration =
      (progress.duration - (position ?? progress.position)) * 1000;

    playerWidthAnimation.value = withTiming(playerWidth, {
      duration: duration,
    });
  };

  const handleTrackWithPosition = () => {
    const positionPercentage = Number(
      (playerWidthAnimation.value / playerWidth).toFixed(2),
    );

    const secondsPosition = progress.duration * positionPercentage;

    seekToPosition(secondsPosition, () => {
      startAnimation(secondsPosition);
    });
  };

  const handleTrackWithTiming = (timePosition?: number) => {
    const timePositionPercentage =
      (timePosition ?? progress.position) / progress.duration;

    playerWidthAnimation.value = playerWidth * timePositionPercentage;

    startAnimation(timePosition);
  };

  const panGesture = Gesture.Pan()
    .onChange(({x}) => {
      const xValue = Math.max(0, Math.min(x, playerWidth));
      playerWidthAnimation.value = xValue;
    })
    .onEnd(() => {
      runOnJS(handleTrackWithPosition)();
    });

  const animatedProgressStyle = useAnimatedStyle(() => {
    return {
      width: playerWidthAnimation.value,
    };
  });

  /* Effects */

  useEffect(() => {
    if (isPlaying) {
      startAnimation();
    } else {
      cancelAnimation(playerWidthAnimation);
    }
  }, [isPlaying]);

  useTrackPlayerEvents([Event.RemoteSeek], async event => {
    if (event.type === Event.RemoteSeek) {
      handleTrackWithTiming(event.position);
    }
  });

  useEffect(() => {
    return () => {
      playerWidthAnimation.value = 0;
      stopAudio();
    };
  }, []);

  return (
    <MotiView
      animate={{translateY: isDownloading || hasTrack ? 0 : 200}}
      transition={{damping: 16}}
      style={[
        styles.outer,
        {
          paddingBottom: insets.bottom,
          backgroundColor: theme.colors.background,
        },
      ]}>
      {hasTrack ? (
        <GestureDetector gesture={panGesture}>
          <Animated.View entering={FadeInDown} style={styles.content}>
            <View
              onLayout={e => {
                setPlayerWidth(e.nativeEvent.layout.width);
              }}
              style={styles.player}>
              <AudioButton isPlaying={isPlaying} onPress={onAudioButtonPress} />

              <ContextMenuButton
                style={{flex: 1}}
                onPressMenuItem={onPressMenuItem}
                menuConfig={audioMenuOptions}
                isMenuPrimaryAction>
                <MainText weight="semiBold" size={16} numberOfLines={1}>
                  {track?.title}
                </MainText>
              </ContextMenuButton>

              <View style={styles.trackButtons}>
                <ScaleButton
                  disabled={isPrevDisabled}
                  isHaptic
                  activeScale={0.8}
                  throttleValue={800}
                  onPress={() => {
                    onSkipPress('prev');
                  }}
                  style={styles.prevTrackButton}>
                  <IconProvider Icon={NextTrackIcon} />
                </ScaleButton>

                <View style={styles.timeContainer}>
                  <MainText size={14}>{formattedDuration}</MainText>
                </View>

                <ScaleButton
                  isHaptic
                  disabled={isNextDisabled}
                  activeScale={0.8}
                  throttleValue={800}
                  onPress={() => {
                    onSkipPress('next');
                  }}
                  style={styles.nextTrackButton}>
                  <IconProvider Icon={NextTrackIcon} />
                </ScaleButton>
              </View>

              <Animated.View
                style={[styles.outerProgress, {width: playerWidth}]}>
                <Animated.View
                  style={[
                    animatedProgressStyle,
                    {backgroundColor: theme.colors.lightAccent},
                    styles.progress,
                  ]}></Animated.View>
              </Animated.View>
            </View>
          </Animated.View>
        </GestureDetector>
      ) : (
        <Animated.View
          exiting={FadeOut}
          style={[theme.styles.cell, styles.downloadingContainer]}>
          <Loader isActive size={24} />
          <MainText numberOfLines={1} weight="semiBold">
            Generating Speech...
          </MainText>
        </Animated.View>
      )}
    </MotiView>
  );
};

export default AudioPlayer;
