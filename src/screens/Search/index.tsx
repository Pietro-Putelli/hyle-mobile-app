import BookAPI from '@/api/routes/book';
import CloseIcon from '@/assets/icons/CloseIcon.svg';
import AdvancedList from '@/components/AdvancedList';
import {ScaleButton} from '@/components/Buttons';
import {MainContainer} from '@/components/Containers';
import IconProvider from '@/components/IconProvider';
import MainText from '@/components/MainText';
import {SearchPlaceholder} from '@/components/Placeholders';
import SearchBar from '@/components/SearchBar';
import SearchResultCell from '@/components/SearchResultCell';
import FetchLimits from '@/constants/fetchLimits';
import RouteNames from '@/constants/routeNames';
import useTheme from '@/hooks/useTheme';
import {useNavigation, useRoute} from '@react-navigation/native';
import {BlurView} from 'expo-blur';
import {isUndefined, unionBy} from 'lodash';
import React, {useCallback, useMemo, useRef, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {KeyboardAvoidingView, View} from 'react-native';
import {TextInput} from 'react-native-gesture-handler';
import Animated from 'react-native-reanimated';
import styles from './styles';

const AnimatedBlurView = Animated.createAnimatedComponent(BlurView);

const Search = () => {
  const navigation = useNavigation<any>();
  const route = useRoute();
  const textInput = useRef<TextInput>(null);
  const {t} = useTranslation();
  const theme = useTheme();

  const [results, setResults] = useState<any[]>([]);
  const [searchText, setSearchText] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isNotFound, setIsNotFound] = useState<boolean>(false);

  const params: any = route.params;

  const offset = useRef<number>(0);

  /* If there's a book, the search is bounded to it */
  const book = params?.book;
  const isSearchInBook = !isUndefined(book);

  /* Render Components */

  const renderItem = useCallback(
    ({item}: any) => {
      return (
        <SearchResultCell
          result={item}
          onPress={onResultPress}
          searchText={searchText.trim()}
        />
      );
    },
    [searchText],
  );

  /* Callback */

  const onResultPress = (result: any) => {
    if (isSearchInBook) {
      navigation.navigate(RouteNames.BookDetail, {
        searchPickId: result.pick_id,
      });
    } else {
      navigation.navigate(RouteNames.BookDetailModal, {
        bookId: result.book_id,
        searchPickId: result.pick_id,
        isModal: true,
      });
    }
  };

  const onBackPress = () => {
    navigation.goBack();
  };

  const _getResults = (text: string) => {
    setIsLoading(true);

    const _offset = offset.current;

    BookAPI.search(
      {
        query: text.trim(),
        offset: _offset,
        limit: FetchLimits.SEARCH,
        bookId: book?.guid,
      },
      (data: any) => {
        setIsLoading(false);

        if (_offset === 0) {
          setIsNotFound(data.length === 0);
          setResults(data);
        } else {
          const key = isSearchInBook ? 'guid' : 'pick_id';
          setResults(unionBy(results, data, key));
        }
      },
    );
  };

  const onSearch = ({text, isEmpty}: any) => {
    setSearchText(text);

    if (isEmpty) {
      setIsLoading(false);
      setResults([]);
      setIsNotFound(false);

      return;
    }

    setResults([]);
    setIsNotFound(false);

    offset.current = 0;

    _getResults(text);
  };

  const onEndReached = () => {
    offset.current += FetchLimits.SEARCH;

    _getResults(searchText);
  };

  const screenTheme = useMemo(() => {
    if (theme.colorScheme === 'dark') {
      return {
        intensity: 70,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
      };
    }

    return {
      intensity: 50,
      backgroundColor: 'rgba(255, 255, 255, 0.4)',
    };
  }, [theme]);

  return (
    <View style={{flex: 1, backgroundColor: screenTheme.backgroundColor}}>
      <AnimatedBlurView
        tint={theme.colorScheme as any}
        intensity={screenTheme.intensity}
        style={[{flex: 1, backgroundColor: 'transparent', paddingBottom: 16}]}>
        <MainContainer style={styles.container} enableDismissGesture>
          <View style={styles.header}>
            <MainText
              numberOfLines={1}
              style={{flex: 1}}
              size={30}
              weight="semiBold"
              adjustsFontSizeToFit>
              {isSearchInBook
                ? t('Common:searchInBook')
                : t('Common:searchYourMind')}
            </MainText>

            <ScaleButton onPress={onBackPress} style={styles.closeTopButton}>
              <IconProvider Icon={CloseIcon} />
            </ScaleButton>
          </View>

          <View style={styles.list}>
            <AdvancedList
              endReachedParams={{
                bulkCount: FetchLimits.SEARCH,
              }}
              cellGap={12}
              isAnimated
              data={results}
              isNotFound={isNotFound}
              isLoading={isLoading}
              renderItem={renderItem}
              keyboardDismissMode="on-drag"
              keyboardShouldPersistTaps="handled"
              keyExtractor={(_, index: number) => index.toString()}
              onEndReached={onEndReached}
              ListEmptyComponent={<SearchPlaceholder />}
              contentContainerStyle={{paddingTop: 16}}
              onEndReachedThreshold={0.3}
            />
          </View>

          <KeyboardAvoidingView behavior="padding" keyboardVerticalOffset={16}>
            <SearchBar
              autoFocus
              ref={textInput}
              placeholder={t('Common:tapIntoYourKnowledge')}
              onSearch={onSearch}
              onChangeText={() => {
                setIsLoading(true);
              }}
            />
          </KeyboardAvoidingView>
        </MainContainer>
      </AnimatedBlurView>
    </View>
  );
};

export default Search;
