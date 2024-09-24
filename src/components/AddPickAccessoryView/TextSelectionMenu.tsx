import AddNoteIcon from '@/assets/icons/AddNoteIcon.svg';
import ChevronLeftIcon from '@/assets/icons/ChevronLeftIcon.svg';
import KeywordIcon from '@/assets/icons/KeywordIcon.svg';
import LanguageIcon from '@/assets/icons/LanguageIcon.svg';
import useTheme from '@/hooks/useTheme';
import {KeywordTypeValue} from '@/types/AddPick';
import {MotiView} from 'moti';
import React, {useEffect, useMemo, useRef, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import Animated, {FadeIn, FadeOut} from 'react-native-reanimated';
import {ActionButton, IconButton} from '../Buttons';
import {TextSelectionMenuProp} from './types';
import EraserIcon from '@/assets/icons/EraserIcon.svg';
import SmallPenIcon from '@/assets/icons/SmallPenIcon.svg';
import {useTranslation} from 'react-i18next';

const X_HIDDEN = -400;

const ITEMS = [
  {
    title: 'keyword',
    icon: KeywordIcon,
    key: KeywordTypeValue.KEYWORD,
    backgroundColor: '#1d3461',
  },
  {
    title: 'annotation',
    icon: AddNoteIcon,
    key: KeywordTypeValue.ANNOTATION,
    backgroundColor: '#386641',
  },
  {
    title: 'meaning',
    icon: LanguageIcon,
    key: KeywordTypeValue.TRANSLATION,
    backgroundColor: '#bd1e28',
  },
];

const TextSelectionMenu = ({
  isMenuVisible,
  isEditMenuVisible,
  onActionPress,
}: TextSelectionMenuProp) => {
  const theme = useTheme();
  const scrollRef = useRef<ScrollView>(null);
  const {t} = useTranslation();

  const isVisible = isMenuVisible || isEditMenuVisible;

  const [isRendered, setIsRendered] = useState(false);

  const scrollToStart = () => {
    scrollRef.current?.scrollTo({x: 0});
  };

  const _onActionPress = (action: any) => {
    scrollToStart();

    onActionPress(action);
  };

  useEffect(() => {
    if (isVisible) {
      setIsRendered(true);
    }
  }, [isVisible]);

  const items = useMemo(() => {
    return ITEMS.map((item: any) => {
      return {
        ...item,
        title: t('Common:' + item.title),
      };
    });
  }, []);

  if (!isRendered) {
    return null;
  }

  return (
    <MotiView
      transition={{damping: 18}}
      from={{translateX: X_HIDDEN}}
      animate={{translateX: isVisible ? 12 : X_HIDDEN}}
      onDidAnimate={() => {
        if (!isVisible) {
          setIsRendered(false);
        }
      }}
      style={[styles.container, {backgroundColor: theme.colors.background}]}>
      <View style={{flex: 1}}>
        {isEditMenuVisible && (
          <Animated.View
            style={[
              styles.selectionMenu,
              {backgroundColor: theme.colors.background},
            ]}
            entering={FadeIn.delay(100)}
            exiting={FadeOut}>
            <ScrollView
              horizontal
              keyboardShouldPersistTaps="always"
              showsHorizontalScrollIndicator={false}>
              <ActionButton
                action={{
                  title: t('Actions:editContent'),
                  icon: SmallPenIcon,
                }}
                onPress={() => {
                  onActionPress('edit');
                }}
              />

              <ActionButton
                action={{
                  title: t('Actions:cancel'),
                  icon: EraserIcon,
                }}
                underline
                onPress={() => {
                  onActionPress('cancel');
                }}
              />
            </ScrollView>
          </Animated.View>
        )}

        <Animated.View entering={FadeIn} exiting={FadeOut}>
          <ScrollView
            horizontal
            ref={scrollRef}
            keyboardShouldPersistTaps="always"
            showsHorizontalScrollIndicator={false}>
            {items.map((item, index) => {
              return (
                <ActionButton
                  onPress={_onActionPress}
                  key={index}
                  action={item}
                  style={{backgroundColor: item.backgroundColor}}
                />
              );
            })}
          </ScrollView>
        </Animated.View>
      </View>

      <View style={{marginRight: -4, marginLeft: 4}}>
        <IconButton
          onPress={() => {
            onActionPress('close');
          }}
          isHaptic
          icon={ChevronLeftIcon}
        />
      </View>
    </MotiView>
  );
};

export default TextSelectionMenu;

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    zIndex: 2,
    top: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  selectionMenu: {
    position: 'absolute',
    width: '100%',
    zIndex: 2,
    height: '100%',
    alignItems: 'center',
    flexDirection: 'row',
  },
});
