import AscOrderIcon from '@/assets/icons/AscOrderIcon.svg';
import BookTopics from '@/components/BookTopics';
import {ScaleButton} from '@/components/Buttons';
import MainText from '@/components/MainText';
import {GlobalEvents} from '@/constants/events';
import useTheme from '@/hooks/useTheme';
import {BookProps} from '@/types/Book';
import moment from 'moment';
import {MotiView} from 'moti';
import React, {useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {EventRegister} from 'react-native-event-listeners';
import IconProvider from '../IconProvider';
import {FadeAnimatedView} from '../Animations';
import Loader from '../Loader';
import {useTranslation} from 'react-i18next';

type BookDetailHeaderProps = {
  isReversingPicks: boolean;
  book: BookProps;
  onReversePress?: () => void;
};

const BookDetailHeader = ({
  book,
  isReversingPicks,
  onReversePress,
}: BookDetailHeaderProps) => {
  const theme = useTheme();
  const {t} = useTranslation();

  const author = book?.author;
  const topics = book?.topics ?? [];
  const picksCount = book?.picksCount ?? 0;

  const [isInverted, setIsInverted] = useState(false);

  const _onReversePress = () => {
    setIsInverted(prev => !prev);

    onReversePress?.();

    EventRegister.emit(GlobalEvents.UpdateListLayout);
  };

  return (
    <View style={styles.header}>
      <MainText style={{paddingHorizontal: 2}} size={32}>
        {book?.title}
      </MainText>

      <View style={styles.authorContainer}>
        <View style={{flex: 1}}>
          {author && (
            <MainText color={theme.colors.lightText} size={14}>
              {t('Common:by')} {author}
            </MainText>
          )}
        </View>

        {book?.createdAt && (
          <MainText style={{color: theme.colors.lightText}} size={10}>
            {moment(book.createdAt).format('MMM Do')}
          </MainText>
        )}
      </View>

      <View style={styles.topicsContainer}>
        <BookTopics data={topics} size={14} />
      </View>

      <View>
        <View style={styles.threadOriginContainer}>
          <View
            style={[
              styles.threadOrigin,
              {backgroundColor: theme.colors.accent},
            ]}>
            <View style={styles.picksCount}>
              <MainText
                weight="bold"
                uppercase
                size={13}
                color={theme.colors.lightAccent}>
                {picksCount} Picks
              </MainText>
            </View>
          </View>

          <ScaleButton
            throttleValue={800}
            style={[
              {backgroundColor: theme.colors.secondaryBackground},
              styles.switchButton,
            ]}
            disableWithoutOpacity={isReversingPicks}
            isHaptic
            disabled={picksCount < 2}
            onPress={_onReversePress}>
            <MotiView
              transition={{damping: 14}}
              from={{rotate: '0deg'}}
              animate={{
                rotate: isInverted ? '180deg' : '0deg',
                scale: isReversingPicks ? 0 : 1,
              }}>
              <IconProvider Icon={AscOrderIcon} />
            </MotiView>

            <MotiView
              style={{position: 'absolute'}}
              from={{scale: 0}}
              animate={{scale: isReversingPicks ? 1 : 0}}>
              <Loader isActive={true} size={24} />
            </MotiView>
          </ScaleButton>
        </View>

        <View style={[styles.thread, {backgroundColor: theme.colors.accent}]} />
      </View>
    </View>
  );
};

export default BookDetailHeader;

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 6,
  },
  threadOriginContainer: {
    marginTop: 24,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  threadOrigin: {
    flex: 1,
    height: 54,
    paddingHorizontal: 12,
    borderRadius: 16,
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
  },
  headphoneIcon: {
    height: 54,
    width: 54,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  picksCount: {
    backgroundColor: '#fff',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 8,
  },
  authorContainer: {
    marginTop: 16,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 2,
  },
  switchButton: {
    height: 50,
    width: 50,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  topicsContainer: {
    marginTop: 20,
  },
  thread: {
    width: 4,
    bottom: 0,
    height: 48,
    left: 26,
  },
});
