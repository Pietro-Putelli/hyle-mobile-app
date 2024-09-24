export interface NavigationHeaderProps {
  title?: string;
  scrollY?: any;
  showLogo?: boolean;
  leftIcon?: any;
  isLeftHaptic?: boolean;
  isLeftDisabled?: boolean;
  rightIcon?: any;
  isRightHaptic?: boolean;
  isRightDisabled?: boolean;
  RightComponent?: React.ReactNode;
  isModal?: boolean;
  onLeftPress?: () => void;
  onRightPress?: () => void;
  onPress?: () => void;
}
