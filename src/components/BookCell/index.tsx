import BookAPI from '@/api/routes/book';
import {MiddlewareDispatch} from '@/api/types';
import MoreIcon from '@/assets/icons/MoreIcon.svg';
import {GlobalEvents} from '@/constants/events';
import RouteNames from '@/constants/routeNames';
import useTheme from '@/hooks/useTheme';
import {generateMenuOptions} from '@/utils/menuOptions';
import openShare from '@/utils/shareProvider';
import {useNavigation} from '@react-navigation/native';
import {isEmpty} from 'lodash';
import moment from 'moment';
import {Skeleton} from 'moti/skeleton';
import React, {useMemo, useRef, useState} from 'react';
import {Alert, View} from 'react-native';
import {EventRegister} from 'react-native-event-listeners';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {ContextMenuView} from 'react-native-ios-context-menu';
import Animated, {FadeIn} from 'react-native-reanimated';
import {useDispatch} from 'react-redux';
import AnimatedCell from '../AnimatedCell';
import BookTopics from '../BookTopics';
import IconProvider from '../IconProvider';
import Loader from '../Loader';
import MainText from '../MainText';
import styles from './styles';
import {BookCellProps} from './types';
import {useTranslation} from 'react-i18next';

const BookCell = ({item}: BookCellProps) => {
  const theme = useTheme();
  const dispatch = useDispatch<MiddlewareDispatch>();
  const navigation = useNavigation<any>();
  const contextMenu = useRef<ContextMenuView | null>(null);
  const {t} = useTranslation();

  const [isDeleting, setIsDeleting] = useState(false);

  const bookMenuConfig = useMemo(() => {
    return generateMenuOptions({
      options: [
        {
          title: t('Actions:share'),
          icon: 'Share',
          key: 'share',
        },
        {
          title: t('Actions:delete'),
          icon: 'Delete',
          isDestructive: true,
          key: 'delete',
        },
      ],
    });
  }, [theme]);

  const topics = item?.topics ?? [];
  const isMocked = item.guid?.includes('mock');

  const onPress = () => {
    navigation.navigate(RouteNames.BookDetail, {bookId: item.guid});
  };

  const onPressMenuItem = ({nativeEvent}: any) => {
    const {actionKey} = nativeEvent;

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
            setIsDeleting(true);

            dispatch(
              BookAPI.delete(item.guid, () => {
                EventRegister.emit(GlobalEvents.UpdateListLayout);
                EventRegister.emit(GlobalEvents.DeleteBook);
              }),
            );
          },
        },
      ]);
    } else if (actionKey == 'share') {
      openShare({data: item, message: t('Common:shareBookMessage')});
    }
  };

  const picksCountStyle = useMemo(() => {
    if (theme.colorScheme == 'light') {
      return {borderColor: '#00000020', borderWidth: 0.5};
    }

    return {};
  }, [theme]);

  return (
    <ContextMenuView
      pointerEvents={isMocked ? 'none' : 'auto'}
      onPressMenuItem={onPressMenuItem}
      ref={contextMenu}
      style={styles.container}
      menuConfig={bookMenuConfig}>
      <TouchableOpacity
        disabled={isMocked || isDeleting}
        activeOpacity={1}
        onPress={onPress}>
        <View style={[styles.cell, theme.styles.cell]}>
          <View style={styles.header}>
            <View style={{flex: 1}}>
              <Skeleton show={isMocked} radius={'square'}>
                <MainText
                  style={{
                    flex: 1,
                    height: isMocked ? 45 : undefined,
                    fontWeight: '500',
                  }}
                  numberOfLines={2}
                  size={24}
                  letterSpacing={1.2}
                  weight="semiBold">
                  {item.title}
                </MainText>
              </Skeleton>

              {(!!item.author || isMocked) && (
                <View style={{marginTop: 8}}>
                  <Skeleton show={isMocked} radius={'square'}>
                    <View style={styles.authorContainer}>
                      <MainText color={theme.colors.lightText} size={12}>
                        by {item.author}
                      </MainText>
                    </View>
                  </Skeleton>
                </View>
              )}
            </View>

            <TouchableOpacity
              activeOpacity={0.5}
              disabled={isMocked}
              style={styles.moreIcon}
              onPress={() => {
                contextMenu.current?.presentMenu();
              }}>
              <IconProvider Icon={MoreIcon} scale={0.8} />
            </TouchableOpacity>
          </View>

          <View style={styles.content}>
            <Skeleton show={isMocked} radius={'square'}>
              {item?.preview && (
                <MainText
                  style={{
                    height: isMocked ? 80 : undefined,
                  }}
                  numberOfLines={7}>
                  {item.preview.content}
                </MainText>
              )}
            </Skeleton>
          </View>

          {!isEmpty(topics) && (
            <View style={styles.keywordsContainer}>
              <BookTopics data={topics} />
            </View>
          )}

          <View style={{marginTop: 24}}>
            <Skeleton show={isMocked} radius={'square'}>
              <View style={styles.footer}>
                <View style={[styles.picksCount, picksCountStyle]}>
                  <MainText
                    weight="bold"
                    size={11}
                    style={{
                      fontWeight: '600',
                      color: theme.colors.lightAccent,
                    }}>
                    {item.picksCount} PICKS
                  </MainText>
                </View>

                <MainText style={{color: theme.colors.lightText}} size={10}>
                  {moment(item.updatedAt).format('MMM Do')}
                </MainText>
              </View>
            </Skeleton>
          </View>
        </View>
      </TouchableOpacity>

      {isDeleting && (
        <Animated.View
          entering={FadeIn}
          style={[
            styles.deletingOverlay,
            {
              backgroundColor: theme.colors.secondaryBackground,
            },
          ]}>
          <Loader isActive size={32} />
          <MainText>{t('Common:deletingBook')}</MainText>
        </Animated.View>
      )}
    </ContextMenuView>
  );
};

export default BookCell;
