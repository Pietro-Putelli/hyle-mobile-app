import {PickProps} from '@/types/Book';

type _CreateBookPickParams = {
  id: string;
  listIndex?: number;
};

export type CreateBookPickParams = _CreateBookPickParams | undefined;

type _AddPickRouteParams = {
  initialInputMode?: string;
  initialText?: string;
  bookData?: CreateBookPickParams;
  pick?: PickProps;
  isFromCamera?: boolean;
};

export type AddPickRouteParams = _AddPickRouteParams | undefined;

export type _TextSelectionProps = {
  start: number;
  end: number;
};

export type TextSelectionProps = _TextSelectionProps;
