import BookAPI from '@/api/routes/book';
import {MiddlewareDispatch} from '@/api/types';
import AdvancedList from '@/components/AdvancedList';
import {FadeAnimatedView} from '@/components/Animations';
import SelectBookCell from '@/components/BookCell/SelectBookCell';
import {MainButton} from '@/components/Buttons';
import {ModalContainer} from '@/components/Containers';
import MainText from '@/components/MainText';
import SearchBar from '@/components/SearchBar';
import RouteNames from '@/constants/routeNames';
import useBooksList from '@/hooks/useBooksList';
import useTheme from '@/hooks/useTheme';
import {flushStateEditPickState} from '@/storage/slices/editPickSlice';
import {useNavigation, useRoute} from '@react-navigation/native';
import React, {useCallback, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {View} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useDispatch} from 'react-redux';
import styles from './styles';

const BooksSelector = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<any>();
  const dispatch = useDispatch<MiddlewareDispatch>();
  const theme = useTheme();
  const {params} = useRoute<any>();
  const {t} = useTranslation();

  const pick = params?.pick;

  const [selected, setSelected] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  const {
    books,
    isLoading: isLoadingList,
    isNotFound,
    getMoreBooks,
    searchBooks,
  } = useBooksList();

  const onDonePress = () => {
    setIsLoading(true);

    if (isLoading) {
      return;
    }

    dispatch(
      BookAPI.create({bookId: selected, parts: pick.parts}, isSucceded => {
        if (isSucceded) {
          dispatch(flushStateEditPickState());

          navigation.navigate(RouteNames.Root);
        }
      }),
    );
  };

  const onSearch = ({text}: any) => {
    searchBooks(text);
  };

  const renderItem = useCallback(
    ({item}: any) => {
      const isSelected = selected === item.guid;

      return (
        <SelectBookCell
          book={item}
          isSelected={isSelected}
          onPress={() => {
            const newId = isSelected ? null : item.guid;
            setSelected(newId);
          }}
        />
      );
    },
    [selected],
  );

  return (
    <ModalContainer
      showBackButton
      hideCloseButton
      title={t('Common:selectBook')}
      scrollDisabled
      style={styles.container}>
      <View style={{paddingHorizontal: 12, flex: 1}}>
        <SearchBar
          onSearch={onSearch}
          style={{backgroundColor: theme.colors.secondaryBackground}}
        />

        <View style={{paddingTop: 12, flex: 1}}>
          <AdvancedList
            data={books}
            isLoading={isLoadingList}
            renderItem={renderItem}
            keyboardDismissMode="on-drag"
            isAnimated
            isNotFound={isNotFound}
            ListEmptyComponent={
              <FadeAnimatedView style={{marginTop: 16}}>
                <MainText align="center">
                  {t('Placeholders:bookSelector')}
                </MainText>
              </FadeAnimatedView>
            }
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
              paddingBottom: 16,
              paddingTop: 16,
            }}
            onEndReached={getMoreBooks}
          />
        </View>
      </View>

      <View
        style={{
          paddingHorizontal: 12,
          paddingBottom: insets.bottom + 16,
          paddingTop: 16,
          backgroundColor: theme.colors.secondaryBackground,
        }}>
        <MainButton
          disabled={!selected}
          title={t('Actions:addNewPick')}
          onPress={onDonePress}
          type="primary"
          isLoading={isLoading}
          loadingText={t('Common:addingPick')}
          fullLoadingDuration={6000}
          isHaptic
        />
      </View>
    </ModalContainer>
  );
};

export default BooksSelector;
