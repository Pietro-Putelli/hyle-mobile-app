import {MenuConfig} from 'react-native-ios-context-menu';

export type DisplayCellProps = {
  Icon?: React.FC;
  title: string;
  value?: string | boolean;
  hasSegue?: boolean;
  isFirst?: boolean;
  isLast?: boolean;
  onPress?: () => void;
  menuConfig?: MenuConfig;
  onChange?: (value: boolean) => void;
  isLoading?: boolean;
  titleStyle?: any;
  onPressMenuOption?: (key: string) => void;
  backgroundColor?: string;
  disabled?: boolean;
};

export type SeparatorTitleProps = {
  title: string;
  titleStyle?: any;
  hasSpacing?: boolean;
  style?: any;
  hasHairline?: boolean;
};
