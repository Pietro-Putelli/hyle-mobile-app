import useTheme from '@/hooks/useTheme';
import {isEmpty} from 'lodash';
import React, {useCallback, useEffect, useMemo, useRef} from 'react';
import {FlatList, View} from 'react-native';
import TopicCell from './TopicCell';
import styles from './styles';

const TopicsSelector = ({onPress, isLoading, topics, selected}: any) => {
  const theme = useTheme();
  const scrollRef = useRef<FlatList>(null);

  const _isEmpty = topics.length === 0;

  const _topics = useMemo(() => {
    if (isLoading) {
      return [{topic: 'm1'}, {topic: 'm2'}, {topic: 'm3'}];
    }

    if (!_isEmpty) {
      return topics;
      // return [...topics, {id: -1}];
    }

    return topics;
  }, [isLoading, _isEmpty, topics]);

  /* Render */

  const renderItem = useCallback(
    ({item, index}: any) => {
      const isSelected = selected?.includes(item.topic);
      const isLast = index === topics.length - 1;

      return (
        <TopicCell
          isSelected={isSelected}
          onPress={() => {
            onPress(item);

            if (index == 0) {
              scrollRef.current?.scrollToIndex({index: 0, animated: true});
            }
          }}
          topic={item}
          isMocked={isLoading}
          index={index}
          isLast={isLast}
        />
      );
    },
    [selected, onPress, isLoading, topics],
  );

  const keyExtractor = useCallback((item: any) => {
    return item?.id ?? item.topic;
  }, []);

  /* Effects */

  useEffect(() => {
    if (!isEmpty(selected)) {
      const lastSelected = selected[selected.length - 1];
      const index = _topics.findIndex(
        (topic: any) => topic.topic === lastSelected,
      );

      scrollRef.current?.scrollToItem({
        animated: true,
        item: _topics[index],
        viewPosition: 0.25,
      });
    }
  }, [selected]);

  return (
    <View
      style={[styles.container, {backgroundColor: theme.colors.background}]}>
      <FlatList
        horizontal
        ref={scrollRef}
        data={_topics}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        showsHorizontalScrollIndicator={false}
      />
    </View>
  );
};

export default TopicsSelector;
