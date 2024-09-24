import {BookProps} from '@/types/Book';

export type PicksEditorControllerProps = {
  book: BookProps;
  // isPrevDisabled?: boolean;
  // isNextDisabled?: boolean;
  // onAudioPlayerSkipPress?: (state: 'next' | 'prev') => void;

  // To know if the book comes from a shared link
  isBookCached: boolean;

  isSearchEnabled?: boolean;

  onBookSaved: () => void;
};
