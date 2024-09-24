import {TextPartProps} from '@/types/AddPick';
import {BookProps, PickExampleProps} from '@/types/Book';

export interface ModalProps {
  isCursorVisible?: boolean;
  isCloseButtonVisible?: boolean;
  isOpen?: boolean;
  setIsOpen: (isOpen: boolean) => void;
  contentStyle?: any;
  onShow?: () => void;
  onDismiss?: () => void;
  children?: React.ReactNode;
}

export interface ColorModalProps extends ModalProps {
  initialColor: string | null;
  onChangeColor?: (color: string) => void;
}

export interface TranslationModalProps extends ModalProps {
  annotation: TextPartProps;
}

export interface ExampleModalProps extends ModalProps {
  example: PickExampleProps;
}

export interface BookInfoProps extends ModalProps {
  book: BookProps;
}

export interface NotificationSettingsModalProps extends ModalProps {}
