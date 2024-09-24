import usePhotoHistory from '@/hooks/usePhotoHistory';
import React, {forwardRef, useCallback, useImperativeHandle} from 'react';
import {View} from 'react-native';
import {Gesture, GestureDetector} from 'react-native-gesture-handler';
import Animated, {
  FadeIn,
  FadeOut,
  LinearTransition,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import PhotoCell from './PhotoCell';
import styles, {PHOTO_CELL_SIDE} from './styles';

const TOP_Y_LIMIT = PHOTO_CELL_SIDE + 16;

const springConfig = {damping: 16};

const PhotosHistory = forwardRef(({onPress}: any, ref) => {
  const startY = useSharedValue(0);
  const translateY = useSharedValue(0);
  const isOpen = useSharedValue(true);

  const {photos, removePhotoFromHistory} = usePhotoHistory();

  const hasPhotos = photos.length > 0;

  useImperativeHandle(
    ref,
    () => ({
      toggle: () => {
        isOpen.value = !isOpen.value;

        translateY.value = withSpring(
          !isOpen.value ? 0 : PHOTO_CELL_SIDE + 8,
          springConfig,
        );
      },
    }),
    [isOpen],
  );

  const renderItem = useCallback(
    ({item}: any) => {
      return (
        <PhotoCell
          item={item}
          onPress={onPress}
          onRemovePress={removePhotoFromHistory}
        />
      );
    },
    [onPress, removePhotoFromHistory],
  );

  const animatedStyles = useAnimatedStyle(() => {
    return {
      transform: [{translateY: translateY.value}],
    };
  }, []);

  const panGesture = Gesture.Pan()
    .onBegin(() => {
      startY.value = translateY.value;
    })
    .onChange(({translationY, velocityY}) => {
      if (isOpen.value && velocityY < 0) {
        translateY.value = startY.value + translationY / 16;
      } else {
        translateY.value = startY.value + translationY;
      }
    })
    .onEnd(({translationY}) => {
      if (translationY > TOP_Y_LIMIT / 4) {
        isOpen.value = false;
        translateY.value = withSpring(PHOTO_CELL_SIDE + 8, springConfig);
      } else {
        isOpen.value = true;
        translateY.value = withSpring(0, springConfig);
      }
    });

  if (!hasPhotos) {
    return null;
  }

  return (
    <GestureDetector gesture={panGesture}>
      <Animated.View
        entering={FadeIn}
        exiting={FadeOut}
        style={[styles.container, animatedStyles]}>
        <View style={styles.cursor} />

        <View style={{width: '100%'}}>
          <Animated.FlatList
            itemLayoutAnimation={LinearTransition.springify().damping(16)}
            horizontal
            data={photos}
            keyExtractor={(_, index) => index.toString()}
            renderItem={renderItem}
            contentContainerStyle={{gap: 6, paddingHorizontal: 4}}
            showsHorizontalScrollIndicator={false}
          />
        </View>
      </Animated.View>
    </GestureDetector>
  );
});

export default PhotosHistory;
