import AiAPI from '@/api/routes/ai';
import BookAPI from '@/api/routes/book';
import EraserIcon from '@/assets/icons/EraserIcon.svg';
import MagicIcon from '@/assets/icons/MagicIcon.svg';
import {ActionButton, MainButton} from '@/components/Buttons';
import {ModalContainer} from '@/components/Containers';
import KeywordDefinitionSources from '@/components/KeywordDefinition/KeywordDefinitionSources';
import TextInput from '@/components/TextInput';
import TranslationContent from '@/components/TranslationContent';
import KeywordView from '@/components/Views/KeywordView';
import RouteNames from '@/constants/routeNames';
import useTheme from '@/hooks/useTheme';
import {
  getStateBookPickById,
  updateStateBookPickAnnotation,
} from '@/storage/slices/booksSlice';
import {
  getPartById,
  removeStateKeyword,
  updateStateAnnotationForKeyword,
  updateStateAnnotationForTranslation,
} from '@/storage/slices/editPickSlice';
import {checkIfAtLeast20PercentChange} from '@/utils/levenshtein';
import {removeUnusedLines} from '@/utils/strings';
import {
  useNavigation,
  useNavigationState,
  useRoute,
} from '@react-navigation/native';
import {cloneDeep} from 'lodash';
import {View} from 'moti';
import React, {useMemo, useRef, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {KeyboardAvoidingView, LayoutAnimation} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useDispatch, useSelector} from 'react-redux';

const MAX_CHARACTERS = 400;

const EditAnnotation = () => {
  const route = useRoute<any>();
  const navigation = useNavigation<any>();
  const insets = useSafeAreaInsets();
  const theme = useTheme();
  const dispatch = useDispatch();
  const {t} = useTranslation();

  const {annotation} = route.params;

  const bookId = annotation?.bookId;
  const pickId = annotation?.pickId;

  const isTranslation = annotation?.type === 'translation';

  const currentPick = useSelector(state => {
    if (!bookId || !pickId) {
      return null;
    }

    return getStateBookPickById(state, bookId, pickId);
  });

  const part = useSelector(state => {
    /* When the bookId exists, the editing is directly from the keyword cell */
    if (bookId != undefined) {
      return annotation;
    }

    /* Get part when editing from AddPick screen */
    return getPartById(state, annotation?.id);
  });

  const navigationState = useNavigationState(state => state);

  const isFromAddPickScreen =
    navigationState.routes[navigationState.index - 1].name ===
    RouteNames.AddPickStack;

  const initialText = part?.annotation ?? '';

  const [value, setValue] = useState(initialText);
  const [translationData, setTranslationData] = useState<any>({
    translation: annotation?.translation ?? '',
    definition: annotation?.definition ?? '',
  });

  const [isGenerating, setIsGenerating] = useState(false);
  const [isDoneButtonLoading, setIsDoneButtonLoading] = useState(false);
  const [annotationSources, setAnnotationSources] = useState<string[]>(
    annotation?.sources ?? [],
  );

  const isCancelButtonDisabled = !annotation?.translation;

  const lastGeneratedText = useRef<string>('');

  const isGenerateEnabled = useMemo(() => {
    if (isGenerating) {
      return true;
    }

    if (value.length === 0) {
      return true;
    }

    const hasTextChanged = checkIfAtLeast20PercentChange(
      lastGeneratedText.current,
      value,
    );

    return hasTextChanged;
  }, [value, lastGeneratedText.current, isGenerating]);

  const onDonePress = () => {
    if (isDoneButtonLoading) {
      return;
    }

    if (bookId != undefined) {
      const partIndex = currentPick.parts.findIndex(
        (part: any) => part.id === annotation.id,
      );

      if (partIndex === -1) {
        return;
      }

      const parts = cloneDeep(currentPick.parts);
      parts[partIndex].annotation = value;

      setIsDoneButtonLoading(true);

      BookAPI.updatePick({bookId, pickId, parts}, () => {
        dispatch(
          updateStateBookPickAnnotation({
            annotation,
            content: removeUnusedLines(value),
          }),
        );

        if (isFromAddPickScreen) {
          navigation.goBack();
        } else {
          navigation.navigate(RouteNames.BookDetail);
        }
      });
    } else {
      const annotationId = annotation?.id;

      if (['keyword', 'annotation'].includes(annotation.type)) {
        dispatch(
          updateStateAnnotationForKeyword({
            id: annotationId,
            content: removeUnusedLines(value),
            sources: annotationSources,
          }),
        );
      } else {
        dispatch(
          updateStateAnnotationForTranslation({
            id: annotationId,
            translation: translationData.translation,
            definition: translationData.definition,
            language: translationData.language,
            dictionaryUrl: translationData.dictionaryUrl,
          }),
        );
      }

      navigation.goBack();
    }
  };

  const onGeneratePress = () => {
    if (isGenerating) {
      return;
    }

    setIsGenerating(true);

    AiAPI.getKeywordDetails({keyword: annotation.content}, response => {
      setIsGenerating(false);

      if (response) {
        const enrichedText = response.content;
        lastGeneratedText.current = enrichedText;

        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);

        setAnnotationSources(response.sources);

        if (enrichedText.length != 0) {
          setValue(enrichedText);
        }
      }
    });
  };

  const onErasePress = () => {
    if (isFromAddPickScreen) {
      dispatch(removeStateKeyword());
      navigation.goBack();
    } else {
      setValue('');
    }
  };

  return (
    <ModalContainer
      scrollDisabled
      style={{paddingHorizontal: 0}}
      onDonePress={onDonePress}
      isDoneButtonLoading={isDoneButtonLoading}
      title={isTranslation ? t('Common:wordDefinition') : ''}
      renderHeader={() => {
        if (!isTranslation) {
          return <KeywordView annotation={annotation} />;
        }

        return null;
      }}>
      <ScrollView keyboardDismissMode="none" keyboardShouldPersistTaps="always">
        {!isTranslation ? (
          <View
            style={{
              alignItems: 'flex-start',
              paddingHorizontal: 16,
              marginBottom: 32,
            }}>
            <View style={{marginTop: 8, width: '100%'}}>
              <View>
                <TextInput
                  size={19}
                  value={value}
                  multiline
                  placeholder={t('Common:addAnnotationPlaceholder')}
                  autoFocus
                  onChangeText={setValue}
                  maxLength={MAX_CHARACTERS}
                />
              </View>

              {!isTranslation && (
                <KeywordDefinitionSources
                  isLoading={isGenerating}
                  sources={annotationSources}
                />
              )}
            </View>
          </View>
        ) : (
          <View>
            <TranslationContent
              isEditing
              data={translationData}
              annotation={annotation}
              setData={setTranslationData}
            />

            {!isCancelButtonDisabled && (
              <View style={{paddingHorizontal: 16, marginTop: 16}}>
                <MainButton
                  isHaptic
                  onPress={onErasePress}
                  leftIcon={EraserIcon}
                  title={t('Actions:removeTranslation')}
                />
              </View>
            )}
          </View>
        )}
      </ScrollView>

      {!isTranslation && (
        <KeyboardAvoidingView
          behavior="padding"
          keyboardVerticalOffset={insets.top + insets.bottom + 66}>
          <View
            style={[
              {
                width: '100%',
                paddingBottom: 12,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingTop: 12,
                paddingHorizontal: 12,
              },
              theme.styles.hairlineTop,
            ]}>
            <ScrollView
              keyboardShouldPersistTaps="always"
              horizontal
              showsHorizontalScrollIndicator={false}>
              <ActionButton
                onPress={onGeneratePress}
                fullLoadingDuration={4000}
                action={{title: t('Actions:generateAI'), icon: MagicIcon}}
                loadingText={t('AddNewPick:doingMagic')}
                isLoading={isGenerating}
                disabled={!isGenerateEnabled}
              />

              <ActionButton
                isHaptic
                action={{
                  title: t('Actions:cancel'),
                  icon: EraserIcon,
                }}
                underline
                onPress={onErasePress}
              />
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      )}
    </ModalContainer>
  );
};

export default EditAnnotation;
