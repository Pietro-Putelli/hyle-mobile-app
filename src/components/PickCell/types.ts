import {TextPartProps} from '@/types/AddPick';
import {BookProps, PickProps} from '@/types/Book';

export type PickCellProps = {
  book?: BookProps;
  pick: PickProps;
  index: number;
  isSelected?: boolean;
  isFoundInSearch?: boolean;
  disableInteraction?: boolean;
  isPreview?: boolean;
  isDeleting?: boolean;
  onLongPress?: () => void;
  onEndHighlight?: () => void;
  onSetTrackPress?: ({track, pick}: any) => void;
  onKeywordPress?: ({word, type, pickId}: any) => void;
  onDeletePress?: (pickId: string) => void;
  onCopyPress?: () => void;
  swipeToEditEnabled?: boolean;
};

export type AccessoryViewProps = {
  isVisible: boolean;
  part: TextPartProps;
  onClosePress: () => void;
};
