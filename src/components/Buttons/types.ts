import {StyleProp, ViewStyle} from 'react-native';

export type ButtonType = 'primary' | 'secondary' | 'tertiary';

export type ButtonState = {
  type?: ButtonType;
  icon?: React.FC;
};

export interface ScaleButtonProps {
  style?: StyleProp<ViewStyle>;
  outerStyle?: StyleProp<ViewStyle>;
  isHaptic?: boolean;
  isLoading?: boolean;
  throttleValue?: number;
  children?: React.ReactNode;
  disabled?: boolean;
  disableWithoutOpacity?: boolean;
  onPress?: () => void;
  onLayout?: (event: any) => void;
  activeScale?: number;
}

export interface ActionButtonProps extends Omit<ScaleButtonProps, 'onPress'> {
  action: any;
  underline?: boolean;
  onPress: (actionKey: string) => void;
  startLoadingWhenPressed?: boolean;
  fullLoadingDuration?: number;
  loadingText?: string;
}

export interface IconButtonProps extends ScaleButtonProps {
  icon?: React.FC;
  iconScale?: number;
  iconName?: string;
  type?: ButtonType;
  isTransparent?: boolean;
  isBlurred?: boolean;
  side?: number;
  opacity?: number;
  forceDarkTheme?: boolean;

  isActive?: boolean;
  states?: ButtonState[];
}

export interface MainButtonProps extends ScaleButtonProps {
  title?: string;
  leftIcon?: React.FC;
  rightIcon?: React.FC;
  type?: ButtonType;
  backgroundColor?: string;
  isLoading?: boolean;
  loadingText?: string;
  fullLoadingDuration?: number;
}

export interface LinkButtonProps extends ScaleButtonProps {
  title: string;
  link: string;
}

export interface SocialButtonProps extends Omit<ScaleButtonProps, 'onPress'> {
  type: 'google' | 'apple';
  onPress: (type: 'google' | 'apple') => void;
}

export interface TitleButtonProps extends ScaleButtonProps {
  children: string;
}
