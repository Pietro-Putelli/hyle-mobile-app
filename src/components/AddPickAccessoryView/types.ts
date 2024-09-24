export interface AddPickAccessoryViewProps {
  hasSegue: boolean;
  isMicActive: boolean;
  setIsMicActive: (isMicActive: boolean) => void;
  isMenuVisible: boolean;
  isEditMenuVisible: boolean;
  onInputPress: (inputMode: string) => void;
  onActionPress: (actionKey: string) => void;
  onTextSelectionActionPress: (actionKey: string) => void;

  onTextCopiedFromAsset: () => void;
  onEnrichTextPress: () => void;
  isEnrichingText: boolean;
  isEnrichTextButtonDisabled: boolean;

  onDonePress: () => void;
  stateProvider: any;
  isDoneButtonDisabled: boolean;
  isLoading: boolean;
}

export type TextSelectionMenuProp = {
  isMenuVisible: boolean;
  isEditMenuVisible: boolean;
  onActionPress: (action: any) => void;
};

export type VoiceRecordMenuProp = {
  isVisible: boolean;
  onClosePress: () => void;
  stateProvider: any;
};
