import {TextPartProps} from '@/types/AddPick';

export type TranslationContentProps = {
  data: any;
  isEditing?: boolean;
  setData: (data: any) => void;
  annotation: TextPartProps;
};
