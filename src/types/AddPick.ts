export type KeywordTypes = 'keyword' | 'annotation' | 'translation';

export const KeywordTypeValue = {
  KEYWORD: 'keyword',
  ANNOTATION: 'annotation',
  TRANSLATION: 'translation',
  ALL: ['keyword', 'annotation', 'translation'],
};

export type PickEditHistoryProps = {
  id: string;
  parts: TextPartProps[];
};

export type HighlightProps = {
  start: number;
  end: number;
  startCharacter: string;
  endCharacter: string;
  string: string;
};

export type TextSelectionProps = {
  text?: string;
  start: number;
  end: number;
};

export type TextPartProps = {
  id: string;
  content: string;
  type: 'text' | KeywordTypes | string;
  start?: number;
  end?: number;
  annotation?: string;
  translation?: string;
  sources?: string[];
  definition?: string;
  language?: string;
  dictionaryUrl?: string;
};
