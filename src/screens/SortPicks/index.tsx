import {ModalContainer} from '@/components/Containers';
import Loader from '@/components/Loader';
import PickCell from '@/components/PickCell';
import useBooks from '@/hooks/useBooks';
import {PickProps} from '@/types/Book';
import {useNavigation, useRoute} from '@react-navigation/native';
import {cloneDeep} from 'lodash';
import React, {useCallback, useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {View} from 'react-native';
import DraggableFlatList, {
  ScaleDecorator,
} from 'react-native-draggable-flatlist';
import Animated, {FadeIn, FadeOut} from 'react-native-reanimated';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

const SortPicks = () => {
  const {params} = useRoute<any>();
  const navigation = useNavigation<any>();
  const insets = useSafeAreaInsets();
  const {t} = useTranslation();

  const bookId = params?.bookId;

  const {picks, isLoadingPicks, picksLength, updatePickOrder, getBookPicks} =
    useBooks({bookId});

  const [tempPicks, setTempPicks] = useState<PickProps[]>(picks);
  const [isLoading, setIsLoading] = useState(false);

  const hasPickOrderChanged = picks.some(
    (pick: any, index: number) => pick.guid != tempPicks[index]?.guid,
  );

  /* Callbacks */

  const onDonePress = () => {
    if (hasPickOrderChanged) {
      setIsLoading(true);

      updatePickOrder(tempPicks, () => {
        navigation.goBack();
      });
    } else {
      navigation.goBack();
    }
  };

  const onDragEnd = ({data}: any) => {
    const newOrderData = cloneDeep(tempPicks);

    for (let i = 0; i < tempPicks.length; i++) {
      const oldPick = tempPicks[i];
      const newPick = data[i];

      if (oldPick.guid != newPick.guid) {
        newOrderData[i] = newPick;
      }
    }

    setTempPicks(newOrderData);
  };

  const renderItem = useCallback(
    ({item, drag, getIndex}: any) => {
      const index = getIndex();
      const pickIndex = picksLength - 1 - index;

      return (
        <ScaleDecorator activeScale={0.95}>
          <PickCell pick={item} onLongPress={drag} index={pickIndex} />
        </ScaleDecorator>
      );
    },
    [picks],
  );

  const keyExtractor = useCallback((item: any) => item.guid, []);

  useEffect(() => {
    setTempPicks(picks);
  }, [picks]);

  return (
    <ModalContainer
      scrollDisabled
      onDonePress={onDonePress}
      isDoneButtonLoading={isLoading}
      isDoneButtonEnabled={hasPickOrderChanged}
      description={t('Common:dragAndDropToReorder')}
      title="Sort picks">
      <View style={{flex: 1}}>
        <DraggableFlatList
          keyExtractor={keyExtractor}
          data={tempPicks}
          renderItem={renderItem}
          onDragEnd={onDragEnd}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingTop: 8,
            paddingBottom: insets.bottom + 64,
          }}
          onEndReached={() => {
            getBookPicks();
          }}
          onEndReachedThreshold={0.3}
          ListFooterComponent={() => (
            <Animated.View
              entering={FadeIn}
              exiting={FadeOut}
              style={[{alignItems: 'center', marginTop: 8}]}>
              <Loader isActive={isLoadingPicks} />
            </Animated.View>
          )}
        />
      </View>
    </ModalContainer>
  );
};

export default SortPicks;
