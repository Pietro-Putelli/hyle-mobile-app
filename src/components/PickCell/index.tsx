import AddIcon from '@/assets/icons/AddIcon.svg';
import MoreIcon from '@/assets/icons/MoreIcon.svg';
import PenIcon from '@/assets/icons/PenIcon.svg';
import RouteNames from '@/constants/routeNames';
import useTheme from '@/hooks/useTheme';
import {TextPartProps} from '@/types/AddPick';
import {generateMenuOptions} from '@/utils/menuOptions';
import Clipboard from '@react-native-clipboard/clipboard';
import {useNavigation} from '@react-navigation/native';
import {MotiView} from 'moti';
import {Skeleton} from 'moti/skeleton';
import React, {useMemo, useRef, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {View} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {ContextMenuView} from 'react-native-ios-context-menu';
import Animated, {FadeIn, SlideInDown} from 'react-native-reanimated';
import AnimatedCell from '../AnimatedCell';
import {HighlightView} from '../Animations';
import {ScaleButton} from '../Buttons';
import HighlitedText from '../HighlitedText';
import IconProvider from '../IconProvider';
import Loader from '../Loader';
import MainText from '../MainText';
import SwipeableContainer from '../SwipeableContainer';
import styles from './styles';
import {PickCellProps} from './types';

const PickCell = ({
  book,
  pick,
  index,
  isDeleting,
  swipeToEditEnabled,
  isFoundInSearch,
  disableInteraction,
  onLongPress,
  onEndHighlight,
  onKeywordPress,
  onDeletePress,
  onCopyPress,
}: PickCellProps) => {
  const theme = useTheme();
  const {t} = useTranslation();
  const navigation = useNavigation<any>();

  const contextMenu = useRef<ContextMenuView | null>(null);

  const isTextShort = onLongPress !== undefined;

  const [isCollapsed, setIsCollapsed] = useState(isTextShort);

  const isMocked = pick.guid.includes('mock');
  const _disableInteraction = disableInteraction || isMocked;

  const pickIndex = pick.index;
  const bookId = book?.guid;
  const pickParts = pick?.parts;
  const pickTitle = pick?.title;

  const isLast = useMemo(() => {
    return book && index === book.picksCount - 1;
  }, [book, index]);

  const marginBottom = useMemo(() => {
    if (isTextShort) {
      return 12;
    }

    return 32;
  }, [isLast, isTextShort]);

  const pickContextMenuConfig = useMemo(() => {
    return generateMenuOptions({
      options: [
        {title: t('Actions:edit'), icon: 'Pen', key: 'edit'},
        {title: t('Actions:copy'), icon: 'Copy', key: 'copy'},
        {
          title: pick?.title ? t('Actions:changeTitle') : t('Actions:addTitle'),
          icon: 'TextInput',
          key: pick?.title ? 'changetitle' : 'addtitle',
        },
        {
          title: t('Actions:delete'),
          icon: 'Delete',
          key: 'delete',
          isDestructive: true,
        },
      ],
    });
  }, []);

  const ContextMenuViewContainer = isTextShort ? View : ContextMenuView;

  const onAddPickPress = () => {
    navigation.navigate(RouteNames.AddPickStack, {
      bookData: {
        id: bookId,
        listIndex: index + 1,
      },
    });
  };

  const onPressMenuItem = ({nativeEvent}: any) => {
    const actionKey = nativeEvent.actionKey;

    if (actionKey === 'delete') {
      onDeletePress?.(pick.guid);
    } else if (actionKey == 'edit' && bookId != undefined) {
      navigation.navigate(RouteNames.AddPickStack, {
        pick,
        bookData: {id: bookId},
      });
    } else if (actionKey == 'copy') {
      onCopyPress?.();

      const plainText = pickParts.map((p: any) => p.content).join('');
      Clipboard.setString(plainText);
    } else if (['changetitle', 'addtitle'].includes(actionKey)) {
      navigation.navigate(RouteNames.EditMetadata, {
        bookId: book?.guid,
        pickId: pick.guid,
      });
    }
  };

  const onPartPress = (part: TextPartProps) => {
    onKeywordPress?.({...part, pickId: pick.guid});
  };

  const onSwipeLeft = () => {
    navigation.navigate(RouteNames.AddPickStack, {
      pick,
      bookData: {id: bookId},
    });
  };

  const Container: React.ComponentType<any> = isTextShort
    ? TouchableOpacity
    : ContextMenuViewContainer;

  return (
    <View>
      <View style={{marginBottom}}>
        <SwipeableContainer
          disabled={!swipeToEditEnabled || _disableInteraction}
          onSwipeLeft={onSwipeLeft}
          Icon={PenIcon}>
          <Animated.View
          // entering={
          //   isTextShort && index > 3
          //     ? undefined
          //     : SlideInDown.springify().stiffness(150).damping(20)
          // }
          >
            <Container
              pointerEvents={_disableInteraction ? 'none' : 'auto'}
              onPress={() => {
                setIsCollapsed(!isCollapsed);
              }}
              activeOpacity={0.8}
              onLongPress={onLongPress}
              ref={contextMenu}
              menuConfig={pickContextMenuConfig}
              delayLongPress={200}
              style={{borderRadius: 20}}
              onPressMenuItem={onPressMenuItem}>
              <HighlightView
                // onLayout={event => {
                //   if (isLast) {
                //     const {height} = event.nativeEvent.layout;
                //     setCellHeight(height);
                //   }
                // }}
                onEnd={onEndHighlight}
                isHighlighted={isFoundInSearch!}
                style={[
                  styles.cell,
                  {padding: isTextShort ? 20 : 24},
                  theme.styles.cell,
                ]}>
                <View style={styles.header}>
                  <View style={styles.headerContent}>
                    <Skeleton show={isMocked}>
                      <View
                        style={{
                          width: isMocked ? 40 : undefined,
                          height: isMocked ? 40 : undefined,
                        }}>
                        {!isMocked && (
                          <MainText weight="bold" size={28}>
                            {pickIndex + 1}.
                          </MainText>
                        )}
                      </View>
                    </Skeleton>

                    {!!pickTitle && (
                      <View style={{flex: 1, bottom: 4}}>
                        <Skeleton show={isMocked}>
                          <MainText numberOfLines={2} size={18} weight="bold">
                            {pickTitle}
                          </MainText>
                        </Skeleton>
                      </View>
                    )}
                  </View>

                  {!isTextShort && (
                    <TouchableOpacity
                      style={styles.moreIcon}
                      activeOpacity={0.5}
                      disabled={isMocked}
                      onPress={() => {
                        contextMenu.current?.presentMenu();
                      }}>
                      <IconProvider Icon={MoreIcon} scale={0.8} />
                    </TouchableOpacity>
                  )}
                </View>

                <Skeleton show={isMocked}>
                  <View
                    style={{
                      height: isTextShort ? 106 : isMocked ? 100 : undefined,
                      overflow: 'hidden',
                      width: '100%',
                    }}>
                    {!isMocked && (
                      <HighlitedText onPartPress={onPartPress}>
                        {pickParts}
                      </HighlitedText>
                    )}
                  </View>
                </Skeleton>
              </HighlightView>
            </Container>

            {isDeleting && (
              <Animated.View
                entering={FadeIn}
                style={[
                  styles.deleteOverlay,
                  {backgroundColor: theme.colors.secondaryBackground},
                ]}>
                <Loader isActive size={32} />
                <MainText>{t('Common:deletingPick')}</MainText>
              </Animated.View>
            )}
          </Animated.View>
        </SwipeableContainer>

        {!isLast && !isTextShort && (
          <MotiView
            from={{scale: 0}}
            animate={{scale: 1}}
            transition={{damping: 16}}
            style={styles.addButton}>
            <ScaleButton
              isHaptic
              disableWithoutOpacity={isDeleting || isMocked}
              onPress={onAddPickPress}
              style={[
                styles.addButtonContent,
                {backgroundColor: theme.colors.secondaryBackground},
              ]}>
              <IconProvider Icon={AddIcon} scale={0.7} />
            </ScaleButton>
          </MotiView>
        )}
      </View>

      {!isTextShort && (
        <MotiView
          // from={{opacity: 1}}
          // animate={{opacity: 1}}
          // transition={{
          //   delay: 1,
          //   type: 'timing',
          //   duration: 200,
          // }}
          style={[
            styles.thread,
            {
              height: isLast ? 0 : '100%',
              backgroundColor: theme.colors.accent,
            },
          ]}>
          {/* {isLast && (
            <View
              style={[{backgroundColor: theme.colors.accent}, styles.originDot]}
            />
          )} */}
        </MotiView>
      )}
    </View>
  );
};

export default PickCell;
