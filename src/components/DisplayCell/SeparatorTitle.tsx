import React, {useMemo} from 'react';
import {View} from 'react-native';
import {SeparatorTitleProps} from './types';
import MainText from '../MainText';
import useTheme from '@/hooks/useTheme';

const SeparatorTitle = ({
  title,
  style,
  titleStyle,
  hasHairline,
  hasSpacing,
}: SeparatorTitleProps) => {
  const theme = useTheme();

  const _style = useMemo(() => {
    if (hasHairline) {
      return {
        borderTopWidth: 1,
        borderTopColor: theme.colors.hairline,
      };
    }

    return {};
  }, [hasHairline]);

  return (
    <View
      style={{
        marginBottom: 12,
        marginLeft: 4,
        marginTop: hasSpacing ? 24 : 0,
        ...style,
        ..._style,
        paddingTop: hasHairline ? 12 : 0,
      }}>
      <MainText
        size={12}
        uppercase
        weight="semiBold"
        color={theme.colors.lightText}
        style={titleStyle}>
        {title}
      </MainText>
    </View>
  );
};

export default SeparatorTitle;
