import BookAPI from '@/api/routes/book';
import {MiddlewareDispatch} from '@/api/types';
import ReorderIcon from '@/assets/icons/ReorderIcon.svg';
import SaveIcon from '@/assets/icons/SaveIcon.svg';
import SearchIcon from '@/assets/icons/SearchIcon.svg';
import ShareIcon from '@/assets/icons/ShareIcon.svg';
import TagIcon from '@/assets/icons/TagIcon.svg';
import RouteNames from '@/constants/routeNames';
import useTheme from '@/hooks/useTheme';
import openShare from '@/utils/shareProvider';
import {useNavigation} from '@react-navigation/native';
import React from 'react';
import {useTranslation} from 'react-i18next';
import {ScrollView, View} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useDispatch} from 'react-redux';
import {ActionButton} from '../Buttons';
import styles from './styles';
import {PicksEditorControllerProps} from './types';

const PicksEditorController = ({
  book,
  isBookCached,
  isSearchEnabled,
  onBookSaved,
}: PicksEditorControllerProps) => {
  const theme = useTheme();
  const {t} = useTranslation();
  const dispatch = useDispatch<MiddlewareDispatch>();
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<any>();
  const [isSaved, setIsSaved] = React.useState<boolean>(false);

  const hasMoreThanOnePick = book.picks.length > 1;

  const onSearchPress = () => {
    navigation.navigate(RouteNames.Search, {book});
  };

  const onSharePress = () => {
    openShare({data: book, message: t('Common:shareBookMessage')});
  };

  const onSavePress = () => {
    dispatch(
      BookAPI.save({bookId: book.guid}, isSuccessful => {
        if (isSuccessful) {
          setIsSaved(true);
          onBookSaved();
        }
      }),
    );
  };

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: theme.colors.translucentBackground,
          paddingBottom: insets.bottom,
        },
        theme.styles.hairlineTop,
      ]}>
      <View style={{width: '100%'}}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {!isSaved && isBookCached && (
            <View style={styles.saveContainer}>
              <ActionButton
                startLoadingWhenPressed
                fullLoadingDuration={1000}
                onPress={onSavePress}
                style={styles.actionButton}
                action={{
                  title: t('Actions:saveBook'),
                  icon: SaveIcon,
                }}
                loadingText={t('Actions:saving')}
              />

              <View style={styles.separator} />
            </View>
          )}

          {isSearchEnabled && (
            <ActionButton
              onPress={onSearchPress}
              style={styles.actionButton}
              action={{
                title: t('Actions:search'),
                icon: SearchIcon,
              }}
            />
          )}

          {hasMoreThanOnePick && (
            <ActionButton
              onPress={() => {
                navigation.navigate(RouteNames.SortPicks, {
                  bookId: book.guid,
                });
              }}
              style={styles.actionButton}
              action={{
                title: t('Actions:reorderPicks'),
                icon: ReorderIcon,
              }}
            />
          )}
          <ActionButton
            onPress={() => {
              navigation.navigate(RouteNames.EditTopics, {bookId: book.guid});
            }}
            style={styles.actionButton}
            action={{
              title: t('Actions:editTopics'),
              icon: TagIcon,
            }}
          />

          <ActionButton
            onPress={onSharePress}
            style={{marginRight: 0}}
            action={{title: t('Actions:share'), icon: ShareIcon}}
          />
        </ScrollView>
      </View>
    </View>
  );
};

export default PicksEditorController;
