export interface SwipeableContainerProps {
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  children: React.ReactNode;
  style?: any;
  disabled?: boolean;
  activeOffsetX?: number[];
  Icon?: React.ReactNode;
}
