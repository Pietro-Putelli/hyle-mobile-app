import CloseIcon from '@/assets/icons/CloseIcon.svg';
import {ScaleButton} from '@/components/Buttons';
import {ModalContainer} from '@/components/Containers';
import IconProvider from '@/components/IconProvider';
import MainText from '@/components/MainText';
import TextInput from '@/components/TextInput';
import useBooks from '@/hooks/useBooks';
import useTheme from '@/hooks/useTheme';
import ColorPickerModal from '@/modals/ColorPickerModal';
import {getBookTopics} from '@/storage/slices/booksSlice';
import {useNavigation, useRoute} from '@react-navigation/native';
import {createSelector} from '@reduxjs/toolkit';
import {isEmpty, pick, unionBy} from 'lodash';
import React, {useEffect, useMemo, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {Keyboard, TouchableOpacity, View} from 'react-native';
import {
  TextInput as RNTextInput,
  ScrollView,
} from 'react-native-gesture-handler';
import {ContextMenuButton, MenuConfig} from 'react-native-ios-context-menu';
import Animated, {ZoomIn, ZoomOut} from 'react-native-reanimated';
import {useSelector} from 'react-redux';
import styles from './styles';

const COLORS = require('@/data/colors.json');

const EditTopics = () => {
  const {params} = useRoute<any>();
  const theme = useTheme();
  const navigation = useNavigation();
  const textRef = React.useRef<RNTextInput>(null);
  const {t} = useTranslation();

  const bookId = params?.bookId;

  const {book, isLoading, updateBookTopics} = useBooks({bookId});

  const initialTopics = book?.topics ?? [];

  const [topics, setTopics] = useState(initialTopics);
  const [value, setValue] = useState('');

  const [selectedTopic, setSelectedTopic] = useState<number | null>(null);
  const [isColorPickerVisible, setIsColorPickerVisible] = useState(false);
  const [isEditingTopic, setIsEditingTopic] = useState(false);

  const topicMenuConfig: MenuConfig = {
    menuTitle: '',
    menuItems: [
      {
        actionKey: 'title',
        actionTitle: t('Actions:editTitle'),
      },
      {
        actionKey: 'color',
        actionTitle: t('Actions:changeColor'),
      },
    ],
  };

  const selectExistingTopics = createSelector([getBookTopics], topics => {
    return topics.slice(1).map((topic: any) => {
      return pick(topic, ['topic', 'color']);
    });
  });

  const existingTopics = useSelector(selectExistingTopics);

  const existingTopicsNotSelected = existingTopics.filter(
    (topic: any) =>
      !topics.find(
        (t: any) => t.topic.toLowerCase() === topic.topic.toLowerCase(),
      ),
  );

  const isDoneButtonEnabled = useMemo(() => {
    const sortedTopics = topics
      .map((topic: any) => topic.topic.toLowerCase() + topic.color)
      .sort();

    const sortedInitialTopics = initialTopics
      .map((topic: any) => topic.topic.toLowerCase() + topic.color)
      .sort();

    return (
      topics.length > 0 &&
      JSON.stringify(sortedTopics) !== JSON.stringify(sortedInitialTopics)
    );
  }, [topics, initialTopics]);

  const onDonePress = () => {
    if (!isDoneButtonEnabled) {
      navigation.goBack();
      return;
    }

    const formatted = topics.map((topic: any) => {
      return {
        topic: topic.topic.toLowerCase(),
        color: topic.color,
      };
    });

    updateBookTopics(formatted, () => {
      navigation.goBack();
    });
  };

  const onRemoveTopic = (index: number) => {
    const newTopics = topics.filter((_: any, i: number) => i !== index);
    setTopics(newTopics);
  };

  const onAddPress = () => {
    if (isEditingTopic) {
      const newTopics = topics.map((topic: any, index: number) => {
        if (index === selectedTopic) {
          return {...topic, topic: value.trim()};
        }

        return topic;
      });

      setTopics(newTopics);
      setValue('');
      setIsEditingTopic(false);
    } else {
      const color = COLORS[Math.floor(Math.random() * COLORS.length)];

      const newTopics = unionBy(
        topics,
        [{topic: value.trim(), color}],
        'topic',
      );

      setTopics(newTopics);
      setValue('');
    }
  };

  const onPressMenuItem = ({actionKey, index}: any) => {
    setSelectedTopic(index);

    if (actionKey == 'color') {
      setIsColorPickerVisible(true);
    }

    if (actionKey == 'title') {
      const intialValue = topics[index].topic;

      setValue(intialValue);
      setIsEditingTopic(true);
    }
  };

  useEffect(() => {
    if (isColorPickerVisible) {
      Keyboard.dismiss();
    } else {
      textRef.current?.focus();
    }
  }, [isColorPickerVisible]);

  const addButtonStyle = useMemo(() => {
    if (theme.colorScheme === 'light') {
      return {
        text: '#fff',
        backgroundColor: theme.colors.accent,
      };
    }

    return {
      text: theme.colors.accent,
      backgroundColor: '#fff',
    };
  }, [theme]);

  return (
    <>
      <ModalContainer
        onDonePress={onDonePress}
        isDoneButtonLoading={isLoading}
        isDoneButtonEnabled={isDoneButtonEnabled}
        style={{paddingHorizontal: 12}}
        title={t('Actions:editTopics')}>
        {!isEmpty(existingTopicsNotSelected) && (
          <>
            <View style={{marginLeft: 6}}>
              <MainText size={16} color={theme.colors.lightText}>
                {t('Common:chooseFromExistingTopics')}:
              </MainText>
            </View>
            <View style={{marginHorizontal: 6, marginTop: 16}}>
              <ScrollView
                showsHorizontalScrollIndicator={false}
                keyboardShouldPersistTaps="always"
                horizontal
                contentContainerStyle={{gap: 10}}>
                {existingTopicsNotSelected.map((topic: any, index: number) => {
                  return (
                    <Animated.View
                      entering={ZoomIn}
                      exiting={ZoomOut}
                      key={index}>
                      <ScaleButton
                        onPress={() => {
                          setTopics((topics: any) =>
                            unionBy(
                              topics,
                              [{topic: topic.topic, color: topic.color}],
                              'topic',
                            ),
                          );
                        }}
                        style={[
                          {backgroundColor: topic.color},
                          styles.editCell,
                        ]}>
                        <MainText
                          color="#fff"
                          weight="semiBold"
                          uppercase
                          size={15}>
                          {topic.topic}
                        </MainText>
                      </ScaleButton>
                    </Animated.View>
                  );
                })}
              </ScrollView>

              <View style={{marginTop: 16, marginBottom: 4}}>
                <MainText size={16} color={theme.colors.lightText}>
                  {t('Common:orCreateNewTopic')}:
                </MainText>
              </View>
            </View>
          </>
        )}

        <View
          style={[
            {backgroundColor: theme.colors.secondaryBackground},
            styles.input,
          ]}>
          <TextInput
            autoFocus
            ref={textRef}
            value={value}
            onChangeText={text => {
              setValue(text);
            }}
            size={17}
            placeholder="New topic title..."
            maxLength={32}
            style={{flex: 1}}
            clearButtonMode="while-editing"
          />

          <ScaleButton
            disabled={value.trim().length === 0}
            isHaptic
            onPress={onAddPress}
            style={[
              styles.doneButton,
              {
                backgroundColor: addButtonStyle.backgroundColor,
              },
            ]}>
            <MainText weight="semiBold" uppercase color={addButtonStyle.text}>
              {isEditingTopic ? t('Actions:edit') : t('Actions:add')}
            </MainText>
          </ScaleButton>
        </View>

        <View style={styles.tagsContainer}>
          {topics.map((topic: any, index: number) => {
            return (
              <Animated.View
                key={index}
                entering={ZoomIn}
                exiting={ZoomOut}
                style={[{backgroundColor: topic.color}, styles.cell]}>
                <ContextMenuButton
                  onPressMenuItem={({nativeEvent}: any) => {
                    onPressMenuItem({
                      actionKey: nativeEvent.actionKey,
                      index,
                    });
                  }}
                  menuConfig={topicMenuConfig}>
                  <MainText color="#fff" weight="semiBold" uppercase size={15}>
                    {topic.topic}
                  </MainText>
                </ContextMenuButton>

                <TouchableOpacity
                  onPress={() => {
                    onRemoveTopic(index);
                  }}
                  activeOpacity={0.7}
                  style={styles.removeButton}>
                  <IconProvider Icon={CloseIcon} color={'white'} />
                </TouchableOpacity>
              </Animated.View>
            );
          })}
        </View>
      </ModalContainer>

      <ColorPickerModal
        initialColor={selectedTopic ? topics[selectedTopic].color : null}
        onChangeColor={(color: string) => {
          const newTopics = topics.map((topic: any, index: number) => {
            if (index === selectedTopic) {
              return {...topic, color};
            }

            return topic;
          });

          setTopics(newTopics);
        }}
        setIsOpen={setIsColorPickerVisible}
        isOpen={isColorPickerVisible}
      />
    </>
  );
};

export default EditTopics;
