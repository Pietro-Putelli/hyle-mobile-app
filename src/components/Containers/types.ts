import {NavigationHeaderProps} from '../NavigationHeader/types';

export type EdgeGesture = {
  onStart: () => void;
  activeOffsetX: number;
};

export interface MainContainerProps {
  children?: React.ReactNode;
  headerProps?: NavigationHeaderProps;
  enableDismissGesture?: boolean;
  disableSafeArea?: boolean;
  style?: any;
  isModal?: boolean;
  onDismissAttempted?: () => void;

  rightGesture?: EdgeGesture;
  showStackHeader?: boolean;
}

export type ModalContainerProps = {
  children?: React.ReactNode;
  title?: string;
  hideCloseButton?: boolean;
  description?: string;
  scrollDisabled?: boolean;
  style?: any;
  showBackButton?: boolean;
  isDoneButtonEnabled?: boolean;
  isDoneButtonLoading?: boolean;
  DoneButton?: React.ReactNode;
  renderHeader?: () => React.ReactNode;
  onDonePress?: () => void;
  accessoryView?: React.ReactNode;
  scrollProps?: any;
};
