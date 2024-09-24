export type AddPickNavigationHeaderProps = {
  onStateChange: (state: string) => void;
  onClosePress: () => void;
  onDeletePress: () => void;
  isEditing: boolean;
  isPrevDisabled: boolean;
  isNextDisabled: boolean;
};
