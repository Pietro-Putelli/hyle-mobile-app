import BookAPI from '@/api/routes/book';
import {MiddlewareDispatch} from '@/api/types';
import {CreateBookPickParams} from '@/screens/AddPick/types';
import {
  getStateBookById,
  updateStateBookPick,
} from '@/storage/slices/booksSlice';
import {
  addStateKeyword,
  flushStateEditPickState,
  getEditPickState,
  removeStateEmptyAnnotations,
  removeStateKeyword,
  setStateHistory,
  setStateTextContent,
  setStateTextParts,
  setStateTextSelection,
  updateStateHistory,
  updateStateTextParts,
} from '@/storage/slices/editPickSlice';
import {TextPartProps, TextSelectionProps} from '@/types/AddPick';
import {BookProps, PickProps} from '@/types/Book';
import {
  getSelectedPart,
  isSelectionCrossingKeyword,
} from '@/utils/editPickHandlers';
import {isEmpty, isEqual, size} from 'lodash';
import {useEffect, useMemo, useRef, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import useDelayedEffect from './useDelayedEffect';

type UseEditPickProps = {
  bookData?: CreateBookPickParams;
  pick?: PickProps;
};

type AddKeywordParams = {
  type: string;
};

const useEditPick = (props?: UseEditPickProps) => {
  const pick = props?.pick;
  const bookData: CreateBookPickParams = props?.bookData;

  /* BookID of the book to add pick to */
  const bookId = bookData?.id;

  /* This is the selected book to add pick to */
  const bookToEdit: BookProps = useSelector(state =>
    getStateBookById(state, bookId),
  );

  const isEditing = pick != undefined;
  const initialPick = useRef<PickProps | undefined>(pick);

  const {text, parts, selection, history} = useSelector(getEditPickState);

  const [selectedPart, setSelectedPart] = useState<TextPartProps | null>();
  const [currentHistoryIndex, setCurrentHistoryIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const isMounted = useRef<boolean>(false);
  const lastTextContent = useRef<string>('');
  const isTextChanging = useRef<boolean>(false);
  const isReplacingParts = useRef<boolean>(false);

  const hasUnsavedChanges = useMemo(() => {
    if (isEditing) {
      return !isEqual(parts, initialPick.current?.parts);
    }

    return !isEmpty(parts);
  }, [isEditing, parts, text, pick, initialPick.current]);

  const isDoneButtonDisabled = useMemo(() => {
    return size(parts) == 0 || text.replace(/\s/g, '').length < 8;
  }, [isEditing, text, parts, hasUnsavedChanges]);

  /* Utility */

  const dispatch = useDispatch<MiddlewareDispatch>();

  const setText = (text: string) => {
    dispatch(setStateTextContent(text));
  };

  const flushStates = () => {
    dispatch(flushStateEditPickState());
  };

  const setTextContent = (text: string) => {
    if (text == '') {
      dispatch(setStateTextParts([]));
    } else {
      dispatch(
        updateStateTextParts({
          prev: lastTextContent.current,
          next: text,
        }),
      );
    }

    lastTextContent.current = text;
  };

  const setSelection = (selection: TextSelectionProps) => {
    dispatch(setStateTextSelection(selection));
  };

  const removeKeyword = () => {
    dispatch(removeStateKeyword());
  };

  const removeEmptyAnnotations = () => {
    setSelectedPart(null);
    dispatch(removeStateEmptyAnnotations());
    setSelectionToEnd();
  };

  const addKeyword = ({type}: AddKeywordParams) => {
    dispatch(addStateKeyword({content: text, type}));
  };

  const setSelectionToEnd = () => {
    const end = text.length;
    setSelection({start: end, end});
  };

  const isMenuVisible = useMemo(() => {
    const {start, end} = selection ?? {};

    if (start == end) {
      return false;
    }

    if (text.length == 0) {
      return false;
    }

    if (isSelectionCrossingKeyword({parts, selection})) {
      return false;
    }

    const substring = text.substring(start, end);

    const spaces = substring.match(/\s/g);
    const spacesCount = spaces?.length ?? 0;

    // /* The selection for keyword can contains max 4 words */
    return spacesCount < 4;
  }, [text, selection, parts]);

  const changeHistoryState = (state: 'next' | 'prev') => {
    const delta = state == 'next' ? 1 : -1;

    const normalizedIndex = Math.min(
      Math.max(0, currentHistoryIndex + delta),
      history.length - 1,
    );

    setCurrentHistoryIndex(normalizedIndex);

    const currentHistory = history[normalizedIndex];
    const parts = currentHistory?.parts;

    if (parts != undefined) {
      const plainText = parts
        .map((part: TextPartProps) => part.content)
        .join('');

      isReplacingParts.current = true;

      setText(plainText);
      dispatch(setStateTextParts(parts));

      setTimeout(() => {
        setSelection({
          start: plainText.length,
          end: plainText.length,
        });
      }, 100);

      setTimeout(() => {
        isReplacingParts.current = false;
      }, 1000);
    }
  };

  const setInitialText = (initialText: string) => {
    lastTextContent.current = initialText;

    if (text.length == 0) {
      setText(initialText);
      setTextContent(initialText);
    }
  };

  const setTextFromDictation = ({prev, next, start}: any) => {
    let finalText = next;

    if (prev != undefined) {
      const prevLength = prev.length;

      const before = prev.substring(0, start);
      const after = prev.substring(start, prevLength);

      finalText = before;

      if (start != 0 && before[before.length - 1] != ' ') {
        finalText += ' ';
      }

      finalText += next;

      if (next[next.length - 1] != ' ' && after[0] != ' ') {
        finalText += ' ';
      }

      finalText += after;
    }

    setText(finalText);
    setTextContent(finalText);
  };

  const setInitialPick = (pick: PickProps) => {
    const plainText = pick.parts
      .map((part: TextPartProps) => part.content)
      .join('');

    lastTextContent.current = plainText;

    isReplacingParts.current = true;

    initialPick.current = pick;

    setText(plainText);
    dispatch(setStateTextParts(pick.parts));
    dispatch(setStateHistory({parts: pick.parts}));

    setTimeout(() => {
      isReplacingParts.current = false;
    }, 250);
  };

  const pasteText = (clipboardText: string) => {
    const {start, end} = selection ?? {start: 0, end: 0};

    const before = text.substring(0, start);
    const after = text.substring(end);

    let newText = before;

    if (before[before.length - 1] != ' ' && selection?.start != 0) {
      newText += ' ';
    }

    newText += clipboardText;

    if (clipboardText[clipboardText.length - 1] != ' ' && after[0] != ' ') {
      newText += ' ';
    }

    newText += after;

    setText(newText);
    setTextContent(newText);
  };

  const editBookPick = (data: any, callback: () => void) => {
    setIsLoading(true);

    if (isLoading) {
      return;
    }

    BookAPI.updatePick(
      {
        bookId,
        pickId: pick?.guid,
        parts,
        ...data,
      },
      isSucceded => {
        if (isSucceded) {
          callback();
          dispatch(updateStateBookPick({bookId, pickId: pick?.guid, parts}));
        }
      },
    );
  };

  const createNewPick = (callback: (isSucceded: boolean) => void) => {
    setIsLoading(true);

    if (isLoading) {
      return;
    }

    let pickIndex;

    if (bookToEdit != undefined) {
      /* If listIndex is not specified, then add the pick at the start of the list. */
      const listIndex = bookData?.listIndex ?? 0;
      const pivotPick = bookToEdit.picks[listIndex];

      if (pivotPick) {
        pickIndex = pivotPick.index + 1;
      }
    }

    dispatch(BookAPI.create({bookId, parts, pickIndex}, callback));
  };

  /* Effects */

  useDelayedEffect(() => {
    isMounted.current = true;
  }, 500);

  useEffect(() => {
    if (!isMounted.current || isReplacingParts.current) {
      return;
    }

    isTextChanging.current = true;

    const timeoutId = setTimeout(() => {
      setTextContent(text);

      isTextChanging.current = false;
    }, 400);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [text]);

  useEffect(() => {
    if (isEmpty(parts) || isReplacingParts.current) {
      return;
    }

    dispatch(updateStateHistory());
  }, [parts]);

  useEffect(() => {
    if (text == '') {
      return;
    }

    const normalisedIndex = Math.max(0, history.length - 1);
    setCurrentHistoryIndex(normalisedIndex);
  }, [history.length]);

  useEffect(() => {
    if (isTextChanging.current) {
      return;
    }

    const part = getSelectedPart({parts, selection, delta: 0});

    let timeoutId: any;

    if (part && part.type != 'text') {
      setSelectedPart(part);
    } else {
      timeoutId = setTimeout(() => {
        setSelectedPart(null);
      }, 250);
    }

    return () => {
      clearTimeout(timeoutId);
    };
  }, [selection, isTextChanging.current]);

  return {
    parts,
    history,
    hasUnsavedChanges,

    isLoading,

    isMenuVisible,
    isDoneButtonDisabled,

    setInitialText,
    setInitialPick,

    selection,
    setSelection,
    setSelectionToEnd,

    selectedPart,
    setSelectedPart,

    text,
    setText,
    setTextContent,
    addKeyword,
    removeKeyword,
    removeEmptyAnnotations,
    setTextFromDictation,
    pasteText,

    currentHistoryIndex,
    changeHistoryState,

    editBookPick,
    createNewPick,

    flushStates,
  };
};

export default useEditPick;
