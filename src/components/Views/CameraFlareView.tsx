import * as React from 'react';
import {StyleSheet} from 'react-native';
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

export type CameraFlareViewRef = {
  flare: () => void;
};

const CameraFlareView = React.forwardRef(
  (_, ref: React.Ref<CameraFlareViewRef>) => {
    const opacity = useSharedValue(0);

    const [isVisible, setIsVisible] = React.useState(false);

    React.useImperativeHandle(ref, () => ({
      flare: () => {
        setIsVisible(true);

        opacity.value = withTiming(1, {duration: 150}, finished => {
          if (finished) {
            opacity.value = 0;

            runOnJS(setIsVisible)(false);
          }
        });
      },
    }));

    const animatedContainerStyle = useAnimatedStyle(() => {
      return {
        opacity: opacity.value,
      };
    });

    const containerStyle = React.useMemo(() => {
      return [
        {
          ...StyleSheet.absoluteFillObject,
          backgroundColor: 'black',
          zIndex: 10,
        },
        animatedContainerStyle,
      ];
    }, []);

    if (!isVisible) {
      return null;
    }

    return <Animated.View style={containerStyle} />;
  },
);

export default CameraFlareView;
