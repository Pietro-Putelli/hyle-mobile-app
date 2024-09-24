import {CustomButton, Pagination, RenderItem} from '@/components/Onboarding';
import React, {useMemo} from 'react';
import {useTranslation} from 'react-i18next';
import {StatusBar, StyleSheet, View, ViewToken} from 'react-native';
import Animated, {
  useAnimatedRef,
  useAnimatedScrollHandler,
  useSharedValue,
} from 'react-native-reanimated';
import onboardingData from './data';

const OnBoarding = () => {
  const flatListRef = useAnimatedRef<any>();
  const scrollX = useSharedValue(0);
  const flatListIndex = useSharedValue(0);
  const {t} = useTranslation();

  const onViewableItemsChanged = ({
    viewableItems,
  }: {
    viewableItems: ViewToken[];
  }) => {
    if (viewableItems[0]?.index !== null && flatListIndex) {
      flatListIndex.value = viewableItems[0]?.index;
    }
  };

  const onScroll = useAnimatedScrollHandler({
    onScroll: event => {
      scrollX.value = event.contentOffset.x;
    },
  });

  const data = useMemo(() => {
    return onboardingData.map((item: any, index: number) => {
      return {
        ...item,
        text: (t('Onboarding:items', {returnObjects: true}) as any)[index]
          .title,
        description: (t('Onboarding:items', {returnObjects: true}) as any)[
          index
        ].description,
      };
    });
  }, []);

  return (
    <>
      <StatusBar barStyle="dark-content" />

      <View style={[styles.container]}>
        <Animated.FlatList
          ref={flatListRef}
          onScroll={onScroll}
          data={data}
          renderItem={({item, index}) => {
            return <RenderItem item={item} index={index} x={scrollX} />;
          }}
          keyExtractor={item => item.id.toString()}
          scrollEventThrottle={16}
          horizontal={true}
          bounces={false}
          pagingEnabled={true}
          showsHorizontalScrollIndicator={false}
          onViewableItemsChanged={onViewableItemsChanged}
          viewabilityConfig={{
            minimumViewTime: 300,
            viewAreaCoveragePercentThreshold: 10,
          }}
        />

        <View style={styles.bottomContainer}>
          <Pagination data={onboardingData} x={scrollX} />

          <CustomButton
            flatListRef={flatListRef}
            flatListIndex={flatListIndex}
            dataLength={onboardingData.length}
            x={scrollX}
          />
        </View>
      </View>
    </>
  );
};

export default OnBoarding;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  bottomContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 30,
    paddingVertical: 30,
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
  },
});
