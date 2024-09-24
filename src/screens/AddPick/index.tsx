import AiAPI from '@/api/routes/ai';
import BookAPI from '@/api/routes/book';
import AddPickAccessoryView from '@/components/AddPickAccessoryView';
import AddPickNavigationHeader from '@/components/AddPickNavigationHeader';
import {MainContainer} from '@/components/Containers';
import KeyboardAvoidingView from '@/components/KeyboardAvoidingView';
import TextInput from '@/components/TextInput';
import TextPart from '@/components/TextPart';
import ToastView from '@/components/ToastView';
import {GlobalEvents} from '@/constants/events';
import RouteNames from '@/constants/routeNames';
import useEditPick from '@/hooks/useEditPick';
import useFocusEffect from '@/hooks/useFocusEffect';
import useKeyboard from '@/hooks/useKeyboardHeight';
import useTheme from '@/hooks/useTheme';
import {deleteStateBookPick} from '@/storage/slices/booksSlice';
import {KeywordTypeValue, TextPartProps} from '@/types/AddPick';
import {InputModes} from '@/types/InputMode';
import {checkIfAtLeast20PercentChange} from '@/utils/levenshtein';
import Clipboard from '@react-native-clipboard/clipboard';
import {useNavigation, useRoute} from '@react-navigation/native';
import {capitalize} from 'lodash';
import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {Alert, StatusBar} from 'react-native';
import {EventRegister} from 'react-native-event-listeners';
import {ScrollView} from 'react-native-gesture-handler';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useDispatch} from 'react-redux';
import styles from './styles';
import {AddPickRouteParams, CreateBookPickParams} from './types';

const AddPick = () => {
  const navigation = useNavigation<any>();
  const route = useRoute();
  const theme = useTheme();
  const dispatch = useDispatch();
  const {t} = useTranslation();

  const params: AddPickRouteParams = route.params;

  const isFromCamera = params?.isFromCamera;

  const bookData: CreateBookPickParams = params?.bookData;
  const bookId = bookData?.id;

  const pick = params?.pick;

  const isEditing = pick != undefined;
  const hasToSelectBook = pick == undefined && bookId == undefined;

  const [isMicActive, setIsMicActive] = useState(false);

  const editPickProvider = useEditPick({pick, bookData});

  const {
    parts,
    text,
    hasUnsavedChanges,
    history,

    isMenuVisible,
    isDoneButtonDisabled,
    isLoading,

    setText,
    setTextContent,
    setInitialText,

    selection,
    setSelection,
    setSelectionToEnd,
    pasteText,

    selectedPart,
    setInitialPick,

    addKeyword,
    removeKeyword,
    removeEmptyAnnotations,

    currentHistoryIndex,
    changeHistoryState,

    editBookPick,
    createNewPick,

    flushStates,
  } = editPickProvider;

  const hasEnoughChars = text.length > 32;

  const isPreviosStateButtonDisabled = currentHistoryIndex == 0;
  const isNextStateButtonDisabled =
    currentHistoryIndex == Math.max(history.length - 1, 0);

  const isEditSelectionMenuVisible = !!selectedPart;

  const textInputRef = useRef<any>(null);
  const scrollRef = useRef<ScrollView>(null);

  const [toastInfo, setToastInfo] = useState<any>(null);
  const [isEnrichingText, setIsEnrichingText] = useState(false);

  const [lastEnrichedText, setLastEnrichedText] = useState<string>('');

  const {keyboardHeight} = useKeyboard();
  const insets = useSafeAreaInsets();

  const isEnrichTextButtonDisabled = useMemo(() => {
    if (!hasEnoughChars) {
      return true;
    }

    if (isEnrichingText) {
      return false;
    }

    if (lastEnrichedText.length == 0) {
      return false;
    }

    const hasTextChanged = checkIfAtLeast20PercentChange(
      lastEnrichedText,
      text,
    );

    return !hasTextChanged;
  }, [hasEnoughChars, isEnrichingText, text, lastEnrichedText]);

  /* Methods */

  const goBack = () => {
    flushStates();

    if (isEditing) {
      navigation.goBack();
      return;
    }

    if (!hasToSelectBook) {
      navigation.navigate(RouteNames.BookDetail);
      return;
    }

    if (isFromCamera) {
      navigation.navigate(RouteNames.Home);
    } else {
      navigation.goBack();
    }
  };

  /* Callbacks */

  const onDismissAttempted = () => {
    if (hasUnsavedChanges) {
      Alert.alert('Discard changes?', 'You have unsaved changes', [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Discard',
          style: 'destructive',
          onPress: goBack,
        },
      ]);
    } else {
      goBack();
    }
  };

  const onStateChange = useCallback(
    (state: string) => {
      if (state == 'prev' || state == 'next') {
        changeHistoryState(state);
      }
    },
    [changeHistoryState],
  );

  const onInputPress = useCallback(
    (inputMode: string) => {
      if (inputMode == InputModes.Text) {
        setIsMicActive(false);
      } else if (inputMode == InputModes.Mic) {
        setIsMicActive(true);
      }
    },
    [setIsMicActive],
  );

  const onActionPress = useCallback(
    async (actionKey: string) => {
      if (actionKey == 'paste') {
        const clipboardText = await Clipboard.getString();
        pasteText(clipboardText);
      }
    },
    [pasteText],
  );

  const onTextSelectionActionPress = useCallback(
    (actionKey: string) => {
      const isOneOfKeyword = KeywordTypeValue.ALL.includes(actionKey);

      if (isOneOfKeyword) {
        addKeyword({type: actionKey});
      }

      if (actionKey == 'cancel') {
        removeKeyword();
      }

      if (actionKey == 'close') {
        setSelectionToEnd();
      }

      if (actionKey == 'edit') {
        if (selectedPart?.type != 'text') {
          navigation.navigate(RouteNames.EditAnnotation, {
            annotation: selectedPart,
          });
        }
      }
    },
    [selection, selectedPart],
  );

  /* Text Input Logic */

  const onSelectionChange = useCallback(
    (event: any) => {
      const selection = event.selection;

      setSelection(selection);
    },
    [setSelection, selection],
  );

  const onChangeText = (text: string) => {
    setText(text);
  };

  const onDonePress = useCallback(() => {
    if (isLoading) {
      return;
    }

    if (isEditing) {
      editBookPick(null, goBack);
    } else if (bookId == undefined) {
      navigation.navigate(RouteNames.CreateOrAddPickStack);
    } else if (bookData != undefined) {
      createNewPick(isSucceded => {
        if (isSucceded) {
          goBack();

          EventRegister.emit(GlobalEvents.UpdateListLayout);
          EventRegister.emit(GlobalEvents.CreateBookPick);
        }
      });
    }
  }, [editBookPick, hasToSelectBook, bookId, bookData, isLoading]);

  const onEnrichTextPress = useCallback(() => {
    if (isEnrichingText) {
      return;
    }

    setIsEnrichingText(true);

    let selectedText = text;
    const isTextSelected = selection.start != selection.end;

    if (isTextSelected) {
      selectedText = text.substring(selection.start, selection.end);
    }

    AiAPI.sharpPick({text: selectedText}, (response: any) => {
      setIsEnrichingText(false);

      if (response) {
        const enrichedText = response.text;
        setLastEnrichedText(enrichedText);

        if (enrichedText.length != 0) {
          setTextContent(enrichedText);
          setText(enrichedText);
        }
      } else {
        setToastInfo({
          isSucceded: false,
          title: t('Toasts:couldNotEnrichText'),
        });
      }
    });
  }, [text]);

  const onDeletePress = useCallback(() => {
    const params: any = {bookId, pickId: pick?.guid};

    BookAPI.deletePick(params, data => {
      if (data) {
        const isLastPickDeleted = data?.is_last;

        if (isLastPickDeleted) {
          navigation.navigate(RouteNames.Home);
          EventRegister.emit(GlobalEvents.DeleteBook);
        } else {
          navigation.goBack();
        }

        dispatch(deleteStateBookPick(params));
      }
    });
  }, [pick]);

  const onTextCopiedFromAsset = useCallback(() => {
    if (text.length == 0) {
      Clipboard.getString().then(copiedText => {
        const normalizedText = capitalize(copiedText.toLowerCase());
        setInitialText(normalizedText);
      });
    }
  }, [setInitialText, text]);

  /* Effects */

  useFocusEffect(
    isFocused => {
      if (isFocused) {
        const initialText = params?.initialText;

        if (isFromCamera && text.length != 0) {
          return;
        }

        if (initialText != undefined) {
          setInitialText(initialText);
        }

        const initialInputMode = params?.initialInputMode;

        if (initialInputMode == InputModes.Mic) {
          setIsMicActive(true);
        }
      }
    },
    [params, isFromCamera],
  );

  useEffect(() => {
    if (isMenuVisible) {
      setIsMicActive(false);
    }
  }, [isMenuVisible]);

  useEffect(() => {
    const type = selectedPart?.type;

    if (type && ['annotation', 'translation'].includes(type)) {
      navigation.navigate(RouteNames.EditAnnotation, {
        annotation: selectedPart,
      });
    }
  }, [selectedPart]);

  useFocusEffect(isFocused => {
    if (isFocused) {
      textInputRef.current?.focus();

      removeEmptyAnnotations();
    }
  }, []);

  useEffect(() => {
    if (pick != undefined) {
      setInitialPick(pick);
    }
  }, [pick]);

  return (
    <>
      <StatusBar barStyle={theme.statusBarStyle} />

      <MainContainer>
        <AddPickNavigationHeader
          isEditing={isEditing}
          onStateChange={onStateChange}
          onDeletePress={onDeletePress}
          onClosePress={onDismissAttempted}
          isNextDisabled={isNextStateButtonDisabled}
          isPrevDisabled={isPreviosStateButtonDisabled}
        />

        <ScrollView
          keyboardShouldPersistTaps="always"
          contentContainerStyle={{
            paddingBottom: keyboardHeight - insets.bottom + 16,
          }}
          scrollIndicatorInsets={{bottom: keyboardHeight - insets.bottom}}
          ref={scrollRef}
          style={styles.content}>
          <TextInput
            multiline
            placeholder={t('AddNewPick:textPlaceholder')}
            onSelectionChange={onSelectionChange}
            ref={textInputRef}
            selection={selection}
            style={{minHeight: 400}}
            onChangeText={onChangeText}>
            {parts.map((part: TextPartProps) => {
              return <TextPart key={part.id} part={part} />;
            })}
          </TextInput>
        </ScrollView>

        <KeyboardAvoidingView>
          <AddPickAccessoryView
            stateProvider={editPickProvider}
            isMicActive={isMicActive}
            setIsMicActive={setIsMicActive}
            hasSegue={hasToSelectBook}
            onInputPress={onInputPress}
            onActionPress={onActionPress}
            isMenuVisible={isMenuVisible}
            isEnrichTextButtonDisabled={isEnrichTextButtonDisabled}
            onDonePress={onDonePress}
            isEditMenuVisible={isEditSelectionMenuVisible}
            onTextSelectionActionPress={onTextSelectionActionPress}
            isDoneButtonDisabled={isDoneButtonDisabled}
            isLoading={isLoading}
            onEnrichTextPress={onEnrichTextPress}
            isEnrichingText={isEnrichingText}
            onTextCopiedFromAsset={onTextCopiedFromAsset}
          />
        </KeyboardAvoidingView>
      </MainContainer>

      <ToastView {...toastInfo} setInfo={setToastInfo} />
    </>
  );
};

export default AddPick;
