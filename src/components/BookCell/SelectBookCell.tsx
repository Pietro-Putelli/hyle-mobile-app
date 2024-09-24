import React from 'react';
import {StyleSheet} from 'react-native';
import {ScaleButton} from '../Buttons';
import CheckButton from '../Buttons/CheckButton';
import MainText from '../MainText';
import useTheme from '@/hooks/useTheme';

const SelectBookCell = ({isSelected, onPress, book}: any) => {
  const theme = useTheme();

  return (
    <ScaleButton
      onPress={onPress}
      activeScale={0.98}
      style={[styles.container, theme.styles.cell]}>
      <MainText style={{flex: 1}} numberOfLines={1}>
        {book.title}
      </MainText>

      <CheckButton isSelected={isSelected} />
    </ScaleButton>
  );
};

export default SelectBookCell;

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginBottom: 8,
  },
});
