import * as React from 'react';
import {View} from 'react-native';
import MainText from '../MainText';
import useTheme from '@/hooks/useTheme';

const KeywordView = ({annotation}: any) => {
  const theme = useTheme();

  const keywordStyle = React.useMemo(() => {
    if (annotation.type == 'keyword') {
      return {backgroundColor: theme.colors.keyword};
    }

    if (annotation.type == 'translation') {
      return {
        backgroundColor: theme.colors.translation,
      };
    }

    return {backgroundColor: theme.colors.annotation};
  }, [annotation]);

  return (
    <View style={[{padding: 10, borderRadius: 12}, keywordStyle]}>
      <MainText weight="medium" color="#fff" size={16}>
        {annotation.content}
      </MainText>
    </View>
  );
};

export default KeywordView;
