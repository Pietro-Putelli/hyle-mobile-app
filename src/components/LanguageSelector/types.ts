export type LanguageSelectorProp = {
  menuTitle?: string;
  style?: any;
  type: 'primary' | 'secondary';
  disabled?: boolean;
  defaultLanguage?: string;
  onPress?: () => void;
  onChange?: (language: string) => void;
};
