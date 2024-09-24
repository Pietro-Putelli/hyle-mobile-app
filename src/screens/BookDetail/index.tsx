import BookAPI from '@/api/routes/book';
import {MiddlewareDispatch} from '@/api/types';
import MoreIcon from '@/assets/icons/MoreIcon.svg';
import AddNewMenu from '@/components/AddNewMenu';
import AdvancedList from '@/components/AdvancedList';
import {MainContainer} from '@/components/Containers';
import {BookDetailHeader} from '@/components/Headers';
import IconProvider from '@/components/IconProvider';
import LoadingView from '@/components/LoadingView';
import PickCell from '@/components/PickCell';
import PicksEditorController from '@/components/PicksEditorController';
import BookPlaceholder from '@/components/Placeholders/BookPlaceholder';
import ToastView from '@/components/ToastView';
import {GlobalEvents} from '@/constants/events';
import FetchLimits from '@/constants/fetchLimits';
import RouteNames from '@/constants/routeNames';
import useBooks from '@/hooks/useBooks';
import useTheme from '@/hooks/useTheme';
import TranslationModal from '@/modals/TranslationModal';
import {KeywordTypeValue, TextPartProps} from '@/types/AddPick';
import {generateMenuOptions} from '@/utils/menuOptions';
import openShare from '@/utils/shareProvider';
import {useNavigation, useRoute} from '@react-navigation/native';
import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {Alert, Keyboard, View} from 'react-native';
import {EventRegister} from 'react-native-event-listeners';
import {ContextMenuButton} from 'react-native-ios-context-menu';
import {useSharedValue} from 'react-native-reanimated';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useDispatch} from 'react-redux';
import styles from './styles';
import {FadeAnimatedView} from '@/components/Animations';
import {size} from 'lodash';

const BookDetail = () => {
  const route = useRoute<any>();
  const navigation = useNavigation<any>();
  const insets = useSafeAreaInsets();
  const scrollY = useSharedValue(0);
  const scrollRef = useRef<any>();
  const theme = useTheme();
  const dispatch = useDispatch<MiddlewareDispatch>();
  const {t} = useTranslation();

  const params = useRef(route.params).current;

  const bookId = params?.bookId;
  const isModal = params?.isModal;

  const [toastInfo, setToastInfo] = useState<any>({});
  const [isDeletingBook, setIsDeletingBook] = useState<boolean>(false);
  const [pickToDelete, setPickToDelete] = useState<string | null>(null);

  /* Use to disable load more when the end is reached */
  const [pickSearchingForId, setPickSearchingForId] = useState<number | null>(
    null,
  );
  const isLoadMoreDisabled = useRef<boolean>(false);

  const {
    book,
    isBookCached,
    picks,
    picksLength,
    isLoading,
    isReversingPicks,
    isLoadingPicks,
    reversePicks,
    getBookPicks,
    deleteBookPick,
    initialPicksCount,
  } = useBooks({bookId});

  const [searchPickId, setSearchPickId] = useState<number | null>(null);
  const [selectedPart, setSelectedPart] = useState<TextPartProps | undefined>();

  const [isTranslationModalOpen, setIsTranslationModalOpen] =
    useState<boolean>(false);

  const moreOptionsMenuConfig = useMemo(() => {
    const options: any[] = [
      {title: t('Actions:share'), icon: 'Share', key: 'share'},
      {title: t('Actions:editMetadata'), icon: 'Pen', key: 'editmetadata'},
      {title: t('Actions:editTopics'), icon: 'Tag', key: 'edittopics'},
    ];

    if (!isBookCached) {
      options.push({
        title: t('Actions:delete'),
        icon: 'Trash',
        isDestructive: true,
      });
    }

    return generateMenuOptions({options});
  }, [theme, isBookCached]);

  /* Callbacks */

  const onPressMenuItem = ({nativeEvent}: any) => {
    const actionKey = nativeEvent.actionKey;

    if (actionKey === 'delete') {
      Alert.alert(t('Popups:deleteBookTitle'), t('Popups:deleteBookMessage'), [
        {
          text: t('Actions:cancel'),
          style: 'cancel',
        },
        {
          text: t('Actions:delete'),
          style: 'destructive',
          onPress: () => {
            setIsDeletingBook(true);

            dispatch(
              BookAPI.delete(book.guid, () => {
                Keyboard.dismiss();

                navigation.navigate(RouteNames.Home);
                EventRegister.emit(GlobalEvents.DeleteBook);
              }),
            );
          },
        },
      ]);
    } else if (actionKey == 'edittopics') {
      navigation.navigate(RouteNames.EditTopics, {bookId: book.guid});
    } else if (actionKey == 'editmetadata') {
      navigation.navigate(RouteNames.EditMetadata, {bookId: book.guid});
    } else if (actionKey == 'share') {
      openShare({data: book, message: t('Common:shareBookMessage')});
    }
  };

  const onKeywordPress = (partData: any) => {
    const {pickId, type, content} = partData;

    if (type == KeywordTypeValue.TRANSLATION) {
      setSelectedPart(partData);
      setIsTranslationModalOpen(true);
    } else {
      navigation.navigate(RouteNames.KeywordDetails, {
        pickId,
        bookId: book.guid,
        selectedPart: content,
      });
    }
  };

  const onDeletePress = (pickId: string) => {
    Alert.alert(t('Popups:deletePickTitle'), t('Popups:deletePickMessage'), [
      {text: t('Actions:cancel'), style: 'cancel'},
      {
        text: t('Actions:delete'),
        style: 'destructive',
        onPress: () => {
          if (bookId != undefined) {
            setPickToDelete(pickId);

            deleteBookPick(pickId, (isLastPickDeleted: boolean) => {
              if (isLastPickDeleted) {
                navigation.navigate(RouteNames.Home);
              }
            });
          }
        },
      },
    ]);
  };

  /* Render */

  const renderItem = useCallback(
    ({item, index}: any) => {
      const isFoundInSearch = searchPickId === item?.guid;

      return (
        <PickCell
          book={book}
          pick={item}
          index={index}
          onDeletePress={onDeletePress}
          onKeywordPress={onKeywordPress}
          isFoundInSearch={isFoundInSearch}
          onEndHighlight={() => setSearchPickId(null)}
          onCopyPress={() => {
            setToastInfo({title: t('Actions:copied'), isVisible: true});
          }}
          isDeleting={pickToDelete === item.guid}
          swipeToEditEnabled
          disableInteraction={isReversingPicks}
        />
      );
    },
    [book, picksLength, searchPickId, pickToDelete, isReversingPicks],
  );

  const RightMenuButton = useMemo(() => {
    return (
      <ContextMenuButton
        pointerEvents={isLoading ? 'none' : 'auto'}
        style={styles.contextButton}
        onPressMenuItem={onPressMenuItem}
        menuConfig={moreOptionsMenuConfig}>
        <IconProvider Icon={MoreIcon} />
      </ContextMenuButton>
    );
  }, [isLoading, onPressMenuItem]);

  const triggerIfInitialCountMoreThan = useMemo(() => {
    const lastPick = picks[picksLength - 1];

    if (
      lastPick &&
      (lastPick.index == 0 || lastPick.index == picksLength - 1)
    ) {
      return 3;
    }

    return undefined;
  }, [picks]);

  /* Functions */

  const scrollToItem = ({item, viewPosition}: any) => {
    setTimeout(() => {
      scrollRef.current?.scrollToItem({
        animated: true,
        item,
        viewPosition,
      });
    }, 200);
  };

  const onEndReached = () => {
    if (isLoadMoreDisabled.current) {
      return;
    }

    getBookPicks();
  };

  /* Effects */

  useEffect(() => {
    const searchPickId = route.params?.searchPickId;

    if (searchPickId != undefined) {
      const pick = picks.find((pick: any) => pick.guid === searchPickId);

      if (pick == undefined) {
        /* Needs to load picks until the chunk that contains the selected one */
        console.log("The pick wasn't found in the current chunk", searchPickId);

        isLoadMoreDisabled.current = true;

        setTimeout(() => {
          scrollRef.current?.scrollToEnd({animated: true});
        }, 250);

        getBookPicks({untilPickId: searchPickId}, (index: any) => {
          setTimeout(() => {
            scrollRef.current.scrollToIndex({
              index,
              viewPosition: 0,
              animated: true,
            });
          }, 1500);

          setTimeout(() => {
            setSearchPickId(searchPickId);
            isLoadMoreDisabled.current = false;
          }, 2000);
        });
      } else {
        setSearchPickId(searchPickId);
        scrollToItem({item: pick, viewPosition: 0.4});
      }
    }
  }, [route.params, scrollRef.current]);

  // useEffect(() => {
  //   return;
  //   const foundPick = picks.find(
  //     (pick: any) => pick.guid === pickSearchingForId,
  //   );

  //   console.log(
  //     'Found pick',
  //     picks.length,
  //     picks.map(pick => pick.guid),
  //     pickSearchingForId,
  //   );
  //   return;

  //   if (isLoadMoreDisabled.current && pickSearchingForId != null) {
  //     if (foundPick != undefined) {
  //       setTimeout(() => {
  //         scrollRef.current?.scrollToItem({
  //           animated: true,
  //           item: foundPick,
  //           viewPosition: 0.4,
  //         });
  //       }, 1000);
  //     }
  //   }
  // }, [picks, pickSearchingForId]);

  return (
    <>
      <MainContainer
        headerProps={{
          scrollY,
          title: book?.title ?? '',
          RightComponent: isLoading ? null : RightMenuButton,
          onPress: () => {
            scrollRef.current?.scrollToOffset({offset: 0, animated: true});
          },
        }}
        isModal={isModal}
        style={{paddingBottom: 0}}
        showStackHeader>
        {isLoading ? (
          <BookPlaceholder />
        ) : (
          <View style={{flex: 1}}>
            <FadeAnimatedView style={{flex: 1}}>
              <AdvancedList
                endReachedParams={{
                  bulkCount: FetchLimits.PICKS,
                  startFrom: initialPicksCount,
                  triggerIfInitialCountMoreThan,
                }}
                estimatedItemSize={300}
                isLoading={isLoadingPicks}
                ref={scrollRef}
                scrollY={scrollY}
                mockDataWhileLoading
                showsVerticalScrollIndicator={false}
                ListHeaderComponent={
                  !isLoading ? (
                    <BookDetailHeader
                      isReversingPicks={isReversingPicks}
                      onReversePress={reversePicks}
                      book={book}
                    />
                  ) : undefined
                }
                data={picks}
                renderItem={renderItem}
                contentContainerStyle={{
                  paddingHorizontal: 8,
                  paddingBottom: insets.bottom + 130,
                }}
                extraData={[searchPickId, picks]}
                onEndReached={onEndReached}
                loaderStyle={{marginTop: 24}}
                getItemLayout={(_, index) => {
                  return {length: 100, offset: 300 * index, index};
                }}
                onEndReachedThreshold={0.1}
                onScrollToIndexFailed={(info: any) => {
                  console.log('Failed to scroll to index', info);
                }}
              />
            </FadeAnimatedView>

            {book != undefined && (
              <PicksEditorController
                book={book}
                isSearchEnabled={!isModal}
                isBookCached={isBookCached}
                onBookSaved={() => {
                  setToastInfo({title: t('Common:bookSaved'), isVisible: true});
                }}
              />
            )}
          </View>
        )}
      </MainContainer>

      {!isLoading && <AddNewMenu type="secondary" bookId={bookId} />}

      {selectedPart != undefined && (
        <TranslationModal
          annotation={selectedPart}
          isOpen={isTranslationModalOpen}
          setIsOpen={setIsTranslationModalOpen}
        />
      )}

      <ToastView {...toastInfo} setInfo={setToastInfo} />

      <LoadingView
        title={t('Common:deletingBook')}
        isVisible={isDeletingBook}
      />
    </>
  );
};

export default BookDetail;
