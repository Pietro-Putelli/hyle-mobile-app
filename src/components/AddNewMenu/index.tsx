import AddIcon from '@/assets/icons/AddIcon.svg';
import CameraIcon from '@/assets/icons/CameraIcon.svg';
import MicIcon from '@/assets/icons/MicIcon.svg';
import PasteIcon from '@/assets/icons/PasteIcon.svg';
import TextInputIcon from '@/assets/icons/TextInputIcon.svg';
import RouteNames from '@/constants/routeNames';
import useFocusEffect from '@/hooks/useFocusEffect';
import useTheme from '@/hooks/useTheme';
import {InputModes} from '@/types/InputMode';
import Clipboard from '@react-native-clipboard/clipboard';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import * as Haptic from 'expo-haptics';
import {LinearGradient} from 'expo-linear-gradient';
import React, {useEffect, useMemo, useRef, useState} from 'react';
import {TouchableWithoutFeedback, View} from 'react-native';
import {Gesture, GestureDetector} from 'react-native-gesture-handler';
import Animated, {
  Extrapolation,
  interpolate,
  runOnJS,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {ScaleButton} from '../Buttons';
import IconProvider from '../IconProvider';
import MainText from '../MainText';
import {PICKS_EDITOR_HEIGHT} from '../PicksEditorController/styles';
import styles, {MENU_BUTTON_SIDE} from './styles';
import {AddNewMenuType} from './types';

const TRANSLATE_Y = MENU_BUTTON_SIDE + 24;
const TRANSLATE_X = MENU_BUTTON_SIDE + 24;

const springAnimationOptions = {
  damping: 10,
  stiffness: 100,
  mass: 0.4,
};

const AddNewMenu = ({type, bookId}: AddNewMenuType) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isBackDropVisible, setIsBackDropVisible] = useState(false);
  const [isPasteButtonVisible, setIsPasteButtonVisible] = useState(false);

  const theme = useTheme();
  const insets = useSafeAreaInsets();

  const isMounted = useRef(false);
  const isSecondary = type === 'secondary';

  const navigation = useNavigation<NativeStackNavigationProp<any>>();

  const panX = useSharedValue(0);
  const panY = useSharedValue(0);

  const panPosition = useSharedValue<string | null>(null);

  const micX = useDerivedValue(() => {
    return withSpring(isExpanded ? -TRANSLATE_X : 0, springAnimationOptions);
  });

  const micY = useDerivedValue(() => {
    let yValue = -TRANSLATE_Y / 2;

    if (isSecondary) {
      yValue = 0;
    }

    return withSpring(isExpanded ? yValue : 0, springAnimationOptions);
  });

  const penX = useDerivedValue(() => {
    if (isSecondary) {
      return withSpring(
        isExpanded ? -TRANSLATE_X + 16 : 0,
        springAnimationOptions,
      );
    }

    return 0;
  });

  const penY = useDerivedValue(() => {
    if (isSecondary) {
      return withSpring(
        isExpanded ? -TRANSLATE_Y + 16 : 0,
        springAnimationOptions,
      );
    }

    return withSpring(isExpanded ? -TRANSLATE_Y : 0, springAnimationOptions);
  });

  const cameraX = useDerivedValue(() => {
    if (isSecondary) {
      return 0;
    }

    return withSpring(isExpanded ? TRANSLATE_X : 0, springAnimationOptions);
  });

  const cameraY = useDerivedValue(() => {
    if (isSecondary) {
      return withSpring(isExpanded ? -TRANSLATE_Y : 0, springAnimationOptions);
    }

    return withSpring(
      isExpanded ? -TRANSLATE_Y / 2 : 0,
      springAnimationOptions,
    );
  });

  /* Animated Styles */

  const animatedMicStyle = useAnimatedStyle(() => {
    return {
      transform: [{translateX: micX.value}, {translateY: micY.value}],
    };
  });

  const animatedCameraStyle = useAnimatedStyle(() => {
    return {
      transform: [{translateX: cameraX.value}, {translateY: cameraY.value}],
    };
  });

  const animatedPenStyle = useAnimatedStyle(() => {
    return {
      transform: [{translateY: penY.value}, {translateX: penX.value}],
    };
  });

  const animatedAddIcon = useAnimatedStyle(() => {
    return {
      transform: [
        {
          rotate: withSpring(
            `${isExpanded ? '45deg' : '0deg'}`,
            springAnimationOptions,
          ),
        },
      ],
    };
  });

  const animatedPrimaryButton = useAnimatedStyle(() => {
    return {
      transform: [
        {scale: withSpring(isExpanded ? 0.9 : 1, springAnimationOptions)},
      ],
    };
  });

  const animatedCursorStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {translateX: panX.value},
        {translateY: panY.value},
        {
          scale: interpolate(
            Math.max(Math.abs(panY.value), Math.abs(panX.value)),
            [0, 100],
            [0, 1],
            Extrapolation.CLAMP,
          ),
        },
      ],
    };
  });

  const backgroundStyle = {
    backgroundColor: theme.colors.secondaryBackground,
  };

  /* Methods */

  const openAddPickStack = ({text, initialInputMode}: any) => {
    navigation.navigate(RouteNames.AddPickStack, {
      initialText: text,
      initialInputMode,
      bookData: {id: bookId},
    });
  };

  const openCamera = () => {
    navigation.navigate(RouteNames.Camera, {bookId});
  };

  /* Callbacks */

  const onPrimaryPress = () => {
    setIsExpanded(prev => !prev);
  };

  const onInputStatePress = (inputMode: string) => {
    if (inputMode === InputModes.Scan) {
      openCamera();
    } else {
      openAddPickStack({initialInputMode: inputMode});
    }

    setTimeout(() => {
      setIsExpanded(false);
    }, 200);
  };

  /* Effects */

  useFocusEffect(isFocused => {
    if (!isFocused) {
      setTimeout(() => {
        setIsExpanded(false);
      }, 200);
    }
  });

  useEffect(() => {
    if (isExpanded) {
      setIsBackDropVisible(true);
    } else {
      setTimeout(() => {
        setIsBackDropVisible(false);
      }, 200);
    }
  }, [isExpanded]);

  useEffect(() => {
    (async () => {
      const text = await Clipboard.hasString();
      setIsPasteButtonVisible(text);
    })();
  }, []);

  const triggerHaptic = () => {
    Haptic.impactAsync(Haptic.ImpactFeedbackStyle.Light);
  };

  /* Handle Gestures */

  const backDropStyle = useAnimatedStyle(() => {
    return {
      backgroundColor: withSpring(
        `rgba(0,0,0,${isExpanded ? 0.7 : 0})`,
        springAnimationOptions,
      ),
      opacity: withSpring(isExpanded ? 1 : 0, springAnimationOptions),
    };
  });

  const onGestureEnd = () => {
    triggerHaptic();

    if (panPosition.value == 'right') {
      openCamera();
    } else {
      const initialInputMode =
        panPosition.value === 'left' ? InputModes.Mic : InputModes.Pen;

      openAddPickStack({initialInputMode});
    }

    panPosition.value = null;
  };

  const panGestureHandler = Gesture.Pan()
    .onChange(({translationX, translationY}) => {
      const threshold = 300;

      let dampenedTranslationX = translationX;
      let dampenedTranslationY = translationY;

      const signX = Math.sign(translationX);
      dampenedTranslationX =
        signX * threshold * Math.log(Math.abs(translationX) / threshold + 1);

      const signY = Math.sign(translationY);
      dampenedTranslationY =
        signY * threshold * Math.log(Math.abs(translationY) / threshold + 1);

      panX.value = dampenedTranslationX;
      panY.value = dampenedTranslationY;

      let newPosition = null;

      const angle = Math.atan2(translationY, translationX);
      const angleInDegrees = Math.abs(angle * (180 / Math.PI)) as number;

      if (isSecondary) {
        if (angleInDegrees > 150) {
          newPosition = 'left';
        } else if (angleInDegrees < 150 && angleInDegrees > 100) {
          newPosition = 'center';
        } else {
          newPosition = 'right';
        }
      } else {
        if (angleInDegrees >= 70 && angleInDegrees <= 110) {
          newPosition = 'center';
        } else if (angleInDegrees > 75) {
          newPosition = 'left';
        } else {
          newPosition = 'right';
        }
      }

      panPosition.value = newPosition;
    })
    .onEnd(({x, y}) => {
      panY.value = withSpring(0, {damping: 16});
      panX.value = withSpring(0, {damping: 16});

      const yValue = Math.abs(y);
      const xValue = Math.abs(x);

      if (yValue > 100 || xValue > 100) {
        runOnJS(onGestureEnd)();
      }
    });

  const onPastePress = async () => {
    const text = await Clipboard.getString();
    openAddPickStack({text});
  };

  useEffect(() => {
    setTimeout(() => {
      isMounted.current = true;
    }, 100);
  }, []);

  const pasteAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: withSpring(
            isExpanded ? penY.value - 70 : 120,
            springAnimationOptions,
          ),
        },
      ],
      opacity: withTiming(isExpanded ? 1 : 0, {duration: 100}),
    };
  });

  const containerStyle: any = useMemo(() => {
    if (isSecondary) {
      return {
        position: 'absolute',
        bottom: PICKS_EDITOR_HEIGHT + 6,
        alignSelf: 'flex-end',
        right: 8,
        zIndex: 5,
      };
    }

    return {
      ...styles.container,
      bottom: 0,
      paddingBottom: insets.bottom + 12,
      paddingTop: 8,
    };
  }, []);

  const secondaryButtonStyle = useMemo(() => {
    if (isSecondary) {
      return {
        transform: [{scale: 0.95}],
      };
    }
    return {};
  }, []);

  return (
    <>
      <View style={containerStyle}>
        <View style={styles.content}>
          <GestureDetector gesture={panGestureHandler}>
            <Animated.View
              style={[styles.primaryButtonOuter, animatedPrimaryButton]}>
              <ScaleButton
                onPress={onPrimaryPress}
                isHaptic
                style={styles.primaryButton}>
                <Animated.View style={animatedAddIcon}>
                  <IconProvider Icon={AddIcon} color="#fff" />
                </Animated.View>
              </ScaleButton>
            </Animated.View>
          </GestureDetector>

          <Animated.View
            style={[
              animatedCursorStyle,
              {backgroundColor: theme.colors.accent},
              styles.cursor,
            ]}></Animated.View>

          {/* Buttons */}

          {!isSecondary && isPasteButtonVisible && (
            <Animated.View
              style={[styles.pasteButtonOuter, pasteAnimatedStyle]}>
              <ScaleButton
                onPress={onPastePress}
                style={[styles.pasteButton, backgroundStyle]}>
                <IconProvider Icon={PasteIcon} />

                <MainText uppercase>Paste</MainText>
              </ScaleButton>
            </Animated.View>
          )}

          <Animated.View
            style={[styles.secondaryButtonOuter, animatedMicStyle]}>
            <ScaleButton
              onPress={() => {
                onInputStatePress(InputModes.Mic);
              }}
              style={[
                styles.secondaryButton,
                secondaryButtonStyle,
                backgroundStyle,
              ]}>
              <IconProvider Icon={MicIcon} />
            </ScaleButton>
          </Animated.View>

          <Animated.View
            style={[styles.secondaryButtonOuter, animatedPenStyle]}>
            <ScaleButton
              onPress={() => {
                onInputStatePress(InputModes.Pen);
              }}
              style={[
                styles.secondaryButton,
                secondaryButtonStyle,
                backgroundStyle,
              ]}>
              <IconProvider Icon={TextInputIcon} />
            </ScaleButton>
          </Animated.View>

          <Animated.View
            style={[styles.secondaryButtonOuter, animatedCameraStyle]}>
            <ScaleButton
              onPress={() => {
                onInputStatePress(InputModes.Scan);
              }}
              style={[
                styles.secondaryButton,
                secondaryButtonStyle,
                backgroundStyle,
              ]}>
              <IconProvider Icon={CameraIcon} />
            </ScaleButton>
          </Animated.View>
        </View>
      </View>

      {!isSecondary && (
        <LinearGradient
          style={styles.gradient}
          colors={theme.colors.gradient}
        />
      )}

      {isBackDropVisible && (
        <TouchableWithoutFeedback
          onPress={() => {
            setIsExpanded(false);
          }}>
          <Animated.View
            style={[styles.overlay, backDropStyle]}></Animated.View>
        </TouchableWithoutFeedback>
      )}
    </>
  );
};

export default AddNewMenu;
