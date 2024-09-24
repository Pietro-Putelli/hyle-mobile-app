import {TextPartProps} from '@/types/AddPick';

export type HighlitedTextProps = {
  children: TextPartProps[];
  onPartPress: (part: TextPartProps) => void;
};
