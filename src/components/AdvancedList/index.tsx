import {GlobalEvents} from '@/constants/events';
import useEventListener from '@/hooks/useEventListener';
import mergeRefs from '@/utils/mergeRefs';
import {useIsFocused} from '@react-navigation/native';
import {FlashList, FlashListProps} from '@shopify/flash-list';
import {isUndefined, size} from 'lodash';
import React, {
  forwardRef,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {FlatListProps, LayoutAnimation, View} from 'react-native';
import Animated, {
  FadeIn,
  FadeOut,
  LinearTransition,
  runOnJS,
  useAnimatedScrollHandler,
} from 'react-native-reanimated';
import AnimatedCell from '../AnimatedCell';
import Loader from '../Loader';

type CombinedListProps = FlashListProps<any> & FlatListProps<any>;

interface EndReachedParams {
  bulkCount: number;
  startFrom?: number;
  triggerIfInitialCountMoreThan?: number;
}

interface AdvancedListProps extends CombinedListProps {
  estimatedItemSize?: number;
  scrollY?: any;
  scrollX?: any;
  isAnimated?: boolean;
  isRefreshing?: boolean;
  isNotFound?: boolean;
  cellGap?: number;
  isLoading?: boolean;
  isLoadingTop?: boolean;
  onRefresh?: () => void;
  onChangeIndex?: (index: number) => void;
  itemSize?: number;
  mockDataWhileLoading?: boolean;
  loaderStyle?: any;

  endReachedParams?: EndReachedParams;
}

const MOCKED_DATA = [
  {id: 'mock-1', guid: 'mock-1', content: ''},
  {id: 'mock-2', guid: 'mock-2', content: ''},
  {id: 'mock-3', guid: 'mock-3', content: ''},
];

const AdvancedList = forwardRef((props: AdvancedListProps, ref) => {
  const {
    data,
    estimatedItemSize,
    scrollY,
    scrollX,
    onScroll,
    onRefresh,
    isRefreshing,
    isAnimated,
    renderItem,
    cellGap,
    isLoading,
    isLoadingTop,
    isNotFound,
    onMomentumScrollEnd,
    onChangeIndex,
    itemSize,
    ListEmptyComponent,
    mockDataWhileLoading,
    onEndReached,
    loaderStyle,
    endReachedParams,
    keyExtractor,
  } = props;

  const dataSize = useMemo(() => {
    return size(data);
  }, [data]);

  const isListEmpty = dataSize === 0;

  const listRef = useRef<any>(null);

  const endReached = useRef<boolean>(false);
  const latestDataSize = useRef(dataSize);

  const isFlashList = estimatedItemSize != undefined;

  const [mockedData, setMockedData] = useState<any[]>([]);
  const [isLayoutLoaded, setIsLayoutLoaded] = useState(!isFlashList);

  const currentData = isLoading && isListEmpty ? mockedData : data;
  const isRenderingMockedData = mockedData.length > 0;

  /* Props */

  const List = React.useMemo(() => {
    if (isFlashList) {
      return Animated.createAnimatedComponent(FlashList);
    }

    return Animated.FlatList;
  }, [isFlashList]);

  /* Callbacks */

  const _onScroll = (nativeEvent: any) => {
    onScroll?.(nativeEvent);
  };

  const onScrollHandler = useAnimatedScrollHandler(nativeEvent => {
    const {
      contentOffset: {y, x},
    } = nativeEvent;

    if (scrollY) {
      scrollY.value = y;
    }

    if (scrollX) {
      scrollX.value = x;
    }

    runOnJS(_onScroll)(nativeEvent);
  });

  const _onEndReached = useCallback(() => {
    // const haEnoughData =
    //   bulkCount != undefined ? dataSize % bulkCount === 0 : true;
    // if (
    //   !isRenderingMockedData &&
    //   !endReached.current &&
    //   dataSize > 0 &&
    //   haEnoughData
    // ) {
    //   endReached.current = true;
    //   onEndReached?.();
    // }

    if (
      isRenderingMockedData ||
      endReached.current ||
      dataSize === 0 ||
      !endReachedParams
    ) {
      return;
    }

    const bulkCount = endReachedParams.bulkCount;
    const startFrom = endReachedParams.startFrom ?? 0;
    const triggerIfInitialCountMoreThan =
      endReachedParams.triggerIfInitialCountMoreThan ?? 0;

    const offsetDataSize = Math.max(dataSize - startFrom, 0);

    if (
      startFrom >= triggerIfInitialCountMoreThan &&
      offsetDataSize % bulkCount === 0
    ) {
      endReached.current = true;
      onEndReached?.();
    }
  }, [
    endReached.current,
    endReachedParams,
    isRenderingMockedData,
    dataSize,
    onEndReached,
  ]);

  const _onMomentumScrollEnd = useCallback(
    ({nativeEvent: {contentOffset}}: any) => {
      onMomentumScrollEnd?.({...contentOffset});

      const {x} = contentOffset;
      const offsetValue = x;

      if (!isUndefined(onChangeIndex) && !isUndefined(itemSize)) {
        const index = Math.max(0, Math.floor(offsetValue / itemSize));
        let maxInData = Math.min(index, dataSize - 1);

        onChangeIndex(maxInData);
      }
    },
    [itemSize, dataSize, onChangeIndex, onMomentumScrollEnd],
  );

  /* Methods */

  const _keyExtractor =
    keyExtractor ??
    useCallback((item: any) => {
      const id = item?.id ?? item?.guid;
      return String(id);
    }, []);

  const refreshLayout = () => {
    if (listRef?.current?.prepareForLayoutAnimationRender) {
      listRef.current?.prepareForLayoutAnimationRender();
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    }
  };

  const getItemLayout = useCallback(
    (_: any, index: number) => {
      if (itemSize != undefined) {
        return {
          length: itemSize,
          offset: itemSize * index,
          index,
        };
      }

      return {
        length: 0,
        offset: 0,
        index,
      };
    },
    [itemSize],
  );

  /* Render Components */

  const _renderItem = useCallback(
    (props: any) => {
      if (!renderItem) {
        return null;
      }

      if (isAnimated) {
        return (
          <AnimatedCell style={{marginBottom: cellGap}}>
            {renderItem(props)}
          </AnimatedCell>
        );
      }

      if (cellGap !== undefined) {
        return <View style={{marginBottom: cellGap}}>{renderItem(props)}</View>;
      } else {
        return renderItem(props);
      }
    },
    [renderItem, isAnimated],
  );

  /* Effects */

  useEffect(() => {
    endReached.current = false;

    if (dataSize > latestDataSize.current) {
      latestDataSize.current = dataSize;
    }

    if (dataSize <= latestDataSize.current) {
      refreshLayout();
    }
  }, [dataSize]);

  useEffect(() => {
    if (mockDataWhileLoading && isLoading && !isNotFound) {
      setMockedData(MOCKED_DATA);
    } else {
      setMockedData([]);

      if (mockDataWhileLoading) {
        refreshLayout();
      }
    }
  }, [isLoading, isNotFound]);

  useEventListener(
    {identifier: GlobalEvents.UpdateListLayout},
    refreshLayout,
    [],
  );

  return (
    <View
      style={{flex: 1}}
      onLayout={() => {
        setIsLayoutLoaded(true);
      }}>
      {isLayoutLoaded && (
        <List
          onRefresh={onRefresh}
          refreshing={isRefreshing}
          keyExtractor={_keyExtractor}
          onScroll={onScrollHandler}
          ListHeaderComponent={
            isLoadingTop ? (
              <Animated.View
                entering={FadeIn}
                exiting={FadeOut}
                layout={LinearTransition.springify().damping(16)}
                style={[{alignItems: 'center', marginBottom: 16}, loaderStyle]}>
                <Loader isActive />
              </Animated.View>
            ) : undefined
          }
          {...props}
          renderItem={_renderItem}
          onEndReached={_onEndReached}
          onEndReachedThreshold={0.2}
          scrollEventThrottle={16}
          data={currentData}
          ref={mergeRefs(listRef, ref)}
          // getItemLayout={getItemLayout}
          itemLayoutAnimation={LinearTransition.springify().damping(16)}
          onMomentumScrollEnd={_onMomentumScrollEnd}
          ListEmptyComponent={isNotFound ? ListEmptyComponent : undefined}
          ListFooterComponent={
            !isLoadingTop && isLoading && !isNotFound ? (
              <Animated.View
                entering={FadeIn}
                exiting={FadeOut}
                style={[{alignItems: 'center', marginTop: 8}, loaderStyle]}>
                <Loader isActive />
              </Animated.View>
            ) : undefined
          }
        />
      )}
    </View>
  );
});

export default AdvancedList;
