import useTheme from '@/hooks/useTheme';
import {KeywordTypeValue} from '@/types/AddPick';
import React, {useMemo} from 'react';
import MainText from '../MainText';
import {TextPartComponentProps} from './types';

const TextPart = ({part}: TextPartComponentProps) => {
  const {id, content, type} = part;

  const theme = useTheme();

  const style = useMemo(() => {
    if (type === KeywordTypeValue.KEYWORD) {
      return {
        backgroundColor: theme.colors.keyword,
      };
    } else if (type === KeywordTypeValue.ANNOTATION) {
      return {
        textDecorationLine: 'underline',
      };
    } else if (type === KeywordTypeValue.TRANSLATION) {
      return {
        textDecorationLine: 'underline',
        textDecorationStyle: 'dotted',
      };
    }

    return {};
  }, [type]);

  return (
    <MainText style={style} size={20} key={id}>
      {content}
    </MainText>
  );
};

export default TextPart;
