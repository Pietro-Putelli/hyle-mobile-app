import {MiddlewareDispatch} from '@/api/types';
import MenuIcon from '@/assets/icons/MenuIcon.svg';
import SearchIcon from '@/assets/icons/SearchIcon.svg';
import AddNewMenu from '@/components/AddNewMenu';
import {MENU_BUTTON_SIDE} from '@/components/AddNewMenu/styles';
import AdvancedList from '@/components/AdvancedList';
import BookCell from '@/components/BookCell';
import {MainContainer} from '@/components/Containers';
import {BooksPlaceholder} from '@/components/Placeholders';
import ReachabilityView from '@/components/ReachabilityView';
import TopicsSelector from '@/components/TopicsSelector';
import FetchLimits from '@/constants/fetchLimits';
import RouteNames from '@/constants/routeNames';
import useBooks from '@/hooks/useBooks';
import usePushNotifications from '@/hooks/usePushNotifications';
import useTheme from '@/hooks/useTheme';
import {useDrawerStatus} from '@react-navigation/drawer';
import {CommonActions, useNavigation} from '@react-navigation/native';
import React, {useCallback, useEffect, useMemo} from 'react';
import {StatusBar, View} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useDispatch} from 'react-redux';
import styles from './styles';
import {ProfileAPI} from '@/api/routes';

const Home = () => {
  const isDrawerOpen = useDrawerStatus() === 'open';
  const insets = useSafeAreaInsets();
  const theme = useTheme();
  const dispatch = useDispatch<MiddlewareDispatch>();

  /* Utility */

  const navigation = useNavigation<any>();

  const {
    books,

    topics,
    selectedTopics,
    handleSelectedTopics,

    refreshBooks,
    getMoreBooks,

    isLoading,
    isLoadingTopics,
    isLoadingFromTopic,
    isNotFound,
    isRefreshing,
  } = useBooks();

  /* Callbacks */

  const onMenuPress = () => {
    navigation.openDrawer();
  };

  const onSearchPress = () => {
    navigation.navigate(RouteNames.Search);
  };

  const onTopicPress = (topic: any) => {
    handleSelectedTopics(topic);
  };

  const renderItem = useCallback(({item}: any) => {
    return <BookCell item={item} />;
  }, []);

  const scrollContentStyle = useMemo(() => {
    return {
      ...styles.scrollContent,
      paddingBottom: insets.bottom + MENU_BUTTON_SIDE + 24,
    };
  }, []);

  /* Utility Effects */

  usePushNotifications();

  // useInAppPurchase();

  useEffect(() => {
    dispatch(
      ProfileAPI.checkHealth(() => {
        /* If the health check fails, navigate to the sign-in screen */
        navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [{name: RouteNames.SignIn}],
          }),
        );
      }),
    );
  }, []);

  return (
    <>
      <MainContainer
        headerProps={{
          leftIcon: MenuIcon,
          onLeftPress: onMenuPress,
          isLeftDisabled: isDrawerOpen,
          rightIcon: SearchIcon,
          onRightPress: onSearchPress,
          isRightHaptic: true,
          showLogo: true,
        }}
        rightGesture={{
          onStart: onSearchPress,
          activeOffsetX: -30,
        }}
        style={{paddingBottom: 0}}>
        <AddNewMenu />

        {!isNotFound && (
          <TopicsSelector
            topics={topics}
            onPress={onTopicPress}
            isLoading={isLoadingTopics}
            selected={selectedTopics}
          />
        )}

        <ReachabilityView />

        <View style={styles.scrollContainer}>
          <AdvancedList
            endReachedParams={{
              bulkCount: FetchLimits.BOOKS,
              startFrom: Math.min(books.length, FetchLimits.BOOKS),
            }}
            isAnimated
            mockDataWhileLoading
            data={books}
            cellGap={12}
            isNotFound={isNotFound}
            isLoading={isLoading}
            isLoadingTop={isLoadingFromTopic}
            renderItem={renderItem}
            isRefreshing={isRefreshing}
            onRefresh={refreshBooks}
            // onEndReached={getMoreBooks}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={scrollContentStyle}
            scrollIndicatorInsets={{top: -1, bottom: insets.bottom}}
            ListEmptyComponent={<BooksPlaceholder />}
          />
        </View>
      </MainContainer>

      <StatusBar barStyle={theme.statusBarStyle} />
    </>
  );
};

export default Home;
